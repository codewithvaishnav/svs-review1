import React from 'react';
import { LeftLogo } from './LeftLogo';
import { MiddleBanner } from './MiddleBanner';
import { RightLogo } from './RightLogo';

export const HeroBrandingHeader: React.FC = () => {
  return (
    <div className="w-full mb-8 py-4 px-4 sm:px-6 md:px-8 bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-pink-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Main Alignment Row: Left Logo | Middle Banner | Right Logo */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        
        {/* Left Side: Left Logo (True Wealth India SVS) */}
        <div className="flex items-center gap-3.5 hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md" />
            <LeftLogo className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative z-10 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" />
          </div>
          <div className="text-left hidden lg:block">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300 tracking-wider uppercase mb-1">
              Registered Corporate
            </span>
            <div className="text-sm font-black text-white tracking-wide">
              TRUE WEALTH INDIA
            </div>
            <div className="text-xs text-amber-400 font-semibold">
              LLP Regd. Real Estate
            </div>
          </div>
        </div>

        {/* Center: Middle Banner Graphic */}
        <div className="flex-1 max-w-2xl text-center px-1 sm:px-4 w-full">
          <MiddleBanner className="w-full" />
        </div>

        {/* Right Side: Right Logo (Srivasuda Foundation) */}
        <div className="flex items-center gap-3.5 hover:scale-105 transition-transform duration-300">
          <div className="text-right hidden lg:block">
            <span className="inline-block px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/40 text-[10px] font-extrabold text-pink-300 tracking-wider uppercase mb-1">
              CSR & Social Welfare
            </span>
            <div className="text-sm font-black text-white tracking-wide">
              SRIVASUDA FOUNDATION
            </div>
            <div className="text-xs text-pink-400 font-semibold">
              Empowering Communities
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-md" />
            <RightLogo className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative z-10 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" />
          </div>
        </div>

      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
    </div>
  );
};
