import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';

export default function Header({
  currentStep,
  totalSteps,
  currentSection,
  onBack,
  canGoBack,
}) {
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
  
  // Calculate approximate remaining minutes
  const remainingSteps = Math.max(0, totalSteps - currentStep);
  const estimatedSeconds = remainingSteps * 7; // ~7 seconds per question
  const estimatedMinutes = Math.max(1, Math.ceil(estimatedSeconds / 60));

  return (
    <header className="relative z-20 w-full border-b border-white/60 bg-white/70 backdrop-blur-md">
      {/* Top micro progress line */}
      <div className="h-1.5 w-full bg-zinc-200/60 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white/80 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition active:scale-95 shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-zinc-900">
                Cogni<span className="text-purple-600">Bloom</span>
              </span>
            </div>
          )}
        </div>

        {/* Center: Current Section Tag (hidden on small mobile) */}
        {currentSection && (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100/90 text-xs font-semibold text-zinc-600 border border-zinc-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
            {currentSection.title}
          </div>
        )}

        {/* Right: Progress stats */}
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-600">
          <div className="hidden xs:flex items-center gap-1 text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>~{estimatedMinutes}m left</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-100/80 text-purple-700 font-bold text-[11px] sm:text-xs">
            {progressPercent}%
          </span>
        </div>
      </div>
    </header>
  );
}
