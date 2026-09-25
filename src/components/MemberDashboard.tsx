import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Video, FileText, Calendar, CreditCard, Download, 
  Eye, Clock, MapPin, CheckCircle2, User, Phone, Mail, Award, 
  ExternalLink, Sparkles, MessageSquare, AlertCircle, Building, 
  Camera, ArrowRight, RefreshCw, Layers, Send, Smartphone, Check, HelpCircle
} from 'lucide-react';
import { memberApi, MemberBookingRequest } from '../services/api';
import { MemberAccount, MemberAppAd, AdminLead } from '../types';
import { useUserMetadata } from '../hooks/useUserMetadata';

interface MemberDashboardProps {
  loggedInUser?: string | null;
  onOpenBookingModal?: (type: 'hotel' | 'resort' | 'event' | 'cab') => void;
  onShowToast?: (msg: string) => void;
  onNavigatePublic?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  loggedInUser,
  onOpenBookingModal,
  onShowToast,
  onNavigatePublic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'booking' | 'history' | 'inspections' | 'documents' | 'app'>('overview');
  
  // Real Member Metadata directly from Firestore via useUserMetadata
  const { 
    member, 
    displayName, 
    memberId, 
    email, 
    phone, 
    plotInfo, 
    tier, 
    kycStatus, 
    isVerified, 
    isLoading: userMetaLoading, 
    refetch: refetchUserMeta 
  } = useUserMetadata(loggedInUser);

