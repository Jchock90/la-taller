import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { PRODUCT_IMAGES } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const ProductCard = ({ item, index, onAddToCart, onViewDetail }) => {
  const { isDark } = useTheme();
  const { translatedText: addToCartText } = useAutoTranslate('Agregar al carrito');
  const { translatedText: viewMoreText } = useAutoTranslate('Ver más');
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className={`${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} rounded-lg overflow-hidden shadow-md border`}
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
        className={`absolute bottom-3 right-3 flex items-center gap-1 ${isDark ? 'bg-gray-700/80 text-gray-100' : 'bg-white/80 text-gray-700'} backdrop-blur-sm text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        <FiEye size={14} />
        {viewMoreText}
      </button>
    </div>
    <div className="p-6">
      <h4 className={`text-xl font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{item.name}</h4>
      <p className="text-purple-600 font-semibold mb-4">{item.price}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        onClick={() => onAddToCart(item)}
      >
        <FiShoppingCart className="mr-2" />
        {addToCartText}
      </motion.button>
    </div>
  </motion.div>
  );
};

export default ProductCard;
