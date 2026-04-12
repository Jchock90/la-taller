import React, { useRef, useEffect } from "react";
import "./TickerBar.css";
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import { useTheme } from '../context/ThemeContext';

const TickerBar = () => {
  const { isDark } = useTheme();
  const text = "⚡ ENVÍO GRATIS en compras +$500.000  ·  🔧 ARMAMOS TU PC  ·  🛡️ GARANTÍA EXTENDIDA  ·  💳 HASTA 12 CUOTAS SIN INTERÉS  ·  🚀 NUEVOS LANZAMIENTOS CADA SEMANA";
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
    <div className={`w-full flex items-center overflow-hidden py-1.5 border-b ${isDark ? 'bg-[#080810] border-cyan-500/10' : 'bg-gray-950 border-cyan-500/20'}`} style={{ minHeight: 0 }}>
      <div className="relative w-full">
        <span
          ref={tickerRef}
          className="block whitespace-nowrap text-[11px] font-medium ticker-text animate-ticker leading-normal text-cyan-400/70 font-mono-code tracking-wider"
        >
          {translatedText}
        </span>
      </div>
    </div>
  );
};

export default TickerBar;

