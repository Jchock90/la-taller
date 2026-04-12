import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiZap } from 'react-icons/fi';
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
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isUserAuthenticated, user } = useUserAuth();

  const handleNavClick = (id) => {
    setCurrentSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ filter: 'blur(12px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full z-50 flex items-center justify-between py-2 px-4 md:px-8 border-b ${isDark ? 'bg-[#0a0a0f]/95 border-cyan-500/20' : 'bg-white/95 border-cyan-500/30'} backdrop-blur-xl`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className={`w-8 h-8 rounded flex items-center justify-center ${isDark ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-cyan-500/10 border border-cyan-500/40'}`}>
            <FiZap className="text-cyan-400" size={18} />
          </div>
          <span className={`text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
            NEXUS<span className="gradient-text">TECH</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-4 py-1.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 rounded ${
                currentSection === item.id
                  ? isDark ? 'text-cyan-400 bg-cyan-500/10' : 'text-cyan-600 bg-cyan-500/10'
                  : isDark ? 'text-neutral-400 hover:text-cyan-300 hover:bg-cyan-500/5' : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-500/5'
              }`}
            >
              {t(`nav.${item.id.replace(/-/g, '')}`)}
              {currentSection === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => isUserAuthenticated ? setShowUserDashboard(true) : setShowUserAuth(true)}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-neutral-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}
            aria-label="User account"
            title={isUserAuthenticated ? user?.nombre : 'Mi cuenta'}
          >
            {isUserAuthenticated ? (
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold uppercase ${isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-cyan-500/15 text-cyan-600 border border-cyan-500/30'}`} style={{ lineHeight: 0, paddingTop: '1px' }}>
                {user?.nombre?.charAt(0) || 'U'}
              </span>
            ) : (
              <FiUser size={18} />
            )}
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-neutral-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-lg font-mono-code font-bold text-xs ${isDark ? 'text-neutral-400 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}
            aria-label="Toggle language"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </motion.button>
          <button 
            className={`md:hidden p-2 ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`absolute left-0 right-0 z-40 shadow-2xl md:hidden border-b ${
              isDark ? 'bg-[#0a0a0f]/98 border-cyan-500/20' : 'bg-white/98 border-cyan-500/20'
            } backdrop-blur-xl`}
          >
            <div className="flex flex-col p-4 space-y-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-sm tracking-[0.15em] uppercase py-3 px-4 rounded transition-all ${
                    currentSection === item.id
                      ? isDark ? 'text-cyan-400 bg-cyan-500/10' : 'text-cyan-600 bg-cyan-500/10'
                      : isDark ? 'text-neutral-300 hover:text-cyan-400 hover:bg-cyan-500/5' : 'text-gray-700 hover:text-cyan-600 hover:bg-cyan-500/5'
                  }`}
                >
                  <span className="text-cyan-500/50 mr-2 font-mono-code text-xs">0{i + 1}</span>
                  {t(`nav.${item.id.replace(/-/g, '')}`)}
                </motion.button>
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