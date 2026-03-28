import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_URL } from '../data/constants';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const WhatsAppContact = ({ button = false }) => {
  const { translatedText: customDesignText } = useAutoTranslate('Solicitar diseño personalizado');
  if (button) {
    return (
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-green-600 transition-colors flex items-center"
      >
        <FaWhatsapp className="mr-2" /> {customDesignText}
      </motion.a>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1 }}
      className="fixed left-6 z-50"
      style={{ bottom: 'var(--fab-bottom, 24px)', transition: 'bottom 0.15s ease-out' }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-green-500 text-white px-2 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={38} />
      </a>
    </motion.div>
  );
};

export default WhatsAppContact;