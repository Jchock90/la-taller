import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useEffect } from 'react';
import { WHATSAPP_CONTACT_URL } from '../data/constants';

const PaymentStatus = ({ status, setCurrentSection }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const configs = {
    success: {
      icon: FiCheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: '¡Compra exitosa!',
      message: 'Tu pago fue procesado correctamente. Pronto recibirás un email con los detalles de tu compra y el seguimiento del envío.',
      submessage: 'Gracias por confiar en La Taller. Nos pondremos en contacto contigo muy pronto.',
    },
    failure: {
      icon: FiXCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Error en el pago',
      message: 'Hubo un problema al procesar tu pago. No se realizó ningún cargo.',
      submessage: 'Por favor, intenta nuevamente o contáctanos si el problema persiste.',
    },
    pending: {
      icon: FiClock,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Pago pendiente',
      message: 'Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.',
      submessage: 'Esto puede tardar unos minutos. No es necesario que permanezcas en esta página.',
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl w-full ${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 md:p-12 shadow-lg text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <Icon className={`${config.iconColor} w-20 h-20`} />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          {config.title}
        </h1>

        <p className="text-lg text-gray-700 mb-4">
          {config.message}
        </p>

        <p className="text-base text-gray-600 mb-8">
          {config.submessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentSection('home')}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </motion.button>

          {status === 'failure' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection('que-vendo')}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-purple-700 transition-colors"
            >
              Ver productos
            </motion.button>
          )}

          <motion.a
            href={WHATSAPP_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-green-600 transition-colors inline-block"
          >
            Contactar por WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default PaymentStatus;
