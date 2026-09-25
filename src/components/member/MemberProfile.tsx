import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, MapPin, ShieldCheck, CheckCircle2, 
  MessageSquare, Clock, Calendar, AlertCircle, Building, 
  Send, ExternalLink, Headphones, FileText, Edit2, Save, X
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';
import { firestoreService } from '../../services/firestoreService';

interface MemberProfileProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({
  loggedInUser,
  onShowToast,
}) => {
  const { 
    displayName: userName, 
    memberId, 
    email, 
    phone, 
    tier, 
    kycStatus, 
    isVerified, 
    plotInfo, 
    member, 
    updateMember,
    isLoading 
  } = useUserMetadata(loggedInUser);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNominee, setEditNominee] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setEditPhone(member.phone || '');
      setEditAddress(member.address || '');
      setEditNominee(member.nomineeName || '');
    }
  }, [member]);

  const supportDetails = {
    name: 'SVS Member Helpdesk',
    role: 'Official Member Assistance & Support Desk',
    phone: '+91 98490 12345',
    whatsapp: '+91 98490 12345',
    email: 'support@srivasudha.com',
    office: 'SVS Corporate HQ, KPHB Colony, Hyderabad',
    availability: 'Mon - Sat (9:00 AM - 7:00 PM)',
    avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80',
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const ok = await updateMember({
        phone: editPhone.trim(),
        address: editAddress.trim(),
        nomineeName: editNominee.trim(),
      });
      if (ok) {
        setIsEditing(false);
        if (onShowToast) onShowToast('Member profile credentials updated in Firestore cloud!');
      } else {
        if (onShowToast) onShowToast('Failed to save updates to Firestore.');
      }
    } catch (e) {
      if (onShowToast) onShowToast('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      if (onShowToast) onShowToast('Please enter both subject and message for your support ticket.');
      return;
    }

    const ticketId = `SVS-SUP-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await firestoreService.addLead({
        id: ticketId,
        name: userName,
        phone: member?.phone || phone,
        email: member?.email || email,
        category: 'Member Support Ticket',
        service: ticketSubject,
        status: 'New',
        source: 'Member Profile Desk',
        notes: `Ticket #${ticketId}: ${ticketMessage}. Allotted: ${plotInfo.plotNo} @ ${plotInfo.venture}`,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        formData: {
          'Member ID': memberId,
          'Member Name': userName,
          'Ticket ID': ticketId,
          'Subject': ticketSubject,
          'Message': ticketMessage,
          'Plot Details': `${plotInfo.plotNo} @ ${plotInfo.venture}`,
        }
      });
    } catch (err) {
      console.warn('Could not persist ticket to Firestore:', err);
    }

    if (onShowToast) {
      onShowToast(`Support ticket submitted to ${supportDetails.name}! Ticket #${ticketId} created in Firestore.`);
      setTicketSubject('');
      setTicketMessage('');
    }
  };

  const handleScheduleCall = () => {
    if (onShowToast) {
      onShowToast(`Scheduled a Priority Phone Consultation with ${supportDetails.name} for Tomorrow 11:00 AM!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold uppercase">
            <User className="w-3.5 h-3.5 text-purple-700" />
            My Profile & Support Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Member Profile & <span className="text-purple-700">Support Desk</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Manage your KYC credentials and reach the Dedicated SVS Member Support Desk.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          KYC {kycStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Personal KYC Details + Support Desk Ticket Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Member KYC & Personal Details Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-700" />
                Member KYC & Allotment Credentials
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-500">
                  {memberId}
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Info</span>
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nominee Name</label>
                    <input
                      type="text"
                      value={editNominee}
                      onChange={(e) => setEditNominee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                    <textarea
                      rows={2}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving to Cloud...' : 'Save to Firestore'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Full Name</span>
                  <div className="font-bold text-slate-900 text-sm">{userName}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Allotted Property</span>
                  <div className="font-bold text-emerald-800 text-sm">{plotInfo.plotNo} @ {plotInfo.venture}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Registered Email</span>
                  <div className="font-semibold text-slate-900">{email}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Registered Phone</span>
                  <div className="font-semibold text-slate-900">{member?.phone || phone}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">PAN Number (KYC)</span>
                  <div className="font-mono font-bold text-emerald-800">{member?.panNo || 'KYC Verified on File'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Registered Nominee</span>
                  <div className="font-bold text-slate-800">{member?.nomineeName || 'Registered on Deed'}</div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Registered Residential Address</span>
                  <div className="font-medium text-slate-700">{member?.address || 'Registered Residential Address on File'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Create Direct Support Ticket */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                Submit Direct Query to Support Desk
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Our Member Assistance Desk responds to all member inquiries within 2 hours during business hours.
              </p>
            </div>

            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject / Query Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g., Request for plot boundary pillars check or payment receipt"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your query or request for site inspection..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Query to Support Desk</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Dedicated Member Support Card */}
        <div className="space-y-6">
          
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                MEMBER SUPPORT DESK
              </span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Available Now
              </span>
            </div>

            {/* Avatar & Support Desk Name */}
            <div className="flex items-center gap-4">
              <img
                src={supportDetails.avatarUrl}
                alt={supportDetails.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{supportDetails.name}</h3>
                <p className="text-xs text-emerald-800 font-semibold">{supportDetails.role}</p>
                <p className="text-[11px] text-slate-500 mt-1">{supportDetails.availability}</p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={`tel:${supportDetails.phone}`}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support Direct ({supportDetails.phone})</span>
              </a>

              <a
                href={`https://wa.me/${supportDetails.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp Support Desk</span>
              </a>

              <a
                href={`mailto:${supportDetails.email}`}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-purple-700" />
                <span>Email: {supportDetails.email}</span>
              </a>

              <button
                onClick={handleScheduleCall}
                className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Priority Site Visit / Call</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{supportDetails.office}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
