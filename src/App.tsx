import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FlagTicker } from './components/FlagTicker';
import { HomeSection } from './components/HomeSection';
import { MembershipSection } from './components/MembershipSection';
import { NriServicesSection } from './components/NriServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ClubResortsSection } from './components/ClubResortsSection';
import { DivisionsSection } from './components/DivisionsSection';
import { PropertySection } from './components/PropertySection';
import { EducationSection } from './components/EducationSection';
import { AiTechSection } from './components/AiTechSection';
import { CareerSection } from './components/CareerSection';
import { HousingSection } from './components/HousingSection';
import { ContactBranchSection } from './components/ContactBranchSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdminPortalSection } from './components/AdminPortalSection';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberHome } from './components/member/MemberHome';
import { MemberPortfolio } from './components/member/MemberPortfolio';
import { MemberPrivileges } from './components/member/MemberPrivileges';
import { MemberBookings } from './components/member/MemberBookings';
import { MemberPayments } from './components/member/MemberPayments';
import { MemberVault } from './components/member/MemberVault';
import { MemberProfile } from './components/member/MemberProfile';
import { AssociateDashboard } from './components/AssociateDashboard';
import { Footer } from './components/Footer';

import { AssociateEnrollModal } from './components/AssociateEnrollModal';
import { LoginModal } from './components/LoginModal';
import { BookingModal } from './components/BookingModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AiChatbot } from './components/AiChatbot';
import { PageAboutBanner } from './components/common/PageAboutBanner';
import { HowItWorksFaqSection } from './components/common/HowItWorksFaqSection';
import { pageGuides } from './data/pageGuides';

