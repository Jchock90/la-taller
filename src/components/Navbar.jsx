import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';
import { NAV_ITEMS } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ setCurrentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const handleNavClick = (id) => {
    setCurrentSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full z-50 flex items-center justify-between p-4 shadow-md ${isDark ? 'bg-gray-300' : 'bg-purple-300'}`}
      >
        <div className="flex items-center">
          <img 
            src="/img/logo.png" 
            alt="La Taller Logo" 
            className="h-8 cursor-pointer"
            onClick={() => handleNavClick('home')}
          />
        </div>

        <div className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <motion.a
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileHover={{ scale: 1.05, color: 'white' }}
              className="text-black text-lg font-medium cursor-pointer"
            >
              {t(`nav.${item.id.replace(/-/g, '')}`)}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg text-black transition-colors ${
              isDark ? 'bg-gray-300 hover:bg-gray-400' : 'bg-purple-200 hover:bg-purple-400'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.button>
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg text-black transition-colors font-semibold text-sm ${
              isDark ? 'bg-gray-300 hover:bg-gray-400' : 'bg-purple-200 hover:bg-purple-400'
            }`}
          >
            {language === 'es' ? 'EN' : 'ES'}
          </motion.button>
          <button 
            className="md:hidden text-black p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-40 bg-white shadow-lg md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {NAV_ITEMS.map((item) => (
                <motion.a
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ scale: 1.05, color: 'black' }}
                  className="text-black text-md cursor-pointer py-2 px-4"
                >
                  {t(`nav.${item.id.replace(/-/g, '')}`)}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;