  const [appAd, setAppAd] = useState<MemberAppAd | null>(null);
  const [myRequests, setMyRequests] = useState<AdminLead[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('July 2026');

  // Member Action Form State
  const [serviceType, setServiceType] = useState('Resort Staycation');
  const [preferredDate, setPreferredDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Sync member requests & app promo from Firestore
  useEffect(() => {
    let isMounted = true;
    const loadExtraData = async () => {
      try {
        if (memberId) {
          const reqs = await memberApi.getMemberRequests(memberId);
          if (isMounted) setMyRequests(reqs);
        }
        const ad = await memberApi.getAppAd();
        if (isMounted) setAppAd(ad);
      } catch (err) {
        console.error('Error loading member extra data from Firestore:', err);
      }
    };
    loadExtraData();
    return () => { isMounted = false; };
  }, [memberId]);

  // Handle Form Submission (Writes to Firestore and syncs with Admin queue)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveMemberId = member?.memberId || memberId;
    const effectiveMemberName = member?.name || displayName;
    const effectivePhone = member?.phone || phone;

    try {
      setIsSubmitting(true);
      const newRequest: MemberBookingRequest = {
        memberId: effectiveMemberId,
        memberName: effectiveMemberName,
        memberPhone: effectivePhone,
        serviceType,
        preferredDate: preferredDate || 'Immediate / Flexible',
        guestCount: Number(guestCount),
        notes: specialNotes || `Allotted Plot: ${plotInfo.plotNo} @ ${plotInfo.venture}`,
        status: 'Pending',
        formData: {
          'Member ID': effectiveMemberId,
          'Member Name': effectiveMemberName,
          'Phone': effectivePhone,
          'Membership Tier': `${tier} Card`,
          'Service Requested': serviceType,
          'Preferred Date': preferredDate || 'Flexible',
          'Guests': `${guestCount} Guests`,
          'Property Allotment': `${plotInfo.plotNo} (${plotInfo.venture})`,
          'Member Notes': specialNotes || 'None'
        }
      };

      await memberApi.submitRequest(newRequest);
      setFormSuccess(true);
      if (onShowToast) onShowToast(`Your ${serviceType} request has been recorded in the cloud!`);
      
      // Reset Form & Refresh History
      setPreferredDate('');
      setSpecialNotes('');
      if (effectiveMemberId) {
        const reqs = await memberApi.getMemberRequests(effectiveMemberId);
        setMyRequests(reqs);
      }
      refetchUserMeta();
      
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      if (onShowToast) onShowToast('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshRequests = async () => {
    try {
      const effectiveId = member?.memberId || memberId;
      if (effectiveId) {
        const reqs = await memberApi.getMemberRequests(effectiveId);
        setMyRequests(reqs);
      }
      refetchUserMeta();
      if (onShowToast) onShowToast('Dashboard refreshed from Firestore cloud!');
    } catch (err) {
      console.error('Error refreshing member data:', err);
    }
  };

  const handleDownloadEC = () => {
    if (onShowToast) onShowToast(`Downloading Form 15 Encumbrance Certificate for ${plotInfo.plotNo}...`);
  };

  const handleDownloadPassbook = () => {
    if (onShowToast) onShowToast(`Downloading Digital Land Passbook for ${displayName}...`);
  };

  if (userMetaLoading && !member) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-700" />
        <p className="text-sm font-semibold">Loading verified member cloud portal...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-serif">No Member Record in Database</h3>
        <p className="text-sm text-slate-600">
          No matching member record was found in the Firestore database for this account.
        </p>
        <div className="pt-2">
          <button
            onClick={() => refetchUserMeta()}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
          >
            Retry Database Query
          </button>
        </div>
      </div>
    );
  }

  const currentMember = member;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. PERSONALIZED WELCOME HEADER & MEMBERSHIP BADGE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {currentMember.tier} Tier Member
              </span>
              <span className="text-xs font-mono text-slate-500">
                ID: <strong className="text-slate-900">{currentMember.memberId}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className="text-emerald-700">{currentMember.name}</span>!
            </h1>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Allotted Plot: <strong className="text-slate-900">{currentMember.plotNo}</strong> @ {currentMember.venture} | Status: <span className="text-emerald-700 font-bold">{currentMember.status}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              {currentMember.staycationCredits} Complimentary Stay Credits Active
            </div>
            <button
              onClick={() => setActiveSubTab('booking')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service / Stay</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & PROPERTY ASSET SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Property Asset</span>
            <Building className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="font-bold text-base text-slate-900">
            {currentMember.plotNo}
          </div>
          <p className="text-[11px] text-slate-500">
            {currentMember.areaSqYd} Sq.Yds | {currentMember.venture}
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Digital Passbook</span>
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-bold text-base text-emerald-800">
            ₹{(currentMember.paidAmount / 100000).toFixed(2)} Lakhs Paid
          </div>
          <p className="text-[11px] text-slate-500">
            Total Value: ₹{(currentMember.totalAmount / 100000).toFixed(2)} Lakhs
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Complimentary Perks</span>
            <Award className="w-5 h-5 text-purple-700" />
          </div>
          <div className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {currentMember.staycationCredits} Nights Available
          </div>
          <p className="text-[11px] text-slate-500">
            {currentMember.tier} Membership Privileges
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Legal Title & EC</span>
            <FileText className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Form 15 Verified
          </div>
          <p className="text-[11px] text-slate-500">
            Reg: {currentMember.regNumber || 'Verified Clear Title'}
          </p>
        </div>

      </div>

      {/* 3. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Member Details</span>
        </button>

        <button
          onClick={() => setActiveSubTab('booking')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'booking'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Submit Service Form</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Request History ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inspections')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'inspections'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Plot Inspections</span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'documents'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Legal Vault (EC & Passbook)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: MEMBER OVERVIEW & PROFILE CARD */}
      {/* ======================================================== */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-700" />
                Verified Member Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Full Name</div>
                  <div className="text-slate-900 font-bold text-sm">{currentMember.name}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Membership Card No</div>
                  <div className="text-emerald-800 font-mono font-bold text-sm">{currentMember.memberId}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Registered Phone</div>
                  <div className="text-slate-900 font-mono font-bold">{currentMember.phone}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Email Address</div>
                  <div className="text-slate-900 font-semibold">{currentMember.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Allotted Property</div>
                  <div className="text-slate-900 font-bold">{currentMember.plotNo} ({currentMember.areaSqYd} Sq.Yds)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Venture / Project</div>
                  <div className="text-slate-900 font-bold">{currentMember.venture}</div>
                </div>
              </div>
            </div>

            {/* Quick Action Prompt to Booking */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-emerald-900">Need to book a staycation or request a site visit?</h4>
                <p className="text-xs text-slate-600">
                  Submit a quick service form and your assigned relationship manager will confirm within 2 hours.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('booking')}
                className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Submit Form Now
              </button>
            </div>
          </div>

          {/* Right Card: Digital Membership Card Display */}
          <div className="space-y-6">
            <div className="bg-emerald-800 border border-emerald-700 rounded-3xl p-6 text-white shadow-md space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span className="font-bold text-sm tracking-wider text-amber-300 uppercase">SVS {currentMember.tier} Pass</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-[10px] text-slate-200 uppercase font-bold tracking-widest">Card Holder</div>
                <div className="text-lg font-bold tracking-wide text-white">{currentMember.name}</div>
                <div className="font-mono text-xs text-amber-300 font-bold">{currentMember.memberId}</div>
              </div>

              <div className="border-t border-emerald-700/60 pt-4 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-200">Complimentary Stays</div>
                  <div className="font-bold text-amber-300">{currentMember.staycationCredits} Nights Left</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-200">Dining & Perks</div>
                  <div className="font-bold text-amber-300">15% Flat Off</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: MEMBER ACTION FORM (Syncs to Admin Leads Queue) */}
      {/* ======================================================== */}
      {activeSubTab === 'booking' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              Member Service & Staycation Request Form
            </h3>
            <p className="text-xs text-slate-600">
              Submit your request below. It will be recorded directly into the database and instantly synced to the Admin Dashboard.
            </p>
          </div>

          {formSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
              <span>Thank you! Your request was successfully submitted to the SVS Admin Concierge. You can track status in the "My Request History" tab.</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Member Name</label>
                <input
                  type="text"
                  value={currentMember.name}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Member ID</label>
                <input
                  type="text"
                  value={currentMember.memberId}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Service / Booking Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Resort Staycation">🌿 Complimentary Eco-Resort Staycation (Yadadri / Goa)</option>
                <option value="Personal Site Inspection Cab">🚗 Site Visit Cab Pickup for Allotted Plot</option>
                <option value="Clubhouse & Banquet Reservation">🎉 Clubhouse & Party Hall Reservation</option>
                <option value="Legal Document Attestation">📜 Certified Title & EC Document Verification</option>
                <option value="Plot Boundary Wall & Fencing">🧱 Boundary Wall & Precast Fencing Request</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Number of Guests</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Special Instructions / Preferences</label>
              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Vegetarian dining preference, late check-in requested, or specific pickup address..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request to Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: MY REQUEST HISTORY (Live 2-way sync with Admin) */}
      {/* ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                Live Request & Booking Status
              </h3>
              <p className="text-xs text-slate-600">
                Real-time tracking of all requests submitted through your member portal.
              </p>
            </div>
            <button
              onClick={handleRefreshRequests}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Refresh Status from DB"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <div className="font-bold text-sm text-slate-900">No active requests found</div>
              <p className="text-xs text-slate-500">You haven't submitted any staycation or service requests yet.</p>
              <button
                onClick={() => setActiveSubTab('booking')}
                className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Submit Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div 
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-700">#{req.id}</span>
                      <span className="font-bold text-slate-900">{req.service}</span>
                    </div>
                    <p className="text-slate-600">
                      Date: {req.date} {req.preferredDate ? `| Preferred: ${req.preferredDate}` : ''}
                    </p>
                    {req.adminNotes && (
                      <div className="text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-1">
                        Admin Note: {req.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                      req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      req.status === 'Contacted' || req.status === 'In Review' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      req.status === 'Site Visit Scheduled' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 4: MONTHLY INSPECTIONS */}
      {/* ======================================================== */}
      {activeSubTab === 'inspections' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-700" />
                Monthly Plot Verification & Drone Inspection
              </h3>
              <p className="text-xs text-slate-600">
                Geo-tagged high-resolution photos and supervisor inspection log for {currentMember.plotNo}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Inspection Period:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                <option value="July 2026">July 2026 (Latest Audit)</option>
                <option value="June 2026">June 2026 (Drone Sweep)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" 
                alt="Plot Inspection Ground Photo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl text-xs font-mono font-bold text-emerald-800 border border-slate-200 flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                INSPECTION VERIFIED — {selectedMonth.toUpperCase()}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-bold text-slate-900 text-sm">Supervisor Audit Checklist</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PASSED ALL CHECKS
                </span>
              </div>

              <div className="space-y-2.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Boundary Pillars & Corner Stones:</span>
                  <span className="text-emerald-800 font-bold">Intact & Numbered</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Weed & Vegetation Clearance:</span>
                  <span className="text-emerald-800 font-bold">Cleared on Schedule</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Approach Road Status:</span>
                  <span className="text-emerald-800 font-bold">40ft BT Road Pristine</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Encroachment Status:</span>
                  <span className="text-emerald-800 font-bold">0 Encroachments (100% Secure)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 5: LEGAL VAULT (EC & PASSBOOK) */}
      {/* ======================================================== */}
      {activeSubTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              Verified Legal Title & Encumbrance Certificate Vault
            </h3>
            <p className="text-xs text-slate-600">
              Government-verified land documentation and legal clearance certificates for {currentMember.plotNo}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-800">
                  Certified Document #01
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Form 15 Encumbrance Certificate (EC)</h4>
              <p className="text-xs text-slate-600">
                100% Legal Clear Title verified by Sub-Registrar Office ({currentMember.regNumber || 'Certified'}).
              </p>
              <button
                onClick={handleDownloadEC}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Download className="w-4 h-4" /> <span>Download Official EC PDF</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-800">
                  Certified Document #02
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Digital Land Passbook & Installments</h4>
              <p className="text-xs text-slate-600">
                Official stamped allotment ledger showing ₹{(currentMember.paidAmount / 100000).toFixed(2)} Lakhs paid.
              </p>
              <button
                onClick={handleDownloadPassbook}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Download className="w-4 h-4" /> <span>Download Passbook Ledger</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DYNAMIC MEMBER APP AD / PROMO SECTION */}
      {/* ======================================================== */}
      {appAd && appAd.isActive && (
        <div className="bg-emerald-800 border border-emerald-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold inline-block">
                {appAd.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {appAd.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {appAd.subtitle}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-emerald-200">
                {appAd.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 shrink-0">
              <a
                href={appAd.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Get Member App</span>
              </a>
              <span className="text-[10px] text-emerald-200">Available for iOS & Android</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
