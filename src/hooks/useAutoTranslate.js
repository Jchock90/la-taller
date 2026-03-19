import { useState, useEffect, createElement } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../services/translationService';

const localTranslations = {
  // TickerBar
  'Acompaño a las personas en un viaje hacia su propia creación, en un espacio seguro, sensible y creativo💘':
    'I accompany people on a journey toward their own creation, in a safe, sensitive and creative space💘',
  'Acompaño a las personas en un viaje hacia su propia creación, en un espacio seguro, sensible y creativo.':
    'I accompany people on a journey toward their own creation, in a safe, sensitive and creative space.',

  // Home
  'La ropa que vistes es la primera pregunta que responde tu cuerpo cada mañana. En La Taller, aprendemos a responder con consciencia, creatividad y amor.':
    'The clothes you wear are the first question your body answers every morning. At La Taller, we learn to answer with awareness, creativity and love.',
  'Momentos en La Taller': 'Moments at La Taller',
  'Lo que dicen nuestras alumnas': 'What our students say',
  'Años tejiendo historias': 'Years weaving stories',
  'Alumnas formadas': 'Students trained',
  'Prendas creadas': 'Garments created',
  'Talleres realizados': 'Workshops held',
  'La Taller cambió mi forma de relacionarme con mi cuerpo y la ropa. Cada prenda que creo es un acto de amor propio.':
    'La Taller changed the way I relate to my body and clothes. Every garment I create is an act of self-love.',
  'Llegué sin saber coser nada y salí con una bombacha hecha por mis propias manos. Fue mágico.':
    'I arrived not knowing how to sew at all and left with underwear made by my own hands. It was magical.',
  'Es más que un taller, es un espacio donde te permites ser creativa y vulnerable al mismo tiempo.':
    'It\'s more than a workshop, it\'s a space where you allow yourself to be creative and vulnerable at the same time.',
  'Conocé más': 'Learn more',

  // Services
  'Soy guía, docente e intérprete en el universo de la indumentaria. Enseño a hacer tu ropa desde cero: elegir la tela, imaginar el diseño, trazar el molde, cortar, coser, ajustar, estampar, bordar, revelar… hasta que la prenda toma forma, y con ella, la identidad de quien la viste.':
    'I am a guide, teacher and interpreter in the world of fashion. I teach you to make your own clothes from scratch: choose the fabric, imagine the design, trace the pattern, cut, sew, adjust, print, embroider, reveal… until the garment takes shape, and with it, the identity of the wearer.',
  'No solo comparto un saber técnico, comparto un oficio, un lenguaje sensible, una forma de pensar el cuerpo, el deseo y la vida cotidiana.':
    'I don\'t just share technical knowledge, I share a craft, a sensitive language, a way of thinking about the body, desire and everyday life.',
  'Mi trabajo tiene raíces profundas en un linaje de mujeres que transmitían el hacer con las manos, en ronda, en confianza, en comunidad.':
    'My work has deep roots in a lineage of women who passed down handwork, in circles, in trust, in community.',
  'He creado un espacio de aprendizaje sin estructuras rígidas, donde cualquiera puede llegar sin saber nada y salir con una prenda hecha por sus propias manos… y con una parte nueva de sí descubierta.':
    'I\'ve created a learning space without rigid structures, where anyone can arrive knowing nothing and leave with a garment made by their own hands… and a new part of themselves discovered.',
  'No enseño a coser ropa: enseño a habitarla.':
    'I don\'t teach sewing clothes: I teach how to inhabit them.',
  'Ofrezco un servicio que es un refugio textil donde cada persona puede explorar a su ritmo, sin juicios ni exigencias. Donde la prenda que nace de tus manos también te enseña algo de vos.':
    'I offer a service that is a textile refuge where each person can explore at their own pace, without judgment or demands. Where the garment born from your hands also teaches you something about yourself.',
  'La taller': 'The Workshop',
  'Taller de bombachas': 'Underwear Workshop',
  'Taller de cianotipia': 'Cyanotype Workshop',
  'Taller de infancias': 'Children\'s Workshop',

  // Products
  'Tesoro': 'Treasure',
  'Piezas exclusivas diseñadas con cuidado artesanal y atención al detalle':
    'Exclusive pieces designed with artisanal care and attention to detail',
  '¿Buscas algo personalizado?': 'Looking for something custom?',
  'Cada pieza puede ser adaptada a tus medidas y preferencias. Contáctame para crear algo único para ti.':
    'Each piece can be adapted to your measurements and preferences. Contact me to create something unique for you.',
  'Solicitar diseño personalizado': 'Request custom design',
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
  'Piezas clásicas diseñadas para trascender temporadas':
    'Classic pieces designed to transcend seasons',
  'Colección Experimental': 'Experimental Collection',
  'Diseños vanguardistas que desafían convenciones':
    'Avant-garde designs that challenge conventions',

  // ProductCard
  'Agregar al carrito': 'Add to cart',
  'Ver más': 'View more',

  // ProductDetailModal
  'Por favor selecciona un talle': 'Please select a size',
  'Por favor selecciona un color': 'Please select a color',
  'Talles disponibles': 'Available sizes',
  'Colores': 'Colors',
  'Composición': 'Composition',
  'Fabricación': 'Fabrication',
  'Cuidados': 'Care',

  // CartPanel
  'Tu carrito': 'Your cart',
  'Tu carrito está vacío': 'Your cart is empty',
  'Talle:': 'Size:',
  'Color:': 'Color:',
  'Total:': 'Total:',
  'Finalizar compra': 'Checkout',

  // CheckoutForm
  'Resumen de compra': 'Order summary',
  'Datos de envío': 'Shipping details',
  'Nombre': 'First name',
  'Apellido': 'Last name',
  'Código Postal': 'Zip code',
  'Selecciona una provincia': 'Select a province',
  'Cargando ciudades...': 'Loading cities...',
  'Selecciona una ciudad': 'Select a city',
  'Teléfono': 'Phone',
  'Error al iniciar el pago. Intenta de nuevo.': 'Error starting payment. Please try again.',
  'Error de conexión con el servidor.': 'Server connection error.',
  'Procesando...': 'Processing...',
  'Ir a pagar': 'Proceed to pay',

  // PaymentStatus
  '¡Compra exitosa!': 'Purchase successful!',
  'Tu pago fue procesado correctamente. Pronto recibirás un email con los detalles de tu compra y el seguimiento del envío.':
    'Your payment was processed successfully. You will soon receive an email with your purchase details and shipping tracking.',
  'Gracias por confiar en La Taller. Nos pondremos en contacto contigo muy pronto.':
    'Thank you for trusting La Taller. We will contact you very soon.',
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

  // CookieConsent
  '¿Aceptás nuestras cookies?': 'Do you accept our cookies?',
  'No, gracias': 'No, thanks',
  'Sí, dale': 'Yes, accept',

  // Footer
  'Diseño de indumentaria artesanal por Jess': 'Artisanal clothing design by Jess',
  'Navegación': 'Navigation',
  'Contacto': 'Contact',
  'Todos los derechos reservados.': 'All rights reserved.',

  // ProductDetailModal
  'Pago seguro': 'Secure payment',

  // Navbar
  'Spotify deshabilitado (cookies de terceros rechazadas)': 'Spotify disabled (third-party cookies rejected)',
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

      // Check local dictionary first
      if (language === 'en' && sourceLang === 'es' && localTranslations[text]) {
        setTranslatedText(localTranslations[text]);
        setIsLoading(false);
        return;
      }

      // Fall back to MyMemory translation API
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

// Component for translating dynamic content (product names, collections, etc.)
export const TranslatedText = ({ text, sourceLang = 'es' }) => {
  const { translatedText } = useAutoTranslate(text, sourceLang);
  return translatedText;
};

// Component for translating <option> elements
export const TranslatedOption = ({ value, text, sourceLang = 'es', ...props }) => {
  const { translatedText } = useAutoTranslate(text || value, sourceLang);
  return createElement('option', { value, ...props }, translatedText);
};
