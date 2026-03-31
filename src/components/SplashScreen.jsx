import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsent } from './CookieConsent';

const CONSENT_KEY = 'cookie-consent';

export default function SplashScreen({ onReady }) {
  const [visible, setVisible] = useState(true);
  const [consent, setConsent] = useState(() => getConsent());
  const [showCookieChoice, setShowCookieChoice] = useState(!consent);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (consent && !showCookieChoice) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          onReady();
        }, 800);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [consent, showCookieChoice, onReady]);

  const handleConsent = (preferences, thirdParty) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      preferences,
      thirdParty,
      date: new Date().toISOString(),
    }));
    setConsent({ preferences, thirdParty });
    setShowCookieChoice(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          <div className="absolute inset-0 win-scanlines" style={{
            background: 'radial-gradient(ellipse at center, rgba(20,0,40,0.8) 0%, rgba(0,0,0,0.95) 70%)',
          }} />

          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
          }} />

          <div className="absolute inset-0 pointer-events-none opacity-30" style={{
            boxShadow: 'inset 0 0 150px rgba(100,0,180,0.3), inset 0 0 80px rgba(0,0,0,0.5)',
          }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.img
              src="/img/logo-white.png"
              alt="La Taller"
              className="h-16 md:h-20 mb-8"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {showCookieChoice ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col items-center gap-4 px-6"
              >
                <p className="text-neutral-400 text-xs text-center max-w-xs">
                  Usamos cookies para mejorar tu experiencia 🍪
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConsent(false, false)}
                    className="px-5 py-2 text-xs font-medium text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleConsent(true, true)}
                    className="px-5 py-2 text-xs font-medium text-black bg-neutral-200 hover:bg-white transition-colors"
                  >
                    Aceptar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1.5"
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-neutral-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
