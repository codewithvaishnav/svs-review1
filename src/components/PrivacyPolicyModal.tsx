import React from 'react';
import { 
  ShieldCheck, Lock, Eye, FileText, CheckCircle2, UserCheck, 
  HelpCircle, Phone, Mail, MapPin, X, ArrowRight
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SVS Srivasudha Privacy Policy
              </h2>
              <p className="text-xs text-slate-300">
                Simple English Guide with Word Meanings & 100% Data Protection Guarantee
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-sm leading-relaxed bg-slate-50/50">
          
          {/* Summary Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Zero Spam Promise
              </span>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium">
                We never sell, rent, or distribute your phone number or email to third-party telemarketers or advertisers.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white px-3 py-2 rounded-lg border border-emerald-200 shadow-2xs shrink-0">
              <Lock className="w-4 h-4 text-emerald-600" />
              100% Secure Storage
            </div>
          </div>

          {/* Section 1: Information We Collect & Meanings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <Eye className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                1. What Information We Collect (And What It Means)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs bg-white rounded-xl border border-slate-200 shadow-2xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-900 font-bold border-b border-slate-200">
                    <th className="p-3">Information We Ask For</th>
                    <th className="p-3">Simple Meaning</th>
                    <th className="p-3">Why We Need It</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Full Name</td>
                    <td className="p-3">Your real name</td>
                    <td className="p-3">To address you respectfully and prepare your official site inspection passes.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Phone & WhatsApp</td>
                    <td className="p-3">Your mobile contact number</td>
                    <td className="p-3">To share complimentary AC cab details, brochure PDFs, and booking status.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Email Address</td>
                    <td className="p-3">Your digital inbox</td>
                    <td className="p-3">To send layout plans, cost estimation sheets, and payment receipts.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">City / Country</td>
                    <td className="p-3">Where you currently live</td>
                    <td className="p-3">Helps our local advisors or NRI desk match your time zone.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Identity Documents (Only during purchase)</td>
                    <td className="p-3">Aadhaar, PAN Card, or Passport (for NRIs)</td>
                    <td className="p-3">Legally mandatory under RERA and Government Sub-Registrar rules for spot land registration.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                2. How We Use Your Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Free AC Cab Coordination
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To assign an authorized SVS chauffeur and property specialist to pick you up from your doorstep anywhere in Hyderabad.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Legal Verification & Land Passbooks
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To complete Encumbrance Certificate (EC) verification, title link documents, and government digital passbook generation.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resort & Club Bookings
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To reserve cottages, banquet lawns, and suite stays for SVS Privilege Card members and plot owners.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bank Loan Assistance
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To assist with pre-approved loans up to 70-80% from SBI, HDFC, ICICI, and Axis Bank if requested.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Data Safety & Control */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                3. Your Rights & Control Over Your Data
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Access Your Details:</strong> You can ask our team at any time to see the contact details stored under your profile.</span>
              </p>
              <p className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Opt-Out Anytime:</strong> Reply "STOP" on WhatsApp or SMS to stop receiving project updates or promotional alerts.</span>
              </p>
              <p className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Request Deletion:</strong> You can ask us to permanently delete your inquiry contact record from our database within 48 hours.</span>
              </p>
            </div>
          </section>

          {/* Section 4: Key Real Estate & Privacy Terms Simplified */}
          <section className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Simple Meanings of Important Terms
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900">RERA</span>
                <p className="text-[11px] text-slate-600">Government Real Estate Regulatory Authority that protects buyers from fraud.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900">EC (Encumbrance Certificate)</span>
                <p className="text-[11px] text-slate-600">Government certificate proving the land has no pending legal disputes or loans.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900">Opt-Out</span>
                <p className="text-[11px] text-slate-600">Choosing to stop receiving messages or calls from us whenever you wish.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Contact Desk */}
          <section className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Have Questions About Your Privacy?
            </h4>
            <p className="text-xs text-slate-300">
              Our Data Privacy & Grievance Officer is available Monday through Sunday, 9:00 AM – 8:00 PM IST.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 86888 81283</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>privacy@svssrivasudha.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jubilee Hills, Hyderabad</span>
              </div>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            SVS Srivasudha Real Estate & Infrastructure © 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );
};
