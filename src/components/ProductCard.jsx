import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const ProductCard = ({ item, index, onViewDetail }) => {
  const { isDark } = useTheme();
  const { translatedText: viewMoreText } = useAutoTranslate('Ver más');
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className={`${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} rounded-lg overflow-hidden shadow-md border h-full flex flex-col`}
  >
    <div className="h-64 overflow-hidden relative group">
      <motion.img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <div className="p-6">
      <h4 className={`text-xl leading-7 font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2 line-clamp-2 min-h-[3.5rem]`} title={item.name}>{item.name}</h4>
      <p className="text-purple-600 font-semibold mb-4">{item.price}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        onClick={() => onViewDetail(item)}
      >
        <FiEye className="mr-2" />
        {viewMoreText}
      </motion.button>
    </div>
  </motion.div>
  );
};

export default ProductCard;
