import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { parsePrice } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const CartPanel = ({ cart, cartCount, cartTotal, showCart, onClose, onUpdateQuantity, onRemove, onCheckout }) => {
  const { isDark } = useTheme();
  const { translatedText: yourCartText } = useAutoTranslate('Tu carrito');
  const { translatedText: emptyCartText } = useAutoTranslate('Tu carrito está vacío');
  const { translatedText: sizeText } = useAutoTranslate('Talle:');
  const { translatedText: colorText } = useAutoTranslate('Color:');
  const { translatedText: totalText } = useAutoTranslate('Total:');
  const { translatedText: checkoutText } = useAutoTranslate('Finalizar compra');
  const { translatedText: safePayText } = useAutoTranslate('Pago seguro');

  // Close on Escape
  useEffect(() => {
    if (!showCart) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showCart, onClose]);
  
  return createPortal(
    <AnimatePresence>
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`relative w-full max-w-md ${isDark ? 'bg-black' : 'bg-white'} h-full shadow-xl flex flex-col win-frame`}
          >
            <div className={`flex items-center justify-between p-4 ${isDark ? 'border-neutral-800 text-neutral-100' : 'border-gray-200'} border-b`}>
              <h2 className="text-xl font-bold">{yourCartText} ({cartCount})</h2>
              <button onClick={onClose} className={isDark ? 'text-neutral-600 hover:text-neutral-100' : 'text-gray-500 hover:text-black'}><FiX size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className={`${isDark ? 'text-neutral-500' : 'text-gray-500'} text-center mt-10`}>{emptyCartText}</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className={`flex items-center gap-4 pb-4 ${isDark ? 'border-neutral-800' : 'border-gray-200'} border-b`}>
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${isDark ? 'text-neutral-100' : 'text-gray-900'}`}>{item.name}</h4>
                      {item.selectedSize && <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{sizeText} {item.selectedSize}</p>}
                      {item.selectedColor && <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{colorText} {item.selectedColor}</p>}
                      <p className={`text-sm font-semibold ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>{item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => onUpdateQuantity(idx, -1)} className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center ${isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border hover:bg-gray-100'}`}><FiMinus size={16} /></button>
                        <span className={`text-sm font-medium w-6 text-center ${isDark ? 'text-neutral-100' : ''}`}>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(idx, 1)} className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center ${isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border hover:bg-gray-100'}`}><FiPlus size={16} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isDark ? 'text-neutral-100' : ''}`}>${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</p>
                      <button onClick={() => onRemove(idx)} className="text-red-500 hover:text-red-700 mt-1"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={`p-4 ${isDark ? 'border-neutral-800' : 'border-gray-200'} border-t`}>
                <div className={`flex justify-between text-lg font-bold mb-4 ${isDark ? 'text-neutral-100' : ''}`}>
                  <span>{totalText}</span>
                  <span>${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className={`w-full py-3 tracking-widest uppercase text-xs border cursor-pointer transition-colors duration-300 win-btn ${
                    isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {checkoutText}
                </button>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <img src="/img/mercadopago.svg" alt="Mercado Pago" className="h-9" />
                  <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>· {safePayText}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const CartButton = ({ cartCount, onClick }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`fixed right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
        isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-black text-white'
      }`}
      style={{ bottom: 'var(--fab-bottom, 24px)', transition: 'bottom 0.15s ease-out' }}
    >
      <FiShoppingCart size={24} />
      {cartCount > 0 && (
        <span className={`absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${
          isDark ? 'bg-neutral-700' : 'bg-purple-600'
        }`}>
          {cartCount}
        </span>
      )}
    </motion.button>
  );
};

export { CartPanel, CartButton };
