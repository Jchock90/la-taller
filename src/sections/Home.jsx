import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import WhatsAppContact from '../components/WhatsAppContact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import { FiCpu, FiMonitor, FiHeadphones, FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiZap } from 'react-icons/fi';

const Home = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [heroImageIdx, setHeroImageIdx] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1600&q=80',
  ];

  const categoryCards = [
    { icon: FiCpu, title: 'Componentes', desc: 'GPUs, CPUs, RAM, SSDs', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80' },
    { icon: FiMonitor, title: 'Monitores', desc: 'OLED, 4K, 240Hz', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
    { icon: FiHeadphones, title: 'Periféricos', desc: 'Teclados, Mouse, Audio', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80' },
  ];

  const features = [
    { icon: FiShield, title: 'Garantía extendida', desc: 'Hasta 3 años en productos seleccionados' },
    { icon: FiTruck, title: 'Envío express', desc: 'Recibí tu pedido en 24-48hs' },
    { icon: FiRefreshCw, title: 'Cambio sin costo', desc: '30 días para cambiar tu producto' },
    { icon: FiZap, title: 'Soporte técnico', desc: 'Asistencia post-venta por expertos' },
  ];

  const stats = [
    { label: 'Productos', value: '2.500+' },
    { label: 'Clientes satisfechos', value: '15K+' },
    { label: 'Años en el mercado', value: '8' },
    { label: 'Marcas top', value: '120+' },
  ];

  const { translatedText: heroTitle } = useAutoTranslate('El futuro de tu setup');
  const { translatedText: heroSub } = useAutoTranslate('Hardware de última generación. Asesoramiento experto. Precios competitivos.');
  const { translatedText: shopNow } = useAutoTranslate('Ver productos');
  const { translatedText: categoriesTitle } = useAutoTranslate('Categorías destacadas');
  const { translatedText: featuresTitle } = useAutoTranslate('¿Por qué NexusTech?');
  const { translatedText: statsTitle } = useAutoTranslate('NexusTech en números');
  const { translatedText: ctaTitle } = useAutoTranslate('¿Listo para armar tu equipo ideal?');
  const { translatedText: ctaSub } = useAutoTranslate('Nuestros expertos te guían paso a paso');
  const { translatedText: ctaBtn } = useAutoTranslate('Empezar ahora');
  const { translatedText: testimonialTitle } = useAutoTranslate('Lo que dicen nuestros clientes');

  const { translatedText: t1 } = useAutoTranslate('Armé mi PC gaming completa con el asesoramiento de NexusTech. Increíble atención y los mejores precios.');
  const { translatedText: t2 } = useAutoTranslate('El soporte post-venta es de otro nivel. Tuve un problema y lo resolvieron en menos de 24 horas.');
  const { translatedText: t3 } = useAutoTranslate('La mejor tienda de tecnología. Componentes originales, envío rápido y garantía real.');

  const testimonials = [
    { text: t1, author: 'Martín G.', role: 'Gamer' },
    { text: t2, author: 'Carolina S.', role: 'Diseñadora' },
    { text: t3, author: 'Facundo R.', role: 'Streamer' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section id="home" className="relative">
      {/* HERO */}
      <div className={`relative h-[85vh] w-full overflow-hidden ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
        <div className="absolute inset-0 grid-bg" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImageIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img src={heroImages[heroImageIdx]} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#050508]/60 via-[#050508]/80 to-[#050508]' : 'bg-gradient-to-b from-gray-50/60 via-gray-50/80 to-gray-50'}`} />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border ${isDark ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className={`text-xs font-mono-code tracking-wider uppercase ${isDark ? 'text-cyan-400/80' : 'text-cyan-600'}`}>
                Online & operativo
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.1 }}
            className={`text-4xl md:text-7xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {heroTitle.split(' ').map((word, i) => (
              <span key={i}>
                {i === heroTitle.split(' ').length - 1 ? <span className="gradient-text">{word}</span> : word}
                {' '}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
            className={`text-base md:text-lg max-w-2xl mb-10 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}
          >
            {heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.3 }}
            className="flex gap-4"
          >
            <button
              onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
              className="cyber-btn px-8 py-3.5 rounded flex items-center gap-2 text-sm"
            >
              {shopNow} <FiArrowRight size={16} />
            </button>
            <button
              onClick={() => setCurrentSection && setCurrentSection('que-hago')}
              className={`px-8 py-3.5 rounded text-xs uppercase tracking-[0.15em] border transition-all ${isDark ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white' : 'border-gray-300 text-gray-700 hover:border-gray-500'}`}
            >
              {t('about.ownThreadTitle')}
            </button>
          </motion.div>
        </div>

        {/* Bottom fade gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${isDark ? 'bg-gradient-to-t from-[#050508]' : 'bg-gradient-to-t from-gray-50'}`} />
      </div>

      {/* STATS BAR */}
      <div className={`w-full ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
        <div className={`max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6`}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`text-2xl md:text-4xl font-bold mb-1 gradient-text`}>{stat.value}</div>
              <div className={`text-xs uppercase tracking-[0.2em] font-mono-code ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className={`w-full py-20 ${isDark ? 'bg-[#080810]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{categoriesTitle}</motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group cursor-pointer rounded-xl overflow-hidden ${isDark ? 'cyber-card' : 'cyber-card-light'}`}
                onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#0a0a14] via-transparent' : 'bg-gradient-to-t from-white via-transparent'}`} />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
                      <cat.icon className="text-cyan-400" size={16} />
                    </div>
                    <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat.title}</h4>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'} font-mono-code`}>{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className={`w-full py-20 ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{featuresTitle}</motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border text-center ${isDark ? 'border-cyan-500/10 bg-cyan-500/[0.02]' : 'border-cyan-500/15 bg-white'}`}
              >
                <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
                  <feat.icon className="text-cyan-400" size={22} />
                </div>
                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feat.title}</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className={`w-full ${isDark ? 'bg-[#080810]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative rounded-2xl overflow-hidden p-12 md:p-16 text-center ${isDark ? 'bg-gradient-to-br from-cyan-500/10 via-[#0a0a14] to-blue-500/10 border border-cyan-500/20' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}
          >
            <div className="absolute inset-0 grid-bg-dense opacity-30" />
            <div className="relative z-10">
              <h3 className={`text-2xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {ctaTitle}
              </h3>
              <p className={`text-sm md:text-base mb-8 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                {ctaSub}
              </p>
              <button
                onClick={() => setCurrentSection && setCurrentSection('que-hago')}
                className="cyber-btn px-10 py-4 rounded-lg text-sm"
              >
                {ctaBtn} <FiArrowRight className="inline ml-2" size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className={`w-full py-20 ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
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
              <div className={`w-12 h-[1px] mx-auto mb-6 ${isDark ? 'bg-cyan-500/30' : 'bg-cyan-500/40'}`} />
              <p className={`text-base md:text-lg italic leading-relaxed mb-6 ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className={`w-8 h-[1px] mx-auto mb-4 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-500/30'}`} />
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {testimonials[currentTestimonial].author}
              </p>
              <p className={`text-xs font-mono-code ${isDark ? 'text-cyan-500/50' : 'text-cyan-600/50'}`}>
                {testimonials[currentTestimonial].role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'bg-cyan-400 w-8' : `${isDark ? 'bg-neutral-700' : 'bg-gray-300'} w-2`}`}
              />
            ))}
          </div>
        </div>
      </div>

      <WhatsAppContact />
    </section>
  );
};

export default Home;
