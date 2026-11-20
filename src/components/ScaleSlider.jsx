import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ScaleSlider({ options = [], value, onChange }) {
  // Find active index
  const activeIndex = options.indexOf(value) !== -1 ? options.indexOf(value) : 0;
  const max = options.length - 1;
  const percentage = max > 0 ? (activeIndex / max) * 100 : 0;

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value, 10);
    if (options[newIndex]) {
      onChange(options[newIndex]);
    }
  };

  const handleSelectOption = (idx) => {
    if (options[idx]) {
      onChange(options[idx]);
    }
  };

  return (
    <div className="w-full my-6 flex flex-col items-center">
      {/* Current selection highlight card */}
      <motion.div
        key={value}
        initial={{ scale: 0.92, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="mb-8 px-6 py-3.5 rounded-2xl bg-white border border-purple-200/80 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.12)] flex items-center gap-2.5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
          {activeIndex + 1}/{options.length}
        </span>
        <span className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          {value || options[0]}
        </span>
        <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
      </motion.div>

      {/* Slider Track with fill */}
      <div className="relative w-full max-w-xl px-2">
        {/* Background track */}
        <div className="relative h-3 w-full rounded-full bg-zinc-200/80 overflow-hidden shadow-inner">
          {/* Active fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-full"
            style={{ width: `${percentage}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>

        {/* Real Range input on top for drag/touch support */}
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={activeIndex}
          onChange={handleSliderChange}
          className="absolute inset-x-2 -top-2.5 w-[calc(100%-16px)] h-8 opacity-0 cursor-pointer z-20"
        />

        {/* Visual Thumb Follower */}
        <motion.div
          className="absolute -top-1.5 pointer-events-none z-10"
          style={{ left: `calc(${percentage}% + ${(0.5 - percentage / 100) * 20}px)` }}
          animate={{ x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <div className="h-6 w-6 rounded-full bg-zinc-900 border-2 border-white shadow-lg flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-purple-400" />
          </div>
        </motion.div>

        {/* Option Tick Markers & Clickable labels */}
        <div className="relative mt-5 flex justify-between items-start">
          {options.map((opt, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className="group flex flex-col items-center focus:outline-none transition-transform hover:scale-105"
                style={{ width: `${100 / options.length}%` }}
              >
                {/* Dot */}
                <span
                  className={`h-2.5 w-2.5 rounded-full mb-2 transition-all ${
                    isSelected
                      ? "bg-purple-600 ring-4 ring-purple-100 scale-125"
                      : "bg-zinc-300 group-hover:bg-zinc-400"
                  }`}
                />
                {/* Label (short or responsive) */}
                <span
                  className={`text-[11px] sm:text-xs text-center leading-tight transition-colors ${
                    isSelected
                      ? "font-bold text-purple-700"
                      : "font-medium text-zinc-500 group-hover:text-zinc-800"
                  }`}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-xs text-zinc-400 flex items-center gap-1.5">
        <span>💡</span> Slide left or right, or click any option to select
      </p>
    </div>
  );
}
