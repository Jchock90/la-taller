import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_URL } from '../data/constants';

const WhatsAppContact = ({ button = false }) => {
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
        <FaWhatsapp className="mr-2" /> Solicitar diseño personalizado
      </motion.a>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-6 bottom-6 z-50"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-green-500 text-white px-2 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={38} className="" />
      </a>
    </motion.div>
  );
};

export default WhatsAppContact;