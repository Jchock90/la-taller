import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const CONSENT_KEY = 'cookie-consent';

export const getConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

export const hasFullConsent = () => {
  const consent = getConsent();
  return consent?.preferences && consent?.thirdParty;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();
  const { translatedText: cookieQuestion } = useAutoTranslate('¿Aceptás nuestras cookies?');
  const { translatedText: noThanks } = useAutoTranslate('No, gracias');
  const { translatedText: yesAccept } = useAutoTranslate('Sí, dale');

  useEffect(() => {
    const consent = getConsent();
    if (!consent) setVisible(true);
  }, []);

  const saveConsent = (preferences, thirdParty) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      preferences,
      thirdParty,
      date: new Date().toISOString(),
    }));
    setVisible(false);

    if (!preferences) {
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
      localStorage.removeItem('translation_cache');
    }
    // Recargar para aplicar los cambios
    window.location.reload();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className={`max-w-md mx-auto rounded-2xl shadow-2xl p-5 md:p-6 border ${
          isDark
            ? 'bg-gray-300 border-gray-400 text-black'
            : 'bg-purple-300 border-purple-400 text-black'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <p className="font-medium text-sm text-black">
              {cookieQuestion}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => saveConsent(false, false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium text-black transition-colors ${
                isDark
                  ? 'bg-gray-400/50 hover:bg-gray-400'
                  : 'bg-purple-400/50 hover:bg-purple-400'
              }`}
            >
              {noThanks}
            </button>
            <button
              onClick={() => saveConsent(true, true)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
            >
              {yesAccept}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
