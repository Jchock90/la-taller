import { motion } from 'framer-motion';
import { FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import { NAV_ITEMS, CONTACT_INFO } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Footer = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const { translatedText: description } = useAutoTranslate('Diseño de indumentaria artesanal por Jess');
  const { translatedText: navTitle } = useAutoTranslate('Navegación');
  const { translatedText: contactTitle } = useAutoTranslate('Contacto');
  const { translatedText: rightsText } = useAutoTranslate('Todos los derechos reservados.');

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/img/logo-white.png" 
              alt="La Taller Logo" 
              className="h-8 cursor-pointer"
              onClick={() => setCurrentSection('home')}
            />
            <p className={isDark ? 'text-gray-500' : 'text-purple-200'}>
              {description}
            </p>
            <div className="flex space-x-4">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl text-white transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-purple-300'
                }`}
              >
                <FiInstagram />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">{navTitle}</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.id}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    onClick={() => setCurrentSection(item.id)}
                    className={isDark ? 'text-gray-400 hover:text-white cursor-pointer flex items-center' : 'text-purple-200 hover:text-white cursor-pointer flex items-center'}
                  >
                    <span className="mr-2">•</span>
                    {t(`nav.${item.id.replace(/-/g, '')}`)}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">{contactTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <a href={`mailto:${CONTACT_INFO.email}`} className={`flex items-center transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-purple-100 hover:text-white'
                }`}>
                  <FiMail className={`mt-1 mr-3 text-xl ${isDark ? 'text-gray-500' : 'text-purple-300'}`} />
                  <span className="underline">{CONTACT_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-start">
                <FiPhone className={`mt-1 mr-3 ${isDark ? 'text-gray-500' : 'text-purple-300'}`} />
                <span>{CONTACT_INFO.phone}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`mt-12 pt-6 border-t text-center ${
            isDark ? 'border-gray-600 text-gray-600' : 'border-purple-300 text-purple-300'
          }`}
        >
          <p>© {new Date().getFullYear()} La Taller by Jesús Mansilla. {rightsText}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;