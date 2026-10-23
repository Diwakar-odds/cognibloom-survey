import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated cute walking avatar along the retro progress bar.
 * Moves with progress and bobs in a cute walking gait!
 */
export default function WalkingAvatarProgressBar({ progressPercent = 0 }) {
  // Ensure avatar stays within bounds
  const clampedProgress = Math.min(Math.max(progressPercent, 2), 98);

  return (
    <div className="relative w-full my-3">
      {/* Walking Character Avatar on top of track */}
      <motion.div
        className="absolute -top-11 z-20 pointer-events-none"
        style={{ left: `${clampedProgress}%` }}
        animate={{
          x: "-50%",
          y: [0, -4, 0],
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 25 },
          y: { duration: 0.35, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Cute Notion-style bendy limbs character with laptop & wave */}
        <div className="relative flex flex-col items-center">
          <svg
            width="42"
            height="46"
            viewBox="0 0 42 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[2px_2px_0px_#000]"
          >
            {/* Waving Arm / Hand (Group rotation prevents path d undefined error) */}
            <motion.g
              animate={{ rotate: [0, 18, -6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "30px 18px" }}
            >
              <path
                d="M30 18 Q36 10 38 4"
                stroke="#0A0A0A"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="38" cy="4" r="3" fill="#ffb4a2" stroke="#0A0A0A" strokeWidth="2" />
            </motion.g>

            {/* Hair Ponytail */}
            <path
              d="M17 6 Q14 2 20 2 Q22 5 20 9"
              fill="#0A0A0A"
            />
            {/* Head */}
            <circle cx="21" cy="11" r="7" fill="#ffb4a2" stroke="#0A0A0A" strokeWidth="2.5" />
            {/* Eyes & smile */}
            <circle cx="19" cy="11" r="1" fill="#0A0A0A" />
            <circle cx="23" cy="11" r="1" fill="#0A0A0A" />
            <path d="M20 14 Q21 16 22 14" stroke="#0A0A0A" strokeWidth="1" strokeLinecap="round" />

            {/* Torso / Top */}
            <rect x="15" y="18" width="13" height="12" rx="4" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="2.5" />
            {/* Mint buttons */}
            <circle cx="21.5" cy="22" r="1" fill="#95d9c0" />
            <circle cx="21.5" cy="26" r="1" fill="#95d9c0" />

            {/* Laptop in hand */}
            <rect x="7" y="19" width="9" height="7" rx="1.5" fill="#0A0A0A" />
            <rect x="8" y="20" width="7" height="5" rx="1" fill="#95d9c0" />

            {/* Animated Bendy Legs (Group transform for smooth walking gait with static valid d paths) */}
            <motion.g
              animate={{ rotate: [-8, 14, -8] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "18px 30px" }}
            >
              <path
                d="M18 30 Q14 36 12 42"
                stroke="#0A0A0A"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </motion.g>

            <motion.g
              animate={{ rotate: [14, -8, 14] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "24px 30px" }}
            >
              <path
                d="M24 30 Q28 35 30 42"
                stroke="#0A0A0A"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>

          {/* Tiny percentage speech bubble on hover / progress */}
          <span className="absolute -bottom-1 bg-black text-[#95d9c0] font-pixel text-[8px] px-1 py-0.5 rounded border border-[#95d9c0] whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>
      </motion.div>

      {/* Retro Thick Progress Bar Container */}
      <div className="h-4 sm:h-5 w-full bg-[#f6f6f6] border-2 sm:border-[2.5px] border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_#000] p-0.5">
        <motion.div
          className="h-full bg-[#95d9c0] rounded-sm relative overflow-hidden"
          style={{ width: `${progressPercent}%` }}
          transition={{ ease: "easeOut", duration: 0.25 }}
        >
          {/* Retro striped pixel pattern */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:12px_12px]" />
        </motion.div>
      </div>
    </div>
  );
}
