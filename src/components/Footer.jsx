import { motion } from 'framer-motion';
import { FiInstagram, FiMail, FiPhone, FiArrowUpRight, FiZap, FiGithub, FiTwitter } from 'react-icons/fi';
import { NAV_ITEMS, CONTACT_INFO } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Footer = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { translatedText: tagline } = useAutoTranslate('Hardware · Software · Gaming · Pro');
  const { translatedText: rightsText } = useAutoTranslate('Todos los derechos reservados.');
  const { translatedText: navLabel } = useAutoTranslate('Navegación');
  const { translatedText: contactLabel } = useAutoTranslate('Contacto');
  const { translatedText: followLabel } = useAutoTranslate('Redes');
  const { translatedText: newsletterLabel } = useAutoTranslate('Suscribite para recibir ofertas exclusivas');

  return (
    <footer className={`${isDark ? 'bg-[#050508]' : 'bg-gray-950'} text-white relative overflow-hidden`}>
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      <div className="relative z-10">
        <div className={`border-b ${isDark ? 'border-cyan-500/10' : 'border-cyan-500/15'} px-6 md:px-12 py-8`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30">
              <FiZap className="text-cyan-400" size={14} />
            </div>
            <span className="text-base font-bold tracking-wider cursor-pointer" onClick={() => setCurrentSection('home')}>
              NEXUS<span className="gradient-text">TECH</span>
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-mono-code">{tagline}</p>
        </div>

        <div className={`border-b ${isDark ? 'border-cyan-500/10' : 'border-cyan-500/15'} px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10`}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-500/60 mb-4 font-mono-code">{navLabel}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
                >
                  {t(`nav.${item.id.replace(/-/g, '')}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-500/60 mb-4 font-mono-code">{contactLabel}</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors break-all flex items-start gap-2 py-1"
                >
                  <FiMail size={16} className="mt-0.5 shrink-0 text-cyan-500/40" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="text-sm text-neutral-400 flex items-center gap-2 py-1">
                <FiPhone size={16} className="shrink-0 text-cyan-500/40" />
                {CONTACT_INFO.phone}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-500/60 mb-4 font-mono-code">{followLabel}</p>
            <div className="flex gap-3">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded flex items-center justify-center border border-cyan-500/20 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FiInstagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded flex items-center justify-center border border-cyan-500/20 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded flex items-center justify-center border border-cyan-500/20 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FiGithub size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-neutral-600 font-mono-code">© {new Date().getFullYear()} NexusTech Demo. {rightsText}</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[10px] text-neutral-600 font-mono-code uppercase tracking-wider">Sistema operativo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;