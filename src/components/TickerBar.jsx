import React, { useRef, useEffect } from "react";
import "./TickerBar.css";
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import { useTheme } from '../context/ThemeContext';

const TickerBar = () => {
  const { isDark } = useTheme();
  const text = "Acompaño a las personas en un viaje hacia su propia creación, en un espacio seguro, sensible y creativo💘";
  const { translatedText } = useAutoTranslate(text);
  const tickerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (tickerRef.current) {
        tickerRef.current.classList.remove("animate-ticker");
        void tickerRef.current.offsetWidth;
        tickerRef.current.classList.add("animate-ticker");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`w-full py-1 flex items-center overflow-hidden ${isDark ? 'bg-purple-300' : 'bg-black'}`} style={{ minHeight: 0 }}>
      <div className="relative w-full">
        <span
          ref={tickerRef}
          className={`block whitespace-nowrap text-sm md:text-base font-medium ticker-text animate-ticker leading-tight ${
            isDark ? 'text-black' : 'text-purple-200'
          }`}
        >
          {translatedText}
        </span>
      </div>
    </div>
  );
};



export default TickerBar;


