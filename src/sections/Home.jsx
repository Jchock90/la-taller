import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import SpotifyPlayer from '../components/SpotifyPlayer';
import WhatsAppContact from '../components/WhatsAppContact';


const Home = () => {
  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg'
  ];

  return (
    <section id="home" className="relative">
      {/* Carrusel ocupa 70vh */}
      <div className="h-[70vh] w-full">
        <Carousel images={carouselImages} />
      </div>
      
      {/* Contenedor del reproductor Spotify */}
      <div className="w-full bg-white py-8">
        <div className="container mx-auto px-6">
          <SpotifyPlayer />
        </div>
      </div>
      <div>
          <WhatsAppContact />
      </div>
    </section>
  );
};

export default Home;