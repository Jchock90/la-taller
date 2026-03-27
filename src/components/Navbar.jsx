import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { useState } from 'react';
import { NAV_ITEMS } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { getConsent } from './CookieConsent';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import UserAuth from './UserAuth';
import UserDashboard from './UserDashboard';

const Navbar = ({ currentSection, setCurrentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isUserAuthenticated, user } = useUserAuth();
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
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full z-50 flex items-center justify-between py-2 px-4 shadow-md ${isDark ? 'bg-neutral-900' : 'bg-purple-300'}`}
      >
        <div className="flex items-center">
          <motion.img 
            src={isDark ? '/img/logo-white.png' : '/img/logo.png'} 
            alt="La Taller Logo" 
            className="h-8 cursor-pointer"
            onClick={() => handleNavClick('home')}
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`group relative text-sm tracking-wide uppercase font-medium cursor-pointer pb-0.5 ${
                isDark ? 'text-gray-200' : 'text-black'
              }`}
            >
              {t(`nav.${item.id.replace(/-/g, '')}`)}
              <span className={`absolute left-0 bottom-0 h-[1.5px] transition-all duration-300 ${
                isDark ? 'bg-gray-200' : 'bg-black'
              } ${
                currentSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            onClick={() => isUserAuthenticated ? setShowUserDashboard(true) : setShowUserAuth(true)}
            whileHover={{ scale: 1.1 }}
            className={isUserAuthenticated
              ? `w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-200 text-neutral-900' : 'bg-black text-purple-300'}`
              : `p-2 rounded-lg ${isDark ? 'text-gray-200' : 'text-black'}`
            }
            aria-label="User account"
            title={isUserAuthenticated ? user?.nombre : 'Mi cuenta'}
          >
            {isUserAuthenticated ? (
              <span className="text-sm font-bold uppercase leading-none">
                {user?.nombre?.charAt(0) || 'U'}
              </span>
            ) : (
              <FiUser size={20} />
            )}
          </motion.button>
          <motion.button
            onClick={() => spotifyAllowed && setSpotifyOpen((prev) => !prev)}
            whileHover={{ scale: 1.1 }}
            className={`p-3 md:p-2 rounded-lg ${spotifyAllowed ? (isDark ? 'text-gray-200' : 'text-black') : (isDark ? 'text-gray-600 cursor-not-allowed' : 'text-black/30 cursor-not-allowed')}`}
            aria-label="Toggle Spotify player"
            title={spotifyAllowed ? 'Spotify' : spotifyDisabledText}
          >
            <FaSpotify size={20} />
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            className={`p-3 md:p-2 rounded-lg ${isDark ? 'text-gray-200' : 'text-black'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
          </motion.button>
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            className={`p-3 md:p-2 rounded-lg font-bold text-base ${isDark ? 'text-gray-200' : 'text-black'}`}
            aria-label="Toggle language"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </motion.button>
          <button 
            className={`md:hidden p-3 ${isDark ? 'text-gray-200' : 'text-black'}`}
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
            initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 100, damping: 16 }}
            className={`absolute left-0 right-0 z-40 shadow-lg md:hidden ${
              isDark ? 'bg-black' : 'bg-white'
            }`}
          >
            <div className="flex flex-col p-4 space-y-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative text-base tracking-wide uppercase cursor-pointer py-3 px-4 inline-block w-fit ${
                    isDark ? 'text-gray-100' : 'text-black'
                  }`}
                >
                  {t(`nav.${item.id.replace(/-/g, '')}`)}
                  <span className={`absolute left-4 bottom-1 h-[1.5px] transition-all duration-300 ${
                    isDark ? 'bg-gray-100' : 'bg-black'
                  } ${
                    currentSection === item.id ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]'
                  }`} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showUserAuth && (
        <UserAuth
          onClose={() => setShowUserAuth(false)}
          onSuccess={() => setShowUserAuth(false)}
        />
      )}

      {showUserDashboard && (
        <UserDashboard
          onClose={() => setShowUserDashboard(false)}
        />
      )}
    </>
  );
};

export default Navbar;