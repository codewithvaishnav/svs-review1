import React from 'react';
import { HeroSection } from './HeroSection';
import { TestimonialsSection } from './TestimonialsSection';
import { 
  Building2, ShieldCheck, CreditCard, PartyPopper, Globe, 
  Hotel, ArrowRight, Award, Users, CheckCircle2, Phone, FileText,
  Building, GraduationCap, Cpu, Sparkles, Download, Landmark, Heart,
  Target, Eye
} from 'lucide-react';

interface HomeSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnrollment: () => void;
  onDownloadBrochure: () => void;
  onOpenBookingModal: (type: 'hotel' | 'resort' | 'event' | 'cab') => void;
  selectedNriCountry: string;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onNavigate,
  onOpenEnrollment,
  onDownloadBrochure,
  onOpenBookingModal,
  selectedNriCountry,
}) => {
  const foundationValues = [
    {
      title: 'Value For Money Deals',
      desc: 'We provide precise market intelligence on growth corridors, delivering exceptional long-term capital returns for every family.',
      icon: Landmark,
    },
    {
      title: 'Uncompromising Quality',
      desc: '100% DTCP, HMDA & RERA layout approvals, 60ft/33ft BT roads, underground drainage, and avenue plantations in all ventures.',
      icon: ShieldCheck,
    },
    {
      title: 'Integrity & Ethics',
      desc: 'We conduct our business with transparent documentation, clear title guarantees, and zero hidden costs.',
      icon: Award,
    },
    {
      title: 'Respect & Trust',
      desc: 'We treat our clients and NRI community with utmost dignity and empathy, helping regular families realize their land ownership dreams.',
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 bg-white">
      
      {/* 1. Primary Hero Section */}
      <HeroSection
        onNavigate={onNavigate}
        onOpenEnrollment={onOpenEnrollment}
        onDownloadBrochure={onDownloadBrochure}
      />

      {/* 2. Key Stats & Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">20+ Years</div>
              <p className="text-xs text-slate-600">Trust & Excellence</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">Complete</div>
              <p className="text-xs text-slate-600">Property Care</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">25,000+</div>
              <p className="text-xs text-slate-600">Satisfied Clients</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">100% Clear</div>
              <p className="text-xs text-slate-600">Legal Documentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. About SVS Srivasudha Legacy & Experience Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Srivasuda True Wealth India
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-serif">
              Grow Your Investments With <br className="hidden sm:inline" />
              <span className="text-emerald-700">SVS Srivasudha</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Srivasuda True Wealth India is a professionally managed real estate enterprise with unrivaled expertise in residential planning, land layout design, and eco-resort development. With <strong>over 20+ years of dedicated service</strong>, we understand the aspirations of the common man and NRI investors alike.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A single piece of land holds several dreams. We have pioneered small land investments and remote property management, making prime land assets in Hyderabad&apos;s fastest-growing corridors accessible, secure, and hassle-free.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onDownloadBrochure}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                Download Corporate Brochure
              </button>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  20+
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Years Professional Experience</div>
                  <p className="text-[11px] text-slate-500">Established Track Record in Telangana & AP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-50">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
                alt="SVS Real Estate Leadership"
                className="w-full h-[380px] object-cover"
              />
              
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-slate-900 space-y-1">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Our Core Commitment</div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Making a regular family&apos;s dream of clear-title land ownership a secure and rewarding reality.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Mission & Vision Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We provide precise insights into high-potential location corridors, delivering 100% approved layouts and unmatched value for money to every investor and NRI family.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To focus on stringent quality standards and long-term sustainable business goals while serving as the most trusted real estate and property management enterprise across India and overseas.
          </p>
        </div>
      </div>

      {/* 5. Pillars of Our Foundation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Pillars of Our Foundation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Why thousands of families and NRIs place their complete trust in SVS Srivasudha.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundationValues.map((v, idx) => {
            const IconComp = v.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-600 transition-colors"
              >
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl w-fit text-emerald-700">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{v.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Milestone & Impact Counter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-50 text-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border border-slate-200">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-700">10,000+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Plots Delivered</div>
            <p className="text-[11px] text-slate-500">Clear Title & Approved Layouts</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700">378+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Happy Gated Communities</div>
            <p className="text-[11px] text-slate-500">Shadnagar, Sadashivpet & Yadadri</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800">75+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Dedicated Staff & Supervisors</div>
            <p className="text-[11px] text-slate-500">On-site Plot & Flat Caretaker Teams</p>
          </div>
        </div>
      </div>

      {/* 7. Category & Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            SVS Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore Services & Ventures
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select any division to view services, member privileges, and verified land opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Teaser 1: Ventures & Projects */}
          <div 
            onClick={() => onNavigate('projects')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Approved Ventures & Plots
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                HMDA & DTCP approved open plots in Shadnagar, Sadashivpet, Yadadri & Kothur with instant passbooks.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Teaser 2: Property Division */}
          <div 
            onClick={() => onNavigate('property-division')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Property Care & Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Precast boundary walls, GPS geo-tagging, 24/7 site supervision, plot cleaning, and verified registration documentation.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>Explore Property Protection</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Teaser 3: Clubs, Resorts & Events */}
          <div 
            onClick={() => onNavigate('club-resorts')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <PartyPopper className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Clubs, Resorts & Events
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Weekend eco-resort getaways, member summits, cardholder galas, and fine dining privileges.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>View Resorts & Events</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Teaser 4: NRI Division */}
          <div 
            onClick={() => onNavigate('nri-division')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                NRI Desk ({selectedNriCountry})
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated desk for NRIs across Singapore, USA, UK, UAE & Malaysia. On-ground property care & legal support.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>Explore NRI Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Teaser 5: Membership Cards */}
          <div 
            onClick={() => onNavigate('membership')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Membership Cards
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Platinum, Gold, and Silver Cards giving resort stays, priority concierge access, and dedicated care.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>Check Privileges</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Teaser 6: Clubs & Resorts */}
          <div 
            onClick={() => onNavigate('club-resorts')}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Hotel className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Clubs & Resorts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Weekend resort getaways, 4-star hotel accommodations, dining privileges, and event spaces for members.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>View Stays & Clubs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </div>

      {/* 8. Client Testimonials */}
      <TestimonialsSection />

      {/* 9. Contact Branch Office CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Direct Corporate Engagement
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Ready to Invest in Land or Join as Channel Partner?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Visit our Corporate Headquarters at KPHB Colony, Hyderabad, or reach out to our dedicated support executives directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4" />
              Contact Branch Office
            </button>
            <button
              onClick={onDownloadBrochure}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              Get Digital Brochure
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
