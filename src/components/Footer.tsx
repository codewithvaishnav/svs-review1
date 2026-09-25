import React from 'react';
import { 
  Building2, Phone, Mail, MapPin, Globe, Shield, Download, 
  Facebook, Youtube, Linkedin, Twitter, ArrowUp, ShieldCheck 
} from 'lucide-react';
import { SVS_LOGO_URL } from '../assets/branding';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onDownloadBrochure: () => void;
  onOpenLogin: (role: 'member' | 'associate' | 'admin') => void;
  onOpenPrivacyPolicy: () => void;
  onOpenEnrollment?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onDownloadBrochure,
  onOpenLogin,
  onOpenPrivacyPolicy,
  onOpenEnrollment,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 text-slate-700 border-t border-slate-200">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        
        {/* Brand & About Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={SVS_LOGO_URL} 
              alt="SVS Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight">SVS Srivasudha</div>
              <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Srivasuda True Wealth India
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Over 20+ years of trusted real estate developments, DTCP/HMDA approved layouts, NRI property supervision, and luxury resort hospitality across Telangana, Andhra Pradesh, and global Indian diaspora.
          </p>

          <div className="pt-2 flex items-center gap-2 text-slate-600">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Quick Links (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                About Company
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('projects')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Plots & Projects
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('nri-division')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                NRI Services
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('club-resorts')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Club & Resorts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('membership')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Membership Cards
              </button>
            </li>
            <li>
              <button onClick={onDownloadBrochure} className="hover:text-emerald-800 transition-colors text-emerald-700 font-bold cursor-pointer text-left">
                Download Brochure
              </button>
            </li>
          </ul>
        </div>

        {/* Portals & Legal (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            Accounts & Legal
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li>
              <button onClick={() => onOpenLogin('member')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Member Login
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLogin('associate')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Associate Login
              </button>
            </li>
            {onOpenEnrollment && (
              <li>
                <button onClick={onOpenEnrollment} className="hover:text-amber-800 text-amber-700 font-bold transition-colors cursor-pointer text-left">
                  Associate Enrollment
                </button>
              </li>
            )}
            <li>
              <button onClick={() => onOpenLogin('admin')} className="hover:text-emerald-700 transition-colors cursor-pointer text-left">
                Admin Login
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('careers')} className="hover:text-emerald-700 transition-colors text-emerald-800 font-bold cursor-pointer text-left">
                Careers
              </button>
            </li>
            <li className="pt-1">
              <button 
                onClick={onOpenPrivacyPolicy} 
                className="flex items-center gap-1.5 text-emerald-800 font-bold hover:text-emerald-950 transition-colors cursor-pointer text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Privacy Policy</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Corporate Address (3 cols) */}
        <div className="lg:col-span-3 space-y-3 text-xs text-slate-600">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            Corporate Office
          </h4>
          <p className="leading-relaxed text-slate-700">
            MIG 550, Road No. 1, KPHB Colony, Kukatpally, Hyderabad - 500072, Telangana, India
          </p>
          <div className="space-y-1 text-slate-700 pt-1">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>+91 86888 81283</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>info@srivasudatruewealthindia.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar with Privacy Link */}
      <div className="bg-slate-100 py-4 border-t border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>© 2026 <strong className="text-slate-900">SVS Srivasudha — Srivasuda True Wealth India</strong>. All Rights Reserved.</p>
            <span className="hidden sm:inline text-slate-300">|</span>
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline transition-all cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Privacy Policy & Terms
            </button>
          </div>
          
          <button
            onClick={scrollToTop}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Back to Top
          </button>
        </div>
      </div>

    </footer>
  );
};
