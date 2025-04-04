import { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import SpotifyPlayer from '../components/SpotifyPlayer';
import WhatsAppContact from '../components/WhatsAppContact';

const Home = () => {
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const mockImages = [
      'https://via.placeholder.com/1200x600?text=Look+1',
      'https://via.placeholder.com/1200x600?text=Look+2',
      'https://via.placeholder.com/1200x600?text=Look+3',
    ];
    setCarouselImages(mockImages);
  }, []);

  return (
    <div className="pt-16 min-h-screen">
      <div className="relative h-screen-80">
        <Carousel images={carouselImages} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <SpotifyPlayer url="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" />
          </div>
          <div className="order-1 md:order-2">
            <WhatsAppContact 
              phone="5491112345678" 
              message="Hola Jésica, vi tu página y me gustaría contactarte"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;