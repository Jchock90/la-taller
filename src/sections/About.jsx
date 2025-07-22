import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const About = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Galerías para cada sección
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
    <section id="quien-soy" className="pt-30 pb-16 px-6 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-purple-900 mb-8 text-center font-italic"
      >
        El origen
      </motion.h2>

      <div className="max-w-5xl mx-auto">
        {/* Sección El Origen */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-semibold text-purple-800 mb-6 text-center border-b border-purple-200 pb-2">
            "La modistería es una extensión de mi cuerpo-memoria, que crece..."
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

            <div className="md:w-1/2 space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Vengo de un linaje de mujeres que hilvanaban saberes en círculo, en las tardes de Entre Ríos, entre mate, telas y bordados. Sentadas en círculo, se transmitían los saberes como si fueran plegarias: bordar, coser, tomar medidas, cortar a mano alzada, leer un cuerpo para transformarlo en molde.
              </p>

              <p className="text-lg leading-relaxed">
                Mi madre aprendió de sus tías y su abuela, con ese tesón de quien sabe que el conocimiento se conquista. Se profesionalizó en el Instituto Moderno Universal "La Victoria", viajando mensualmente a rendir exámenes con su maniquí a cuestas hasta graduarse en 1977.
              </p>

              <blockquote className="italic border-l-4 border-purple-500 pl-4 py-2 text-purple-700">
                "El oficio no muere con quien lo lleva, se transforma, se cuela en las manos de quien sigue"
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Sección El Hilo Propio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-purple-900 mb-12 text-center font-italic">
            El Hilo Propio
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

            <div className="md:w-1/2 space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Crecí entre retazos y pruebas de calce, dibujando mundos con tizas en el reverso de las mesas del taller. El taller de mamá era mi casa, mi patio de juegos, mi primera escuela. Mis muñecas vestían trajes hechos por mis manos pequeñas, con la misma admiración por el oficio que hasta hoy me acompaña.
              </p>

              <p className="text-lg leading-relaxed">
                En mi adolescencia descubrí que vestirme era identificarme. No necesitaba comprar, necesitaba inventar. Empecé a desarmar, a reconstruir, a probar. Cualquier hilo servía, el que quedaba en la máquina, sin importar el color.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cierre */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mt-12"
        >
          <blockquote className="text-xl italic text-purple-700">
            "Llegó la hora de abrir el círculo, de hacer lugar para quien quiera entrar. Porque el oficio no es solo un oficio, es una manera de habitar el mundo."
          </blockquote>
        </motion.div>

        {/* Modal de imagen ampliada */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
              onClick={closeImage}
            >
              <div 
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeImage}
                  className="absolute top-4 right-4 text-white text-4xl z-50 hover:text-purple-300 transition-colors"
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
                      className="absolute left-4 text-white text-4xl z-50 hover:text-purple-300 transition-colors"
                      aria-label="Imagen anterior"
                    >
                      &#10094;
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 text-white text-4xl z-50 hover:text-purple-300 transition-colors"
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