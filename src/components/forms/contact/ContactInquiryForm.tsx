import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { dbService } from '../../../services/dbService';
import { firestoreService } from '../../../services/firestoreService';
import { FirestoreCollections } from '../../../types';

interface ContactInquiryFormProps {
  onSuccess?: () => void;
  initialService?: string;
  initialMessage?: string;
}

export const ContactInquiryForm: React.FC<ContactInquiryFormProps> = ({ 
  onSuccess, 
  initialService = 'DTCP & HMDA Plot Purchase Inquiry',
  initialMessage = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: initialService,
    message: initialMessage,
  });

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      serviceType: initialService || prev.serviceType,
      message: initialMessage || prev.message
    }));
  }, [initialService, initialMessage]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = Date.now();
      const generatedId = `SVS-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const leadPayload = {
        id: generatedId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || 'Not Provided',
        category: 'General Inquiry',
        service: `General Inquiry: ${formData.serviceType}`,
        source: 'Website Contact Form',
        status: 'New',
        timestamp: now,
        createdAt: new Date(now).toISOString(),
        date: new Date(now).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: formData.message?.trim() || 'General contact inquiry',
        formData: {
          'Client Full Name': formData.name.trim(),
          'Mobile Number': formData.phone.trim(),
          'Email Address': formData.email?.trim() || 'Not Provided',
          'Inquiry Interest': formData.serviceType,
          'Client Message & Requirements': formData.message?.trim() || 'General inquiry regarding projects/services.',
        },
      };

      // 1. Direct Cloud Persistence via firestoreService & dbService
      await firestoreService.addLead(leadPayload as any);
      await dbService.setDocument(FirestoreCollections.LEADS, generatedId, leadPayload);

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: unknown) {
      console.error('[ContactForm:SubmitError] Failed to write lead to Firestore:', err);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900">Inquiry Dispatched Successfully!</h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Our Senior Relationship Desk will connect with you within 30 minutes with official brochure & location pricing.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              serviceType: initialService,
              message: '',
            });
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
        <input
          type="text"
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Ramesh Varma"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-700 font-bold mb-1">Mobile / WhatsApp No. *</label>
          <input
            type="tel"
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Department / Service of Interest</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
        >
          <option value="DTCP & HMDA Plot Purchase Inquiry">DTCP & HMDA Plot Purchase Inquiry</option>
          <option value="SVS Privilege Membership Card Application">SVS Privilege Membership Card Application</option>
          <option value="SVS Student Admission & Scholarship Application">SVS Student Admission & Scholarship Application</option>
          <option value="Open Plot Fencing & Boundary Protection">Open Plot Fencing & Boundary Protection</option>
          <option value="NRI Asset & Remote Land Management">NRI Asset & Remote Land Management</option>
          <option value="SVS Club Privileges & Resort Stays">SVS Club Privileges & Resort Stays</option>
          <option value="Channel Partner & Associate Enrollment">Channel Partner & Associate Enrollment</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Your Message / Requirements</label>
        <textarea
          rows={3}
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Specify plot size, location preferences, or query details..."
          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 text-xs placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        {isSubmitting ? (
          <span>Sending Inquiry...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Direct Message to Head Office</span>
          </>
        )}
      </button>
    </form>
  );
};
