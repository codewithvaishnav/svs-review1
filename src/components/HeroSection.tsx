import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRight, ShieldCheck, Download, Award, Sparkles, 
  MapPin, CheckCircle2, ChevronRight, ChevronLeft, Hotel, UserCheck,
  Search, PhoneCall, Compass, Home, Trees, Shield
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnrollment: () => void;
  onDownloadBrochure: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenEnrollment,
  onDownloadBrochure,
}) => {
  const slides = [
    {
      id: 1,
      title: 'Trusted Real Estate & Gated Land Ventures in Hyderabad',
      subtitle: 'Srivasuda True Wealth India — Over 20+ years of DTCP & HMDA approved open plots, luxury farm communities, and verified title registrations.',
      tagline: 'DTCP & HMDA APPROVED VENTURES',
      ctaText: 'Explore Available Projects',
      ctaTarget: 'projects',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
      badge: '20+ Years Legacy of Trust',
    },
    {
      id: 2,
      title: 'Complete On-Ground Property Care & Protection',
      subtitle: 'Precast boundary wall fencing, GPS geo-tagging, 24/7 supervisor visits, and live digital CCTV monitoring for peace of mind.',
      tagline: 'ASSET SECURITY & MANAGEMENT',
      ctaText: 'Property Protection Services',
      ctaTarget: 'property-division',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85',
      badge: '24/7 Field Supervision',
    },
    {
      id: 3,
      title: 'Exclusive Privileges with SVS Membership Cards',
      subtitle: 'Platinum, Diamond, Gold & Silver Cards giving complimentary resort staycations, priority concierge desk, and clubhouse dining privileges.',
      tagline: 'LUXURY CLUB & STAYCATION ACCESS',
      ctaText: 'View Membership Privileges',
      ctaTarget: 'membership',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
      badge: 'Complimentary Resort Stays',
    },
    {
      id: 4,
      title: 'Global NRI Property Management & Legal Desk',
      subtitle: 'Dedicated support for Non-Resident Indians across Singapore, USA, UK, UAE & Malaysia with clear title verification and digital updates.',
      tagline: 'GLOBAL INDIAN DIASPORA DESK',
      ctaText: 'Explore NRI Property Desk',
      ctaTarget: 'nri-division',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      badge: 'Dedicated NRI Relationship Manager',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-slate-950 text-white">
      
      {/* Background Image Carousel with Smooth Transitions */}
      <div className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Rich Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-sm animate-in fade-in duration-500">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{slide.tagline}</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-white font-medium">{slide.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-sm font-serif">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-base sm:text-xl font-normal leading-relaxed max-w-2xl drop-shadow-sm">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate(slide.ctaTarget)}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenEnrollment}
                className="px-5 sm:px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer hover:border-white/50"
              >
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>Join as Channel Partner</span>
              </button>

              <button
                onClick={onDownloadBrochure}
                className="px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Brochure</span>
              </button>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-t border-white/15">
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">20+ Years</div>
                <div className="text-slate-300 text-[11px] font-medium">Trust & Track Record</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">25,000+</div>
                <div className="text-slate-300 text-[11px] font-medium">Happy Land Owners</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100% Clear</div>
                <div className="text-slate-300 text-[11px] font-medium">Legal Documentation</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300">Global Desks</div>
                <div className="text-slate-300 text-[11px] font-medium">Singapore, USA, UAE</div>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute z-30 bottom-6 right-4 sm:right-8 flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Slide Dots Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/20 backdrop-blur-md">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </section>
  );
};
