import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const ProductCard = ({ item, index, onViewDetail }) => {
  const { isDark } = useTheme();
  const { translatedText: viewMoreText } = useAutoTranslate('Ver más');
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    transition={{ type: 'spring', stiffness: 80, damping: 15, delay: index * 0.08 }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ y: -8, scale: 1.03 }}
    className={`${isDark ? 'bg-black border-neutral-800' : 'bg-white border-gray-100'} overflow-hidden shadow-md border h-full flex flex-col`}
  >
    <div className="h-64 overflow-hidden relative group win-inset">
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
      <p className={`font-semibold mb-4 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>{item.price}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center w-full py-2.5 px-4 tracking-widest uppercase text-xs border transition-colors duration-300 win-btn ${
          isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
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

export default memo(ProductCard);
