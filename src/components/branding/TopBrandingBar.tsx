import React from 'react';
import { LeftLogo } from './LeftLogo';
import { RightLogo } from './RightLogo';

interface TopBrandingBarProps {
  onNavigate?: (sectionId: string) => void;
}

export const TopBrandingBar: React.FC<TopBrandingBarProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white text-slate-900 border-b border-slate-200 py-2.5 px-3 sm:px-6 lg:px-8 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Entity Branding: True Wealth India LLP */}
        <div 
          onClick={() => onNavigate?.('hero')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
        >
          <LeftLogo className="w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="text-left hidden xs:block sm:block min-w-0">
            <div className="text-[10px] sm:text-xs md:text-xs font-black text-slate-900 tracking-wide leading-tight group-hover:text-emerald-700 transition-colors uppercase truncate">
              TRUE WEALTH INDIA
            </div>
            <div className="text-[8px] sm:text-[9px] text-emerald-700 font-bold tracking-wider uppercase truncate">
              LLP Real Estate
            </div>
          </div>
        </div>

        {/* Center Official Minimal Title */}
        <div className="flex flex-col items-center justify-center text-center px-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline-block h-[1px] w-8 sm:w-12 bg-slate-300" />
            <h1 className="text-xs sm:text-base md:text-lg font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif text-slate-900 whitespace-nowrap">
              SRIVASUDA
            </h1>
            <span className="hidden sm:inline-block h-[1px] w-8 sm:w-12 bg-slate-300" />
          </div>

          <div className="text-[8px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.12em] text-slate-600 uppercase mt-0.5 whitespace-nowrap">
            TRUE WEALTH INDIA <span className="text-amber-600 font-bold mx-1">•</span> FOUNDATION
          </div>
        </div>

        {/* Right Entity Branding: Srivasuda Foundation */}
        <div 
          onClick={() => onNavigate?.('about')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group justify-end shrink-0 min-w-0"
        >
          <div className="text-right hidden xs:block sm:block min-w-0">
            <div className="text-[10px] sm:text-xs md:text-xs font-black text-slate-900 tracking-wide leading-tight group-hover:text-pink-700 transition-colors uppercase truncate">
              SRIVASUDA FOUNDATION
            </div>
            <div className="text-[8px] sm:text-[9px] text-pink-700 font-bold tracking-wider uppercase truncate">
              CSR & Social Welfare
            </div>
          </div>
          <RightLogo className="w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 group-hover:scale-105 transition-transform" />
        </div>

      </div>
    </div>
  );
};
