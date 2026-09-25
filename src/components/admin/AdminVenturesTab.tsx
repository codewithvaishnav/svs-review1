import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Edit3, Trash2, Search, Filter, MapPin, Tag,
  Sparkles, Home, Trees, DollarSign, X, Check, Eye, ChevronRight,
  Layers, ArrowUpRight, ShieldCheck, CheckCircle2, Image as ImageIcon,
  AlertCircle, RefreshCw, Star
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { Project, FirestoreCollections } from '../../types';
import { DeviceImageUpload } from '../common/DeviceImageUpload';

interface AdminVenturesTabProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_OFFICIAL_VENTURES: Omit<Project, 'id'>[] = [
  {
    title: 'SVS Emerald County',
    zone: 'Shadnagar South Corridor',
    location: 'Near Bangalore Highway (NH-44), Shadnagar, Telangana',
    state: 'telangana',
    propertyType: 'plot',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'DTCP approved mega layout with 60ft blacktop roads, underground drainage, electricity, and water pipelines.',
    highlights: [
      'DTCP & TS-RERA Approved Layout',
      '60ft & 33ft Wide Blacktop Roads',
      'Underground Drainage & Electricity Cabling',
      'Spot Registration with Clear Title Guarantee',
      'Children Play Park & Avenue Plantations'
    ],
    startingPrice: '₹14,500 / sq.yd',
    plotsAvailable: 35,
    totalArea: '45 Acres',
    configuration: '165 - 400 Sq. Yds',
    approvalType: 'DTCP & TS-RERA',
    reraNumber: 'P02400004921',
    possession: 'Immediate Registration',
    isFeatured: true
  },
  {
    title: 'SVS Vasudha Green Valley',
    zone: 'Sadashivpet West Corridor',
    location: 'Mumbai Highway (NH-65), Near NIMZ, Sadashivpet, Telangana',
    state: 'telangana',
    propertyType: 'plot',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDesc: 'Premium open plot venture near national investment manufacturing zone with 100% vaastu compliance.',
    highlights: [
      'Adjacent to NIMZ Sadashivpet Industrial Hub',
      'DTCP Approved & Ready for Construction',
      'Overhead Water Tank & 24/7 Security',
      'High Capital Appreciation Track Record'
    ],
    startingPrice: '₹12,800 / sq.yd',
    plotsAvailable: 22,
    totalArea: '32 Acres',
    configuration: '150 - 300 Sq. Yds',
    approvalType: 'DTCP Approved',
    reraNumber: 'P02400005118',
    possession: 'Ready to Register',
    isFeatured: true
  },
  {
    title: 'SVS Royal Meadows',
    zone: 'Shamshabad Aerocity Corridor',
    location: 'Kothur-Shamshabad Growth Belt, Hyderabad, Telangana',
    state: 'telangana',
    propertyType: 'villa',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    shortDesc: 'Luxury gated villa community featuring clubhouse, swimming pool, jogging track, and solar fencing.',
    highlights: [
      'HMDA Approved Gated Villa Community',
      '15 Mins from Rajiv Gandhi International Airport',
      'Clubhouse with Indoor Games & Banquet Hall',
      'Underground Cabling & Sewage Treatment Plant'
    ],
    startingPrice: '₹1.85 Cr onwards',
    plotsAvailable: 15,
    totalArea: '25 Acres',
    configuration: '3 & 4 BHK Triplex Villas',
    approvalType: 'HMDA & TS-RERA',
    reraNumber: 'P02400006240',
    possession: 'Dec 2026',
    isFeatured: false
  },
  {
    title: 'SVS Amaravati Pride',
    zone: 'Vijayawada-Guntur Capital Belt',
    location: 'Near Mangalagiri Bypass, Andhra Pradesh',
    state: 'andhra_pradesh',
    propertyType: 'plot',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    shortDesc: 'CRDA approved plotted layout in Andhra Pradesh capital region with prime highway connectivity.',
    highlights: [
      'AP CRDA & AP RERA Approved Layout',
      'Close to Mangalagiri AIIMS & Tech Zone',
      'Underground Drainage, Water & Power Grid',
      'Compound Wall for Entire Venture with Arch Gate'
    ],
    startingPrice: '₹18,000 / sq.yd',
    plotsAvailable: 18,
    totalArea: '20 Acres',
    configuration: '200 - 500 Sq. Yds',
    approvalType: 'AP-CRDA & AP-RERA',
    reraNumber: 'P03200001889',
    possession: 'Immediate Registration',
    isFeatured: true
  }
];

