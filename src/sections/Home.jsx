import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import WhatsAppContact from '../components/WhatsAppContact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Home = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ years: 0, students: 0, pieces: 0, workshops: 0 });

  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1770750350/IMG_20250401_125636_065_fnnsll.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1770751215/DSC_4000_kbul1k.jpg'
  ];

  const galleryImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1749191481/2_zdjmle.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1749190222/2_qvqrsy.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1749190908/8_wslmkq.webp',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1753679983/IMG_20250715_155506_pa6s9o.jpg'
  ];

  const testimonials = [
    {
      text: 'La Taller cambió mi forma de relacionarme con mi cuerpo y la ropa. Cada prenda que creo es un acto de amor propio.',
      author: 'María'
    },
    {
      text: 'Llegué sin saber coser nada y salí con una bombacha hecha por mis propias manos. Fue mágico.',
      author: 'Lucía'
    },
    {
      text: 'Es más que un taller, es un espacio donde te permites ser creativa y vulnerable al mismo tiempo.',
      author: 'Soledad'
    }
  ];

  const stats = [
    { label: 'Años tejiendo historias', value: 8 },
    { label: 'Alumnas formadas', value: 250 },
    { label: 'Prendas creadas', value: 1500 },
    { label: 'Talleres realizados', value: 95 }
  ];

  const { translatedText: quoteText } = useAutoTranslate('La ropa que vistes es la primera pregunta que responde tu cuerpo cada mañana. En La Taller, aprendemos a responder con consciencia, creatividad y amor.');
  const { translatedText: galleryTitle } = useAutoTranslate('Momentos en La Taller');
  const { translatedText: testimonialTitle } = useAutoTranslate('Lo que dicen nuestras alumnas');
  const { translatedText: stat1Label } = useAutoTranslate('Años tejiendo historias');
  const { translatedText: stat2Label } = useAutoTranslate('Alumnas formadas');
  const { translatedText: stat3Label } = useAutoTranslate('Prendas creadas');
  const { translatedText: stat4Label } = useAutoTranslate('Talleres realizados');
  const { translatedText: testimonial1Text } = useAutoTranslate('La Taller cambió mi forma de relacionarme con mi cuerpo y la ropa. Cada prenda que creo es un acto de amor propio.');
  const { translatedText: testimonial2Text } = useAutoTranslate('Llegué sin saber coser nada y salí con una bombacha hecha por mis propias manos. Fue mágico.');
  const { translatedText: testimonial3Text } = useAutoTranslate('Es más que un taller, es un espacio donde te permites ser creativa y vulnerable al mismo tiempo.');

  const translatedTestimonials = [
    { text: testimonial1Text, author: 'María' },
    { text: testimonial2Text, author: 'Lucía' },
    { text: testimonial3Text, author: 'Soledad' }
  ];

  const translatedStats = [
    { label: stat1Label, value: 8 },
    { label: stat2Label, value: 250 },
    { label: stat3Label, value: 1500 },
    { label: stat4Label, value: 95 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const targetStats = { years: 8, students: 250, pieces: 1500, workshops: 95 };
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCounters({
        years: Math.floor(targetStats.years * progress),
        students: Math.floor(targetStats.students * progress),
        pieces: Math.floor(targetStats.pieces * progress),
        workshops: Math.floor(targetStats.workshops * progress)
      });

      if (progress === 1) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative">
      <div className="h-[70vh] w-full pt-10">
        <Carousel images={carouselImages} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full ${isDark ? 'bg-black' : 'bg-white'} py-16`}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className={`text-xl md:text-2xl leading-relaxed font-medium italic ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            "{quoteText}"
          </p>
        </div>
      </motion.div>

      <div className={`w-full ${isDark ? 'bg-black' : 'bg-gray-50'} py-16`}>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className={`text-2xl md:text-3xl font-bold text-center ${isDark ? 'text-gray-100' : 'text-black'} mb-12`}>{galleryTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="relative h-48 rounded-lg overflow-hidden shadow-md cursor-pointer group"
              >
                <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className={`w-full ${isDark ? 'bg-black' : 'bg-white'} py-16`}>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className={`text-2xl md:text-3xl font-bold text-center ${isDark ? 'text-gray-100' : 'text-black'} mb-12`}>{testimonialTitle}</h3>
          <div className="grid grid-cols-4 gap-4 mb-12">
            {translatedStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`text-center p-6 rounded-lg ${isDark ? 'bg-black border border-gray-800' : 'bg-gray-100'}`}
              >
                <div className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-black'} mb-2`}>
                  {counters[Object.keys(counters)[idx]]}+
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`text-center p-8 rounded-lg ${isDark ? 'bg-black border border-gray-800' : 'bg-gray-100'} max-w-2xl mx-auto`}
          >
            <p className={`text-lg italic mb-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              "{translatedTestimonials[currentTestimonial].text}"
            </p>
            <p className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              – {translatedTestimonials[currentTestimonial].author}
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mt-6">
            {translatedTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentTestimonial ? `${isDark ? 'bg-purple-400' : 'bg-purple-600'} w-8` : isDark ? 'bg-gray-700' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`w-full ${isDark ? 'bg-black' : 'bg-white'} py-8`}>
        <div className="max-w-md mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://res.cloudinary.com/dtnkj0wdx/image/upload/v1753672721/T2_jew1by.jpg"
                alt="Productos disponibles"
                className="w-full h-[20rem] md:h-[24rem] object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                }`}
              >
                {t('home.buttonText')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div>
        <WhatsAppContact />
      </div>
    </section>
  );
};

export default Home;
