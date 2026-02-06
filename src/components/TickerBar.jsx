import React, { useRef, useEffect } from "react";
import "./TickerBar.css";

const TickerBar = () => {
  const text = "Acompaño a las personas en un viaje hacia su propia creación, en un espacio seguro, sensible y creativo💘";
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
    <div className="w-full bg-black py-1 flex items-center overflow-hidden" style={{ minHeight: 0 }}>
      <div className="relative w-full">
        <span
          ref={tickerRef}
          className="block text-purple-200 whitespace-nowrap text-sm md:text-base font-medium ticker-text animate-ticker leading-tight"
        >
          {text}
        </span>
      </div>
    </div>
  );
};



export default TickerBar;