export const AdminVenturesTab: React.FC<AdminVenturesTabProps> = ({ onShowToast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'telangana' | 'andhra_pradesh'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'plot' | 'villa' | 'apartment'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    zone: '',
    location: '',
    state: 'telangana',
    propertyType: 'plot',
    status: 'ongoing',
    image: '',
    shortDesc: '',
    highlights: [],
    startingPrice: '',
    plotsAvailable: 25,
    totalArea: '',
    configuration: '',
    approvalType: 'DTCP & TS-RERA',
    reraNumber: '',
    possession: 'Immediate Registration',
    isFeatured: false,
  });
  const [highlightsInput, setHighlightsInput] = useState('');
  const [planImage, setPlanImage] = useState('');

  // Delete Confirmation Modal State
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);

  // Real-time subscription to Firestore VENTURES collection
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = dbService.subscribeToCollection<Project>(
      FirestoreCollections.VENTURES,
      (cloudProjects) => {
        setProjects(cloudProjects || []);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.zone?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.reraNumber?.toLowerCase().includes(q) ||
      p.approvalType?.toLowerCase().includes(q);

    const matchesState = stateFilter === 'all' || p.state === stateFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesType = typeFilter === 'all' || p.propertyType === typeFilter;

    return matchesSearch && matchesState && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setForm({
      id: `proj-${Date.now()}`,
      title: '',
      zone: '',
      location: '',
      state: 'telangana',
      propertyType: 'plot',
      status: 'ongoing',
      image: '',
      shortDesc: '',
      highlights: [],
      startingPrice: '₹14,000 / sq.yd',
      plotsAvailable: 25,
      totalArea: '30 Acres',
      configuration: '165 - 350 Sq. Yds',
      approvalType: 'DTCP & TS-RERA',
      reraNumber: 'P0240000' + Math.floor(1000 + Math.random() * 9000),
      possession: 'Immediate Registration',
      isFeatured: false,
    });
    setHighlightsInput('DTCP Approved Layout\n60ft & 33ft Wide Blacktop Roads\nUnderground Drainage & Electricity Cabling\nSpot Registration with Clear Title');
    setPlanImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setForm({ ...proj });
    setHighlightsInput((proj.highlights || []).join('\n'));
    setPlanImage(proj.gallery?.[0] || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      onShowToast('Please fill in required fields (Title, Location).');
      return;
    }

    setIsSaving(true);
    const cleanedHighlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      id: form.id || `proj-${Date.now()}`,
      title: form.title.trim(),
      zone: form.zone?.trim() || 'Hyderabad Growth Corridor',
      location: form.location.trim(),
      state: form.state || 'telangana',
      propertyType: form.propertyType || 'plot',
      status: form.status || 'ongoing',
      image: form.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      gallery: planImage ? [planImage] : form.gallery || [],
      shortDesc: form.shortDesc?.trim() || 'Approved layout with clear titles and complete infrastructural developments.',
      highlights: cleanedHighlights.length > 0 ? cleanedHighlights : ['DTCP Approved Layout', 'Clear Title Guarantee'],
      startingPrice: form.startingPrice?.trim() || 'Price on Request',
      plotsAvailable: Number(form.plotsAvailable) || 0,
      totalArea: form.totalArea?.trim() || 'Plotted Layout',
      configuration: form.configuration?.trim() || 'Standard Plots',
      approvalType: form.approvalType?.trim() || 'DTCP Approved',
      reraNumber: form.reraNumber?.trim() || 'Clear Title Verified',
      possession: form.possession?.trim() || 'Ready to Register',
      isFeatured: !!form.isFeatured,
    };

    try {
      const res = await dbService.setDocument(FirestoreCollections.VENTURES, projectToSave.id, projectToSave);
      if (res.success) {
        onShowToast(editingProject ? `Updated venture "${projectToSave.title}"` : `Published new venture "${projectToSave.title}"`);
        setIsModalOpen(false);
      } else {
        onShowToast('Failed to save venture: ' + (res.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Error saving venture to Firestore:', err);
      onShowToast('Error saving venture to database: ' + (err?.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmProject) return;
    const p = deleteConfirmProject;
    try {
      await dbService.deleteDocument(FirestoreCollections.VENTURES, p.id);
      onShowToast(`Deleted venture "${p.title}" from live database`);
      setDeleteConfirmProject(null);
    } catch (err: any) {
      console.error('Error deleting venture:', err);
      onShowToast('Error deleting venture: ' + (err?.message || ''));
    }
  };

  const handleToggleFeatured = async (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = !p.isFeatured;
    try {
      await dbService.updateDocument(FirestoreCollections.VENTURES, p.id, { isFeatured: updated });
      onShowToast(`Venture "${p.title}" ${updated ? 'marked as Featured' : 'unmarked from Featured'}`);
    } catch (err: any) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const handleSeedOfficialVentures = async () => {
    setIsSeeding(true);
    try {
      let count = 0;
      for (const sample of SAMPLE_OFFICIAL_VENTURES) {
        const id = `proj-svs-${count + 1}`;
        await dbService.setDocument(FirestoreCollections.VENTURES, id, { ...sample, id });
        count++;
      }
      onShowToast(`Successfully seeded ${count} official SVS ventures into Firestore!`);
    } catch (err: any) {
      console.error('Error seeding ventures:', err);
      onShowToast('Error seeding ventures: ' + (err?.message || ''));
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
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Ventures & Projects Management (Firestore CMS)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Create, update, or remove real estate ventures and upload site imagery. All updates sync instantly to the public Property Section.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {projects.length === 0 && (
            <button
              onClick={handleSeedOfficialVentures}
              disabled={isSeeding}
              className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Populate initial verified SVS ventures"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Ventures'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Venture</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, corridor, or RERA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">All States (Telangana & AP)</option>
          <option value="telangana">Telangana State Only</option>
          <option value="andhra_pradesh">Andhra Pradesh State Only</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">All Lifecycle Statuses</option>
          <option value="ongoing">Active / Open for Sale</option>
          <option value="completed">Completed & Delivered</option>
          <option value="upcoming">Upcoming Pre-Launch</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">All Asset Types</option>
          <option value="plot">Open Land Plots</option>
          <option value="villa">Gated Villas</option>
          <option value="apartment">Apartments</option>
        </select>
      </div>

      {/* Ventures Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
          <p className="text-xs font-bold">Synchronizing Ventures from Firestore...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Ventures Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {projects.length === 0
                ? 'Your Firestore database has no ventures yet. Add your first venture or click Seed Sample Ventures below.'
                : 'No ventures match your filter criteria. Try adjusting your search query.'}
            </p>
          </div>
          {projects.length === 0 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                + Add First Venture
              </button>
              <button
                onClick={handleSeedOfficialVentures}
                disabled={isSeeding}
                className="px-5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Seed Verified SVS Ventures
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              {/* Cover Image & Badges */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      project.status === 'ongoing'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : project.status === 'completed'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-cyan-600 text-white shadow-sm'
                    }`}
                  >
                    {project.status === 'ongoing' ? 'Active / Selling' : project.status === 'completed' ? 'Completed' : 'Pre-Launch'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleFeatured(project, e)}
                      className={`p-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        project.isFeatured
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-amber-300'
                      }`}
                      title={project.isFeatured ? 'Featured on Homepage (Click to disable)' : 'Mark as Featured'}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <span className="px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-amber-300 text-[10px] font-bold">
                      {project.state === 'telangana' ? 'Telangana' : 'Andhra Pradesh'}
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                  <span className="font-black text-white capitalize flex items-center gap-1.5">
                    {project.propertyType === 'plot' && <Trees className="w-3.5 h-3.5 text-emerald-400" />}
                    {project.propertyType === 'villa' && <Home className="w-3.5 h-3.5 text-amber-400" />}
                    {project.propertyType === 'apartment' && <Building2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{project.propertyType}</span>
                  </span>
                  <span className="text-amber-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {project.startingPrice}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                      {project.zone}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {project.plotsAvailable} Plots Left
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-white leading-snug">{project.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.shortDesc || project.location}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      RERA: {project.reraNumber || 'Verified'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {project.approvalType || 'DTCP'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {project.totalArea || 'Layout'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Venture</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmProject(project)}
                    className="py-1.5 px-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                    title="Delete Venture from Database"
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
      {/* MODAL: ADD / EDIT VENTURE */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingProject ? `Edit Venture: ${editingProject.title}` : 'Add New Real Estate Venture'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Saves directly to Firestore collection <code className="text-amber-300">ventures</code>
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
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Venture Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. SVS Emerald County"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Zone / Corridor */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Zone / Corridor *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    placeholder="e.g. Shadnagar South Growth Corridor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Full Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Near Bangalore Highway (NH-44), Shadnagar, Hyderabad, Telangana"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    State Provision *
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="telangana">Telangana State</option>
                    <option value="andhra_pradesh">Andhra Pradesh State</option>
                  </select>
                </div>

                {/* Property Asset Type */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Asset Type *
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="plot">🌲 Open Land Plot</option>
                    <option value="villa">🏡 Gated Villa</option>
                    <option value="apartment">🏢 Residential Apartment</option>
                  </select>
                </div>

                {/* Status / Lifecycle */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Lifecycle Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="ongoing">🟢 Ongoing / Open for Sale</option>
                    <option value="completed">🏆 Completed & Delivered</option>
                    <option value="upcoming">🚀 Upcoming Pre-Launch</option>
                  </select>
                </div>

                {/* Starting Price */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Starting Investment Price *
                  </label>
                  <input
                    type="text"
                    value={form.startingPrice}
                    onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                    placeholder="e.g. ₹14,500 / sq.yd or ₹1.85 Cr"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Total Area */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Total Acreage
                  </label>
                  <input
                    type="text"
                    value={form.totalArea}
                    onChange={(e) => setForm({ ...form, totalArea: e.target.value })}
                    placeholder="e.g. 45 Acres"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Available Plots */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Plots / Units Available
                  </label>
                  <input
                    type="number"
                    value={form.plotsAvailable}
                    onChange={(e) => setForm({ ...form, plotsAvailable: Number(e.target.value) })}
                    placeholder="e.g. 35"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Configuration */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Plot Sizes / Unit Range
                  </label>
                  <input
                    type="text"
                    value={form.configuration}
                    onChange={(e) => setForm({ ...form, configuration: e.target.value })}
                    placeholder="e.g. 165 - 400 Sq. Yds"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Approval Type */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Statutory Approvals
                  </label>
                  <input
                    type="text"
                    value={form.approvalType}
                    onChange={(e) => setForm({ ...form, approvalType: e.target.value })}
                    placeholder="e.g. DTCP & TS-RERA"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* RERA Number */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    RERA Registration Number
                  </label>
                  <input
                    type="text"
                    value={form.reraNumber}
                    onChange={(e) => setForm({ ...form, reraNumber: e.target.value })}
                    placeholder="e.g. P02400004921"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Possession */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Possession Timeline
                  </label>
                  <input
                    type="text"
                    value={form.possession}
                    onChange={(e) => setForm({ ...form, possession: e.target.value })}
                    placeholder="e.g. Immediate Registration"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Highlight as <strong>Featured Venture</strong> on website hero & top showcase
                  </label>
                </div>

                {/* Cover Image Upload (Device) */}
                <div className="sm:col-span-2 pt-2">
                  <DeviceImageUpload
                    label="Venture Cover Image (From Device / File Upload)"
                    value={form.image}
                    onChange={(newImg) => setForm({ ...form, image: newImg })}
                    required={true}
                    hint="Upload photos from phone or computer. Auto-compressed for Firestore storage."
                  />
                </div>

                {/* Master Plan Image Upload (Device) */}
                <div className="sm:col-span-2 pt-2">
                  <DeviceImageUpload
                    label="Layout Master Plan / Blueprint Image (Optional)"
                    value={planImage}
                    onChange={(newImg) => setPlanImage(newImg)}
                    required={false}
                    hint="Upload layout map or architectural blueprint."
                  />
                </div>

                {/* Short Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Venture Overview Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.shortDesc}
                    onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                    placeholder="Provide overview highlights of location advantage, connectivity, and development status..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Highlights */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    Key Highlights Checklist (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="DTCP Approved Layout&#10;60ft & 33ft Wide Blacktop Roads&#10;Underground Drainage&#10;Spot Registration"
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
                  {isSaving ? 'Saving to Database...' : editingProject ? 'Update Venture' : 'Publish Venture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ======================================================== */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Delete Venture?</h4>
                <p className="text-xs text-slate-400">
                  Are you sure you want to permanently delete <strong className="text-white">{deleteConfirmProject.title}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              This action will remove the venture from Firestore and will no longer be visible to visitors or prospective buyers on the website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProject(null)}
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
