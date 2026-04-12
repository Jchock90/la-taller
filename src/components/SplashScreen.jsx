import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsent } from './CookieConsent';
import { FiZap } from 'react-icons/fi';

const CONSENT_KEY = 'cookie-consent';

export default function SplashScreen({ onReady }) {
  const [visible, setVisible] = useState(true);
  const [consent, setConsent] = useState(() => getConsent());
  const [showCookieChoice, setShowCookieChoice] = useState(!consent);
  const [exiting, setExiting] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (consent && !showCookieChoice) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 100);

      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          onReady();
        }, 800);
      }, 1800);
      return () => { clearTimeout(timer); clearInterval(interval); };
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg" />
          
          {/* Radial glow */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 60%)',
          }} />

          {/* Scan lines */}
          <div className="absolute inset-0 scan-lines" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 neon-border">
                <FiZap className="text-cyan-400" size={24} />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-wider text-white">
                  NEXUS<span className="gradient-text">TECH</span>
                </span>
                <div className="text-[10px] tracking-[0.3em] text-cyan-500/50 uppercase font-mono-code">
                  Loading system...
                </div>
              </div>
            </motion.div>

            {showCookieChoice ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col items-center gap-5 px-6"
              >
                <div className="border border-cyan-500/20 rounded-lg p-4 bg-cyan-500/5 backdrop-blur-sm max-w-xs">
                  <p className="text-neutral-400 text-xs text-center font-mono-code">
                    <span className="text-cyan-400">{'>'}</span> Usamos cookies para optimizar tu experiencia
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConsent(false, false)}
                    className="px-6 py-2.5 text-xs font-medium tracking-wider uppercase text-neutral-400 border border-neutral-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all rounded"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleConsent(true, true)}
                    className="px-6 py-2.5 text-xs font-medium tracking-wider uppercase text-[#050508] bg-cyan-400 hover:bg-cyan-300 transition-all rounded"
                  >
                    Aceptar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 w-48"
              >
                {/* Progress bar */}
                <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                    style={{ width: `${Math.min(loadProgress, 100)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-[10px] text-cyan-500/50 font-mono-code tracking-wider">
                  {Math.min(Math.round(loadProgress), 100)}%
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
