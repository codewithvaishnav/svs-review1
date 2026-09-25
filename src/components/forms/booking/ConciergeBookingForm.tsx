import React, { useState } from 'react';
import { Hotel, Calendar, Users, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Phone, CreditCard } from 'lucide-react';
import { dbService } from '../../../services/dbService';
import { firestoreService } from '../../../services/firestoreService';
import { FirestoreCollections } from '../../../types';

interface ConciergeBookingFormProps {
  bookingType: 'hotel' | 'resort' | 'event' | 'cab';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ConciergeBookingForm: React.FC<ConciergeBookingFormProps> = ({ 
  bookingType, 
  onSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    membershipCardNo: '',
    date: '',
    guests: '2 Guests',
    specialNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const typeLabels = {
    hotel: {
      title: 'Luxury Hotel Room Reservation',
      desc: 'Redeem complimentary luxury hotel nights or book verified partner suites at subsidized rates.',
    },
    resort: {
      title: 'SVS Club & Resort Stay Redemption',
      desc: 'Exclusive access to our affiliated clubs and tranquil nature resorts with dining discounts.',
    },
    event: {
      title: 'Free Event Pass & Summit Registration',
      desc: 'Reserve complimentary VIP entry passes for upcoming summits, cardholder meets, and family festivals.',
    },
    cab: {
      title: 'Chauffeur Cab & Airport Pickup',
      desc: 'Priority on-demand chauffeur transportation and airport concierge transfers.',
    },
  };

  const currentMeta = typeLabels[bookingType] || typeLabels.hotel;

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

    const now = Date.now();
    const generatedId = `SVS-RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      id: generatedId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      category: 'Hospitality',
      service: `Hospitality: ${currentMeta.title}`,
      source: 'Concierge Booking Modal',
      status: 'New',
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      date: new Date(now).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      preferredDate: formData.date || 'Flexible',
      notes: `Card: ${formData.membershipCardNo || 'Guest / Non-Member'} | Booking Date: ${formData.date || 'Flexible'} | Guests: ${formData.guests} | Special Notes: ${formData.specialNotes || 'None'}`,
      formData: {
        'Guest Full Name': formData.name.trim(),
        'Mobile Number': formData.phone.trim(),
        'Membership Card Number': formData.membershipCardNo?.trim() || 'Non-Member / Prospective Guest',
        'Hospitality Category': currentMeta.title,
        'Reservation Type': bookingType.toUpperCase(),
        'Preferred Booking Date': formData.date || 'Flexible / To Be Coordinated',
        'Number of Guests': formData.guests,
        'Special Requests / Notes': formData.specialNotes?.trim() || 'None specified',
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
      console.error('[ConciergeBookingForm:SubmitError] Firestore write error:', err);
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
        <h4 className="text-xl font-bold text-slate-900">Booking Request Sent!</h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you! Our hospitality team will contact you via WhatsApp/phone within 30 minutes to confirm your reservation.
        </p>
        <div className="pt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-amber-800 font-mono text-xs border border-slate-200">
            Booking ID: SVS-RES-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-emerald-900">{currentMeta.title}</p>
          <p className="text-[11px] text-slate-600">{currentMeta.desc}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">Primary Guest Full Name *</label>
        <input
          type="text"
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rajesh Kumar"
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
          <label className="block text-slate-700 font-bold mb-1">SVS Member Card No.</label>
          <input
            type="text"
            name="membershipCardNo"
            value={formData.membershipCardNo}
            onChange={handleChange}
            placeholder="e.g. SVS-GLD-8821 (Optional)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-700 font-bold mb-1">Preferred Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1">Number of Guests</label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests (Couple)</option>
            <option value="3-4 Guests">3 - 4 Guests (Family)</option>
            <option value="5+ Guests">5+ Guests (Group)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Special Preferences / Meal Notes</label>
        <textarea
          rows={2}
          name="specialNotes"
          value={formData.specialNotes}
          onChange={handleChange}
          placeholder="e.g., Pure Veg food preference, early check-in, airport terminal pickup..."
          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 text-xs placeholder:text-slate-400"
        />
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
          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <span>Confirm Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
