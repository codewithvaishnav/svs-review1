import React, { useState } from 'react';
import { 
  ShieldCheck, Building, CreditCard, Calendar, Award, 
  ExternalLink, Sparkles, ArrowRight, FileText, Camera,
  MapPin, CheckCircle2, AlertCircle, Phone, RefreshCw,
  MessageSquare, Send, Clock, CheckCircle, Plus, X, UserCheck, Inbox,
  Smartphone, Download, Star
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';
import { firestoreService } from '../../services/firestoreService';

interface MemberHomeProps {
  loggedInUser?: string | null;
  onNavigateTab: (tab: string) => void;
  onOpenBookingModal?: (type: 'hotel' | 'resort' | 'event' | 'cab') => void;
  onShowToast?: (msg: string) => void;
  onNavigatePublic?: () => void;
}

export const MemberHome: React.FC<MemberHomeProps> = ({
  loggedInUser,
  onNavigateTab,
  onOpenBookingModal,
  onShowToast,
  onNavigatePublic,
}) => {
  const { 
    displayName: userName, 
    memberId, 
    plotInfo, 
    tier, 
    member,
    isLoading 
  } = useUserMetadata(loggedInUser);

  // State for the bottom Universal Member Enquiry & Support Desk
  const [enquiryCategory, setEnquiryCategory] = useState<'General Enquiry & Site Visit Scheduling' | 'Plot Title, Form 15 EC & HMDA Legal Verification' | 'Club Resort & 2-Night Staycation Credit Booking' | 'Payment Ledger, EMI Receipt & Statement Request' | 'Supervisor Inspection & Drone Audit Photos' | 'Missing Feature or Custom Assistance Request'>('General Enquiry & Site Visit Scheduling');
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryPriority, setEnquiryPriority] = useState<'Standard (Within 24 Hours)' | 'Urgent (Within 4 Hours)' | 'Immediate Callback Required'>('Standard (Within 24 Hours)');
  const [enquiryContactMode, setEnquiryContactMode] = useState<'Phone Call from Support' | 'WhatsApp Message' | 'Email Update' | 'In-Portal Notification'>('Phone Call from Support');
  const [enquiryPreferredTime, setEnquiryPreferredTime] = useState<'Morning (10:00 AM - 1:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)' | 'Evening (5:00 PM - 8:00 PM)' | 'Anytime / As Soon As Possible'>('Morning (10:00 AM - 1:00 PM)');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquirySubject.trim() || !enquiryMessage.trim()) {
      if (onShowToast) onShowToast('Please enter both subject and detailed message.');
      return;
    }

    const ref = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRefId(ref);
    setEnquirySubmitted(true);

    // Persist real enquiry to Firestore leads / inquiries collection
    try {
      await firestoreService.addLead({
        id: ref,
        name: userName,
        phone: member?.phone || '+91 98490 55432',
        email: member?.email || 'member@svssrivasudha.com',
        category: enquiryCategory,
        service: enquirySubject,
        status: 'New',
        source: 'Member Portal Support Desk',
        notes: `[${enquiryPriority}] Preferred Mode: ${enquiryContactMode} (${enquiryPreferredTime}). Plot: ${plotInfo.plotNo} @ ${plotInfo.venture}. Message: ${enquiryMessage}`,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        formData: {
          'Member ID': memberId,
          'Member Name': userName,
          'Priority': enquiryPriority,
          'Contact Mode': enquiryContactMode,
          'Preferred Time': enquiryPreferredTime,
          'Category': enquiryCategory,
          'Subject': enquirySubject,
          'Message': enquiryMessage,
        }
      });
    } catch (err) {
      console.warn('Could not save enquiry to Firestore:', err);
    }

    if (onShowToast) onShowToast(`Your enquiry (${ref}) has been submitted to the SVS Admin & Support Desk!`);
  };

  const handleResetEnquiryForm = () => {
    setEnquirySubject('');
    setEnquiryMessage('');
    setEnquirySubmitted(false);
    setSubmittedRefId('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Personalized Welcome Header */}
      <div className="bg-emerald-800 border border-emerald-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              {tier} Member Portal
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, <span className="text-amber-300">{userName}</span>!
            </h1>
            
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Member ID: <strong className="text-white font-mono">{memberId}</strong> | Allotted Plot: <strong className="text-amber-300">{plotInfo.plotNo}</strong> @ {plotInfo.venture}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => { if (onShowToast) onShowToast('Redeem your Staycation credits anytime via the official SVS Mobile App!'); }}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              {plotInfo.staycationCredits} Staycation Credits Active
            </button>
          </div>
        </div>
      </div>

      {/* 1. Plot Allotment & Audit Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Plot Allotment & Audit Overview
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Venture Location</span>
            <div className="font-bold text-slate-900 text-sm">{plotInfo.venture}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Plot Number & Facing</span>
            <div className="font-bold text-emerald-800 text-sm">{plotInfo.plotNo}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Approval / Registration LP No.</span>
            <div className="font-mono font-bold text-slate-900 text-xs">{plotInfo.regNumber}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Next Installment Due</span>
            <div className="font-bold text-amber-700 text-xs">
              {plotInfo.nextEmiDueDate} {plotInfo.nextEmiAmount > 0 ? `(₹${plotInfo.nextEmiAmount.toLocaleString('en-IN')})` : ''}
            </div>
          </div>
        </div>

        {/* Progress & Quick Property Highlight */}
        {(() => {
          const paidLakhs = (plotInfo.paidAmount / 100000).toFixed(2);
          const totalLakhs = (plotInfo.totalAmount / 100000).toFixed(2);
          const percentPaid = plotInfo.totalAmount > 0 
            ? Math.min(100, Math.round((plotInfo.paidAmount / plotInfo.totalAmount) * 100))
            : 0;

          return (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  {percentPaid}%
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    ₹{paidLakhs} Lakhs paid of ₹{totalLakhs} Lakhs • {member?.kycStatus === 'Verified' ? 'HMDA / DTCP Title Verified' : `${member?.kycStatus || 'Verification In Progress'}`}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {plotInfo.documentStatus || 'Encumbrance Certificate & digital passbook updated.'}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. INLINE UNIVERSAL MEMBER ENQUIRY & SUPPORT DESK FORM */}
      <div id="member-enquiry-form" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              Comprehensive Member Desk
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Universal Member Enquiry & Support Form
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Submit any enquiry, document request, site visit scheduling, or support inquiry directly to the SVS Admin & Member Support Desk.
            </p>
          </div>
        </div>

        {enquirySubmitted ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase text-emerald-800">
                Acknowledgement Ref: {submittedRefId}
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                Enquiry Successfully Received by Admin & Support Desk
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                The <strong className="text-slate-900">SVS Member Support Desk</strong> has been notified regarding <strong className="text-emerald-800">{enquirySubject}</strong>. We will reach out to you via <strong className="text-slate-900">{enquiryContactMode}</strong> during your preferred window (<strong className="text-slate-900">{enquiryPreferredTime}</strong>).
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetEnquiryForm}
                className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Submit Another Enquiry / Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendEnquiry} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Field 1: Enquiry Category / Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Enquiry Category / Type <span className="text-emerald-700">*</span>
                </label>
                <select
                  value={enquiryCategory}
                  onChange={(e) => setEnquiryCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="General Enquiry & Site Visit Scheduling">General Enquiry & Site Visit Scheduling</option>
                  <option value="Plot Title, Form 15 EC & HMDA Legal Verification">Plot Title, Form 15 EC & HMDA Legal Verification</option>
                  <option value="Club Resort & 2-Night Staycation Credit Booking">Club Resort & 2-Night Staycation Credit Booking</option>
                  <option value="Payment Ledger, EMI Receipt & Statement Request">Payment Ledger, EMI Receipt & Statement Request</option>
                  <option value="Supervisor Inspection & Drone Audit Photos">Supervisor Inspection & Drone Audit Photos</option>
                  <option value="Missing Feature or Custom Assistance Request">Other / Missing Feature or Custom Assistance Request</option>
                </select>
              </div>

              {/* Field 2: Plot Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Plot / Member Reference
                </label>
                <input
                  type="text"
                  readOnly
                  value={`Plot #15 - Royal City Phase 1 (${memberId})`}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Field 3: Priority Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Priority Level <span className="text-emerald-700">*</span>
                </label>
                <select
                  value={enquiryPriority}
                  onChange={(e) => setEnquiryPriority(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="Standard (Within 24 Hours)">Standard (Within 24 Hours)</option>
                  <option value="Urgent (Within 4 Hours)">Urgent (Within 4 Hours)</option>
                  <option value="Immediate Callback Required">Immediate Callback Required</option>
                </select>
              </div>

              {/* Field 4: Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Preferred Contact Method <span className="text-emerald-700">*</span>
                </label>
                <select
                  value={enquiryContactMode}
                  onChange={(e) => setEnquiryContactMode(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="Phone Call from Support">Phone Call from Support</option>
                  <option value="WhatsApp Message">WhatsApp Message</option>
                  <option value="Email Update">Email Update</option>
                  <option value="In-Portal Notification">In-Portal Notification</option>
                </select>
              </div>

              {/* Field 5: Preferred Callback Window */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  5. Preferred Callback / Contact Window
                </label>
                <select
                  value={enquiryPreferredTime}
                  onChange={(e) => setEnquiryPreferredTime(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  <option value="Anytime / As Soon As Possible">Anytime / As Soon As Possible</option>
                </select>
              </div>

              {/* Field 6: Subject / Request Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6. Subject / Request Title <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request for Form 15 EC or Sunday site inspection"
                  value={enquirySubject}
                  onChange={(e) => setEnquirySubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

            </div>

            {/* Field 7: Detailed Message / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                7. Detailed Message / Description <span className="text-emerald-700">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your enquiry, missing document, site inspection dates, or resort booking dates. The SVS Support Team will acknowledge within 2 hours..."
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 font-medium">
                🔒 Logged under reference <strong className="text-slate-800">{memberId}</strong>.
              </p>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Enquiry
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. SVS Official Mobile App Poster Card */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
            <Smartphone className="w-3 h-3 text-emerald-700" />
            Official SVS App
          </div>
          <div className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            4.9 Rating
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold tracking-tight text-slate-900 mb-1">
            All Member Options Available on the App
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download on Google Play Store & Apple App Store for complete offline & live access to your property portfolio.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>My Properties & Legal Vault</strong> (Form 15 EC & HMDA Deeds)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Club & Resort Bookings</strong> (Redeem Staycation Credits)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>EMI Passbook & Receipts</strong> (Live payment ledger)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-sm">
          <button
            onClick={() => { if (onShowToast) onShowToast('Opening SVS Official App on Google Play Store...'); }}
            className="py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Play Store
          </button>
          <button
            onClick={() => { if (onShowToast) onShowToast('Opening SVS Official App on Apple App Store...'); }}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            App Store
          </button>
        </div>
      </div>

    </div>
  );
};
