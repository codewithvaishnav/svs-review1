import React, { useState } from 'react';
import { MapPin, Phone, Calendar, Car, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { dbService } from '../../../services/dbService';
import { firestoreService } from '../../../services/firestoreService';
import { FirestoreCollections } from '../../../types';

interface SiteInspectionBookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SiteInspectionBookingForm: React.FC<SiteInspectionBookingFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    corridor: 'Shadnagar (NH-44)',
    preferredDate: '',
    pickupRequired: 'Yes (AC Vehicle Pickup)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const now = Date.now();
    const generatedId = `SVS-SITE-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      id: generatedId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || 'Not Provided',
      category: 'Site Visit',
      service: `Site Inspection: ${formData.corridor}`,
      source: 'Site Visit Modal Form',
      status: 'New',
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      date: new Date(now).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      preferredDate: formData.preferredDate || 'Flexible',
      notes: `Preferred Inspection Date: ${formData.preferredDate || 'Flexible'} | AC Vehicle Pickup: ${formData.pickupRequired}`,
      formData: {
        'Visitor Full Name': formData.name.trim(),
        'Mobile Number': formData.phone.trim(),
        'Email Address': formData.email?.trim() || 'Not Provided',
        'Growth Corridor / Project': formData.corridor,
        'Preferred Inspection Date': formData.preferredDate || 'Flexible / To Be Coordinated',
        'AC Cab Pickup Service': formData.pickupRequired,
      },
    };

    try {
      await firestoreService.addLead(payload as any);
      await dbService.setDocument(FirestoreCollections.LEADS, generatedId, payload);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: unknown) {
      console.error('[SiteInspectionForm:SubmitError] Firestore write error:', err);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h4 className="text-xl font-bold text-slate-900">Site Visit Requested!</h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Our team will call you shortly to confirm your pickup time and address. Free doorstep AC cab is included.
        </p>
        <div className="pt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-emerald-800 font-mono text-xs border border-slate-200">
            Reference ID: SVS-SITE-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900">Free Doorstep Pickup & Drop</p>
          <p className="text-[11px] text-slate-600">
            Visit our approved layouts in person with zero obligations. Free AC cab service across Hyderabad.
          </p>
        </div>
      </div>

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
          placeholder="e.g. Sudheer Reddy"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-700 font-bold mb-1">Venture Corridor</label>
          <select
            name="corridor"
            value={formData.corridor}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
          >
            <option value="Shadnagar (NH-44)">Shadnagar (Bengaluru Highway / NH-44)</option>
            <option value="Sadashivpet (NH-65)">Sadashivpet (Mumbai Highway / NIMZ)</option>
            <option value="Yadadri (NH-163)">Yadadri & Bhongir (Warangal Highway)</option>
            <option value="Shamshabad (Airport Zone)">Shamshabad & Airport Zone</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1">Preferred Visit Date</label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Complimentary Pickup Request</label>
        <select
          name="pickupRequired"
          value={formData.pickupRequired}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
        >
          <option value="Yes (AC Vehicle Pickup)">Yes, arrange AC Car pickup from my location</option>
          <option value="Self Drive (Meet at Site)">No, I will drive directly to the site location</option>
        </select>
      </div>

      <div className="pt-2 flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Scheduling Visit...</span>
          ) : (
            <>
              <span>Book Free Site Visit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
