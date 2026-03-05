import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { PRODUCT_IMAGES, parsePrice } from '../data/products';

const CartPanel = ({ cart, cartCount, cartTotal, showCart, onClose, onUpdateQuantity, onRemove, onCheckout }) => (
  createPortal(
    <AnimatePresence>
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Tu carrito ({cartCount})</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black"><FiX size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Tu carrito está vacío</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-4 border-b pb-4">
                    <img src={PRODUCT_IMAGES[item.imageKey]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      {item.selectedSize && <p className="text-xs text-gray-500">Talle: {item.selectedSize}</p>}
                      {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                      <p className="text-purple-600 text-sm font-semibold">{item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => onUpdateQuantity(idx, -1)} className="p-1 border rounded hover:bg-gray-100"><FiMinus size={14} /></button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(idx, 1)} className="p-1 border rounded hover:bg-gray-100"><FiPlus size={14} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</p>
                      <button onClick={() => onRemove(idx)} className="text-red-500 hover:text-red-700 mt-1"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-purple-700 transition-colors"
                >
                  Finalizar compra
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
);

const CartButton = ({ cartCount, onClick }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="fixed right-6 bottom-6 z-40 bg-black text-white p-4 rounded-full shadow-lg"
  >
    <FiShoppingCart size={24} />
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {cartCount}
      </span>
    )}
  </motion.button>
);

export { CartPanel, CartButton };
