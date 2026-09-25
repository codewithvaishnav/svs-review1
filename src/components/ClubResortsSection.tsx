import React, { useState, useEffect } from 'react';
import { 
  Hotel, Utensils, Waves, Calendar, MapPin, 
  ArrowRight, ShieldCheck, Sparkles, Clock, 
  Users, CheckCircle2, Ticket, PartyPopper, Flame, Video,
  Building
} from 'lucide-react';
import { HospitalityItem, SvsEvent, FirestoreCollections } from '../types';
import { dbService } from '../services/dbService';

interface ClubResortsSectionProps {
  onOpenBookingModal: (type: 'hotel' | 'resort' | 'event' | 'cab') => void;
  onNavigate: (sectionId: string) => void;
}

export const ClubResortsSection: React.FC<ClubResortsSectionProps> = ({
  onOpenBookingModal,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'hotel' | 'resort' | 'event'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'stays' | 'events'>('all');
  const [hospitalityList, setHospitalityList] = useState<HospitalityItem[]>([]);
  const [eventsList, setEventsList] = useState<SvsEvent[]>([]);

  useEffect(() => {
    // Subscribe to live hospitality collection added by SVS Admin
    const unsubHosp = dbService.subscribeToCollection<HospitalityItem>(
      FirestoreCollections.HOSPITALITY,
      (cloudItems) => {
        setHospitalityList(cloudItems || []);
      }
    );

    // Subscribe to live events collection added by SVS Admin
    const unsubEvents = dbService.subscribeToCollection<SvsEvent>(
      FirestoreCollections.EVENTS,
      (cloudEvents) => {
        setEventsList(cloudEvents || []);
      }
    );

    return () => {
      unsubHosp();
      unsubEvents();
    };
  }, []);

  const filteredItems = hospitalityList.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-16 pb-16 bg-white">
      
      {/* 1. Header Hero Banner */}
      <section className="relative bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80" 
            alt="SVS Club and Events Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Hospitality, Stays & Member Events
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif">
            SVS Clubs, Resorts & Summits
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience premium luxury staycations, 4-star weekend getaways, and VIP cardholder events across our elite partner resorts and convention spaces.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => onOpenBookingModal('resort')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Hotel className="w-4 h-4" />
              Book Resort Stay
            </button>
            <button
              onClick={() => onOpenBookingModal('event')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <PartyPopper className="w-4 h-4" />
              Book Free Event Pass
            </button>
          </div>
        </div>
      </section>

      {/* 2. Section Selector Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Hospitality & Events
          </button>
          <button
            onClick={() => setActiveTab('stays')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'stays'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hotel className="w-3.5 h-3.5 text-emerald-600" />
            Resorts & Stays
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
            Upcoming Events & Summits
          </button>
        </div>
      </div>

      {/* 3. Upcoming Events & Summits Section */}
      {(activeTab === 'all' || activeTab === 'events') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <PartyPopper className="w-4 h-4" />
                Member Conclaves & Summits
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Upcoming Events & Cardholder Celebrations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Network with fellow investors, celebrate foundation milestones, and get first-look access to new HMDA layouts.
              </p>
            </div>
            <button
              onClick={() => onOpenBookingModal('event')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              General Event Pass Registration
            </button>
          </div>

          {eventsList.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-slate-900">No Public Summits Currently Scheduled</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Investor conclaves, cardholder celebrations, and growth corridor summits scheduled by SVS Administration will appear here live.
                </p>
              </div>
              <button
                onClick={() => onOpenBookingModal('event')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                Inquire for Private Banquet / Event Booking
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eventsList.map((evt) => (
                <div 
                  key={evt.id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {evt.image ? (
                        <img 
                          src={evt.image} 
                          alt={evt.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-400">
                          <PartyPopper className="w-12 h-12 opacity-50" />
                        </div>
                      )}
                      {evt.badge && (
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/30">
                          {evt.badge}
                        </div>
                      )}
                      {evt.type && (
                        <div className="absolute bottom-3 right-3 bg-emerald-800/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                          {evt.type}
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                          {evt.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-semibold text-slate-900">{evt.date}</span>
                          {evt.time && (
                            <>
                              <span className="text-slate-400">|</span>
                              <span>{evt.time}</span>
                            </>
                          )}
                        </div>
                        {evt.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}
                      </div>

                      {evt.perks && evt.perks.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold uppercase text-slate-900 tracking-wider">Pass Inclusions:</div>
                          <div className="space-y-1">
                            {evt.perks.map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onOpenBookingModal('event')}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Book Event Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Resorts & Stays Section */}
      {(activeTab === 'all' || activeTab === 'stays') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Hotel className="w-4 h-4 text-emerald-700" />
                Affiliated Stays & Clubhouses
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Luxury Resort Stays & Banquet Venues
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Cardholders enjoy complimentary staycation nights and heavily subsidized dining across our partner venues.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Venues
              </button>
              <button
                onClick={() => setFilter('hotel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'hotel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hotels & Dining
              </button>
              <button
                onClick={() => setFilter('resort')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'resort' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Eco-Resorts & Spas
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <Hotel className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  {filter === 'all'
                    ? 'No Hospitality Venues Currently Listed'
                    : `No ${filter === 'hotel' ? 'Hotels' : filter === 'resort' ? 'Eco-Resorts' : 'Banquet Venues'} Found`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  Resort stays, luxury suites, and banquet venues added by SVS Administration will appear here.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => onOpenBookingModal('resort')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Hotel className="w-4 h-4" />
                  <span>Contact Concierge Desk</span>
                </button>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    View All Venues
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: HospitalityItem) => (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {item.badge || item.type}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.location}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5">Amenities:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.features.map((am, i) => (
                            <span 
                              key={i} 
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg"
                            >
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onOpenBookingModal(item.type === 'hotel' ? 'hotel' : 'resort')}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request Booking / Stay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};
