import React, { useState } from 'react';
import { 
  Building2, Globe, Shield, Phone, Lock, ChevronDown, Menu, X, 
  UserCheck, Download, Sparkles, MapPin, Hotel, Briefcase, FileText,
  Building, GraduationCap, Cpu, CreditCard, Award, Calendar, User,
  Smartphone, CheckCircle2, ArrowRight
} from 'lucide-react';
import { TopBrandingBar } from './branding/TopBrandingBar';

import { UserRole } from '../lib/rbac';

interface NavbarProps {
  onOpenLogin: (role: 'member' | 'associate' | 'admin') => void;
  onOpenEnrollment: () => void;
  onNavigate: (sectionId: string) => void;
  selectedNriCountry: string;
  onSelectNriCountry: (countryName: string) => void;
  onDownloadBrochure: () => void;
  currentTab?: string;
  isLoggedIn?: boolean;
  userRole?: UserRole;
  loggedInUser?: string | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenEnrollment,
  onNavigate,
  selectedNriCountry,
  onSelectNriCountry,
  onDownloadBrochure,
  currentTab = 'home',
  isLoggedIn = false,
  userRole = 'guest',
  loggedInUser = null,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-slate-200">
      
      {/* Top Minimal Official Branding Bar */}
      <TopBrandingBar onNavigate={onNavigate} />

