import React from 'react';
import { motion } from 'framer-motion';

export default function RetroScaleSlider({ options = [], value, onChange }) {
  const activeIndex = options.indexOf(value) !== -1 ? options.indexOf(value) : 0;
  const max = options.length - 1;
  const percentage = max > 0 ? (activeIndex / max) * 100 : 0;

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value, 10);
    if (options[newIndex]) {
      onChange(options[newIndex]);
    }
  };

  return (
    <div className="w-full my-6 flex flex-col items-center font-retro">
      {/* Retro LCD Display Screen showing active value */}
      <motion.div
        key={value}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="mb-6 w-full max-w-md p-3.5 bg-black border-2 border-black rounded-lg text-center shadow-[4px_4px_0px_#95d9c0]"
      >
        <div className="flex items-center justify-between text-[11px] text-[#95d9c0] font-pixel mb-1 px-1">
          <span>LEVEL: 0{activeIndex + 1}</span>
          <span className="animate-pulse">● TUNING</span>
        </div>
        <div className="text-sm sm:text-base font-bold text-white tracking-wide">
          &gt; {value || options[0]} &lt;
        </div>
      </motion.div>

      {/* Retro Stepped Track */}
      <div className="relative w-full max-w-xl px-2">
        {/* Retro meter track */}
        <div className="relative h-6 w-full bg-[#f6f6f6] border-2 border-black rounded-md overflow-hidden shadow-[3px_3px_0px_#000] p-1 flex items-center">
          {/* Segmented LED blocks */}
          <div className="w-full h-full flex gap-1">
            {options.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full rounded-xs transition-colors duration-150 ${
                  i <= activeIndex
                    ? "bg-[#95d9c0] border border-black shadow-inner"
                    : "bg-zinc-200"
                }`}
              />
            ))}
          </div>

          {/* Actual draggable range input overlay */}
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={activeIndex}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>

        {/* Ticks and Clickable Labels */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((opt, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`p-2 rounded-md text-xs border-2 text-left transition-all ${
                  isSelected
                    ? "bg-[#95d9c0] text-black font-bold border-black shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                    : "bg-white text-zinc-700 border-zinc-300 hover:border-black hover:bg-zinc-50"
                }`}
              >
                <span className="font-pixel text-[10px] block opacity-60">0{idx + 1}.</span>
                <span className="line-clamp-2">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
