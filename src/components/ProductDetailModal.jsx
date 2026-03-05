import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import Carousel from './Carousel';
import { PRODUCT_GALLERY, PRODUCT_DETAILS } from '../data/products';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  if (!product) return null;

  const details = PRODUCT_DETAILS[product.id];

  const handleAddToCart = () => {
    if (details && details.talles.length > 0 && !selectedSize) {
      alert('Por favor selecciona un talle');
      return;
    }
    if (details && details.colores.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color');
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-72 md:h-auto md:min-h-[500px] relative">
              <Carousel images={PRODUCT_GALLERY[product.imageKey]} />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-xl text-purple-600 font-semibold mt-1">{product.price}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-black"><FiX size={24} /></button>
              </div>

              {details && (
                <div className="space-y-5 text-sm">
                  {details.talles && details.talles.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Talles disponibles *</h3>
                      <div className="flex gap-2 flex-wrap">
                        {details.talles.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedSize(t)}
                            className={`border rounded px-3 py-1 transition-colors ${
                              selectedSize === t 
                                ? 'border-purple-600 bg-purple-600 text-white' 
                                : 'border-gray-300 text-gray-700 hover:border-purple-400'
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
                      <h3 className="font-semibold text-gray-900 mb-2">Colores *</h3>
                      <div className="flex gap-2 flex-wrap">
                        {details.colores.map(c => (
                          <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            className={`rounded-full px-3 py-1 transition-colors ${
                              selectedColor === c 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Composición</h3>
                    <p className="text-gray-600">{details.composicion}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fabricación</h3>
                    <p className="text-gray-600">{details.fabricacion}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cuidados</h3>
                    <p className="text-gray-600">{details.cuidados}</p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleAddToCart}
              >
                <FiShoppingCart className="mr-2" />
                Agregar al carrito
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductDetailModal;
