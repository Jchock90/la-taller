import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../services/translationService';

export const useAutoTranslate = (text, sourceLang = 'es') => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (language === sourceLang) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translateText(text, language, sourceLang);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, language, sourceLang]);

  return { translatedText, isLoading };
};
