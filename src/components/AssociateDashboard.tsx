import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Plus, ArrowRight, Forward, Smartphone, Star, CheckCircle, Download, CheckCircle2, RotateCcw,
  Copy, ShieldCheck, Phone, MapPin, Sparkles, AlertCircle, Building2, UserCheck, Inbox, Clock
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { firestoreService } from '../services/firestoreService';
import { AdminLead, AssociateAccount, FirestoreCollections } from '../types';
import { orderBy, limit } from 'firebase/firestore';

interface AssociateDashboardProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
  onNavigatePublic?: () => void;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  interestedVenture: string;
  budget: string;
  date?: string;
  sourceNote?: string;
  completedDate?: string;
}

export const AssociateDashboard: React.FC<AssociateDashboardProps> = ({
  loggedInUser,
  onShowToast,
}) => {
  const [currentAssociate, setCurrentAssociate] = useState<AssociateAccount | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Direct client pipeline registered by this ASC
  const [leads, setLeads] = useState<Lead[]>([]);

  // Completed / Closed deals archive
  const [completedLeads, setCompletedLeads] = useState<Lead[]>([]);

  // General inquiries forwarded to THIS specific ASC by Head Office Admin
  const [adminForwardedLeads, setAdminForwardedLeads] = useState<Lead[]>([]);

  const [directViewMode, setDirectViewMode] = useState<'active' | 'completed'>('active');

  // Form inputs
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadVenture, setNewLeadVenture] = useState('Royal City (Shadnagar)');

  // 1. Resolve the Associate Profile dynamically from Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadAssociateProfile() {
      setIsLoadingProfile(true);
      const identifier = (loggedInUser || '').trim();

      if (!identifier) {
        // Fallback for default demo associate if no session provided
        try {
          const fallback = await firestoreService.findAssociateByIdentifier('SVS-ASC-441');
          if (isMounted) setCurrentAssociate(fallback);
        } catch (e) {
          console.warn('Error fetching demo associate:', e);
        } finally {
          if (isMounted) setIsLoadingProfile(false);
        }
        return;
      }

      try {
        const profile = await firestoreService.findAssociateByIdentifier(identifier);
        if (isMounted && profile) {
          setCurrentAssociate(profile);
        } else if (isMounted) {
          // If newly registered or code-based fallback
          const isCode = identifier.startsWith('SVS-ASC');
          setCurrentAssociate({
            id: identifier,
            associateCode: isCode ? identifier : `SVS-ASC-${Math.floor(1000 + Math.random() * 9000)}`,
            name: !isCode ? identifier : 'Associate Partner',
            phone: '',
            email: '',
            city: 'Telangana & AP',
            status: 'Active',
            commissionRate: 'Standard Tier (Direct Allocation)',
            activeReferrals: 0,
            completedDeals: 0,
            totalEarnings: 0,
            registeredDate: new Date().toISOString().split('T')[0],
          });
        }
      } catch (err) {
        console.warn('Error loading associate profile:', err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    loadAssociateProfile();
    return () => { isMounted = false; };
  }, [loggedInUser]);

  // Keep associate profile synced with real-time updates (e.g. commission changes by Admin)
  useEffect(() => {
    const unsub = firestoreService.listenAssociates((list) => {
      const activeIdentifier = (currentAssociate?.associateCode || loggedInUser || '').trim().toLowerCase();
      if (!activeIdentifier) return;

      const match = list.find((a) => 
        (a.associateCode && a.associateCode.toLowerCase() === activeIdentifier) ||
        (a.id && a.id.toLowerCase() === activeIdentifier) ||
        (a.phone && a.phone.replace(/[^0-9]/g, '') === activeIdentifier.replace(/[^0-9]/g, '')) ||
        (a.name && a.name.toLowerCase() === activeIdentifier)
      );

      if (match) {
        setCurrentAssociate(match);
      }
    });
    return () => unsub();
  }, [currentAssociate?.associateCode, loggedInUser]);

  // Derive active identifiers for this associate
  const activeCode = currentAssociate?.associateCode || (loggedInUser?.startsWith('SVS-ASC') ? loggedInUser : 'SVS-ASC-441');
  const activeName = currentAssociate?.name || (!loggedInUser?.startsWith('SVS-ASC') ? loggedInUser : 'Associate Partner') || 'Associate Partner';

  // 2. Fetch real leads strictly scoped to THIS associate's code or phone
  useEffect(() => {
    if (!activeCode) return;

    const normalizedCode = activeCode.toLowerCase().trim();
    const phoneDigits = currentAssociate?.phone ? currentAssociate.phone.replace(/[^0-9]/g, '') : '';

    const unsubscribe = dbService.subscribeToCollection<AdminLead>(
      FirestoreCollections.LEADS,
      (allLeads) => {
        const myDirect: Lead[] = [];
        const myDone: Lead[] = [];
        const forwarded: Lead[] = [];

        allLeads.forEach((l) => {
          const leadAssocCode = (l.formData && l.formData['Associate Code']) 
            ? String(l.formData['Associate Code']).toLowerCase().trim() 
            : '';
          const leadAssocMobile = (l.formData && l.formData['Associate Mobile']) 
            ? String(l.formData['Associate Mobile']).replace(/[^0-9]/g, '') 
            : '';
          const notesText = (l.notes || '').toLowerCase();
          const sourceText = (l.source || '').toLowerCase();
          const assignedToCode = (l.assignedTo || '').toLowerCase().trim();
          const formDataAssigned = (l.formData && l.formData['Assigned Associate']) 
            ? String(l.formData['Assigned Associate']).toLowerCase().trim() 
            : '';

          // 1. Direct ownership: lead registered by this associate
          const isDirectOwnership = 
            (leadAssocCode && leadAssocCode === normalizedCode) ||
            notesText.includes(normalizedCode) ||
            sourceText.includes(normalizedCode) ||
            (phoneDigits && leadAssocMobile && leadAssocMobile === phoneDigits);

          // 2. Head Office forwarding: lead assigned explicitly to this associate
          const isAssignedByAdmin = 
            (assignedToCode && assignedToCode === normalizedCode) ||
            (formDataAssigned && formDataAssigned === normalizedCode) ||
            notesText.includes(`assigned to ${normalizedCode}`) ||
            notesText.includes(`forwarded to ${normalizedCode}`);

          const item: Lead = {
            id: l.id,
            name: l.name,
            phone: l.phone,
            interestedVenture: l.service || l.venture || 'SVS Venture',
            budget: (l.formData && l.formData['Budget Range']) || '',
            date: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recent',
            completedDate: l.status === 'Completed' || l.status === 'Registered' ? (l.formData?.['Completed Date'] || 'Completed') : undefined,
            sourceNote: isAssignedByAdmin ? 'Assigned by Head Office' : 'Direct Registration'
          };

          if (isDirectOwnership) {
            if (l.status === 'Completed' || l.status === 'Registered') {
              myDone.push(item);
            } else {
              myDirect.push(item);
            }
          } else if (isAssignedByAdmin) {
            if (l.status === 'Completed' || l.status === 'Registered') {
              myDone.push(item);
            } else {
              forwarded.push(item);
            }
          }
          // Any other lead belongs to another associate or is unassigned public enquiry — strictly excluded!
        });

        setLeads(myDirect);
        setCompletedLeads(myDone);
        setAdminForwardedLeads(forwarded);
      },
      [orderBy('timestamp', 'desc'), limit(100)]
    );

    return () => unsubscribe();
  }, [activeCode, currentAssociate?.phone]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopiedCode(true);
    if (onShowToast) onShowToast(`Copied Associate Code ${activeCode} to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    const leadId = `SVS-ASC-${Date.now()}`;
    const newLeadRecord: AdminLead = {
      id: leadId,
      name: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      category: 'Associate Direct Client',
      service: newLeadVenture,
      status: 'New',
      source: `Associate ${activeName} (${activeCode})`,
      notes: `Registered by Associate ${activeCode} (${activeName})`,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      assignedTo: activeCode,
      formData: {
        'Associate Code': activeCode,
        'Associate Name': activeName,
        'Associate Mobile': currentAssociate?.phone || '',
        'Client Full Name': newLeadName.trim(),
        'Client Phone': newLeadPhone.trim(),
        'Target Venture': newLeadVenture
      }
    };

    // Save directly to Firestore Cloud Database
    await dbService.setDocument(FirestoreCollections.LEADS, leadId, newLeadRecord);

    setNewLeadName('');
    setNewLeadPhone('');
    setDirectViewMode('active');
    if (onShowToast) onShowToast(`Client ${newLeadName.trim()} registered in your pipeline!`);
  };

  const handlePreFillSample = () => {
    setNewLeadName('Srikanth Reddy');
    setNewLeadPhone('+91 98480 12345');
    setNewLeadVenture('Royal City (Shadnagar)');
    if (onShowToast) onShowToast('Sample client details pre-filled. Click "Add to My List" to register!');
  };

  const handleAcceptForwardedLead = async (forwarded: Lead) => {
    await dbService.updateDocument(FirestoreCollections.LEADS, forwarded.id, {
      notes: `Accepted by Associate ${activeCode} (${activeName}) on ${new Date().toISOString()}`,
      status: 'Site Visit Scheduled',
      formData: {
        'Associate Code': activeCode,
        'Associate Name': activeName,
      }
    });
    setDirectViewMode('active');
    if (onShowToast) onShowToast(`Accepted enquiry for ${forwarded.name}. Moved to your active pipeline!`);
  };

  const handleMarkAsCompleted = async (lead: Lead) => {
    const completedDateStr = new Date().toLocaleDateString();
    await dbService.updateDocument(FirestoreCollections.LEADS, lead.id, {
      status: 'Completed',
      notes: `Completed / Plot Booked with Associate ${activeCode} on ${completedDateStr}`,
      formData: {
        'Completed Date': completedDateStr
      }
    });
    if (onShowToast) onShowToast(`Marked ${lead.name}'s deal as Completed / Registered in Firestore!`);
  };

  const handleReopenLead = async (lead: Lead) => {
    await dbService.updateDocument(FirestoreCollections.LEADS, lead.id, {
      status: 'In Progress'
    });
    setDirectViewMode('active');
    if (onShowToast) onShowToast(`Reopened ${lead.name} to active pipeline.`);
  };

  const isBrandNewAssociate = leads.length === 0 && completedLeads.length === 0 && adminForwardedLeads.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Associate Welcome Banner with Real Dynamic Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span>Partner ID: {activeCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hover:text-amber-900 cursor-pointer ml-1"
                  title="Copy Partner ID"
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentAssociate?.status || 'Active'} Partner</span>
              </span>

              {currentAssociate?.city && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{currentAssociate.city}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, <span className="text-emerald-700">{activeName}</span>
            </h1>

            <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong>Commission Slab:</strong> {currentAssociate?.commissionRate || 'Standard Tier (Direct Allocation)'}</span>
              {currentAssociate?.phone && (
                <span>• <strong>Registered Mobile:</strong> {currentAssociate.phone}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-5 shadow-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">My Deals</div>
                <div className="text-xl font-black text-slate-900">{leads.length}</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Admin Leads</div>
                <div className="text-xl font-black text-indigo-700">{adminForwardedLeads.length}</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Closed Deals</div>
                <div className="text-xl font-black text-emerald-700">{completedLeads.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Guide Card for Brand New Associates */}
      {isBrandNewAssociate && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800/60 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to SVS Srivasudha Associate Network</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Your Associate Partner Portal is Active & Ready
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                As a verified partner, your dashboard strictly manages your private client pipeline. Because you are a newly authorized associate, you start with a clean slate. You can register your prospective plot buyers below or receive qualified inquiries forwarded by SVS Head Office.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> 1. Register Buyers
                </span>
                <p className="text-[11px] text-slate-300">
                  Input customer details below to lock them under your Associate ID.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> 2. Site Inspections
                </span>
                <p className="text-[11px] text-slate-300">
                  Schedule direct site visits to Royal City, Paradise Valley, or Gold County.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3. Earn Commission
                </span>
                <p className="text-[11px] text-slate-300">
                  Receive prompt commission payouts upon spot registration and deed clearance.
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreFillSample}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pre-fill Sample Client Enquiry</span>
              </button>
              <span className="text-[11px] text-slate-400">Try registering your first test client to see your pipeline in action!</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Quick Registration Form Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Register New Client Enquiry</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Tagged to Associate: <strong className="text-emerald-700">{activeCode}</strong>
          </span>
        </div>

        <form onSubmit={handleAddLead} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Buyer Name *</label>
            <input
              type="text"
              required
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              placeholder="e.g. Ramesh Varma"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Contact Phone *</label>
            <input
              type="tel"
              required
              value={newLeadPhone}
              onChange={(e) => setNewLeadPhone(e.target.value)}
              placeholder="+91 98765 00000"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Venture</label>
            <select
              value={newLeadVenture}
              onChange={(e) => setNewLeadVenture(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="Royal City (Shadnagar)">Royal City (Shadnagar)</option>
              <option value="Paradise Valley (Yadadri)">Paradise Valley (Yadadri)</option>
              <option value="Gold County (Kothur)">Gold County (Kothur)</option>
              <option value="Aerocity Phase 1 (Mucherla)">Aerocity Phase 1 (Mucherla)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> <span>Add to My List</span>
          </button>
        </form>
      </div>

      {/* Two Lists Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* List 1: My Direct Client Pipeline (with Active / Completed toggle) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            {/* Active / Completed Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setDirectViewMode('active')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  directViewMode === 'active'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Active ({leads.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDirectViewMode('completed')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  directViewMode === 'completed'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed Deals ({completedLeads.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-semibold text-slate-500">
              {directViewMode === 'active' ? 'Follow-ups' : 'Registered archive'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {directViewMode === 'active' ? (
              leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-slate-700">
                    No active direct clients.
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Register a new enquiry above using the form to start tracking your personal buyer pipeline.
                  </p>
                  <button
                    type="button"
                    onClick={handlePreFillSample}
                    className="mt-2 text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl cursor-pointer"
                  >
                    + Pre-fill Sample Buyer
                  </button>
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{lead.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>{lead.interestedVenture}</span>
                      {lead.date && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-medium text-[10px]">
                          {lead.date}
                        </span>
                      )}
                    </div>
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleMarkAsCompleted(lead)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Mark plot deal as completed / registered"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Mark Completed</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : (
              completedLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-slate-700">
                    No completed deals yet.
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    When you close a client plot sale, mark it as completed to archive your registered deals and commission.
                  </p>
                </div>
              ) : (
                completedLeads.map((lead) => (
                  <div key={lead.id} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        {lead.name}
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">{lead.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>{lead.interestedVenture}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {lead.completedDate}
                      </span>
                    </div>
                    <div className="pt-0.5 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleReopenLead(lead)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                        title="Move back to active pipeline"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> <span>Reopen to Active</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* List 2: Admin Forwarded Enquiries (Strictly Leads Assigned to this Associate) */}
        <div className="bg-white rounded-3xl border border-indigo-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Admin Forwarded Enquiries ({adminForwardedLeads.length})
              </h3>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Assigned to {activeCode}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {adminForwardedLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-base font-bold text-slate-700">
                  No pending admin forwarded leads.
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Inquiries assigned directly to your Partner ID ({activeCode}) by SVS Head Office will show up here for you to accept.
                </p>
              </div>
            ) : (
              adminForwardedLeads.map((lead) => (
                <div key={lead.id} className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-2 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{lead.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>{lead.interestedVenture}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{lead.date}</span>
                    <button
                      type="button"
                      onClick={() => handleAcceptForwardedLead(lead)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Accept Lead</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* SVS Official Mobile App Banner Card */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            Official SVS App
          </div>
          <div className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            4.9 Rating
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold tracking-tight text-slate-900 mb-1">
            All Associate & Member Options Available on the App
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download on Google Play Store & Apple App Store for complete on-ground client registration, venture tracking, and live lead notifications.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Client Pipeline & Lead Management</strong> (Instant enquiry registration & direct admin lead routing)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Live Layout & Venture Status</strong> (HMDA / DTCP approvals, plot availability & geo-demarcation)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Legal Documents & Title Vault</strong> (Form 15 EC downloads & RERA certified brochures)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-sm">
          <button
            type="button"
            onClick={() => { if (onShowToast) onShowToast('Opening SVS Official App on Google Play Store...'); }}
            className="py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Play Store</span>
          </button>
          <button
            type="button"
            onClick={() => { if (onShowToast) onShowToast('Opening SVS Official App on Apple App Store...'); }}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>App Store</span>
          </button>
        </div>
      </div>

    </div>
  );
};
