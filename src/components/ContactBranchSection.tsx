import React from 'react';
import { BRANCH_LOCATIONS } from '../data/svsData';
import { 
  MapPin, Phone, Mail, Building2, Globe, Sparkles 
} from 'lucide-react';
import { ContactInquiryForm } from './forms';

interface ContactBranchSectionProps {
  initialService?: string;
  initialMessage?: string;
}

export const ContactBranchSection: React.FC<ContactBranchSectionProps> = ({
  initialService,
  initialMessage,
}) => {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 text-slate-900 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-700" />
            Branch Network & Headquarters
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Get In Touch With Us
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Visit our Corporate Head Office in KPHB Colony Hyderabad, or reach out to our regional branches and Singapore overseas desk.
          </p>
        </div>

        {/* Contact Split: Corporate Info & Modular Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Corporate Office & Contact Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              SVS Corporate Headquarters & Branch Offices
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BRANCH_LOCATIONS.map((branch) => (
                <div
                  key={branch.id}
                  className={`p-5 rounded-2xl border ${
                    branch.isCorporate
                      ? 'bg-white border-amber-400 shadow-md sm:col-span-2'
                      : 'bg-white border-slate-200 shadow-xs'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      {branch.city}
                    </h4>
                    {branch.isCorporate && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                        Headquarters
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {branch.address}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700 font-medium">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Phone className="w-3 h-3 text-emerald-700" />
                      {branch.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {branch.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Contact Inquiry Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Send Your Message</h3>
              <p className="text-xs text-slate-500 mt-1">
                For property inquiries, NRI land management, or resort bookings.
              </p>
            </div>

            {/* Modular Form Component with Separation of Concerns */}
            <ContactInquiryForm initialService={initialService} initialMessage={initialMessage} />
          </div>

        </div>

      </div>
    </section>
  );
};
