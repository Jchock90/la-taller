import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Carousel = ({ images, overlayText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const textRef = useRef(overlayText);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Typewriter effect
  useEffect(() => {
    if (!overlayText) return;
    textRef.current = overlayText;
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (textRef.current !== overlayText) { clearInterval(timer); return; }
      i++;
      setDisplayedText(overlayText.slice(0, i));
      if (i >= overlayText.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, [overlayText]);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Typewriter text overlay */}
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
          <p className="text-2xl md:text-4xl leading-relaxed font-medium italic text-white max-w-4xl text-center drop-shadow-lg">
            "{displayedText}"
            <span className={`inline-block w-[2px] h-[1.2em] bg-white ml-1 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </p>
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;