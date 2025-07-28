import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import SpotifyPlayer from '../components/SpotifyPlayer';
import WhatsAppContact from '../components/WhatsAppContact';

const Home = ({ setCurrentSection }) => {
  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg'
  ];

  return (
    <section id="home" className="relative">
      {/* Carrusel con márgenes, compensando altura del navbar fijo */}
      <div className="h-[70vh] w-full px-8 sm:px-16 lg:px-24 xl:px-32 pt-20">
        <div className="h-full rounded-lg overflow-hidden shadow-lg max-w-6xl mx-auto">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {/* Contenedor de la imagen y reproductor Spotify */}
      <div className="w-full bg-white py-8">
        <div className="px-8 sm:px-16 lg:px-24 xl:px-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen con texto y botón */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dtnkj0wdx/image/upload/v1753672721/T2_jew1by.jpg"
                  alt="Productos disponibles"
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setCurrentSection && setCurrentSection('que-vendo')}
                  className="bg-black hover:bg-black-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Conocé más
                </button>
              </div>
            </motion.div>

            {/* Reproductor Spotify */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center"
            >
              <SpotifyPlayer />
            </motion.div>
          </div>
        </div>
      </div>

      <div>
        <WhatsAppContact />
      </div>
    </section>
  );
};

export default Home;
