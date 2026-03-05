import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { PRODUCT_IMAGES } from '../data/products';

const ProductCard = ({ item, index, onAddToCart, onViewDetail }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
  >
    <div className="h-64 overflow-hidden relative group">
      <motion.img
        src={PRODUCT_IMAGES[item.imageKey]}
        alt={item.name}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      <button
        onClick={() => onViewDetail(item)}
        className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
      >
        <FiEye size={14} />
        Ver más
      </button>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-medium text-gray-900 mb-2">{item.name}</h4>
      <p className="text-purple-600 font-semibold mb-4">{item.price}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-full bg-black text-white py-2 px-4 rounded-md"
        onClick={() => onAddToCart(item)}
      >
        <FiShoppingCart className="mr-2" />
        Agregar al carrito
      </motion.button>
    </div>
  </motion.div>
);

export default ProductCard;
