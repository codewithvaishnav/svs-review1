import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building, PhoneCall, KeyRound, LandPlot, 
  Lock, Camera, FileText, CheckCircle2,
  Home, Trees, Sparkles, MapPin, Search, Filter, 
  Download, ArrowRight, ShieldCheck, X, Compass,
  Calendar, Layers, Check, Award, Eye
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { Project, FirestoreCollections } from '../types';

interface PropertySectionProps {
  onOpenBookingModal?: (type: 'hotel' | 'resort' | 'event' | 'cab' | 'site-inspection') => void;
  onDownloadBrochure?: () => void;
  onOpenLogin?: (role?: 'member' | 'associate' | 'admin') => void;
  isLoggedIn?: boolean;
}

export const PropertySection: React.FC<PropertySectionProps> = ({ 
  onOpenBookingModal,
  onDownloadBrochure,
  onOpenLogin,
  isLoggedIn = false
}) => {
  // Live Dynamic Projects directly from Firestore Database
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    // Real-time live Firestore subscription
    const unsubscribeCloud = dbService.subscribeToCollection<Project>(
      FirestoreCollections.VENTURES,
      (cloudProjects) => {
        setProjectsList(cloudProjects || []);
      }
    );

    return () => {
      unsubscribeCloud();
    };
  }, []);

  // Filters State
  const [selectedState, setSelectedState] = useState<'all' | 'telangana' | 'andhra_pradesh'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'plot' | 'villa' | 'apartment'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected project for master plan / details modal
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Counts Calculation
  const counts = useMemo(() => {
    return {
      all: projectsList.length,
      telangana: projectsList.filter(p => p.state === 'telangana').length,
      andhra_pradesh: projectsList.filter(p => p.state === 'andhra_pradesh').length,
      ongoing: projectsList.filter(p => p.status === 'ongoing').length,
      completed: projectsList.filter(p => p.status === 'completed').length,
      upcoming: projectsList.filter(p => p.status === 'upcoming').length,
      plots: projectsList.filter(p => p.propertyType === 'plot').length,
      villas: projectsList.filter(p => p.propertyType === 'villa').length,
      apartments: projectsList.filter(p => p.propertyType === 'apartment').length,
    };
  }, [projectsList]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      // State Filter
      if (selectedState !== 'all' && project.state !== selectedState) {
        return false;
      }
      // Status Filter
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }
      // Property Type Filter
      if (selectedType !== 'all' && project.propertyType !== selectedType) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesLocation = project.location.toLowerCase().includes(query);
        const matchesZone = project.zone.toLowerCase().includes(query);
        const matchesDesc = (project.shortDesc || '').toLowerCase().includes(query);
        const matchesRera = project.reraNumber ? project.reraNumber.toLowerCase().includes(query) : false;
        const matchesApproval = project.approvalType ? project.approvalType.toLowerCase().includes(query) : false;
        return matchesTitle || matchesLocation || matchesZone || matchesDesc || matchesRera || matchesApproval;
      }
      return true;
    });
  }, [projectsList, selectedState, selectedStatus, selectedType, searchQuery]);

  const handleOpenDetails = (project: Project) => {
    setActiveProjectModal(project);
    setActiveGalleryIndex(0);
  };

  const clearAllFilters = () => {
    setSelectedState('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  const isFilterActive = selectedState !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || searchQuery !== '';

  return (
    <section id="property-division" className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Section Header */}
        <div className="bg-emerald-800 rounded-3xl p-6 sm:p-10 text-white border border-emerald-700 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-slate-950" />
              SVS Real Estate & Property Portfolio
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Curated Land & Housing Projects
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm sm:leading-relaxed">
              Explore ongoing developments, ready-to-move completed communities, and upcoming high-growth launches across <strong>Telangana</strong> and <strong>Andhra Pradesh</strong>. Every project features 100% clear titles, DTCP/HMDA/APCRDA approvals, and strict RERA compliance.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-700/80">
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <span className="text-xl sm:text-2xl font-black text-amber-300">2 States</span>
                <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Telangana & Andhra Pradesh</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <span className="text-xl sm:text-2xl font-black text-white">350+ Acres</span>
                <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Developed & Delivered</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <span className="text-xl sm:text-2xl font-black text-amber-300">3 Asset Types</span>
                <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Plots, Villas & Apartments</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <span className="text-xl sm:text-2xl font-black text-white">100%</span>
                <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">Clear Title & RERA Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY FILTER PANEL */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-md space-y-6">
          
          {/* STATE / PROVISION SELECTOR (Top Hierarchy) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Select State / Region (Two States / Provisions)
              </label>
              <span className="text-[11px] font-bold text-slate-500">
                {selectedState === 'all' ? 'Showing all regions' : selectedState === 'telangana' ? 'Filtered: Telangana State' : 'Filtered: Andhra Pradesh State'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* All States Option */}
              <button
                type="button"
                onClick={() => setSelectedState('all')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedState === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌐</span>
                    <span className="font-bold text-sm">All States & Territories</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1 font-medium">
                    All Telangana & AP Projects
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedState === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {counts.all}
                </span>
              </button>

              {/* Telangana State Option */}
              <button
                type="button"
                onClick={() => setSelectedState('telangana')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedState === 'telangana'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏛️</span>
                    <span className="font-bold text-sm">Telangana State</span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 font-medium">
                    Hyderabad, Shadnagar, Shamshabad, Sadashivpet, Yadadri
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedState === 'telangana' ? 'bg-amber-300 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {counts.telangana}
                </span>
              </button>

              {/* Andhra Pradesh State Option */}
              <button
                type="button"
                onClick={() => setSelectedState('andhra_pradesh')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedState === 'andhra_pradesh'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌊</span>
                    <span className="font-bold text-sm">Andhra Pradesh State</span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 font-medium">
                    Amaravati, Visakhapatnam Coast, Vijayawada, Guntur, Tirupati
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedState === 'andhra_pradesh' ? 'bg-amber-300 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {counts.andhra_pradesh}
                </span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5 space-y-4">
            
            {/* ROW: Status Tabs & Property Type Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Project Status Filter Tabs */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  Project Status:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedStatus === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Statuses
                  </button>

                  <button
                    onClick={() => setSelectedStatus('ongoing')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedStatus === 'ongoing'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Ongoing / Active ({counts.ongoing})</span>
                  </button>

                  <button
                    onClick={() => setSelectedStatus('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedStatus === 'completed'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Completed & Delivered ({counts.completed})</span>
                  </button>

                  <button
                    onClick={() => setSelectedStatus('upcoming')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedStatus === 'upcoming'
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Upcoming Pre-Launch ({counts.upcoming})</span>
                  </button>
                </div>
              </div>

              {/* Property Category Filter Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  Property Asset Type:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedType === 'all'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    All Types ({counts.all})
                  </button>

                  <button
                    onClick={() => setSelectedType('plot')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      selectedType === 'plot'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Trees className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open Plots ({counts.plots})</span>
                  </button>

                  <button
                    onClick={() => setSelectedType('villa')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      selectedType === 'villa'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-amber-600" />
                    <span>Luxury Villas ({counts.villas})</span>
                  </button>

                  <button
                    onClick={() => setSelectedType('apartment')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      selectedType === 'apartment'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Apartments ({counts.apartments})</span>
                  </button>
                </div>
              </div>

            </div>

            {/* SEARCH BAR & ACTIVE FILTER RESET */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, highway corridor, RERA ID, or city..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs">
                <span className="font-bold text-slate-600">
                  Showing <strong className="text-amber-700 font-black">{filteredProjects.length}</strong> matching projects
                </span>

                {isFilterActive && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* PROJECTS SHOWCASE GRID */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
              <Building className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">
                {projectsList.length === 0 
                  ? 'No Property Ventures Currently Published' 
                  : 'No projects found matching your criteria'}
              </h3>
              <p className="text-xs text-slate-500">
                {projectsList.length === 0
                  ? 'Verified DTCP, HMDA, and TS-RERA layouts added by SVS Administration will appear here live with site maps and spot registration details.'
                  : 'Try switching the state provision or resetting filters to view all available layouts, villas, and apartments.'}
              </p>
            </div>
            {projectsList.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => {
              const isPlot = project.propertyType === 'plot';
              const isVilla = project.propertyType === 'villa';
              const isApartment = project.propertyType === 'apartment';

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-amber-400"
                >
                  {/* Top Image Container */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

                    {/* Top Status & Category Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                      {/* Status Tag */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
                        project.status === 'ongoing'
                          ? 'bg-emerald-700 text-white'
                          : project.status === 'completed'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-cyan-700 text-white'
                      }`}>
                        {project.status === 'ongoing' ? 'Active / Ongoing' : project.status === 'completed' ? 'Delivered & Complete' : 'Upcoming Pre-Launch'}
                      </span>

                      {/* State Badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs ${
                        project.state === 'telangana'
                          ? 'bg-white/95 text-amber-900 border border-amber-200 backdrop-blur-xs'
                          : 'bg-white/95 text-cyan-900 border border-cyan-200 backdrop-blur-xs'
                      }`}>
                        {project.state === 'telangana' ? '🏛️ Telangana' : '🌊 Andhra Pradesh'}
                      </span>
                    </div>

                    {/* Asset Type Pill on bottom left */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-900 text-[11px] font-bold flex items-center gap-1">
                        {isPlot && <Trees className="w-3 h-3 text-emerald-700" />}
                        {isVilla && <Home className="w-3 h-3 text-amber-600" />}
                        {isApartment && <Building className="w-3 h-3 text-cyan-700" />}
                        <span>{isPlot ? 'Open Plot Venture' : isVilla ? 'Gated Luxury Villa' : 'Residential Apartment'}</span>
                      </span>
                      {project.totalArea && (
                        <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 text-[10px] font-bold">
                          {project.totalArea}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    
                    <div className="space-y-2.5">
                      {/* Project Title & Zone */}
                      <div>
                        <span className="text-[11px] font-bold text-amber-700 block uppercase tracking-wider">
                          {project.zone}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 group-hover:text-emerald-800 transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      {/* Location Pin */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {project.shortDesc}
                      </p>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase">Configuration:</span>
                          <span className="font-bold text-slate-900 block truncate">
                            {project.configuration || 'Custom Layout'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase">Approvals:</span>
                          <span className="font-bold text-emerald-800 block truncate">
                            {project.approvalType || 'DTCP Approved'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase">Possession:</span>
                          <span className="font-bold text-slate-900 block truncate">
                            {project.possession || 'Ready'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase">RERA ID:</span>
                          <span className="font-mono text-slate-700 font-bold block truncate">
                            {project.reraNumber || 'Verified Clear Title'}
                          </span>
                        </div>
                      </div>

                      {/* Highlights Chips */}
                      <div className="space-y-1 pt-1">
                        {project.highlights.slice(0, 2).map((hl, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="truncate">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & CTAs */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Starting Investment:</span>
                          <span className="text-base font-black text-slate-900">
                            {project.startingPrice || 'On Request'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          SVS Member Perks
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenDetails(project)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Layout</span>
                        </button>

                        <button
                          onClick={() => onOpenBookingModal && onOpenBookingModal('site-inspection')}
                          className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Site Visit</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CALLOUT BANNER: On-ground inspections & Video walkthroughs */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              NRI & Resident Buyer Convenience
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Need a Custom Site Visit or Drone Video Inspection?
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our dedicated field officers will take you to any venture across Telangana and Andhra Pradesh in a company vehicle, or dispatch 4K live drone walkthroughs for NRI buyers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBookingModal && onOpenBookingModal('site-inspection')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Schedule Free Site Trip</span>
            </button>
            {onDownloadBrochure && (
              <button
                onClick={onDownloadBrochure}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Master Portfolio</span>
              </button>
            )}
          </div>
        </div>

        {/* MEMBER EXCLUSIVE CCTV & EC VAULT PORTAL */}
        {isLoggedIn ? (
          <div className="rounded-3xl border border-emerald-200 bg-white text-slate-900 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Member Dashboard Active</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Live Plot Surveillance & Certified EC Vault</h3>
              </div>
              <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono border border-slate-200">
                Member Ref: SVS-HYD-8042
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* CCTV Feed 1 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="relative aspect-video rounded-xl bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-emerald-700" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    LIVE STREAM
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono">
                    CAM-01 Shadnagar Gate
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Shadnagar Main Gate Feed</h4>
                <p className="text-[11px] text-slate-500">Night vision & boundary sensor active.</p>
              </div>

              {/* CCTV Feed 2 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="relative aspect-video rounded-xl bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
                  <LandPlot className="w-7 h-7 text-amber-600" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    LIVE STREAM
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono">
                    CAM-04 Amaravati Boundary
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Amaravati Capital Plot Monitor</h4>
                <p className="text-[11px] text-slate-500">Direct supervisor surveillance feed.</p>
              </div>

              {/* EC & Title Vault */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Document & EC Title Vault</h4>
                  <p className="text-[11px] text-slate-500">Download certified Encumbrance Certificates (EC) and mutation passbooks.</p>
                </div>
                <button
                  onClick={() => onDownloadBrochure && onDownloadBrochure()}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Download Certified EC Copy
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-3 shadow-md">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Member Portal: Live Video Feeds & Title Vault
              </h3>
              <p className="text-xs text-slate-600">
                Log in with your SVS membership credentials to access live camera feeds, digital boundary passes, and EC downloads.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={() => onOpenLogin && onOpenLogin('member')}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Log In to Member Portal</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* PROJECT DETAILS & MASTER PLAN MODAL */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                    activeProjectModal.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    activeProjectModal.status === 'completed' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-cyan-100 text-cyan-800 border border-cyan-300'
                  }`}>
                    {activeProjectModal.status === 'ongoing' ? 'Active / Ongoing' : activeProjectModal.status === 'completed' ? 'Completed & Delivered' : 'Upcoming Pre-Launch'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {activeProjectModal.state === 'telangana' ? '🏛️ Telangana State' : '🌊 Andhra Pradesh State'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
                  {activeProjectModal.title}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {activeProjectModal.location}
                </p>
              </div>

              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Viewer */}
            <div className="space-y-2">
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={(activeProjectModal.gallery && activeProjectModal.gallery[activeGalleryIndex]) || activeProjectModal.image} 
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {activeProjectModal.gallery && activeProjectModal.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {activeProjectModal.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeGalleryIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Specs & Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Asset Type</span>
                <span className="font-bold text-slate-900 capitalize">{activeProjectModal.propertyType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Acreage / Scale</span>
                <span className="font-bold text-slate-900">{activeProjectModal.totalArea || 'Standard Layout'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Approvals</span>
                <span className="font-bold text-emerald-800">{activeProjectModal.approvalType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting Price</span>
                <span className="font-bold text-amber-700">{activeProjectModal.startingPrice}</span>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Venture Deliverables & Infrastructure
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeProjectModal.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                RERA Registration: <strong className="text-slate-800">{activeProjectModal.reraNumber || 'Verified Clear Title'}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProjectModal(null);
                    if (onOpenBookingModal) {
                      onOpenBookingModal('site-inspection');
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book a Free Site Visit</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