import { Project } from './types';
import { UserRole } from './lib/rbac';
import { CheckCircle2, FileText, X, Building2, Globe, Sparkles, CreditCard, Palmtree, GraduationCap, Briefcase, Home as HomeIcon, MapPin } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedNriCountry, setSelectedNriCountry] = useState('Singapore');
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'member' | 'associate' | 'admin'>('member');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'hotel' | 'resort' | 'event' | 'cab' | 'site-inspection'>('hotel');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const [contactService, setContactService] = useState<string>('DTCP & HMDA Plot Purchase Inquiry');
  const [contactMessage, setContactMessage] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigate = (sectionId: string) => {
    let targetTab = sectionId;
    if (sectionId === 'hero') targetTab = 'home';
    if (sectionId === 'resorts') targetTab = 'club-resorts';
    if (sectionId === 'projects' || sectionId === 'housing') targetTab = 'property-division';

    setCurrentTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = (role: 'member' | 'associate' | 'admin') => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (role: 'member' | 'associate' | 'admin', username: string, memberId?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    // For members, pass the explicit memberId if available (e.g. SVS-PLT-2024-8890) or username
    const identifier = memberId || username;
    setLoggedInUser(identifier);

    if (role === 'admin') {
      setCurrentTab('admin');
      showToast(`Logged in as ADMIN (${username}). Admin Governance Portal unlocked!`);
    } else if (role === 'member') {
      setCurrentTab('member-dashboard');
      showToast(`Welcome ${username}! Dedicated Member Dashboard unlocked.`);
    } else if (role === 'associate') {
      setCurrentTab('associate-dashboard');
      showToast(`Welcome Partner ${username}! Dedicated Associate Portal unlocked.`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('guest');
    setLoggedInUser(null);
    setCurrentTab('home');
    showToast('Logged out successfully.');
  };

  const handleSwitchRole = (role: UserRole | 'logout', username?: string) => {
    if (role === 'logout' || role === 'guest') {
      setIsLoggedIn(false);
      setUserRole('guest');
      setLoggedInUser(null);
      showToast('Switched session to Guest (Implicit Default Public Role).');
    } else {
      setIsLoggedIn(true);
      setUserRole(role);
      setLoggedInUser(username || `${role.toUpperCase()}-USER`);
      showToast(`Switched session role to ${role.toUpperCase()}. RBAC matrix updated.`);
    }
  };

  const handleOpenBooking = (type: 'hotel' | 'resort' | 'event' | 'cab' | 'site-inspection') => {
    setBookingType(type);
    setIsBookingOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadBrochure = () => {
    showToast('Downloading SVS Srivasudha Official Brochure PDF...');
  };

  const handleProjectSelect = (project: Project) => {
    showToast(`Inquiry initiated for ${project.title} (${project.zone}). Our executive will reach out!`);
    handleNavigate('contact');
  };

  const handleApplyJob = (jobTitle: string) => {
    showToast(`Application started for ${jobTitle}. Please fill the contact form or enroll as an associate.`);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:text-amber-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navbar Header */}
      <Navbar
        currentTab={currentTab}
        onOpenLogin={handleOpenLogin}
        onOpenEnrollment={() => setIsEnrollmentOpen(true)}
        onNavigate={handleNavigate}
        selectedNriCountry={selectedNriCountry}
        onSelectNriCountry={setSelectedNriCountry}
        onDownloadBrochure={handleDownloadBrochure}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* Main Active Page View */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomeSection
            onNavigate={handleNavigate}
            onOpenEnrollment={() => setIsEnrollmentOpen(true)}
            onDownloadBrochure={handleDownloadBrochure}
            onOpenBookingModal={handleOpenBooking}
            selectedNriCountry={selectedNriCountry}
          />
        )}

        {(currentTab === 'projects' || currentTab === 'property-division') && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Property Division"
              title="SVS Sri Vasudha Property Division"
              subtitle="20+ Years Trust • Approved Open Plots & Farmlands"
              description="Delivering DTCP, HMDA, and RERA-approved venture plots across Hyderabad's key growth corridors including Shadnagar, Yadadri, Shamshabad, and Pharma City with 100% clear titles, spot registration, and transparent resale care."
              icon={Building2}
              accentColor="emerald"
              stats={[
                { label: 'Plotted Ventures', value: '45+' },
                { label: 'Happy Plot Owners', value: '10,000+' },
                { label: 'Approval Rate', value: '100%' }
              ]}
            />
            <PropertySection
              onOpenBookingModal={handleOpenBooking}
              onDownloadBrochure={handleDownloadBrochure}
              onOpenLogin={(role) => handleOpenLogin(role || 'member')}
              isLoggedIn={isLoggedIn}
            />
            <HowItWorksFaqSection
              {...pageGuides.property}
            />
          </div>
        )}

        {currentTab === 'education-division' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Education Division"
              title="SVS Skill Academy & Training"
              subtitle="Professional Real Estate & Digital Skill Pathways"
              description="Empowering real estate advisors, associates, and aspiring youth with certified training programs, market analytics, legal compliance literacy, and digital property sales toolkits."
              icon={GraduationCap}
              accentColor="indigo"
              stats={[
                { label: 'Certified Associates', value: '2,500+' },
                { label: 'Training Modules', value: '12' },
                { label: 'Placement Rate', value: '94%' }
              ]}
            />
            <EducationSection
              onApplyStudent={() => {
                setContactService('SVS Student Admission & Scholarship Application');
                setContactMessage('I am interested in applying for SVS Skill Training / Student Scholarship.');
                handleNavigate('contact');
              }}
            />
          </div>
        )}

        {currentTab === 'ai-tech-division' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About AI Technology"
              title="SVS Smart AI Intelligence Suite"
              subtitle="Algorithmic Property Insights & 24/7 Virtual Assistance"
              description="Proprietary AI engines providing instant land valuation, multi-year corridor ROI projections, automated legal checklist validations, and multilingual investor guidance."
              icon={Sparkles}
              accentColor="cyan"
              stats={[
                { label: 'Instant Valuations', value: '< 2s' },
                { label: 'Predictive Accuracy', value: '98.4%' },
                { label: 'Inquiries Handled', value: '50k+' }
              ]}
            />
            <AiTechSection onOpenBookingModal={handleOpenBooking} />
          </div>
        )}

        {currentTab === 'nri-division' && (
          <div>
            <FlagTicker
              selectedCountry={selectedNriCountry}
              onSelectCountry={(country) => {
                setSelectedNriCountry(country);
              }}
            />
            <div className="py-6">
              <PageAboutBanner
                badge="About NRI Services"
                title="SVS Global NRI Investor & Care Desk"
                subtitle="Property Advisory & Investment Support for NRIs"
                description="Dedicated support for overseas buyers with verified open plots, transparent documentation, and regular property updates across Hyderabad corridors."
                icon={Globe}
                accentColor="emerald"
                stats={[
                  { label: 'Global NRI Clients', value: '3,200+' },
                  { label: 'Country Desks', value: '15+' },
                  { label: 'Verified Plots', value: '100%' }
                ]}
              />
              <NriServicesSection
                selectedCountryName={selectedNriCountry}
                onSelectCountry={setSelectedNriCountry}
                onOpenConsultation={() => handleNavigate('contact')}
              />
              <HowItWorksFaqSection
                {...pageGuides.nri}
              />
            </div>
          </div>
        )}

        {currentTab === 'membership' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Membership Cards"
              title="SVS Privilege Membership Program"
              subtitle="Cardholder Benefits & Special Privileges"
              description="Privilege cards offering special discounts on new venture plots, complimentary resort stays, and priority support for families."
              icon={CreditCard}
              accentColor="amber"
              stats={[
                { label: 'Active Cardholders', value: '5,000+' },
                { label: 'Resort Stays Included', value: 'Yes' },
                { label: 'Venture Discounts', value: 'Exclusive' }
              ]}
            />
            <MembershipSection
              onDownloadBrochure={handleDownloadBrochure}
              onApplyCard={(tier) => {
                setContactService('SVS Privilege Membership Card Application');
                setContactMessage(`I am interested in applying for the SVS ${tier} Privilege Membership Card.`);
                handleNavigate('contact');
              }}
            />
            <HowItWorksFaqSection
              {...pageGuides.membership}
            />
          </div>
        )}

        {(currentTab === 'club-resorts' || currentTab === 'events') && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Club & Resorts"
              title="SVS Hospitality & Resorts"
              subtitle="Staycations, Banquets & Member Events"
              description="Eco-resorts, clubhouse suites, swimming pools, banquet lawns, and annual gatherings curated for SVS members and families."
              icon={Palmtree}
              accentColor="amber"
              stats={[
                { label: 'Partner Resorts', value: '3 Major' },
                { label: 'Banquet Capacity', value: '2,000+' },
                { label: 'Member Discounts', value: 'Available' }
              ]}
            />
            <ClubResortsSection
              onOpenBookingModal={handleOpenBooking}
              onNavigate={handleNavigate}
            />
            <HowItWorksFaqSection
              {...pageGuides.clubResorts}
            />
          </div>
        )}

        {currentTab === 'divisions' && (
          <div className="py-6">
            <DivisionsSection
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentTab === 'careers' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Careers at SVS"
              title="Build Your Career With SVS Srivasudha"
              subtitle="Culture of Integrity, High Incentives & Rapid Growth"
              description="Join one of Telangana & Andhra Pradesh's most trusted real estate enterprises. We offer industry-leading commissions, leadership development, marketing toolkits, and clear promotion ladders."
              icon={Briefcase}
              accentColor="rose"
              stats={[
                { label: 'Active Team', value: '450+' },
                { label: 'Avg. Associate Growth', value: '3.5x' },
                { label: 'Weekly Payouts', value: '100%' }
              ]}
            />
            <CareerSection
              onOpenEnrollment={() => setIsEnrollmentOpen(true)}
              onApplyJob={handleApplyJob}
            />
          </div>
        )}

        {currentTab === 'housing' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About Housing & Living"
              title="SVS Gated Communities & Living"
              subtitle="Ready & Semi-Finished Villas, Farmhouses & Apartments"
              description="Discover premium gated villas and custom farmhouse developments built with eco-friendly infrastructure, smart security, and lush green landscaping."
              icon={HomeIcon}
              accentColor="emerald"
              stats={[
                { label: 'Completed Communities', value: '15+' },
                { label: 'Families Residing', value: '1,800+' },
                { label: 'Green Cover', value: '40%' }
              ]}
            />
            <HousingSection
              onOpenConsultation={() => handleNavigate('contact')}
              onDownloadBrochure={handleDownloadBrochure}
            />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="py-6">
            <PageAboutBanner
              badge="About SVS Network"
              title="SVS Branch & Client Support Hub"
              subtitle="Corporate HQ, Regional Centers & Helpdesk"
              description="Visit our corporate headquarters in KPHB Colony, Hyderabad or reach out to our regional branch desks across Telangana and Andhra Pradesh for in-person advisory."
              icon={MapPin}
              accentColor="emerald"
              stats={[
                { label: 'Corporate HQ', value: 'Hyderabad' },
                { label: 'Branch Offices', value: '6' },
                { label: 'Direct Helpline', value: '24/7' }
              ]}
            />
            <ContactBranchSection 
              initialService={contactService}
              initialMessage={contactMessage}
            />
          </div>
        )}

        {currentTab === 'member-dashboard' && (
          <div className="py-6">
            <MemberHome
              loggedInUser={loggedInUser}
              onNavigateTab={handleNavigate}
              onOpenBookingModal={handleOpenBooking}
              onShowToast={showToast}
              onNavigatePublic={() => setCurrentTab('home')}
            />
          </div>
        )}

        {currentTab === 'member-portfolio' && (
          <div className="py-6">
            <MemberPortfolio
              loggedInUser={loggedInUser}
              onShowToast={showToast}
              onNavigateTab={handleNavigate}
            />
          </div>
        )}

        {currentTab === 'member-privileges' && (
          <div className="py-6">
            <MemberPrivileges
              loggedInUser={loggedInUser}
              onShowToast={showToast}
              onNavigateTab={handleNavigate}
            />
          </div>
        )}

        {currentTab === 'member-bookings' && (
          <div className="py-6">
            <MemberBookings
              loggedInUser={loggedInUser}
              onOpenBookingModal={handleOpenBooking}
              onShowToast={showToast}
            />
          </div>
        )}

        {currentTab === 'member-payments' && (
          <div className="py-6">
            <MemberPayments
              loggedInUser={loggedInUser}
              onShowToast={showToast}
            />
          </div>
        )}

        {currentTab === 'member-vault' && (
          <div className="py-6">
            <MemberVault
              loggedInUser={loggedInUser}
              onShowToast={showToast}
            />
          </div>
        )}

        {currentTab === 'member-profile' && (
          <div className="py-6">
            <MemberProfile
              loggedInUser={loggedInUser}
              onShowToast={showToast}
            />
          </div>
        )}

        {currentTab === 'associate-dashboard' && (
          <div className="py-6">
            <AssociateDashboard
              loggedInUser={loggedInUser}
              onShowToast={showToast}
              onNavigatePublic={() => setCurrentTab('home')}
            />
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="py-6">
            <AdminDashboard 
              onLogout={handleLogout}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onDownloadBrochure={handleDownloadBrochure}
        onOpenLogin={handleOpenLogin}
        onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
        onOpenEnrollment={() => setIsEnrollmentOpen(true)}
      />

      {/* Modals */}
      <AssociateEnrollModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        onOpenLogin={() => {
          setIsEnrollmentOpen(false);
          handleOpenLogin('associate');
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialRole={loginRole}
        onLoginSuccess={handleLoginSuccess}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        loggedInUser={loggedInUser}
        onNavigateToDashboard={(role) => {
          if (role === 'admin') handleNavigate('admin');
          else if (role === 'member') handleNavigate('member-dashboard');
          else if (role === 'associate') handleNavigate('associate-dashboard');
        }}
        onOpenEnrollment={() => {
          setIsLoginOpen(false);
          setIsEnrollmentOpen(true);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingType={bookingType}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* SVS AI Concierge Floating Chatbot */}
      <AiChatbot
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        loggedInUser={loggedInUser}
      />

    </div>
  );
}

export default App;
