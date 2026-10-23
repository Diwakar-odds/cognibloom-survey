import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl text-center"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-[#222228] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm mb-6">
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        CogniBloom Student Survey
      </div>

      {/* Hero Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#222228] leading-[1.18] mb-4">
        Make Learning <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Stick.</span>
        <br />
        <span className="font-handwriting text-3xl sm:text-5xl font-normal text-zinc-600 block mt-1">
          Not Just For The Exam.
        </span>
      </h1>

      {/* Quote callout box */}
      <div className="my-6 sm:my-8 rounded-2xl bg-white/90 border border-zinc-200/90 p-4 sm:p-6 shadow-xs text-left">
        <p className="text-sm sm:text-base font-medium text-zinc-700 leading-relaxed italic border-l-4 border-purple-600 pl-4">
          “Forget generic textbooks and boring lectures. If we built an AI study companion tailored specifically to your memory and learning style, what would it need to solve?”
        </p>
      </div>

      {/* Key perks / stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-zinc-600 mb-8 text-left sm:text-center max-w-md mx-auto">
        <span className="flex items-center justify-start sm:justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ~2–3 Minutes to complete
        </span>
        <span className="flex items-center justify-start sm:justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
          VIP Early Access Waitlist
        </span>
      </div>

      {/* CTA Button */}
      <motion.button
        type="button"
        onClick={onStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group inline-flex h-13 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#222228] px-8 text-base font-bold text-white shadow-xl hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
      >
        <span>Let's Start Your Journey</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
}
