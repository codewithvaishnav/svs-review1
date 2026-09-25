import React from 'react';
import { TESTIMONIALS_DATA } from '../data/svsData';
import { Star, Quote, MapPin } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            Verified Client Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What Our Clients & NRI Members Say
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Hear directly from plot owners and overseas investors who rely on Srivasuda True Wealth India.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between space-y-6 relative hover:shadow-xl transition-shadow"
            >
              
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-emerald-600/20" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>

              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs font-bold text-emerald-800">{t.role}</p>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {t.location}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
