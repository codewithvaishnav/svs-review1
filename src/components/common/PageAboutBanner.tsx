import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
}

interface PageAboutBannerProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: LucideIcon;
  stats?: StatItem[];
  accentColor?: 'emerald' | 'amber' | 'cyan' | 'indigo' | 'rose';
}

export const PageAboutBanner: React.FC<PageAboutBannerProps> = ({
  badge,
  title,
  subtitle,
  description,
  icon: Icon,
  stats = [],
  accentColor = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accentDot: 'bg-emerald-600',
      iconBox: 'bg-emerald-700 text-white',
      borderAccent: 'border-emerald-100',
      statValue: 'text-emerald-800'
    },
    amber: {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      accentDot: 'bg-amber-500',
      iconBox: 'bg-amber-600 text-white',
      borderAccent: 'border-amber-100',
      statValue: 'text-amber-800'
    },
    cyan: {
      badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      accentDot: 'bg-cyan-600',
      iconBox: 'bg-cyan-700 text-white',
      borderAccent: 'border-cyan-100',
      statValue: 'text-cyan-800'
    },
    indigo: {
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      accentDot: 'bg-indigo-600',
      iconBox: 'bg-indigo-700 text-white',
      borderAccent: 'border-indigo-100',
      statValue: 'text-indigo-800'
    },
    rose: {
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      accentDot: 'bg-rose-600',
      iconBox: 'bg-rose-700 text-white',
      borderAccent: 'border-rose-100',
      statValue: 'text-rose-800'
    }
  };

  const scheme = colorMap[accentColor];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className={`bg-white border ${scheme.borderAccent} rounded-2xl p-5 sm:p-7 shadow-xs`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scheme.badgeBg}`}>
                <span className={`w-2 h-2 rounded-full ${scheme.accentDot}`} />
                {badge}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {subtitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`p-2 rounded-xl shrink-0 ${scheme.iconBox}`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          {stats.length > 0 && (
            <div className="flex items-center gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <div className={`text-lg sm:text-xl font-black ${scheme.statValue}`}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
