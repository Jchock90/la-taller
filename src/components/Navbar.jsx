import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { useState } from 'react';
import { NAV_ITEMS } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getConsent } from './CookieConsent';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Navbar = ({ setCurrentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const consent = getConsent();
  const spotifyAllowed = consent?.thirdParty !== false;
  const { translatedText: spotifyDisabledText } = useAutoTranslate('Spotify deshabilitado (cookies de terceros rechazadas)');

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
              whileHover={{ scale: 1.05, color: isDark ? '#c084fc' : 'white' }}
              className="text-black text-lg font-medium cursor-pointer"
            >
              {t(`nav.${item.id.replace(/-/g, '')}`)}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            onClick={() => spotifyAllowed && setSpotifyOpen((prev) => !prev)}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg transition-colors ${spotifyAllowed ? 'text-black hover:bg-black/10' : 'text-black/30 cursor-not-allowed'}`}
            aria-label="Toggle Spotify player"
            title={spotifyAllowed ? 'Spotify' : spotifyDisabledText}
          >
            <FaSpotify size={18} />
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-lg text-black hover:bg-black/10 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.button>
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-lg text-black hover:bg-black/10 transition-colors font-semibold text-sm"
            aria-label="Toggle language"
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

        <motion.div
          initial={false}
          animate={{
            opacity: spotifyOpen ? 1 : 0,
            y: spotifyOpen ? 0 : -8,
            pointerEvents: spotifyOpen ? 'auto' : 'none'
          }}
          transition={{ duration: 0.2 }}
          className={`absolute right-4 top-[calc(100%+32px)] z-[60] w-[320px] max-w-[90vw] rounded-xl shadow-xl border overflow-hidden ${
            isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
          }`}
          style={{ visibility: spotifyOpen ? 'visible' : 'hidden' }}
        >
          <iframe
            src="https://open.spotify.com/embed/playlist/41DWUFcZTx1GbNDIydf6AZ?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Mini Player"
          ></iframe>
        </motion.div>

      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`relative z-40 shadow-lg md:hidden ${
              isDark ? 'bg-black' : 'bg-white'
            }`}
          >
            <div className="flex flex-col p-4 space-y-4">
              {NAV_ITEMS.map((item) => (
                <motion.a
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ scale: 1.05, color: isDark ? '#c084fc' : '#000' }}
                  className={`text-md cursor-pointer py-2 px-4 ${
                    isDark ? 'text-gray-100' : 'text-black'
                  }`}
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