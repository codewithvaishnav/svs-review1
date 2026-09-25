import React from 'react';
import { X, Hotel, MapPin, Sparkles } from 'lucide-react';
import { ConciergeBookingForm, SiteInspectionBookingForm } from './forms';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'hotel' | 'resort' | 'event' | 'cab' | 'site-inspection';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingType,
}) => {
  if (!isOpen) return null;

  const isSiteInspection = bookingType === 'site-inspection';

  const modalTitles = {
    'site-inspection': 'Book a Free Site Visit',
    'hotel': 'Hotel Room Reservation',
    'resort': 'Resort & Stay Booking',
    'event': 'Book Free Event Pass',
    'cab': 'Cab & Pickup Booking',
  };

  const modalSubtitles = {
    'site-inspection': 'Complimentary AC Cab Included',
    'hotel': 'Member & Guest Stays',
    'resort': 'Member & Guest Stays',
    'event': 'VIP Passes & Summit Invitations',
    'cab': 'Airport & Travel Concierge',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              {isSiteInspection ? (
                <MapPin className="w-5 h-5 text-amber-600" />
              ) : (
                <Hotel className="w-5 h-5 text-emerald-700" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {modalTitles[bookingType] || 'Resort & Room Booking'}
              </h3>
              <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                {modalSubtitles[bookingType] || 'Member & Guest Service'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modular Form Rendering */}
        <div className="p-6 overflow-y-auto">
          {isSiteInspection ? (
            <SiteInspectionBookingForm onSuccess={onClose} onCancel={onClose} />
          ) : (
            <ConciergeBookingForm 
              bookingType={bookingType as 'hotel' | 'resort' | 'event' | 'cab'} 
              onSuccess={onClose} 
              onCancel={onClose} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
