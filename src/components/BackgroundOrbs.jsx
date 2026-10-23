import React from 'react';

export default function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top-left purple glow */}
      <div className="absolute -top-32 -left-32 h-80 w-80 sm:h-[450px] sm:w-[450px] rounded-full bg-purple-300/35 blur-[100px] sm:blur-[130px]" />
      
      {/* Middle-right indigo glow */}
      <div className="absolute top-1/4 -right-32 h-80 w-80 sm:h-[500px] sm:w-[500px] rounded-full bg-indigo-300/30 blur-[110px] sm:blur-[140px]" />
      
      {/* Bottom-center amber / rose warm glow */}
      <div className="absolute -bottom-32 left-1/4 h-72 w-72 sm:h-[420px] sm:w-[420px] rounded-full bg-amber-200/35 blur-[100px] sm:blur-[130px]" />
    </div>
  );
}
