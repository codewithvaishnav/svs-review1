import React, { useState } from 'react';
import { 
  Calendar, MapPin, Sparkles, CheckCircle2, Clock, 
  ExternalLink, ArrowRight, Building, Users, Star
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';
import { firestoreService } from '../../services/firestoreService';

interface MemberBookingsProps {
  loggedInUser?: string | null;
  onOpenBookingModal?: (type: 'hotel' | 'resort' | 'event' | 'cab') => void;
  onShowToast?: (msg: string) => void;
}

export const MemberBookings: React.FC<MemberBookingsProps> = ({
  loggedInUser,
  onOpenBookingModal,
  onShowToast,
}) => {
  const { displayName, memberId, plotInfo, member, isLoading } = useUserMetadata(loggedInUser);
  const [selectedResort, setSelectedResort] = useState<string>('Srivasudha Royal Palms Resort, Hyderabad');
  const [selectedDates, setSelectedDates] = useState<string>('12th - 14th Sep 2026');
  const [guests, setGuests] = useState<string>('2 Adults, 1 Child');

  const handleBookNow = async () => {
    const reqId = `SVS-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await firestoreService.addLead({
        id: reqId,
        name: displayName,
        phone: member?.phone || '+91 98490 55432',
        email: member?.email || 'member@svssrivasudha.com',
        category: 'Staycation Booking Request',
        service: selectedResort,
        status: 'New',
        source: 'Member Portal Staycation Hub',
        notes: `Staycation booking for ${selectedResort} on dates ${selectedDates}. Guests: ${guests}. Credits available: ${plotInfo.staycationCredits}`,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        formData: {
          'Booking ID': reqId,
          'Member ID': memberId,
          'Member Name': displayName,
          'Resort': selectedResort,
          'Dates': selectedDates,
          'Guests': guests,
          'Allotted Plot': `${plotInfo.plotNo} @ ${plotInfo.venture}`,
        }
      });
    } catch (err) {
      console.warn('Could not persist staycation request:', err);
    }

    if (onOpenBookingModal) {
      onOpenBookingModal('resort');
    } else if (onShowToast) {
      onShowToast(`Staycation booking request (${reqId}) recorded in Firestore for ${selectedResort}! Support desk will confirm shortly.`);
    }
  };

  const pastBookings = [
    {
      id: 'SVS-RES-8812',
      resort: 'Srivasudha Royal Palms Resort, Hyderabad',
      dates: '18th - 20th Jan 2026 (2 Nights)',
      status: 'Completed',
      creditsUsed: '2 Credits',
      guests: '2 Adults',
    },
    {
      id: 'SVS-RES-7741',
      resort: 'SVS Hilltop Retreat, Ananthagiri Hills',
      dates: '10th - 11th Aug 2025 (1 Night)',
      status: 'Completed',
      creditsUsed: '1 Credit',
      guests: '2 Adults, 2 Children',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            Club & Resort Bookings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Complimentary <span className="text-emerald-700">Staycations</span> & Club Access
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Redeem your annual Platinum/Gold privileges across our premier resorts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="text-xs font-bold text-slate-700 uppercase">Available Balance</div>
          <div className="text-2xl font-black text-emerald-800 flex items-center justify-center gap-1.5 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {plotInfo.staycationCredits} Credits
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Valid till 31st Dec 2026</div>
        </div>
      </div>

      {/* Resort Selector & Booking Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Featured Resorts */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">
            Select Your SVS Luxury Resort Destination
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              onClick={() => setSelectedResort('Srivasudha Royal Palms Resort, Hyderabad')}
              className={`rounded-3xl border-2 p-5 space-y-4 cursor-pointer transition-all ${
                selectedResort.includes('Royal Palms')
                  ? 'border-emerald-700 bg-emerald-50/40 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden h-40">
                <img 
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" 
                  alt="Royal Palms Resort"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  HYDERABAD
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">SVS Royal Palms Resort</h4>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Luxury villas with private pool, clubhouse dining, and organic farm tours near Shamshabad.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedResort('SVS Hilltop Retreat, Ananthagiri Hills')}
              className={`rounded-3xl border-2 p-5 space-y-4 cursor-pointer transition-all ${
                selectedResort.includes('Hilltop Retreat')
                  ? 'border-emerald-700 bg-emerald-50/40 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden h-40">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
                  alt="Hilltop Retreat"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  VIKARABAD
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">SVS Hilltop Retreat</h4>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.8
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Eco-luxury cottages nestled amidst misty hills, trekking trails, and wellness ayurveda spa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Booking Request Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5">
          <h3 className="text-lg font-bold text-slate-900">
            Redeem Staycation
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Selected Resort
              </label>
              <input 
                type="text" 
                readOnly 
                value={selectedResort}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Check-in / Out
              </label>
              <input 
                type="text" 
                value={selectedDates}
                onChange={(e) => setSelectedDates(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Guest Count
              </label>
              <input 
                type="text" 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Credits Required:</span>
                <span className="text-amber-800">1 Credit / Night</span>
              </div>
              <p className="text-[11px] text-slate-600">Includes complimentary breakfast & clubhouse access.</p>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm Staycation Booking</span>
            </button>
          </div>
        </div>

      </div>

      {/* Past & Upcoming Bookings Ledger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Staycation & Club Access History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Resort / Property</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Credits Redeemed</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pastBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{b.resort}</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.dates}</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.guests}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">{b.creditsUsed}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