      {/* Top Utility Bar */}
      {!isLoggedIn && (
        <div className="bg-slate-100 text-slate-700 text-xs py-1.5 px-4 hidden sm:block border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                Direct Helpline: <a href="tel:+918688881283" className="hover:underline text-emerald-800 font-bold">+91 86888 81283</a>
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Corporate HQ: KPHB Colony, Hyderabad
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onDownloadBrochure}
                className="flex items-center gap-1 hover:text-emerald-800 transition-colors text-[11px] font-semibold text-slate-700 cursor-pointer"
              >
                <Download className="w-3 h-3 text-emerald-700" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 text-xs font-semibold text-slate-700">
          
          {/* MEMBER ROLE NAVIGATION */}
          {isLoggedIn && userRole === 'member' && (
            <>
              <button 
                onClick={() => handleNav('member-dashboard')} 
                className={`py-2 transition-colors flex items-center gap-1.5 ${
                  currentTab === 'member-dashboard' 
                    ? 'text-emerald-600 dark:text-emerald-400 font-black border-b-2 border-emerald-500' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Dashboard & Enquiries
              </button>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

              <button 
                onClick={() => handleNav('home')} 
                className={`py-2 transition-colors ${
                  currentTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🌐 Public Website
              </button>
            </>
          )}

          {/* ASSOCIATE ROLE NAVIGATION */}
          {isLoggedIn && userRole === 'associate' && (
            <>
              <button 
                onClick={() => handleNav('associate-dashboard')} 
                className={`py-2 transition-colors flex items-center gap-1.5 ${
                  currentTab === 'associate-dashboard' 
                    ? 'text-amber-600 dark:text-amber-400 font-black border-b-2 border-amber-500' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                Associate Partner Portal
              </button>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

              <button 
                onClick={() => handleNav('home')} 
                className={`py-2 transition-colors ${
                  currentTab === 'home' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🌐 Public Website
              </button>
            </>
          )}

          {/* ADMIN ROLE NAVIGATION */}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <button 
                onClick={() => handleNav('admin')} 
                className={`py-2 transition-colors flex items-center gap-1.5 ${
                  currentTab === 'admin' 
                    ? 'text-cyan-600 dark:text-cyan-400 font-black border-b-2 border-cyan-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-500 font-bold'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-cyan-500" />
                Admin Governance
              </button>

              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" />

              <button 
                onClick={() => handleNav('home')} 
                className={`py-2 transition-colors ${
                  currentTab === 'home' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🌐 Public Website
              </button>
            </>
          )}

          {/* PUBLIC GUEST NAVIGATION */}
          {(!isLoggedIn || userRole === 'guest') && (
            <>
              <button 
                onClick={() => handleNav('home')} 
                className={`py-2 transition-colors ${
                  currentTab === 'home' || currentTab === 'hero' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Home
              </button>

              {/* NRI Division Link */}
              <button 
                onClick={() => handleNav('nri-division')}
                className={`flex items-center gap-1 py-2 transition-colors ${
                  currentTab === 'nri-division' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'text-emerald-700 dark:text-emerald-400 font-extrabold hover:text-emerald-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                NRI Services
              </button>

              <button 
                onClick={() => handleNav('property-division')} 
                className={`py-2 transition-colors ${
                  currentTab === 'property-division' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Property
              </button>

              <button 
                onClick={() => handleNav('club-resorts')} 
                className={`py-2 transition-colors ${
                  currentTab === 'club-resorts' || currentTab === 'events'
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Club & Resorts
              </button>

              <button 
                onClick={() => handleNav('membership')} 
                className={`py-2 transition-colors ${
                  currentTab === 'membership' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Membership
              </button>

              <button 
                onClick={() => handleNav('education-division')} 
                className={`py-2 transition-colors ${
                  currentTab === 'education-division' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Education
              </button>

              <button 
                onClick={() => handleNav('ai-tech-division')} 
                className={`py-2 transition-colors flex items-center gap-1 ${
                  currentTab === 'ai-tech-division' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'text-cyan-600 dark:text-cyan-400 font-extrabold hover:text-cyan-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                AI
              </button>

              <button 
                onClick={() => handleNav('careers')} 
                className={`py-2 transition-colors ${
                  currentTab === 'careers' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Careers
              </button>

              <button 
                onClick={() => handleNav('contact')} 
                className={`py-2 transition-colors ${
                  currentTab === 'contact' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold border-b-2 border-amber-400' 
                    : 'hover:text-emerald-700'
                }`}
              >
                Contact
              </button>
            </>
          )}

        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* Authenticated User Role Badge & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-cyan-100 text-cyan-900 border-cyan-400 dark:bg-cyan-950 dark:text-cyan-300'
                  : userRole === 'associate'
                  ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                <UserCheck className="w-3.5 h-3.5" />
                <span>[{userRole.toUpperCase()}] {loggedInUser || 'User'}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Log Out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('associate')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                Associate Portal
              </button>

              <button
                onClick={() => onOpenLogin('member')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                Login
              </button>
            </div>
          )}

          {/* Associate Enrollment CTA */}
          <button
            onClick={onOpenEnrollment}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Enroll Associate
          </button>

        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          {isLoggedIn ? (
            userRole === 'associate' ? (
              <button
                onClick={() => handleNav('associate-dashboard')}
                className="px-2.5 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                Partner Hub
              </button>
            ) : userRole === 'admin' ? (
              <button
                onClick={() => handleNav('admin')}
                className="px-2.5 py-1.5 text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-slate-950" />
                Admin Hub
              </button>
            ) : (
              <button
                onClick={() => handleNav('member-dashboard')}
                className="px-2.5 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                Member Hub
              </button>
            )
          ) : (
            <button
              onClick={() => onOpenLogin('member')}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg cursor-pointer"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-slate-700 dark:text-slate-200">
            {isLoggedIn ? (
              userRole === 'associate' ? (
                <>
                  <button onClick={() => handleNav('associate-dashboard')} className="text-left py-2 hover:text-amber-600 flex items-center gap-2 font-black text-amber-500">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    Associate Partner Hub & Leads
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                  <button onClick={() => handleNav('home')} className="text-left py-2 hover:text-amber-600 font-bold">
                    🌐 Browse Public Website
                  </button>
                </>
              ) : userRole === 'admin' ? (
                <>
                  <button onClick={() => handleNav('admin')} className="text-left py-2 hover:text-cyan-500 flex items-center gap-2 font-black text-cyan-500">
                    <Shield className="w-4 h-4 text-cyan-500" />
                    Admin Governance Portal
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                  <button onClick={() => handleNav('home')} className="text-left py-2 hover:text-cyan-500 font-bold">
                    🌐 Browse Public Website
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNav('member-dashboard')} className="text-left py-2 hover:text-emerald-700 flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    Dashboard & Enquiries
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                  <button onClick={() => handleNav('home')} className="text-left py-2 hover:text-emerald-700 font-bold">
                    🌐 Browse Public Website
                  </button>
                </>
              )
            ) : (
              <>
                <button onClick={() => handleNav('hero')} className="text-left py-2 hover:text-emerald-700">
                  Home
                </button>

                <button onClick={() => handleNav('nri-division')} className="text-left py-2 text-emerald-700 font-bold flex items-center justify-between">
                  <span>NRI Services</span>
                  <Globe className="w-4 h-4" />
                </button>

                <button onClick={() => handleNav('property-division')} className="text-left py-2 hover:text-emerald-700">
                  Property (Care & Resale)
                </button>

                <button onClick={() => handleNav('club-resorts')} className="text-left py-2 hover:text-emerald-700">
                  Club & Resorts
                </button>

                <button onClick={() => handleNav('membership')} className="text-left py-2 hover:text-emerald-700">
                  Membership Cards (Platinum, Gold, Silver)
                </button>

                <button onClick={() => handleNav('education-division')} className="text-left py-2 hover:text-emerald-700">
                  Education & Skill Academy
                </button>

                <button onClick={() => handleNav('ai-tech-division')} className="text-left py-2 text-cyan-600 font-bold flex items-center justify-between">
                  <span>AI</span>
                  <Cpu className="w-4 h-4 text-cyan-500" />
                </button>

                <button onClick={() => handleNav('careers')} className="text-left py-2 hover:text-emerald-700">
                  Career & Jobs
                </button>

                <button onClick={() => handleNav('contact')} className="text-left py-2 hover:text-emerald-700">
                  Contact & Branch Offices
                </button>
              </>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className={`px-3 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-between ${
                  userRole === 'associate'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80'
                    : userRole === 'admin'
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80'
                    : 'bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300'
                }`}>
                  <span className="truncate">
                    {userRole === 'associate' ? 'Partner: ' : userRole === 'admin' ? 'Admin: ' : 'Member: '}
                    {loggedInUser || 'Verified'}
                  </span>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full text-white shrink-0 ml-2 ${
                    userRole === 'associate' ? 'bg-amber-600' : userRole === 'admin' ? 'bg-cyan-600' : 'bg-emerald-600'
                  }`}>
                    {userRole}
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold text-xs rounded-xl text-center border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenEnrollment();
                  }}
                  className="w-full py-2.5 bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  Enroll as Associate
                </button>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin('associate');
                    }}
                    className="flex-1 py-2 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-black text-xs rounded-lg text-center cursor-pointer"
                  >
                    Partner Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin('member');
                    }}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg text-center cursor-pointer"
                  >
                    Member Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
