const CACHE_KEY = 'translation_cache';
const API_URL = 'https://api.mymemory.translated.net/get';

const getCache = () => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
};

const setCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving translation cache:', error);
  }
};

const generateCacheKey = (text, sourceLang, targetLang) => {
  return `${sourceLang}-${targetLang}-${text}`;
};

export const translateText = async (text, targetLang = 'en', sourceLang = 'es') => {
  if (!text || text.trim() === '') return text;
  if (sourceLang === targetLang) return text;

  const cacheKey = generateCacheKey(text, sourceLang, targetLang);
  const cache = getCache();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translation = data.responseData.translatedText;
      cache[cacheKey] = translation;
      setCache(cache);
      return translation;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const clearTranslationCache = () => {
  localStorage.removeItem(CACHE_KEY);
};
