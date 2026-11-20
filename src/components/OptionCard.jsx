import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import SurveyIcon from './SurveyIcon';

export default function OptionCard({
  label,
  icon,
  emoji,
  isSelected,
  onClick,
  isMulti = false,
  hasCustomInput = false,
  customInputValue = '',
  onCustomInputChange,
}) {
  return (
    <div className="w-full">
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.98 }}
        className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-between gap-3 ${
          isSelected
            ? "border-[#95d9c0] bg-[#eaf3f0] shadow-[0_4px_20px_rgba(149,217,192,0.2)] text-zinc-900"
            : "border-zinc-200/90 bg-white/80 hover:bg-white hover:border-zinc-300 shadow-sm text-zinc-800"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {(icon || emoji) && (
            <span className={`h-9 w-9 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
              isSelected ? "bg-black text-[#95d9c0]" : "bg-zinc-100 text-zinc-700"
            }`}>
              <SurveyIcon name={icon} emoji={emoji} className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
            </span>
          )}
          <span className={`text-sm sm:text-base leading-snug break-words ${isSelected ? "font-bold text-black" : "font-medium"}`}>
            {label}
          </span>
        </div>

        {/* Selection indicator */}
        <div
          className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? "bg-purple-600 text-white"
              : isMulti
              ? "border-2 border-zinc-300 rounded-md"
              : "border-2 border-zinc-300"
          }`}
        >
          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </div>
      </motion.button>

      {/* Expandable custom input for "Other" */}
      <AnimatePresence>
        {hasCustomInput && isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden px-1"
          >
            <input
              type="text"
              autoFocus
              value={customInputValue}
              onChange={(e) => onCustomInputChange && onCustomInputChange(e.target.value)}
              placeholder="Please specify here..."
              className="w-full px-4 py-2.5 rounded-xl border border-purple-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
