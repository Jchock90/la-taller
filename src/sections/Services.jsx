import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const SimpleCarousel = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 7, ease: 'linear' } }}
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => onImageClick(images[currentIndex])}
        />
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-5' : 'bg-white/50'}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Services = () => {
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const { translatedText: intro } = useAutoTranslate('Acompaño a las personas en un viaje hacia su propia creación, en un espacio seguro, sensible y creativo.');
  const { translatedText: para1 } = useAutoTranslate('Soy guía, docente e intérprete en el universo de la indumentaria. Enseño a hacer tu ropa desde cero: elegir la tela, imaginar el diseño, trazar el molde, cortar, coser, ajustar, estampar, bordar, revelar… hasta que la prenda toma forma, y con ella, la identidad de quien la viste.');
  const { translatedText: para2 } = useAutoTranslate('No solo comparto un saber técnico, comparto un oficio, un lenguaje sensible, una forma de pensar el cuerpo, el deseo y la vida cotidiana.');
  const { translatedText: para3 } = useAutoTranslate('Mi trabajo tiene raíces profundas en un linaje de mujeres que transmitían el hacer con las manos, en ronda, en confianza, en comunidad.');
  const { translatedText: para4 } = useAutoTranslate('He creado un espacio de aprendizaje sin estructuras rígidas, donde cualquiera puede llegar sin saber nada y salir con una prenda hecha por sus propias manos… y con una parte nueva de sí descubierta.');
  const { translatedText: para5 } = useAutoTranslate('No enseño a coser ropa: enseño a habitarla.');
  const { translatedText: conclusion } = useAutoTranslate('Ofrezco un servicio que es un refugio textil donde cada persona puede explorar a su ritmo, sin juicios ni exigencias. Donde la prenda que nace de tus manos también te enseña algo de vos.');
  
  const { translatedText: gallery1Title } = useAutoTranslate('La taller');
  const { translatedText: gallery2Title } = useAutoTranslate('Taller de bombachas');
  const { translatedText: gallery3Title } = useAutoTranslate('Taller de cianotipia');
  const { translatedText: gallery4Title } = useAutoTranslate('Taller de infancias');

