import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import { FiCpu, FiTool, FiMessageSquare, FiArrowRight, FiCheckCircle, FiMonitor, FiHardDrive, FiWifi } from 'react-icons/fi';

const Services = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const { translatedText: intro } = useAutoTranslate('En NexusTech no solo vendemos tecnología, la entendemos y la compartimos.');
  const { translatedText: para1 } = useAutoTranslate('Nuestro equipo de especialistas está preparado para asesorarte en cada paso: desde elegir los componentes ideales para tu presupuesto hasta el armado y configuración completa de tu equipo.');
  const { translatedText: para2 } = useAutoTranslate('Ya sea que busques armar tu primera PC gaming, actualizar tu estación de trabajo profesional o simplemente necesites un diagnóstico técnico, estamos para ayudarte.');
  
  const { translatedText: processTitle } = useAutoTranslate('¿Cómo funciona?');
  const { translatedText: faqTitle } = useAutoTranslate('Preguntas frecuentes');
  const { translatedText: brandsTitle } = useAutoTranslate('Marcas que trabajamos');

  const services = [
    {
      icon: FiCpu,
      title: 'Armado de PC a medida',
      desc: 'Configuramos tu equipo ideal según tus necesidades. Gaming, streaming, diseño, oficina — cada build se diseña y testea para máximo rendimiento.',
      features: ['Asesoramiento personalizado', 'Stress test 24h incluido', 'Cable management premium', 'Garantía del armado'],
      img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: FiTool,
      title: 'Soporte técnico',
      desc: 'Diagnóstico profesional, reparación de hardware y software, upgrades, mantenimiento preventivo y más. Atención rápida con garantía.',
      features: ['Diagnóstico sin cargo', 'Reparación en 48h', 'Repuestos originales', 'Garantía de 6 meses'],
      img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: FiMessageSquare,
      title: 'Asesoramiento',
      desc: 'Te ayudamos a elegir los mejores componentes y periféricos. Comparativas, benchmarks y recomendaciones basadas en tu uso real.',
      features: ['Consulta gratuita', 'Comparativas detalladas', 'Presupuestos sin compromiso', 'Seguimiento post-compra'],
      img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const process = [
    { step: '01', title: 'Consultá', desc: 'Contanos qué necesitás y tu presupuesto' },
    { step: '02', title: 'Diseñamos', desc: 'Armamos la configuración perfecta para vos' },
    { step: '03', title: 'Armamos', desc: 'Ensamblado profesional con stress test' },
    { step: '04', title: 'Entregamos', desc: 'Listo para usar con soporte continuo' },
  ];

  const faqs = [
    { q: '¿Hacen envíos a todo el país?', a: 'Sí, hacemos envíos a toda Argentina con seguimiento en tiempo real. Envío gratis en compras mayores a $500.000.' },
    { q: '¿Cuánto tarda el armado de una PC?', a: 'El armado estándar tarda 24-48hs hábiles. Incluye stress test y configuración de drivers.' },
    { q: '¿Qué garantía tienen los productos?', a: 'Todos nuestros productos tienen garantía oficial del fabricante más nuestra garantía extendida de servicio técnico.' },
    { q: '¿Puedo llevar mis componentes para el armado?', a: 'Sí, podés traer tus componentes y armamos/configuramos por un costo de servicio. Verificamos compatibilidad sin cargo.' },
  ];

  const brands = ['NVIDIA', 'AMD', 'Intel', 'ASUS', 'MSI', 'Corsair', 'Logitech', 'HyperX', 'Samsung', 'Seagate', 'Razer', 'SteelSeries'];

  return (
    <section id="que-hago" className={`py-20 pt-10 ${isDark ? 'bg-[#050508]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('services.title')}
          </h2>
          <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
            {intro}
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="max-w-6xl mx-auto space-y-12 mb-20">
          {services.map((svc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              <div className="md:w-1/2">
                <div className={`relative rounded-xl overflow-hidden ${isDark ? 'border border-cyan-500/10' : 'border border-cyan-500/15'}`}>
                  <img src={svc.img} alt={svc.title} className="w-full h-64 md:h-80 object-cover" />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#050508]/70 to-transparent' : 'bg-gradient-to-t from-gray-50/50 to-transparent'}`} />
                  <div className="absolute top-4 left-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#050508]/80 border border-cyan-500/30' : 'bg-white/80 border border-cyan-500/30'} backdrop-blur-sm`}>
                      <svc.icon className="text-cyan-400" size={20} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{svc.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{svc.desc}</p>
                <ul className="space-y-2">
                  {svc.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FiCheckCircle className="text-cyan-400 shrink-0" size={14} />
                      <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-12 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{processTitle}</motion.h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {process.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-3 gradient-text font-mono-code`}>{step.step}</div>
                <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-10 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{brandsTitle}</motion.h3>

          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                viewport={{ once: true }}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase border transition-all ${isDark ? 'border-cyan-500/10 text-neutral-500 bg-cyan-500/[0.02] hover:border-cyan-500/30 hover:text-cyan-400' : 'border-cyan-500/15 text-gray-500 bg-white hover:border-cyan-500/40 hover:text-cyan-600'}`}
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xs tracking-[0.3em] uppercase text-center mb-10 font-mono-code ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}
          >{faqTitle}</motion.h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={`p-5 rounded-xl border ${isDark ? 'border-cyan-500/10 bg-cyan-500/[0.02]' : 'border-cyan-500/15 bg-white'}`}
              >
                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{faq.q}</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;