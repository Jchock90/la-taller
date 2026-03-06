import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import SpotifyPlayer from '../components/SpotifyPlayer';
import WhatsAppContact from '../components/WhatsAppContact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Home = ({ setCurrentSection }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1770750350/IMG_20250401_125636_065_fnnsll.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1770751215/DSC_4000_kbul1k.jpg'
  ];

  return (
    <section id="home" className="relative">
      <div className="h-[70vh] w-full px-8 sm:px-16 lg:px-24 xl:px-32 pt-10">
        <div className="h-full rounded-lg overflow-hidden shadow-lg max-w-6xl mx-auto">
          <Carousel images={carouselImages} />
        </div>
      </div>

      <div className={`w-full ${isDark ? 'bg-gray-950' : 'bg-white'} py-8`}>
        <div className="px-8 sm:px-16 lg:px-24 xl:px-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  {t('home.buttonText')}
                </button>
              </div>
            </motion.div>

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
