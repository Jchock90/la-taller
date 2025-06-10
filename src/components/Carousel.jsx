import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
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

  useEffect(() => {
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
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}

      {/* Indicadores de posición (puntos) mejorados */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
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

export default Carousel;