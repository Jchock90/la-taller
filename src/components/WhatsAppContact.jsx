import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppContact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-6 bottom-6 z-50"
    >
      <a
        href="https://wa.me/5493447552378?text=Hola%20Jésica,%20me%20interesa%20tu%20trabajo"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={24} className="mr-2" />
        <span>Contactar</span>
      </a>
    </motion.div>
  );
};

export default WhatsAppContact;