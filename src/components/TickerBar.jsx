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
    <div className="w-full flex items-center overflow-hidden bg-black win-ridge" style={{ minHeight: 0, height: '22px' }}>
      <div className="relative w-full">
        <span
          ref={tickerRef}
          className={`block whitespace-nowrap text-[13px] font-medium ticker-text animate-ticker leading-none ${
            isDark ? 'text-neutral-300' : 'text-neutral-300'
          }`}
        >
          {translatedText}
        </span>
      </div>
    </div>
  );
};



export default TickerBar;


