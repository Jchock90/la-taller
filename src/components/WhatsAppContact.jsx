import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppContact = ({ phone, message }) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-green-100">
      <div className="flex items-center mb-4">
        <FaWhatsapp className="text-green-500 text-3xl mr-3" />
        <h3 className="text-xl font-bold text-gray-800">Contacto directo</h3>
      </div>
      <p className="text-gray-600 mb-4">
        ¿Quieres hablar con Jésica sobre un diseño personalizado? Envíale un mensaje directo por WhatsApp.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp className="mr-2" />
        Enviar mensaje
      </a>
    </div>
  );
};

export default WhatsAppContact;