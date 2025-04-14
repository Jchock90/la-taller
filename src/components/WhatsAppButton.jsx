import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

const WhatsAppButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href="https://wa.me/549TU_NUMERO"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={28} />
        <span className="ml-2 hidden md:inline-block font-medium">
          Contactar
        </span>
      </a>
    </motion.div>
  )
}

export default WhatsAppButton