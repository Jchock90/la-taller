import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FiTarget, FiAward, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const About = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { translatedText: missionTitle } = useAutoTranslate('Nuestra Misión');
  const { translatedText: missionText } = useAutoTranslate('Democratizar el acceso a tecnología de calidad, ofreciendo asesoramiento experto y los mejores productos a precios competitivos.');
  const { translatedText: valuesTitle } = useAutoTranslate('Nuestros Valores');
  const { translatedText: timelineTitle } = useAutoTranslate('Nuestra Historia');

  const values = [
    { icon: FiTarget, title: 'Innovación', desc: 'Siempre a la vanguardia de las últimas tecnologías y tendencias del mercado.' },
    { icon: FiAward, title: 'Calidad', desc: 'Solo trabajamos con marcas certificadas y productos que pasan nuestro control de calidad.' },
    { icon: FiUsers, title: 'Comunidad', desc: 'Construimos una comunidad de entusiastas que comparten la pasión por la tecnología.' },
    { icon: FiTrendingUp, title: 'Crecimiento', desc: 'Ayudamos a nuestros clientes a potenciar su productividad y experiencia digital.' },
  ];

  const timeline = [
    { year: '2018', event: 'Fundación de NexusTech como tienda online especializada' },
    { year: '2020', event: 'Apertura del primer showroom y centro de servicio técnico' },
    { year: '2022', event: 'Alcanzamos 10.000 clientes y alianzas con +80 marcas' },
    { year: '2024', event: 'Lanzamiento del programa de armado de PC personalizado' },
    { year: '2026', event: 'Expansión nacional con envíos en 24hs a todo el país' },
  ];

  return (
    <section id="quien-soy" className={`pt-10 pb-16 ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
      {/* Hero heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        viewport={{ once: true }}
        className="text-center px-6 mb-16"
      >
        <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('about.originTitle')}
        </h2>
        <p className={`text-xs uppercase tracking-[0.3em] font-mono-code ${isDark ? 'text-cyan-400/50' : 'text-cyan-600/50'}`}>
          {t('about.familyQuote')}
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        {/* About intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <div className={`relative rounded-xl overflow-hidden ${isDark ? 'border border-cyan-500/10' : 'border border-cyan-500/15'}`}>
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
                  alt="NexusTech Setup"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#050508]/60 to-transparent' : 'bg-gradient-to-t from-gray-50/40 to-transparent'}`} />
              </div>
            </div>

            <div className="md:w-1/2 space-y-4">
              <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                {t('about.originText1')}
              </p>
              <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                {t('about.originText2')}
              </p>
              <blockquote className={`border-l-2 pl-4 py-2 italic ${isDark ? 'border-cyan-500/30 text-cyan-400/70' : 'border-cyan-500/40 text-cyan-700'}`}>
                {t('about.craftQuote')}
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative rounded-2xl p-10 md:p-14 mb-20 text-center overflow-hidden ${isDark ? 'bg-gradient-to-br from-cyan-500/5 via-[#0a0a14] to-blue-500/5 border border-cyan-500/15' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}
        >
          <div className="absolute inset-0 grid-bg-dense opacity-20" />
          <div className="relative z-10">
            <div className={`w-14 h-14 rounded-xl mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
              <FiTarget className="text-cyan-400" size={26} />
            </div>
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{missionTitle}</h3>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
              {missionText}
            </p>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className={`text-2xl md:text-3xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('about.ownThreadTitle')}
          </h3>
          <div className="flex flex-col md:flex-row-reverse gap-10 items-center mt-8">
            <div className="md:w-1/2">
              <div className={`relative rounded-xl overflow-hidden ${isDark ? 'border border-cyan-500/10' : 'border border-cyan-500/15'}`}>
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"
                  alt="NexusTech Lab"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#050508]/60 to-transparent' : 'bg-gradient-to-t from-gray-50/40 to-transparent'}`} />
              </div>
            </div>

            <div className="md:w-1/2 space-y-4">
              <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                {t('about.threadText1')}
              </p>
              <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                {t('about.threadText2')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{valuesTitle}</motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border text-center ${isDark ? 'border-cyan-500/10 bg-cyan-500/[0.02]' : 'border-cyan-500/15 bg-white'}`}
              >
                <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
                  <val.icon className="text-cyan-400" size={22} />
                </div>
                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{val.title}</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{timelineTitle}</motion.h3>

          <div className="max-w-2xl mx-auto space-y-0">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${idx === timeline.length - 1 ? 'bg-cyan-400 pulse-dot' : isDark ? 'bg-cyan-500/30 border border-cyan-500/40' : 'bg-cyan-500/40 border border-cyan-500/50'}`} />
                  {idx < timeline.length - 1 && <div className={`w-[1px] h-16 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/20'}`} />}
                </div>
                <div className="pb-8">
                  <span className={`text-xs font-mono-code font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{item.year}</span>
                  <p className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <blockquote className={`text-lg md:text-xl italic ${isDark ? 'text-neutral-300' : 'text-gray-800'}`}>
            {t('about.closingQuote')}
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default About;