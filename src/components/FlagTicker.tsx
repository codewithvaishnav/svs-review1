import React from 'react';
import { NRI_COUNTRIES } from '../data/svsData';

interface FlagTickerProps {
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
}

export const FlagTicker: React.FC<FlagTickerProps> = ({ selectedCountry, onSelectCountry }) => {
  return (
    <div className="bg-slate-50 border-y border-slate-200 py-1.5 overflow-hidden relative">
      <div className="relative w-full overflow-hidden flex whitespace-nowrap py-1">
        <div className="flex items-center gap-8 animate-marquee shrink-0">
          {[...NRI_COUNTRIES, ...NRI_COUNTRIES, ...NRI_COUNTRIES].map((country, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCountry(country.name)}
              className="inline-flex items-center gap-2.5 cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
            >
              <img src={country.flagUrl} alt={country.name} className="w-5 h-3.5 object-cover rounded-sm border border-slate-200 shadow-xs" />
              <span className="text-xs font-semibold text-slate-700 hover:text-emerald-700">
                SVS {country.name} Desk
              </span>
              <span className="text-slate-300">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
