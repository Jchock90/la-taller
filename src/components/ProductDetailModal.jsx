import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import Carousel from './Carousel';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate, TranslatedText } from '../hooks/useAutoTranslate';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState([{ size: '', color: '' }]);
  const [validationMsg, setValidationMsg] = useState('');
  const { isDark } = useTheme();

  // Resetear selección al cambiar de producto
  useEffect(() => {
    setQuantity(1);
    setSelections([{ size: '', color: '' }]);
    setValidationMsg('');
  }, [product?._id]);

  // Sync selections array length with quantity
  useEffect(() => {
    setSelections(prev => {
      if (prev.length === quantity) return prev;
      if (quantity > prev.length) {
        // Add new units copying the last selection as default
        const last = prev[prev.length - 1] || { size: '', color: '' };
        return [...prev, ...Array(quantity - prev.length).fill(null).map(() => ({ ...last }))];
      }
      // Remove excess
      return prev.slice(0, quantity);
    });
  }, [quantity]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const { translatedText: sizesAvailableText } = useAutoTranslate('Talles disponibles');
  const { translatedText: colorsText } = useAutoTranslate('Colores');
  const { translatedText: compositionText } = useAutoTranslate('Composición');
  const { translatedText: fabricationText } = useAutoTranslate('Fabricación');
  const { translatedText: careText } = useAutoTranslate('Cuidados');
  const { translatedText: addToCartText } = useAutoTranslate('Agregar al carrito');
  const { translatedText: safePayText } = useAutoTranslate('Pago seguro');
  const { translatedText: quantityLabel } = useAutoTranslate('Cantidad');
  const { translatedText: unitLabel } = useAutoTranslate('Unidad');
  const { translatedText: selectSizeForUnit } = useAutoTranslate('Selecciona talle para la unidad');
  const { translatedText: selectColorForUnit } = useAutoTranslate('Selecciona color para la unidad');
  
  if (!product) return null;

  const details = product;
  const hasSizes = details.talles && details.talles.length > 0;
  const hasColors = details.colores && details.colores.length > 0;

  const updateSelection = (index, field, value) => {
    setSelections(prev => prev.map((s, i) => i === index ? { ...s, [field]: s[field] === value ? '' : value } : s));
    setValidationMsg('');
  };

  const handleAddToCart = () => {
    // Validate all units have required selections
    for (let i = 0; i < selections.length; i++) {
      if (hasSizes && !selections[i].size) {
        setValidationMsg(`${selectSizeForUnit} ${i + 1}`);
        return;
      }
      if (hasColors && !selections[i].color) {
        setValidationMsg(`${selectColorForUnit} ${i + 1}`);
        return;
      }
    }
    setValidationMsg('');

    // Group by size+color combo
    const grouped = {};
    selections.forEach(s => {
      const key = `${s.size}||${s.color}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    // Add each unique combo to cart
    Object.entries(grouped).forEach(([key, qty]) => {
      const [size, color] = key.split('||');
      onAddToCart(product, size, color, qty);
    });

    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${isDark ? 'bg-neutral-900' : 'bg-white'} shadow-2xl w-full max-w-4xl h-[85vh] md:h-[90vh] overflow-hidden flex flex-col md:flex-row win-frame`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-48 md:h-auto md:min-h-[500px] relative flex-shrink-0 win-inset">
              <Carousel images={product.gallery || [product.imageUrl]} />
            </div>

            <div className={`w-full md:w-1/2 p-4 md:p-8 flex-1 min-h-0 overflow-y-auto ${isDark ? 'bg-neutral-900' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</h2>
                  <p className={isDark ? 'text-xl font-semibold mt-1 text-gray-400' : 'text-xl text-purple-600 font-semibold mt-1'}>{product.price}</p>
                </div>
                <button onClick={onClose} className={isDark ? 'text-gray-600 hover:text-gray-100' : 'text-gray-400 hover:text-black'}><FiX size={24} /></button>
              </div>

              {details && (
                <div className={`space-y-5 text-sm ${isDark ? 'text-gray-400' : ''}`}>

                  {/* Per-unit size/color selectors */}
                  {(hasSizes || hasColors) && selections.map((sel, idx) => (
                    <div key={idx} className={`space-y-4 ${quantity > 1 ? `pt-4 ${idx > 0 ? `border-t ${isDark ? 'border-neutral-700' : 'border-gray-200'}` : ''}` : ''}`}>
                      {quantity > 1 && (
                        <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{unitLabel} {idx + 1}</h3>
                      )}

                      {hasSizes && (
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                            {sizesAvailableText} *
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {details.talles.map(t => (
                              <button
                                key={t}
                                onClick={() => updateSelection(idx, 'size', t)}
                                className={`border px-4 py-2 md:px-3 md:py-1 transition-colors ${
                                  sel.size === t
                                    ? isDark ? 'border-gray-600 bg-gray-600 text-white' : 'border-purple-600 bg-purple-600 text-white'
                                    : isDark ? 'border-neutral-700 text-neutral-400 hover:border-neutral-500' : 'border-gray-300 text-gray-700 hover:border-purple-400'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasColors && (
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                            {colorsText} *
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {details.colores.map(c => (
                              <button
                                key={c}
                                onClick={() => updateSelection(idx, 'color', c)}
                                className={`px-4 py-2 md:px-3 md:py-1 transition-colors ${
                                  sel.color === c
                                    ? isDark ? 'bg-gray-600 text-white' : 'bg-purple-600 text-white'
                                    : isDark ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{compositionText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}><TranslatedText text={details.composicion} /></p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{fabricationText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}><TranslatedText text={details.fabricacion} /></p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{careText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}><TranslatedText text={details.cuidados} /></p>
                  </div>
                </div>
              )}

              {validationMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                    isDark ? 'bg-red-900/40 text-red-300 border border-red-800/50' : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationMsg}
                </motion.div>
              )}

              {/* Quantity selector */}
              <div className="mt-5 flex items-center gap-4">
                <h3 className={`font-semibold text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{quantityLabel}</h3>
                <div className={`flex items-center border ${isDark ? 'border-neutral-700' : 'border-gray-300'}`}>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className={`px-3 py-2 transition-colors ${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className={`px-4 py-2 text-sm font-medium min-w-[2.5rem] text-center ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className={`px-3 py-2 transition-colors ${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-6 flex items-center justify-center w-full py-3 px-4 tracking-widest uppercase text-xs border transition-colors duration-300 win-btn ${
                  isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={handleAddToCart}
              >
                <FiShoppingCart className="mr-2" />
                {addToCartText}
              </motion.button>
              <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                <img src="/img/mercadopago.svg" alt="Mercado Pago" className="h-9" />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>· {safePayText}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductDetailModal;
