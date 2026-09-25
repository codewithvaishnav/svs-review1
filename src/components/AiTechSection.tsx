import React from 'react';
import { 
  Cpu, Sparkles, Eye, MapPin, CheckCircle2, 
  ArrowRight, ExternalLink, ShieldCheck, Zap, BarChart3, Bot, 
  Globe, Laptop, PhoneCall 
} from 'lucide-react';

interface AiTechSectionProps {
  onOpenBookingModal?: (type: 'event') => void;
}

export const AiTechSection: React.FC<AiTechSectionProps> = ({ onOpenBookingModal }) => {
  const handleLaunchExternalPortal = () => {
    // Redirects to external PropTech portal platform
    window.open('https://proptech.svsgroup.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="ai-tech-division" className="py-16 sm:py-20 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-700" />
            SVS AI Tech & PropTech Digital Suite
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Next-Gen AI & Aerial Technology in Real Estate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            SVS Group integrates high-precision 4K aerial drone spatial mapping, 360° Virtual Reality site walkthroughs, and AI-driven land valuation intelligence powered by our dedicated PropTech platform.
          </p>
        </div>

        {/* AI & PropTech Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-cyan-400 transition-all space-y-4 shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Growth & ROI Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Machine learning algorithms analyzing historical highway expansions, Master Plans, and Regional Ring Road nodes to predict land appreciation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-400 transition-all space-y-4 shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">4K Drone Spatial Surveying</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-precision aerial photogrammetry generating millimeter-accurate layout maps, elevation profiles, and boundary overlays.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-400 transition-all space-y-4 shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">360° VR Interactive Site Tours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect open plots, clubhouses, and surrounding 100-ft roads remotely from USA, Singapore, or Dubai in real-time Virtual Reality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-400 transition-all space-y-4 shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Legal Title Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated AI verification on Encumbrance Certificates (EC), RERA registration numbers, and DTCP layout approvals.
            </p>
          </div>

        </div>

        {/* Primary Call to Action: External PropTech Portal Access */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold uppercase tracking-wider border border-cyan-300 inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-700" />
              External Platform Integration
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              Access the External SVS PropTech AI & Spatial Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our advanced AI valuation engine, live GIS masterplan layer viewers, and high-definition 4K aerial drone streams are hosted on our specialized external PropTech infrastructure.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Single Sign-On Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Drone Live Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Legal Verification</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
            
            {/* Primary CTA */}
            <button
              onClick={handleLaunchExternalPortal}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Laptop className="w-5 h-5" />
              <span>Launch External AI Tech Suite</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Secondary CTA */}
            {onOpenBookingModal && (
              <button
                onClick={() => onOpenBookingModal('event')}
                className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Schedule Virtual VR Walkthrough</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
