import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import Carousel from '../components/Carousel';
import WhatsAppContact from '../components/WhatsAppContact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const TypewriterQuote = ({ text, isDark }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(text);
  const containerRef = useRef(null);

  // Start typing only when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!text || !isVisible) return;
    textRef.current = text;
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (textRef.current !== text) { clearInterval(timer); return; }
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, [text, isVisible]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  if (!text) return null;
  return (
    <div ref={containerRef} className={`py-12 md:py-24 px-6 ${isDark ? 'bg-black' : 'bg-white'} flex flex-col items-center`}>
      <div className={`w-12 h-px ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'} mb-10`} />
      <div className="relative max-w-2xl w-full text-center">
        <p className={`text-base md:text-2xl lg:text-3xl leading-relaxed font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-800'} invisible`} aria-hidden="true">
          "{text}"
        </p>
        <p className={`text-base md:text-2xl lg:text-3xl leading-relaxed font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-800'} absolute inset-0`}>
          "{displayed}"
          <span className={`inline-block w-[2px] h-[1.2em] ${isDark ? 'bg-neutral-300' : 'bg-neutral-800'} ml-1 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </p>
      </div>
      <div className={`w-12 h-px ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'} mt-10`} />
    </div>
  );
};

const Home = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedGalleryIndex, setExpandedGalleryIndex] = useState(null);

  // Close gallery modal on Escape
  const closeGallery = useCallback(() => setExpandedGalleryIndex(null), []);
  useEffect(() => {
    if (expandedGalleryIndex === null) return;
    const handleEsc = (e) => e.key === 'Escape' && closeGallery();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [expandedGalleryIndex, closeGallery]);

  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1770750350/IMG_20250401_125636_065_fnnsll.jpg'
  ];

  const galleryImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_1200,h_900,q_auto,f_auto/v1749191481/2_zdjmle.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_1200,h_900,q_auto,f_auto/v1749190222/2_qvqrsy.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_1200,h_900,q_auto,f_auto/v1749190908/8_wslmkq.webp',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_1200,h_900,q_auto,f_auto/v1753679983/IMG_20250715_155506_pa6s9o.jpg'
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
  const { translatedText: testimonial1Text } = useAutoTranslate('La Taller cambió mi forma de relacionarme con mi cuerpo y la ropa. Cada prenda que creo es un acto de amor propio.');
  const { translatedText: testimonial2Text } = useAutoTranslate('Llegué sin saber coser nada y salí con una bombacha hecha por mis propias manos. Fue mágico.');
  const { translatedText: testimonial3Text } = useAutoTranslate('Es más que un taller, es un espacio donde te permites ser creativa y vulnerable al mismo tiempo.');
  const { translatedText: hiloQuote } = useAutoTranslate('Cada prenda nace de un hilo propio');
  const { translatedText: hiloSub } = useAutoTranslate('Conoce mi historia');
  const { translatedText: galleryCta } = useAutoTranslate('Descubre más momentos y detalles de La Taller. Te invito a conocer la galería completa.');
  const { translatedText: seeMoreText } = useAutoTranslate('Ver más');
  const { translatedText: seeCollectionText } = useAutoTranslate('Ver colección');

  const translatedTestimonials = [
    { text: testimonial1Text, author: 'María' },
    { text: testimonial2Text, author: 'Lucía' },
    { text: testimonial3Text, author: 'Soledad' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="home" className="relative">
      <div className="h-[80vh] w-full">
        <Carousel images={carouselImages} />
      </div>

      {/* Tesoro hero (moved up) */}
      <div className={`w-full ${isDark ? 'bg-black' : 'bg-white'} py-16`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          viewport={{ once: true }}
          className="relative group max-w-md mx-auto px-6"
        >
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://res.cloudinary.com/dtnkj0wdx/image/upload/v1753672721/T2_jew1by.jpg"
              alt="Productos disponibles"
              className="w-full h-[24rem] object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              style={{ objectPosition: 'center 70%' }}
              onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
            />
            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.2 }}
                viewport={{ once: true }}
                className={`px-12 py-3.5 tracking-widest uppercase text-sm border cursor-pointer transition-colors duration-300 ${isDark ? 'border-neutral-700 text-neutral-700 hover:bg-black/10' : 'border-neutral-700 text-neutral-700 hover:bg-black/10'}`}
                onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
              >
                {seeCollectionText} →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hilo Propio hero */}
      <div className={`w-full ${isDark ? 'bg-black' : 'bg-white'}`}>
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden cursor-pointer group"
          onClick={() => setCurrentSection && setCurrentSection('quien-soy')}
        >
          <img
            src="https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_1600,q_auto,f_auto/v1749188256/IMG_20250401_130716_872_keefme.jpg"
            alt="Hilo propio"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl md:text-5xl text-white text-center drop-shadow-lg mb-4"
            >
              {hiloQuote}
            </motion.p>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-white/80 text-sm md:text-base tracking-widest uppercase group-hover:text-white transition-colors duration-300"
            >
              {hiloSub} →
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className={`w-full ${isDark ? 'bg-black' : 'bg-white'} py-20`}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Testimonials */}
          <motion.h3
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            viewport={{ once: true }}
            className={`text-sm md:text-base tracking-[0.3em] uppercase text-center ${isDark ? 'text-neutral-400' : 'text-neutral-500'} mb-12`}
          >{testimonialTitle}</motion.h3>

          <AnimatePresence mode="wait">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 70, damping: 16 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className={`block text-5xl md:text-6xl leading-none ${isDark ? 'text-neutral-700' : 'text-neutral-200'} mb-4 select-none`}>"</span>
            <p className={`text-base md:text-lg italic leading-relaxed mb-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              {translatedTestimonials[currentTestimonial].text}
            </p>
            <div className={`w-8 h-px ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'} mx-auto mb-4`} />
            <p className={`text-sm tracking-[0.2em] uppercase ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {translatedTestimonials[currentTestimonial].author}
            </p>
          </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {translatedTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTestimonial ? `${isDark ? 'bg-neutral-400' : 'bg-neutral-700'} w-8` : `${isDark ? 'bg-neutral-700' : 'bg-neutral-300'} w-1.5`}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`w-full ${isDark ? 'bg-black' : 'bg-neutral-50'} py-20`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            viewport={{ once: true }}
            className={`text-sm md:text-base tracking-[0.3em] uppercase text-center ${isDark ? 'text-neutral-400' : 'text-neutral-500'} mb-12`}
          >{galleryTitle}</motion.h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 70, damping: 14, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`relative overflow-hidden cursor-pointer group ${idx === 0 || idx === 3 ? 'h-72 md:h-80' : 'h-56 md:h-64'}`}
                onClick={() => setExpandedGalleryIndex(idx)}
              >
                <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>

          {/* CTA below gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              className={`px-12 py-3.5 tracking-widest uppercase text-sm border cursor-pointer ${isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'} transition-colors duration-300`}
              onClick={() => setCurrentSection && setCurrentSection('que-hago')}
            >
              {seeMoreText}
            </button>
          </motion.div>

          {/* Modal for expanded gallery image */}
          <AnimatePresence>
          {expandedGalleryIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${isDark ? 'bg-black/95' : 'bg-black/90'} z-50 flex flex-col items-center justify-center p-4`}
              onClick={() => setExpandedGalleryIndex(null)}
            >
              <div 
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setExpandedGalleryIndex(null)}
                  className={`absolute top-4 right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                    isDark ? 'hover:text-neutral-300' : 'hover:text-neutral-400'
                  }`}
                  aria-label="Cerrar imagen"
                >
                  &times;
                </button>

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedGalleryIndex((expandedGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
                      }}
                      className={`absolute left-2 md:left-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                        isDark ? 'hover:text-neutral-300' : 'hover:text-neutral-400'
                      }`}
                      aria-label="Imagen anterior"
                    >
                      &#10094;
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedGalleryIndex((expandedGalleryIndex + 1) % galleryImages.length);
                      }}
                      className={`absolute right-2 md:right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                        isDark ? 'hover:text-neutral-300' : 'hover:text-neutral-400'
                      }`}
                      aria-label="Siguiente imagen"
                    >
                      &#10095;
                    </button>
                  </>
                )}

                <motion.img
                  key={expandedGalleryIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={galleryImages[expandedGalleryIndex]}
                  alt={`Galería ${expandedGalleryIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {expandedGalleryIndex + 1} / {galleryImages.length}
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Typewriter quote */}
      <TypewriterQuote text={quoteText} isDark={isDark} />

      <div>
        <WhatsAppContact />
      </div>
    </section>
  );
};

export default Home;
