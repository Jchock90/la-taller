import { motion } from 'framer-motion';
import { FiInstagram, FiMail, FiPhone, FiArrowUpRight } from 'react-icons/fi';
import { NAV_ITEMS, CONTACT_INFO } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Footer = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { translatedText: tagline } = useAutoTranslate('Diseño de indumentaria artesanal');
  const { translatedText: rightsText } = useAutoTranslate('Todos los derechos reservados.');
  const { translatedText: navLabel } = useAutoTranslate('Secciones');
  const { translatedText: contactLabel } = useAutoTranslate('Contacto');
  const { translatedText: followLabel } = useAutoTranslate('Seguinos');

  const bg = isDark ? 'bg-neutral-900' : 'bg-black';
  const border = isDark ? 'border-neutral-800' : 'border-neutral-800';
  const muted = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const label = isDark ? 'text-neutral-400' : 'text-neutral-400';
  const hover = isDark ? 'hover:text-white' : 'hover:text-white';

  return (
    <footer className={`${bg} text-white`}>
      {/* Top bar — brand + tagline */}
      <div className={`border-b ${border} px-6 md:px-12 py-8`}>
        <img
          src="/img/logo-white.png"
          alt="La Taller"
          className="h-7 cursor-pointer mb-3 opacity-90"
          onClick={() => setCurrentSection('home')}
        />
        <p className={`text-xs uppercase tracking-[0.2em] ${muted}`}>{tagline}</p>
      </div>

      {/* Main grid */}
      <div className={`border-b ${border} px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10`}>
        {/* Nav */}
        <div>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${muted} mb-4`}>{navLabel}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`text-sm ${label} ${hover} transition-colors`}
              >
                {t(`nav.${item.id.replace(/-/g, '')}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${muted} mb-4`}>{contactLabel}</p>
          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className={`text-sm ${label} ${hover} transition-colors break-all flex items-start gap-2 py-1`}
              >
                <FiMail size={16} className="mt-0.5 shrink-0" />
                {CONTACT_INFO.email}
              </a>
            </li>
            <li className={`text-sm ${label} flex items-center gap-2 py-1`}>
              <FiPhone size={16} className="shrink-0" />
              {CONTACT_INFO.phone}
            </li>
          </ul>
        </div>

        {/* Instagram */}
        <div>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${muted} mb-4`}>{followLabel}</p>
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-neutral-700 px-4 py-2 ${label} ${hover} hover:border-neutral-500 transition-colors`}
          >
            <FiInstagram size={15} />
            Instagram
            <FiArrowUpRight size={15} />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`px-6 md:px-12 py-5 flex flex-col items-center gap-1 win-status-bar`}>
        <p className={`text-[11px] ${muted}`}>© {new Date().getFullYear()} La Taller by Jesús Mansilla.</p>
        <p className={`text-[11px] ${muted}`}>{rightsText}</p>
      </div>
    </footer>
  );
};

export default Footer;