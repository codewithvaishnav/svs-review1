import React, { useState, useEffect } from 'react';
import { 
  Award, Shield, Sparkles, Check, Gift, Crown, 
  Calendar, ExternalLink, ArrowRight, CreditCard
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';
import { MembershipCard, FirestoreCollections } from '../../types';
import { dbService } from '../../services/dbService';
import { getMergedMembershipCards } from '../../data/svsData';

interface MemberPrivilegesProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const MemberPrivileges: React.FC<MemberPrivilegesProps> = ({
  loggedInUser,
  onShowToast,
  onNavigateTab,
}) => {
  const { displayName: userName, memberId, tier, isLoading } = useUserMetadata(loggedInUser);
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>(() => getMergedMembershipCards([]));
  const [selectedTier, setSelectedTier] = useState<string>('platinum');

  // Subscribe to live membership cards from Firestore
  useEffect(() => {
    const unsubscribe = dbService.subscribeToCollection<MembershipCard>(
      FirestoreCollections.CARDS,
      (cloudCards) => {
        const merged = getMergedMembershipCards(cloudCards || []);
        setMembershipCards(merged);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (tier) {
      const t = tier.toLowerCase().trim();
      if (t.includes('diamond')) setSelectedTier('diamond');
      else if (t.includes('gold')) setSelectedTier('gold');
      else if (t.includes('silver')) setSelectedTier('silver');
      else setSelectedTier('platinum');
    }
  }, [tier]);

  const handleDownloadCard = () => {
    if (onShowToast) {
      onShowToast(`Downloading Digital ${selectedTier.toUpperCase()} Membership Card for ${userName} [${memberId}]...`);
    }
  };

  const activeCard = membershipCards.find(
    (c) => c.tier.toLowerCase().trim() === selectedTier.toLowerCase().trim()
  ) || membershipCards[0];

  const getTierGradient = (card: MembershipCard) => {
    if (card.bgGradient) return card.bgGradient;
    const t = card.tier.toLowerCase();
    if (t === 'platinum') return 'from-slate-900 via-slate-800 to-slate-950 border-slate-300';
    if (t === 'diamond') return 'from-cyan-950 via-slate-900 to-slate-950 border-cyan-400';
    if (t === 'gold') return 'from-amber-950 via-slate-900 to-slate-950 border-amber-400';
    return 'from-emerald-950 via-slate-900 to-slate-950 border-emerald-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            Membership Card & Privileges
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Your Srivasudha <span className="text-amber-700">Privilege Card</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Access exclusive staycations, resort amenities, and VIP investor invitations dynamically managed in the live SVS database.
          </p>
        </div>

        {/* 4 Core Tiers Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {membershipCards.map((c) => {
            const tKey = c.tier.toLowerCase();
            const isSelected = selectedTier === tKey;
            return (
              <button
                key={c.id || c.tier}
                onClick={() => setSelectedTier(tKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.tier} Card
              </button>
            );
          })}
        </div>
      </div>

      {/* Digital Member Card & Privilege Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Column: Realistic Interactive Membership Card */}
        <div className="lg:col-span-1">
          <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${getTierGradient(activeCard)} border-2 shadow-2xl text-white relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between group`}>
            {/* Top Bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-sm uppercase tracking-widest text-slate-100">
                  Srivasudha Club
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950">
                {activeCard.tier.toUpperCase()}
              </span>
            </div>

            {/* Chip & Member ID */}
            <div className="space-y-3 my-auto relative z-10">
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-500 border border-amber-100/40 shadow-inner" />
              <div>
                <div className="text-[10px] text-slate-200 font-bold uppercase tracking-widest">
                  Member ID #
                </div>
                <div className="font-mono text-lg font-black tracking-widest text-amber-300">
                  {memberId || 'SVS-MEM-8821'}
                </div>
              </div>
            </div>

            {/* Bottom Bar: Name & Valid Thru */}
            <div className="flex items-end justify-between border-t border-white/20 pt-4 relative z-10">
              <div>
                <div className="text-[10px] text-slate-200 font-bold uppercase">Plot Owner & Member</div>
                <div className="font-bold text-sm uppercase tracking-wider text-white">
                  {userName || 'Privileged Member'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-200 font-bold uppercase">Valid Thru</div>
                <div className="font-mono text-xs font-bold text-slate-100">LIFE / 2045</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadCard}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              Save Digital Card to Wallet
            </button>
          </div>
        </div>

        {/* Right Column: Privilege Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {activeCard.subtitle || `${activeCard.tier} Tier Privileges`}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {activeCard.tier} Card Privileges & Benefits
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Annual Staycation Nights</div>
                <div className="text-xs text-emerald-800 font-bold mt-0.5">{activeCard.resortNights}</div>
                <p className="text-xs text-slate-500 mt-1">Redeemable across Srivasudha luxury resorts & retreats.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Plot Discount Privilege</div>
                <div className="text-xs text-amber-800 font-bold mt-0.5">{activeCard.discountPerk}</div>
                <p className="text-xs text-slate-500 mt-1">Exclusive discount applied on upcoming venture purchases.</p>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Included Tier Perks:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCard.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="text-xs text-slate-600">
              Ready to use your annual staycation privileges?
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('member-bookings')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Resort Staycation Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
