import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated cute retro robot that peeks out horizontally from the SIDE (Left or Right)
 * of the survey card, waiting for the card to mount before emerging!
 */
export default function PeekingCharacter({ side = 'right', questionIndex = 0, isAnswering = false }) {
  const isRight = side === 'right';

  return (
    <motion.div
      key={`${questionIndex}-${side}`}
      className={`absolute z-0 pointer-events-none select-none hidden md:block ${
        isRight
          ? '-right-14 lg:-right-16 top-1/4'
          : '-left-14 lg:-left-16 top-1/3'
      }`}
      // Wait for central question card to open, then peek out smoothly!
      initial={{
        x: isRight ? -35 : 35,
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
        y: [0, -4, 0],
      }}
      transition={{
        x: { delay: 0.28, duration: 0.45, ease: 'easeOut' },
        opacity: { delay: 0.28, duration: 0.3 },
        y: { delay: 0.7, duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="relative">
        {/* Thought bubble when user clicks an answer */}
        {isAnswering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`absolute -top-7 ${
              isRight ? '-left-12' : '-right-12'
            } bg-black text-[#95d9c0] text-[10px] font-retro font-bold px-2 py-0.5 rounded border border-[#95d9c0] shadow-[2px_2px_0px_#000] whitespace-nowrap z-30`}
          >
            {isRight ? 'Aha! 💡' : 'Nice! ✨'}
          </motion.div>
        )}

        {/* Retro Bot SVG oriented to peek around the card edge */}
        <svg
          width="74"
          height="86"
          viewBox="0 0 74 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[3px_3px_0px_rgba(0,0,0,0.9)]"
          style={{
            transform: isRight ? 'none' : 'scaleX(-1)', // Flip orientation naturally on left side
          }}
        >
          {/* Antenna with pulsing light */}
          <rect x="28" y="4" width="5" height="12" fill="#0A0A0A" />
          <motion.circle
            cx="30.5"
            cy="4"
            r="4"
            fill="#d41f26"
            stroke="#0A0A0A"
            strokeWidth="2"
            animate={{ fill: ['#d41f26', '#95d9c0', '#d41f26'] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />

          {/* Bot Main Head tilted inward toward the card */}
          <rect
            x="6"
            y="16"
            width="58"
            height="50"
            rx="12"
            fill="#95d9c0"
            stroke="#0A0A0A"
            strokeWidth="3.5"
          />

          {/* Screws / Ear bolts */}
          <rect x="0" y="32" width="6" height="14" rx="2" fill="#0A0A0A" />
          <rect x="64" y="32" width="6" height="14" rx="2" fill="#0A0A0A" />

          {/* Face Screen Visor */}
          <rect
            x="14"
            y="25"
            width="44"
            height="26"
            rx="7"
            fill="#0A0A0A"
          />

          {/* Animated Eyes looking toward the card */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1] }}
          >
            {/* Left Eye looking leftwards at the questions */}
            <circle cx="26" cy="37" r="4.5" fill="#95d9c0" />
            <circle cx="25" cy="35.5" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="44" cy="37" r="4.5" fill="#95d9c0" />
            <circle cx="43" cy="35.5" r="1.5" fill="#FFFFFF" />
          </motion.g>

          {/* Cute Rosy Pixel Blushes */}
          <rect x="17" y="43" width="5" height="3" fill="#d41f26" rx="1" />
          <rect x="49" y="43" width="5" height="3" fill="#d41f26" rx="1" />

          {/* Mouth */}
          <path
            d={isAnswering ? "M30 45 Q36 50 41 45" : "M32 45 H38"}
            stroke="#95d9c0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Hands holding the edge of the survey box */}
          <rect x="4" y="62" width="12" height="9" rx="3" fill="#6bc4a7" stroke="#0A0A0A" strokeWidth="2.5" />
          <rect x="20" y="62" width="12" height="9" rx="3" fill="#6bc4a7" stroke="#0A0A0A" strokeWidth="2.5" />
        </svg>
      </div>
    </motion.div>
  );
}