const galleries = [
  {
    title: gallery1Title,
    images: [
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191478/1_r92hkz.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191481/2_zdjmle.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191487/4_jpqhrx.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191492/6_tzaeqp.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191495/8_d6fupl.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191495/7_fhnl2q.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191496/9_qjjpff.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749191497/3_z4vtv9.jpg"
    ]
  },
  {
    title: gallery2Title,
    images: [
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190204/1_n5pw9p.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190222/2_qvqrsy.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190224/3_uc6am0.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190215/4_sqoljp.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190222/5_dqpwhk.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190215/6_lvlboz.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190221/7_bunwjq.jpg"
    ]
  },
  {
    title: gallery3Title,
    images: [
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190922/3_cq9mgi.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190907/5_x8qsrk.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190908/8_wslmkq.webp",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190909/9_mvvzwm.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190911/7_inzcpk.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190911/10_jzfpea.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190912/11_jl5bxb.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190913/13_rtszlx.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190913/12_itn46i.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190918/2_ftfp9x.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190920/4_he3ey7.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190921/6_odwtek.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1749190895/1_fvngj7.jpg"
    ]
  },
  {
    title: gallery4Title,
    images: [
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679983/IMG_20250715_155506_pa6s9o.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679980/IMG_20250211_185913_a8yr0f.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679978/IMG-20240626-WA0054_f3b7ik.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679978/IMG-20240731-WA0015_wdrn1c.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679978/IMG-20240626-WA0052_fdso9k.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679978/IMG-20240626-WA0045_wm52zq.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679977/IMG-20240626-WA0035_hjjon8.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679977/IMG-20240112-WA0145_gh57h0.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679977/IMG_20250128_200643_qwfcr4.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679977/IMG_20240112_190032_yuty7n.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679977/IMG_20250211_195449_ivfgjz.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679976/IMG-20240112-WA0132_gfxsxa.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679975/IMG_20250122_163546_vswsm2.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679974/IMG_20240112_193139_socwvp.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679974/IMG_20240112_190748_x17qlb.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679973/IMG_20240112_190725_bn7ule.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679972/IMG_20250128_200534_mpk0ej.jpg",
      "https://res.cloudinary.com/dtnkj0wdx/image/upload/c_fill,w_800,q_auto,f_auto/v1753679967/IMG_20250102_181022_198_q0rj4z.webp"
    ]
  }
];

  const openGallery = (gallery, index) => {
    setSelectedGallery(gallery);
    setCurrentImageIndex(index || 0);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % selectedGallery.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      (prev - 1 + selectedGallery.images.length) % selectedGallery.images.length
    );
  };

  return (
    <section id="que-hago" className={`py-20 pt-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 55, damping: 15 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-2xl md:text-4xl font-bold ${isDark ? 'text-neutral-100' : 'text-black'} mb-8`}>{t('services.title')}</h2>
          
          <div className="max-w-5xl mx-auto text-left space-y-6 mb-12">
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-100' : 'text-black'}`}>
              <strong>{intro}</strong>
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              {para1}
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              {para2}
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              {para3}
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              {para4}
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              {para5}
            </p>
            
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-neutral-100' : 'text-black'}`}>
              <strong>{conclusion}</strong>
            </p>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
          {/* First gallery — full width hero */}
          <motion.div
            initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 70, damping: 14 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative h-72 md:h-[70vh] overflow-hidden cursor-pointer group win-inset"
            onClick={() => openGallery(galleries[0])}
          >
            <SimpleCarousel 
              images={galleries[0].images} 
              onImageClick={(image) => {
                const index = galleries[0].images.indexOf(image);
                openGallery(galleries[0], index);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
              <h3 className="text-xl md:text-3xl font-semibold text-white tracking-wide">
                {galleries[0].title}
              </h3>
            </div>
          </motion.div>

          {/* Remaining galleries — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {galleries.slice(1).map((gallery, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 70, damping: 14, delay: i * 0.12 }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative h-72 md:h-96 overflow-hidden cursor-pointer group win-inset"
                onClick={() => openGallery(gallery)}
              >
                <SimpleCarousel 
                  images={gallery.images} 
                  onImageClick={(image) => {
                    const index = gallery.images.indexOf(image);
                    openGallery(gallery, index);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-5 pointer-events-none">
                  <h3 className="text-base md:text-lg font-semibold text-white tracking-wide">
                    {gallery.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${isDark ? 'bg-black/95' : 'bg-black/90'} z-50 flex flex-col items-center justify-center p-4`}
              onClick={closeGallery}
            >
              <div 
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeGallery}
                  className={`absolute top-4 right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                    isDark ? 'hover:text-neutral-300' : 'hover:text-indigo-300'
                  }`}
                  aria-label="Cerrar galería"
                >
                  &times;
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className={`absolute left-2 md:left-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                    isDark ? 'hover:text-neutral-300' : 'hover:text-indigo-300'
                  }`}
                  aria-label="Imagen anterior"
                >
                  &#10094;
                </button>

                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={selectedGallery.images[currentImageIndex]}
                  alt={`Imagen ${currentImageIndex + 1} de ${selectedGallery.title}`}
                  className="w-full h-full object-contain"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className={`absolute right-2 md:right-4 text-white text-2xl md:text-4xl z-50 transition-colors p-2 ${
                    isDark ? 'hover:text-neutral-300' : 'hover:text-indigo-300'
                  }`}
                  aria-label="Siguiente imagen"
                >
                  &#10095;
                </button>

                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {currentImageIndex + 1} / {selectedGallery.images.length} - {selectedGallery.title}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Services;