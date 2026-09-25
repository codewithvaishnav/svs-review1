import React from 'react';
import { SERVICE_DIVISIONS } from '../data/svsData';
import { 
  Home, Landmark, Globe, Hotel, HeartHandshake, ArrowRight, CheckCircle2 
} from 'lucide-react';

interface DivisionsSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const DivisionsSection: React.FC<DivisionsSectionProps> = ({ onNavigate }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return Home;
      case 'Landmark': return Landmark;
      case 'Globe': return Globe;
      case 'Hotel': return Hotel;
      default: return HeartHandshake;
    }
  };

  return (
    <section id="divisions" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300">
            SVS Group Verticals
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Key Divisions
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Delivering holistic real estate, property maintenance, hospitality, and social welfare solutions through specialized subsidiary divisions.
          </p>
        </div>

        {/* Divisions Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_DIVISIONS.map((division) => {
            const IconComponent = getIcon(division.iconName);
            return (
              <div
                key={division.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                
                {/* Division Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={division.image}
                    alt={division.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
                      SVS Vertical
                    </span>
                  </div>
                </div>

                {/* Division Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {division.title}
                    </h3>
                    <p className="text-xs font-bold text-emerald-800">
                      {division.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {division.description}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {division.features.map((feat, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (division.id === 'nri-services') onNavigate('nri-division');
                      else if (division.id === 'club-resorts') onNavigate('club-resorts');
                      else onNavigate('projects');
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer shadow-xs"
                  >
                    Explore Division
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
