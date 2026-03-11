import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import Carousel from './Carousel';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { isDark } = useTheme();
  
  const { translatedText: selectSizeText } = useAutoTranslate('Por favor selecciona un talle');
  const { translatedText: selectColorText } = useAutoTranslate('Por favor selecciona un color');
  const { translatedText: sizesAvailableText } = useAutoTranslate('Talles disponibles');
  const { translatedText: colorsText } = useAutoTranslate('Colores');
  const { translatedText: compositionText } = useAutoTranslate('Composición');
  const { translatedText: fabricationText } = useAutoTranslate('Fabricación');
  const { translatedText: careText } = useAutoTranslate('Cuidados');
  const { translatedText: addToCartText } = useAutoTranslate('Agregar al carrito');
  
  if (!product) return null;

  const details = product;

  const handleAddToCart = () => {
    if (details && details.talles.length > 0 && !selectedSize) {
      alert(selectSizeText);
      return;
    }
    if (details && details.colores.length > 0 && !selectedColor) {
      alert(selectColorText);
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${isDark ? 'bg-gray-950' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-72 md:h-auto md:min-h-[500px] relative">
              <Carousel images={product.gallery || [product.imageUrl]} />
            </div>

            <div className={`w-full md:w-1/2 p-6 md:p-8 overflow-y-auto ${isDark ? 'bg-gray-950' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</h2>
                  <p className={isDark ? 'text-xl font-semibold mt-1 text-gray-400' : 'text-xl text-purple-600 font-semibold mt-1'}>{product.price}</p>
                </div>
                <button onClick={onClose} className={isDark ? 'text-gray-600 hover:text-gray-100' : 'text-gray-400 hover:text-black'}><FiX size={24} /></button>
              </div>

              {details && (
                <div className={`space-y-5 text-sm ${isDark ? 'text-gray-400' : ''}`}>
                  {details.talles && details.talles.length > 0 && (
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{sizesAvailableText} *</h3>
                      <div className="flex gap-2 flex-wrap">
                        {details.talles.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedSize(t)}
                            className={`border rounded px-3 py-1 transition-colors ${
                              selectedSize === t 
                                ? isDark ? 'border-gray-600 bg-gray-600 text-white' : 'border-purple-600 bg-purple-600 text-white'
                                : isDark ? 'border-gray-700 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-purple-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.colores && details.colores.length > 0 && (
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{colorsText} *</h3>
                      <div className="flex gap-2 flex-wrap">
                        {details.colores.map(c => (
                          <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            className={`rounded-full px-3 py-1 transition-colors ${
                              selectedColor === c 
                                ? isDark ? 'bg-gray-600 text-white' : 'bg-purple-600 text-white'
                                : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{compositionText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>{details.composicion}</p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{fabricationText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>{details.fabricacion}</p>
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{careText}</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>{details.cuidados}</p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-6 flex items-center justify-center w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                }`}
                onClick={handleAddToCart}
              >
                <FiShoppingCart className="mr-2" />
                {addToCartText}
              </motion.button>
              <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                <img src="/img/mercadopago.svg" alt="Mercado Pago" className="h-9" />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>· Pago seguro</span>
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
