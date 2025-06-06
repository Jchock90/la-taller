import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Componente Carousel modificado sin texto central
const SimpleCarousel = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useState(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            x: index === currentIndex ? 0 : (direction === 'right' ? -100 : 100)
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => onImageClick(image)}
        />
      ))}

      {/* Indicadores de posición (puntos) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
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

  const galleries = [
    {
      title: "La taller",
      images: [
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191478/1_r92hkz.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191481/2_zdjmle.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191487/4_jpqhrx.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191492/6_tzaeqp.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191495/8_d6fupl.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191495/7_fhnl2q.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191496/9_qjjpff.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749191497/3_z4vtv9.jpg"
      ]
    },
    {
      title: "Taller de bombachas",
      images: [
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190204/1_n5pw9p.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190222/2_qvqrsy.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190224/3_uc6am0.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190215/4_sqoljp.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190222/5_dqpwhk.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190215/6_lvlboz.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190221/7_bunwjq.jpg"
      ]
    },
    {
      title: "Taller de cianotipia",
      images: [
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190922/3_cq9mgi.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190907/5_x8qsrk.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190908/8_wslmkq.webp",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190909/9_mvvzwm.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190911/7_inzcpk.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190911/10_jzfpea.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190912/11_jl5bxb.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190913/13_rtszlx.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190913/12_itn46i.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190918/2_ftfp9x.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190920/4_he3ey7.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190921/6_odwtek.jpg",
        "https://res.cloudinary.com/dtnkj0wdx/image/upload/v1749190895/1_fvngj7.jpg"
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
    <section id="que-hago" className="py-20 pt-30 bg-indigo-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Qué hago</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Servicios especializados que ofrezco para llevar tus ideas de moda a la realidad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {galleries.map((gallery, galleryIndex) => (
            <motion.div
              key={galleryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: galleryIndex * 0.2, duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-6 text-center">
                {gallery.title}
              </h3>
              
              <div 
                className="h-64 rounded-lg overflow-hidden shadow-sm cursor-pointer"
                onClick={() => openGallery(gallery)}
              >
                <SimpleCarousel 
                  images={gallery.images} 
                  onImageClick={(image) => {
                    const index = gallery.images.indexOf(image);
                    openGallery(gallery, index);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de pantalla completa */}
        <AnimatePresence>
          {selectedGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
              onClick={closeGallery}
            >
              <div 
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeGallery}
                  className="absolute top-4 right-4 text-white text-4xl z-50 hover:text-indigo-300 transition-colors"
                  aria-label="Cerrar galería"
                >
                  &times;
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 text-white text-4xl z-50 hover:text-indigo-300 transition-colors"
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
                  className="absolute right-4 text-white text-4xl z-50 hover:text-indigo-300 transition-colors"
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