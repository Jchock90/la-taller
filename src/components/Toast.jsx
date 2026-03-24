import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const Toast = ({ message, show, onClose }) => {
  const { isDark } = useTheme();
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed right-6 z-50 ${isDark ? 'bg-green-700' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
          style={{ bottom: 'calc(var(--fab-bottom, 24px) + 64px)' }}
        >
          <FiCheck className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
