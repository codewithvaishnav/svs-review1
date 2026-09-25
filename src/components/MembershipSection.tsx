import React, { useState, useEffect } from 'react';
import { MembershipCard, FirestoreCollections } from '../types';
import { MEMBERSHIP_CARDS, getMergedMembershipCards } from '../data/svsData';
import { dbService } from '../services/dbService';
import { 
  CreditCard, Sparkles, CheckCircle2, Download, Award, Shield, 
  Crown, Hotel, Wrench, ArrowRight 
} from 'lucide-react';

interface MembershipSectionProps {
  onDownloadBrochure: () => void;
  onOpenEnrollment?: () => void;
  onApplyCard?: (tier: string) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  onDownloadBrochure,
  onOpenEnrollment,
  onApplyCard,
}) => {
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>(() => getMergedMembershipCards([]));

  // Live real-time Firestore sync for membership cards
  useEffect(() => {
    const unsubscribe = dbService.subscribeToCollection<MembershipCard>(
      FirestoreCollections.CARDS,
      (cloudCards) => {
        const merged = getMergedMembershipCards(cloudCards || []);
        setMembershipCards(merged);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section id="membership" className="py-16 sm:py-20 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-700" />
            Exclusive Privilege Cards
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif">
            Srivasuda Membership Division
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Redefine luxury living and enjoy exclusive plot discounts, free luxury resort night stays, and dedicated site supervisors for your land assets in India.
          </p>
        </div>

        {/* Card Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipCards.map((card) => (
            <div
              key={card.id || card.tier}
              className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-600 flex flex-col justify-between space-y-6 transition-all group"
            >
              
              {/* Card Header Visual */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                    {card.tier} Tier
                  </span>
                  <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{card.tier} Card</h3>
                  <p className="text-xs text-slate-500">{card.subtitle}</p>
                </div>

                {/* Key Metrics */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Discount Privilege:</span>
                    <span className="text-xs font-black text-emerald-700">{card.discountPerk}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Free Resort Stay:</span>
                    <span className="font-semibold text-slate-900">{card.resortNights}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Included Perks:</div>
                  <ul className="space-y-2">
                    {card.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (onApplyCard) {
                    onApplyCard(card.tier);
                  } else if (onOpenEnrollment) {
                    onOpenEnrollment();
                  }
                }}
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                Apply for {card.tier} Card
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}
        </div>

        {/* Download Brochure Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <Download className="w-5 h-5 text-emerald-700" />
              Want to see detailed membership terms & conditions?
            </h4>
            <p className="text-xs text-slate-600">
              Download the official Srivasudha Membership Brochure in PDF format.
            </p>
          </div>

          <button
            onClick={onDownloadBrochure}
            className="px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            Download PDF Brochure
          </button>
        </div>

      </div>
    </section>
  );
};
