import React, { useState, useEffect } from 'react';
import {
  PartyPopper, Plus, Edit3, Trash2, Search, Filter, MapPin, Tag,
  Calendar, Clock, Users, X, Check, Eye, AlertCircle, RefreshCw,
  Sparkles, CheckCircle2, Award
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { SvsEvent, FirestoreCollections } from '../../types';
import { DeviceImageUpload } from '../common/DeviceImageUpload';

interface AdminEventsTabProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_OFFICIAL_EVENTS: Omit<SvsEvent, 'id'>[] = [
  {
    title: 'SVS Annual Cardholders Gala & Leadership Night',
    date: '2026-10-24',
    time: '06:30 PM - 10:30 PM IST',
    location: 'Vasudha Grand Ballroom & Poolside Lawn, Hyderabad',
    type: 'Annual Gala',
    badge: 'Cardholder Exclusive',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    description: 'An exclusive red-carpet annual celebration for SVS Gold, Diamond, Platinum, and Royal cardholders featuring executive keynote presentations, member awards, musical performances, and gourmet banquet dining.',
    perks: [
      'Complimentary Banquet Dining & Refreshments for Family',
      'Priority Allotment Voucher for Upcoming Ventures',
      'Exclusive Networking with Real Estate Advisors & NRIs',
      'Annual Lucky Draw for Staycation Upgrades'
    ],
    capacity: '300 Guests',
    createdAt: Date.now()
  },
  {
    title: 'Telangana Growth Corridor Real Estate Summit 2026',
    date: '2026-11-15',
    time: '10:00 AM - 04:00 PM IST',
    location: 'SVS Vasudha Eco-Resorts Convention Center, Shamshabad Road',
    type: 'Investment Summit',
    badge: 'Free Registration',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier investor forum analyzing high-yield infrastructure corridors across Shadnagar, Sadashivpet, and Yadadri with guest urban planners and land legal experts.',
    perks: [
      'Comprehensive Corridor Price Appreciation Whitepaper',
      'Direct Interaction with Layout Planners & Surveyors',
      'On-Spot Token Booking Discounts & Passbook Care',
      'Complimentary Lunch & Resort Day Pass'
    ],
    capacity: '200 Delegates',
    createdAt: Date.now()
  },
  {
    title: 'SVS Diwali Festival of Lights & Resort Carnival',
    date: '2026-11-08',
    time: '04:00 PM - 09:30 PM IST',
    location: 'Vasudha Lakeview Eco-Retreat Amphitheater',
    type: 'Resort Celebration',
    badge: 'Family Friendly',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'Grand Diwali celebration featuring traditional fireworks, cultural performances, kids play arena, and outdoor food festival amidst nature.',
    perks: [
      'Free Entry for SVS Members and 2 Accompanying Guests',
      'Children Fun Games & Pottery Workshops',
      'Grand Fireworks Display & Live Music by Local Artists',
      'Special Festive Dinner Buffet'
    ],
    capacity: '400 Members',
    createdAt: Date.now()
  }
];

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({ onShowToast }) => {
  const [events, setEvents] = useState<SvsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SvsEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<SvsEvent>>({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Annual Gala',
    badge: 'Member Exclusive',
    image: '',
    description: '',
    perks: [],
    capacity: '200 Guests',
  });
  const [perksInput, setPerksInput] = useState('');

  // Delete Confirmation Modal State
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<SvsEvent | null>(null);

  // Real-time subscription to Firestore EVENTS collection
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = dbService.subscribeToCollection<SvsEvent>(
      FirestoreCollections.EVENTS,
      (cloudEvents) => {
        setEvents(cloudEvents || []);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter logic
  const filteredEvents = events.filter((ev) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.title?.toLowerCase().includes(q) ||
      ev.location?.toLowerCase().includes(q) ||
      ev.description?.toLowerCase().includes(q) ||
      ev.badge?.toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || ev.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    const nextWeekDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    setForm({
      id: `evt-${Date.now()}`,
      title: '',
      date: nextWeekDate,
      time: '06:00 PM IST',
      location: 'SVS Vasudha Eco-Resorts Grand Lawn, Hyderabad',
      type: 'Annual Gala',
      badge: 'Member Exclusive',
      image: '',
      description: '',
      perks: [],
      capacity: '250 Guests',
      createdAt: Date.now(),
    });
    setPerksInput('Complimentary Banquet Dinner for Family\nPriority Venture Allocation\nLive Musical Performances\nNetworking with SVS Leadership');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: SvsEvent) => {
    setEditingEvent(evt);
    setForm({ ...evt });
    setPerksInput((evt.perks || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      onShowToast('Please fill in required fields (Title, Date, Location).');
      return;
    }

    setIsSaving(true);
    const cleanedPerks = perksInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const eventToSave: SvsEvent = {
      id: form.id || `evt-${Date.now()}`,
      title: form.title.trim(),
      date: form.date.trim(),
      time: form.time?.trim() || '10:00 AM IST',
      location: form.location.trim(),
      type: form.type?.trim() || 'Member Summit',
      badge: form.badge?.trim() || 'SVS Event',
      image: form.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      description: form.description?.trim() || 'Join us for this signature SVS community gathering.',
      perks: cleanedPerks.length > 0 ? cleanedPerks : ['Complimentary Member Entry', 'Refreshments Included'],
      capacity: form.capacity?.trim() || 'Open for Members',
      createdAt: form.createdAt || Date.now(),
    };

    try {
      const res = await dbService.setDocument(FirestoreCollections.EVENTS, eventToSave.id, eventToSave);
      if (res.success) {
        onShowToast(editingEvent ? `Updated event "${eventToSave.title}"` : `Published new event "${eventToSave.title}"`);
        setIsModalOpen(false);
      } else {
        onShowToast('Failed to save event: ' + (res.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Error saving event to Firestore:', err);
      onShowToast('Error saving event: ' + (err?.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmEvent) return;
    const evt = deleteConfirmEvent;
    try {
      await dbService.deleteDocument(FirestoreCollections.EVENTS, evt.id);
      onShowToast(`Deleted event "${evt.title}"`);
      setDeleteConfirmEvent(null);
    } catch (err: any) {
      console.error('Error deleting event:', err);
      onShowToast('Error deleting event: ' + (err?.message || ''));
    }
  };

  const handleSeedOfficialEvents = async () => {
    setIsSeeding(true);
    try {
      let count = 0;
      for (const sample of SAMPLE_OFFICIAL_EVENTS) {
        const id = `evt-svs-${count + 1}`;
        await dbService.setDocument(FirestoreCollections.EVENTS, id, { ...sample, id });
        count++;
      }
      onShowToast(`Successfully seeded ${count} official SVS events into Firestore!`);
    } catch (err: any) {
      console.error('Error seeding events:', err);
      onShowToast('Error seeding events: ' + (err?.message || ''));
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-amber-400" />
            <span>Events & Summits Management (Firestore CMS)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Publish and manage cardholder galas, investor summits, and resort celebrations with uploaded imagery. Real-time sync with the Club & Resorts portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {events.length === 0 && (
            <button
              onClick={handleSeedOfficialEvents}
              disabled={isSeeding}
              className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Populate upcoming official SVS events"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Events'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Event</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, venue, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">All Event Categories</option>
          <option value="Annual Gala">Annual Gala</option>
          <option value="Investment Summit">Investment Summit</option>
          <option value="Resort Celebration">Resort Celebration</option>
          <option value="Property Expo">Property Expo</option>
          <option value="Member Meetup">Member Meetup</option>
        </select>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
          <p className="text-xs font-bold">Synchronizing Events from Firestore...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <PartyPopper className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Events Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {events.length === 0
                ? 'Your Firestore database has no events yet. Click "+ Add New Event" or seed verified SVS member gatherings.'
                : 'No events match your search criteria. Try a different query.'}
            </p>
          </div>
          {events.length === 0 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                + Add First Event
              </button>
              <button
                onClick={handleSeedOfficialEvents}
                disabled={isSeeding}
                className="px-5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Seed Verified SVS Events
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              {/* Event Image */}
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                {evt.image ? (
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-850 flex items-center justify-center text-slate-600">
                    <PartyPopper className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                    {evt.badge || evt.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-amber-300 text-[10px] font-bold">
                    {evt.type}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-200">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{evt.date}</span>
                  </span>
                  {evt.capacity && (
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-400" />
                      <span>{evt.capacity}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Event Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-black text-sm text-white leading-snug">{evt.title}</h3>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{evt.time}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] line-clamp-1">{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {evt.description}
                  </p>

                  {evt.perks && evt.perks.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Included Privileges ({evt.perks.length})
                      </span>
                      <ul className="text-[11px] text-slate-300 space-y-0.5">
                        {evt.perks.slice(0, 2).map((p, i) => (
                          <li key={i} className="flex items-center gap-1 truncate">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{p}</span>
                          </li>
                        ))}
                        {evt.perks.length > 2 && (
                          <li className="text-[10px] text-slate-500 font-medium">
                            +{evt.perks.length - 2} more privileges
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Event</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmEvent(evt)}
                    className="py-1.5 px-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New SVS Event / Summit'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Saves directly to Firestore collection <code className="text-amber-300">events</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Title */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. SVS Annual Cardholders Gala & Leadership Night"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Event Category */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Category *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Annual Gala">Annual Gala</option>
                    <option value="Investment Summit">Investment Summit</option>
                    <option value="Resort Celebration">Resort Celebration</option>
                    <option value="Property Expo">Property Expo</option>
                    <option value="Member Meetup">Member Meetup</option>
                  </select>
                </div>

                {/* Badge / Tag */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Badge Tag *
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. Cardholder Exclusive, VIP Pass, Free Registration"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Time *
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g. 06:30 PM - 10:30 PM IST"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Venue / Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Vasudha Grand Ballroom & Poolside Lawn, Hyderabad"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Guest Capacity / Seats Limit
                  </label>
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="e.g. 250 Guests / Limited Seats"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2 pt-2">
                  <DeviceImageUpload
                    label="Event Banner / Promotional Poster (Upload from Device)"
                    value={form.image}
                    onChange={(newImg) => setForm({ ...form, image: newImg })}
                    required={false}
                    hint="Upload event banner from your device or paste an image link."
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the occasion, special guest dignitaries, agenda, and expectations..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Perks Checklist */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Event Inclusions & Member Perks (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={perksInput}
                    onChange={(e) => setPerksInput(e.target.value)}
                    placeholder="Complimentary Banquet Dining for Family&#10;Priority Venture Allocation Voucher&#10;Live Musical Orchestration"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSaving ? 'Saving to Database...' : editingEvent ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ======================================================== */}
      {deleteConfirmEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Delete Event?</h4>
                <p className="text-xs text-slate-400">
                  Are you sure you want to delete <strong className="text-white">{deleteConfirmEvent.title}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              This event will be deleted from Firestore and immediately removed from the member events calendar.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
