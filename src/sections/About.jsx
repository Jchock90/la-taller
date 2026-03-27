import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const galleries = {
  origen: [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749188051/IMG_20250401_134336_023_rnc613.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749187835/IMG_20250401_134347_295_ptpwni.jpg'
  ],
  hiloPropio: [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749188256/IMG_20250401_130716_872_keefme.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749188232/IMG_20250401_124837_874_gdg45d.jpg'
  ]
};


  const openImage = (galleryKey, index = 0) => {
    setSelectedImage(galleryKey);
    setCurrentImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % galleries[selectedImage].length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      (prev - 1 + galleries[selectedImage].length) % galleries[selectedImage].length
    );
  };

  return (
    <section id="quien-soy" className={`pt-10 pb-16 px-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: 'blur(15px)', scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        viewport={{ once: true }}
        className={`text-2xl md:text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-black'} mb-8 text-center font-italic`}
      >
        {t('about.originTitle')}
      </motion.h2>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20"
        >
          <h3 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-black'} mb-6 text-center pb-2`}>
            {t('about.familyQuote')}
          </h3>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <motion.img
                src={galleries.origen[0]}
                alt="Historia familiar"
                className="w-full rounded-lg shadow-lg object-cover h-80 md:h-96 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => openImage('origen', 0)}
              />
            </div>

            <div className={`md:w-1/2 space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-base md:text-lg leading-relaxed">
                {t('about.originText1')}
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                {t('about.originText2')}
              </p>

              <blockquote className={`italic border-l-4 ${isDark ? 'border-gray-500 text-gray-300' : 'border-black text-black'} pl-4 py-2`}>
                {t('about.craftQuote')}
              </blockquote>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <h3 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-black'} mb-12 text-center font-italic`}>
            {t('about.ownThreadTitle')}
          </h3>

          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <motion.img
                src={galleries.hiloPropio[0]}
                alt="Proceso creativo"
                className="w-full rounded-lg shadow-lg object-cover h-80 md:h-96 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => openImage('hiloPropio', 0)}
              />
            </div>

            <div className={`md:w-1/2 space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-base md:text-lg leading-relaxed">
                {t('about.threadText1')}
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                {t('about.threadText2')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mt-12"
        >
          <blockquote className={`text-xl italic ${isDark ? 'text-gray-300' : 'text-black'}`}>
            {t('about.closingQuote')}
          </blockquote>
        </motion.div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${isDark ? 'bg-black/95' : 'bg-black/90'} z-50 flex flex-col items-center justify-center p-4`}
              onClick={closeImage}
            >
              <div 
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeImage}
                  className={`absolute top-4 right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                    isDark ? 'hover:text-gray-300' : 'hover:text-purple-300'
                  }`}
                  aria-label="Cerrar imagen"
                >
                  &times;
                </button>

                {galleries[selectedImage].length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className={`absolute left-2 md:left-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                        isDark ? 'hover:text-gray-300' : 'hover:text-purple-300'
                      }`}
                      aria-label="Imagen anterior"
                    >
                      &#10094;
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className={`absolute right-2 md:right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                        isDark ? 'hover:text-gray-300' : 'hover:text-purple-300'
                      }`}
                      aria-label="Siguiente imagen"
                    >
                      &#10095;
                    </button>
                  </>
                )}

                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={galleries[selectedImage][currentImageIndex]}
                  alt="Imagen ampliada"
                  className="w-full h-full object-contain"
                />

                {galleries[selectedImage].length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    {currentImageIndex + 1} / {galleries[selectedImage].length}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default About;