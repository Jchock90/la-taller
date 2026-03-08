import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const getTranslationValue = (lang, key) => {
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value;
  };

  const t = (key) => {
    const selectedValue = getTranslationValue(language, key);
    if (selectedValue !== undefined) {
      return selectedValue;
    }

    const fallbackValue = getTranslationValue('es', key);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }

    return key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
