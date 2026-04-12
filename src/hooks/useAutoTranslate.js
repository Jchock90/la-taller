import { useState, useEffect, createElement } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../services/translationService';

const localTranslations = {
  'En NexusTech no solo vendemos tecnología, la entendemos y la compartimos.': 'At NexusTech we don\'t just sell technology, we understand it and share it.',
  'Nuestro equipo de especialistas está preparado para asesorarte en cada paso: desde elegir los componentes ideales para tu presupuesto hasta el armado y configuración completa de tu equipo.': 'Our team of specialists is ready to advise you every step of the way: from choosing the ideal components for your budget to the complete assembly and configuration of your setup.',
  'Ya sea que busques armar tu primera PC gaming, actualizar tu estación de trabajo profesional o simplemente necesites un diagnóstico técnico, estamos para ayudarte.': 'Whether you\'re looking to build your first gaming PC, upgrade your professional workstation, or just need a technical diagnosis, we\'re here to help.',

  'La tecnología que usás define cómo trabajas, jugás y creás. En NexusTech, te ayudamos a elegir con conocimiento y confianza.': 'The technology you use defines how you work, play and create. At NexusTech, we help you choose with knowledge and confidence.',
  'Nuestra tienda': 'Our store',
  'Lo que dicen nuestros clientes': 'What our clients say',
  'Años en el mercado': 'Years in the market',
  'Clientes satisfechos': 'Satisfied clients',
  'Productos disponibles': 'Products available',
  'Marcas oficiales': 'Official brands',
  'NexusTech cambió mi forma de armar setups. El asesoramiento fue clave para elegir todo perfecto.': 'NexusTech changed the way I build setups. The advice was key to choosing everything perfectly.',
  'Armé mi primera PC gaming con ellos y quedó increíble. El stress test fue súper completo.': 'I built my first gaming PC with them and it turned out incredible. The stress test was super thorough.',
  'El soporte técnico es rápido y profesional. Siempre vuelvo por más.': 'Technical support is fast and professional. I always come back for more.',

  'Armado de PC a medida': 'Custom PC building',
  'Soporte técnico': 'Technical support',
  'Asesoramiento': 'Consulting',

  'Tienda': 'Store',
  'Tecnología de última generación seleccionada por expertos para vos': 'Cutting-edge technology hand-picked by experts for you',
  '¿Necesitás un armado a medida?': 'Need a custom build?',
  'Configuramos tu equipo ideal según tu presupuesto y necesidades. Asesoramiento personalizado sin compromiso.': 'We configure your ideal setup based on your budget and needs. Personalized advice with no commitment.',
  'Consultar por WhatsApp': 'Ask via WhatsApp',
  'Cargando productos...': 'Loading products...',
  'Filtrar productos': 'Filter products',
  'Limpiar filtros': 'Clear filters',
  'Todas las categorías': 'All categories',
  'Todas las colecciones': 'All collections',
  'Todos los talles': 'All sizes',
  'Todos los colores': 'All colors',
  'No se encontraron productos con los filtros seleccionados': 'No products found with the selected filters',
  'agregado al carrito': 'added to cart',
  'producto': 'product',
  'productos': 'products',
  'Colección Atemporal': 'Timeless Collection',
  'Productos seleccionados para máximo rendimiento': 'Products selected for maximum performance',
  'Colección Experimental': 'Experimental Collection',
  'Lo último en tecnología e innovación': 'The latest in technology and innovation',

  'Agregar al carrito': 'Add to cart',
  'Ver más': 'View more',

  'Por favor selecciona un talle': 'Please select a size',
  'Por favor selecciona un color': 'Please select a color',
  'Talles disponibles': 'Available sizes',
  'Colores': 'Colors',
  'Composición': 'Composition',
  'Fabricación': 'Fabrication',
  'Cuidados': 'Care',

  'Tu carrito': 'Your cart',
  'Tu carrito está vacío': 'Your cart is empty',
  'Talle:': 'Size:',
  'Color:': 'Color:',
  'Total:': 'Total:',
  'Finalizar compra': 'Checkout',

  'Resumen de compra': 'Order summary',
  'Datos de envío': 'Shipping details',
  'Nombre': 'First name',
  'Apellido': 'Last name',
  'Código Postal': 'Zip code',
  'Selecciona una provincia': 'Select a province',
  'Cargando ciudades...': 'Loading cities...',
  'Selecciona una ciudad': 'Select a city',
  'Teléfono': 'Phone',
  'Dirección (calle y número)': 'Address (street and number)',
  'Piso / Depto (opcional)': 'Floor / Apt (optional)',
  'Error al iniciar el pago. Intenta de nuevo.': 'Error starting payment. Please try again.',
  'Error de conexión con el servidor.': 'Server connection error.',
  'Procesando...': 'Processing...',
  'Ir a pagar': 'Proceed to pay',

  '¡Compra exitosa!': 'Purchase successful!',
  'Tu pago fue procesado correctamente. Pronto recibirás un email con los detalles de tu compra y el seguimiento del envío.':
    'Your payment was processed successfully. You will soon receive an email with your purchase details and shipping tracking.',
  'Gracias por confiar en NexusTech. Nos pondremos en contacto contigo muy pronto.':
    'Thank you for trusting NexusTech. We will contact you very soon.',
  'Error en el pago': 'Payment error',
  'Hubo un problema al procesar tu pago. No se realizó ningún cargo.':
    'There was a problem processing your payment. No charges were made.',
  'Por favor, intenta nuevamente o contáctanos si el problema persiste.':
    'Please try again or contact us if the problem persists.',
  'Pago pendiente': 'Payment pending',
  'Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.':
    'Your payment is being processed. We will notify you by email when confirmed.',
  'Esto puede tardar unos minutos. No es necesario que permanezcas en esta página.':
    'This may take a few minutes. You don\'t need to stay on this page.',
  'Volver al inicio': 'Back to home',
  'Ver productos': 'View products',
  'Contactar por WhatsApp': 'Contact via WhatsApp',

  '¿Aceptás nuestras cookies?': 'Do you accept our cookies?',
  'No, gracias': 'No, thanks',
  'Sí, dale': 'Yes, accept',

  'Tienda de tecnología y servicios informáticos': 'Technology store and IT services',
  'Navegación': 'Navigation',
  'Contacto': 'Contact',
  'Todos los derechos reservados.': 'All rights reserved.',

  'Pago seguro': 'Secure payment',

  'Spotify deshabilitado (cookies de terceros rechazadas)': 'Spotify disabled (third-party cookies rejected)',

  'Iniciar sesión': 'Sign in',
  'Crear cuenta': 'Create account',
  'Email': 'Email',
  'Contraseña': 'Password',
  'Confirmar contraseña': 'Confirm password',
  'o': 'or',
  'Continuar con Google': 'Continue with Google',
  '¿No tenés cuenta?': "Don't have an account?",
  '¿Ya tenés cuenta?': 'Already have an account?',
  'Ventajas de registrarte': 'Benefits of signing up',
  'Seguí el estado de tus compras en tiempo real': 'Track your purchases status in real time',
  'Historial completo de todas tus compras': 'Complete history of all your purchases',
  'Proceso de compra más rápido': 'Faster checkout process',
  'Las contraseñas no coinciden': 'Passwords do not match',
  'Los emails no coinciden': 'Emails do not match',
  'Confirmar email': 'Confirm email',
  '¡Cuenta creada!': 'Account created!',
  'Tu cuenta fue creada exitosamente. Ya podés empezar a comprar.': 'Your account was created successfully. You can now start shopping.',

  'Mi cuenta': 'My account',
  'Mis compras': 'My purchases',
  'Aún no tenés compras realizadas': 'You have no purchases yet',
  'Explorar productos': 'Explore products',
  'Cerrar sesión': 'Sign out',
  'Total': 'Total',
  'Pendiente': 'Pending',
  'En proceso': 'In process',
  'Aprobado': 'Approved',
  'Rechazado': 'Rejected',
  'Reembolsado': 'Refunded',
  'Despachado': 'Shipped',
  'Seguir mi envío': 'Track my shipment',
  'Estado': 'Status',
  'Fecha': 'Date',
  'Ver detalles': 'View details',
  'Cargando...': 'Loading...',
  'Envío a': 'Shipping to',
};

export const useAutoTranslate = (text, sourceLang = 'es') => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(() => {
    if (language === sourceLang) return text;
    if (language === 'en' && sourceLang === 'es' && localTranslations[text]) {
      return localTranslations[text];
    }
    return text;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function doTranslate() {
      if (language === sourceLang) {
        setTranslatedText(text);
        setIsLoading(false);
        return;
      }

      if (language === 'en' && sourceLang === 'es' && localTranslations[text]) {
        setTranslatedText(localTranslations[text]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translateText(text, language, sourceLang);
        if (!cancelled) {
          setTranslatedText(result);
        }
      } catch {
        if (!cancelled) setTranslatedText(text);
      }
      if (!cancelled) setIsLoading(false);
    }
    doTranslate();
    return () => { cancelled = true; };
  }, [text, language, sourceLang]);

  return { translatedText, isLoading };
};

export const TranslatedText = ({ text, sourceLang = 'es' }) => {
  const { translatedText } = useAutoTranslate(text, sourceLang);
  return translatedText;
};

export const TranslatedOption = ({ value, text, sourceLang = 'es', ...props }) => {
  const { translatedText } = useAutoTranslate(text || value, sourceLang);
  return createElement('option', { value, ...props }, translatedText);
};
