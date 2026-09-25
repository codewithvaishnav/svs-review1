import React, { useState } from 'react';
import { 
  Briefcase, UserCheck, CheckCircle2, Sparkles, MapPin, 
  Send, FileText, User, Mail, Phone, Award, Lightbulb, 
  HeartHandshake, Building2, Upload, Check
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { FirestoreCollections } from '../types';

interface CareerSectionProps {
  onOpenEnrollment: () => void;
  onApplyJob?: (jobTitle: string) => void;
}

export const CareerSection: React.FC<CareerSectionProps> = ({ onOpenEnrollment }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    domain: 'Sales & Relationship Management',
    experienceYears: '3-5 Years',
    whyJoin: '',
    valueContribution: '',
    portfolioUrl: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refNum = 'SVS-HR-' + Math.floor(100000 + Math.random() * 900000);
    setApplicationRef(refNum);

    const leadPayload = {
      id: refNum,
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      category: 'Career',
      service: `Job Application: ${formData.domain}`,
      source: 'Careers Portal',
      notes: `Location: ${formData.city} | Experience: ${formData.experienceYears} | Domain: ${formData.domain} | Why Join: ${formData.whyJoin}`,
      formData: {
        'Applicant Name': formData.fullName,
        'Email Address': formData.email,
        'Phone Number': formData.phone,
        'Current City': formData.city,
        'Domain / Role Applied': formData.domain,
        'Years of Experience': formData.experienceYears,
        'Resume / LinkedIn URL': formData.portfolioUrl || 'Not provided',
        'Why Join SVS Group': formData.whyJoin || 'Not specified',
        'Value Contribution': formData.valueContribution || 'Not specified',
      }
    };

    dbService.setDocument(FirestoreCollections.LEADS, refNum, leadPayload)
      .catch(err => console.error('[CareerSection] Failed to write application to Firestore:', err));

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      domain: 'Sales & Relationship Management',
      experienceYears: '3-5 Years',
      whyJoin: '',
      valueContribution: '',
      portfolioUrl: '',
    });
    setIsSubmitted(false);
  };

  return (
    <section id="careers" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300">
            <Briefcase className="w-4 h-4" />
            Join Our Growing Legacy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Careers & Talent Application
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            At SVS Group, we believe exceptional talent drives extraordinary real estate growth. Tell us who you are, why you want to work with us, and how you will add value to our mission.
          </p>
        </div>

        {/* Channel Partner & Associate Enrollment Banner */}
        <div className="p-8 rounded-3xl bg-emerald-800 text-white border border-emerald-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Channel Partner & Associate Opportunity
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Enroll as an Official SVS Channel Associate
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Looking for a partnership rather than a full-time role? Earn attractive commissions, access direct venture allocation, and partner with a 20+ year old trusted real estate enterprise.
            </p>
          </div>

          <button
            onClick={onOpenEnrollment}
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 whitespace-nowrap flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-slate-950" />
            Fill Associate Enrollment Form
          </button>
        </div>

        {/* Main Application Pitch Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          
          <div className="border-b border-slate-200 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              Candidate Value Proposal
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Why Work With SVS Group? Express Your Interest
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Please complete all fields below. Our Talent Acquisition team personally reviews every application to match passionate candidates with leadership opportunities.
            </p>
          </div>

          {isSubmitted ? (
            /* Success State Confirmation Card */
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 text-center space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black uppercase">
                  Ref No: {applicationRef}
                </span>
                <h4 className="text-2xl font-black text-slate-900">
                  Application Submitted Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Your talent proposal has been dispatched directly to the SVS HR & Executive Management Desk.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Domain:</span>
                  <span className="font-bold text-slate-900">{formData.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900">{formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-bold text-slate-900">{formData.experienceYears}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Row 1: Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Reddy"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Current Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Current City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad / Vijayawada / Bangalore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

              </div>

              {/* Row 2: Domain & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Domain / Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    Primary Domain / Role *
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Sales & Relationship Management">Sales & Relationship Management</option>
                    <option value="Site Operations & Land Surveying">Site Operations & Land Surveying</option>
                    <option value="Legal & Title Verification">Legal & Title Verification</option>
                    <option value="Digital Marketing & Lead Generation">Digital Marketing & Lead Generation</option>
                    <option value="Finance, Billing & Accounts">Finance, Billing & Accounts</option>
                    <option value="Executive Management & Operations">Executive Management & Operations</option>
                    <option value="Other Specialist Role">Other Specialist Role</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    Total Work Experience *
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="6-10 Years">6-10 Years</option>
                    <option value="10+ Years Senior Leader">10+ Years Senior Leader</option>
                  </select>
                </div>

                {/* Resume Upload from Device / Portfolio */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    Attach Resume / Profile Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Upload file or paste link"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
                    <label className="cursor-pointer px-4 py-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>Browse</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, portfolioUrl: `${f.name} (Uploaded from device)` });
                            };
                            reader.readAsDataURL(f);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Row 3: Describing Motivation & Value Proposition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Why Join Us */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                    Why do you want to join SVS Group? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what excites you about SVS Group's 20+ years of real estate legacy, transparent venture developments, or customer-first vision..."
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                {/* How will candidate benefit company */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    How will your skills & experience benefit our company? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe how your expertise, network, domain knowledge, or leadership skills will drive growth, sales, customer trust, or operational efficiency at SVS..."
                    value={formData.valueContribution}
                    onChange={(e) => setFormData({ ...formData, valueContribution: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <p className="text-[11px] text-slate-500">
                  By submitting, you agree to allow SVS HR team to contact you via Phone/Email.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Talent Application
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
