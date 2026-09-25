import React from 'react';

interface MiddleBannerProps {
  className?: string;
}

export const MiddleBanner: React.FC<MiddleBannerProps> = ({ className = 'w-full max-w-xl h-auto' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl bg-gradient-to-r from-slate-950/80 via-slate-900/95 to-slate-950/80 border border-amber-500/30 shadow-2xl backdrop-blur-md ${className}`}>
      {/* Top Banner Ornamental Line */}
      <div className="w-full flex items-center justify-center gap-3 mb-1">
        <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-amber-300">
          OFFICIAL BRANDING
        </div>
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
      </div>

      {/* Main Title Banner: SRIVASUDA */}
      <div className="relative">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 filter drop-shadow-[0_4px_12px_rgba(219,39,119,0.5)]">
          SRIVASUDA
        </h1>
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/20 to-amber-500/20 blur-xl -z-10 rounded-full" />
      </div>

      {/* Sub-Title Banner: TRUE WEALTH INDIA */}
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs sm:text-base md:text-lg font-black tracking-[0.25em] text-amber-300 uppercase filter drop-shadow">
          TRUE WEALTH INDIA
        </span>
      </div>

      {/* Tagline Badge */}
      <div className="mt-2 inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-[10px] sm:text-xs font-bold text-emerald-300 shadow-inner">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        DTCP, HMDA & RERA APPROVED REAL ESTATE & INFRASTRUCTURE
      </div>

      {/* Bottom Banner Decorative Line */}
      <div className="w-full flex items-center justify-center gap-3 mt-2">
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-emerald-400/50 to-amber-400/80" />
        <span className="text-[9px] font-mono text-slate-400">ESTD. 2004</span>
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-emerald-400/50 to-amber-400/80" />
      </div>
    </div>
  );
};
