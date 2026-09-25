import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileText, PhoneCall, Plus, 
  Edit3, Trash2, CheckCircle2, AlertCircle, RefreshCw,
  Search, Filter, MapPin, Tag, Sparkles, Home, Trees,
  DollarSign, X, Check, Eye, ChevronRight, Layers, ArrowUpRight,
  CreditCard, Crown, Award, Shield, ArrowRight, Phone, Mail,
  MessageSquare, Calendar, Clock, Globe, Copy, ExternalLink,
  UserCheck, FileCheck, Info, Briefcase, ChevronDown, Smartphone, ShieldCheck,
  PartyPopper
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { Project, AdminLead, MembershipCard, MemberAccount, MemberAppAd, FirestoreCollections, HospitalityItem, AssociateAccount, SvsEvent } from '../types';
import { PROJECTS_DATA, MEMBERSHIP_CARDS, DEFAULT_HOSPITALITY_ITEMS, DEFAULT_APP_AD, getMergedMembershipCards } from '../data/svsData';
import { DeviceImageUpload } from './common/DeviceImageUpload';
import { AdminVenturesTab } from './admin/AdminVenturesTab';
import { AdminEventsTab } from './admin/AdminEventsTab';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'events' | 'members' | 'membership' | 'hospitality' | 'leads' | 'associates'>('projects');
  
  // Dynamic Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<SvsEvent[]>([]);
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>(() => getMergedMembershipCards([]));
  const [hospitality, setHospitality] = useState<HospitalityItem[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [associates, setAssociates] = useState<AssociateAccount[]>([]);
  const [appAd, setAppAd] = useState<MemberAppAd>(DEFAULT_APP_AD);

  // Search & Filters for Associates
  const [associateSearchQuery, setAssociateSearchQuery] = useState('');
  const [associateStatusFilter, setAssociateStatusFilter] = useState<'all' | 'Pending' | 'Active' | 'Suspended'>('all');
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<AssociateAccount | null>(null);
  const [associateForm, setAssociateForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    experienceYears: '2-5 Years',
    pincode: '',
    aadhaarPanNumber: '',
    commissionRate: 'Standard Tier (Direct Allocation)',
    password: 'associate123',
    status: 'Active' as 'Active' | 'Pending' | 'Suspended',
    adminNotes: '',
  });

  // Search & Filters for Members
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberTierFilter, setMemberTierFilter] = useState('all');

  // Search & Filters for Projects
  const [searchQuery, setSearchQuery] = useState('');
  const [projectStateFilter, setProjectStateFilter] = useState<'all' | 'telangana' | 'andhra_pradesh'>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');

  // Search & Filters for Hospitality
  const [hospSearchQuery, setHospSearchQuery] = useState('');
  const [hospTypeFilter, setHospTypeFilter] = useState<'all' | 'resort' | 'hotel' | 'event'>('all');

  // Search & Filters for Leads Queue
  const [leadsSearchQuery, setLeadsSearchQuery] = useState('');
  const [leadsCategoryFilter, setLeadsCategoryFilter] = useState<string>('all');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<string>('all');

  // Modal States for Add / Edit
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberAccount | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [editingMembershipCard, setEditingMembershipCard] = useState<MembershipCard | null>(null);

  const [isHospitalityModalOpen, setIsHospitalityModalOpen] = useState(false);
  const [editingHospitality, setEditingHospitality] = useState<HospitalityItem | null>(null);

  // Full Form Details Inspector Modal State
  const [selectedLeadForInspection, setSelectedLeadForInspection] = useState<AdminLead | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // In-app Confirmation Modal (Replaces browser window.confirm which gets blocked in iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDanger: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDanger: true,
    onConfirm: () => {},
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Load initial data & subscribe to real-time changes directly from Firestore
  useEffect(() => {
    // 1. Live ventures/projects
    const unsubscribeProjects = dbService.subscribeToCollection<Project>(
      FirestoreCollections.VENTURES,
      (cloudProjects) => {
        setProjects(cloudProjects || []);
      }
    );

    // Live events/summits
    const unsubscribeEvents = dbService.subscribeToCollection<SvsEvent>(
      FirestoreCollections.EVENTS,
      (cloudEvents) => {
        setEvents(cloudEvents || []);
      }
    );

    // 2. Live membership cards - always maintain the 4 canonical cards merged with DB edits
    const unsubscribeCards = dbService.subscribeToCollection<MembershipCard>(
      FirestoreCollections.CARDS,
      (cloudCards) => {
        const merged = getMergedMembershipCards(cloudCards || []);
        setMembershipCards(merged);

        // Ensure all 4 canonical cards exist in Firestore so database holds all 4
        if (!cloudCards || cloudCards.length < 4) {
          MEMBERSHIP_CARDS.forEach((defaultCard) => {
            const existsInCloud = cloudCards?.some(
              (c) => c.tier?.toLowerCase().trim() === defaultCard.tier.toLowerCase().trim() || c.id === defaultCard.id
            );
            if (!existsInCloud && defaultCard.id) {
              dbService.setDocument(FirestoreCollections.CARDS, defaultCard.id, defaultCard)
                .catch((err) => console.warn('Could not auto-seed membership card to Firestore:', err));
            }
          });
        }
      }
    );

    // 3. Live hospitality items
    const unsubscribeHosp = dbService.subscribeToCollection<HospitalityItem>(
      FirestoreCollections.HOSPITALITY,
      (cloudHosp) => {
        setHospitality(cloudHosp || []);
      }
    );

    // 4. Live leads strictly from Firestore
    const unsubscribeLeads = firestoreService.listenLeads((remoteLeads) => {
      setLeads(remoteLeads || []);
    });

    // 5. Live members strictly from Firestore
    const unsubscribeMembers = firestoreService.listenMembers((remoteMembers) => {
      setMembers(remoteMembers || []);
    });

    // 6. Live associate accounts strictly from Firestore
    const unsubscribeAssociates = firestoreService.listenAssociates((remoteAssociates) => {
      setAssociates(remoteAssociates || []);
    });

    // 7. App Ad from Firestore
    dbService.getDocument<MemberAppAd>(FirestoreCollections.APP_ADS, 'main_ad')
      .then((cloudAd) => {
        if (cloudAd) setAppAd(cloudAd);
      })
      .catch(() => {});

    return () => {
      unsubscribeProjects();
      unsubscribeEvents();
      unsubscribeCards();
      unsubscribeHosp();
      unsubscribeLeads();
      unsubscribeMembers();
      unsubscribeAssociates();
    };
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // ============================================
  // PROJECT FORM STATE & HANDLERS
  // ============================================
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
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
    plotsAvailable: 20,
    totalArea: '',
    configuration: '',
    approvalType: '',
    reraNumber: '',
    possession: '',
  });
  const [highlightsInput, setHighlightsInput] = useState('');

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      id: `proj-${Date.now()}`,
      title: '',
      zone: '',
      location: '',
      state: 'telangana',
      propertyType: 'plot',
      status: 'ongoing',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      shortDesc: '',
      highlights: ['DTCP Approved Layout', '60ft & 33ft Wide Blacktop Roads', 'Underground Drainage & Electricity'],
      startingPrice: '₹15,000 / sq.yd',
      plotsAvailable: 30,
      totalArea: '40 Acres',
      configuration: '180 - 500 Sq. Yds',
      approvalType: 'DTCP & TS-RERA',
      reraNumber: 'P02400008899',
      possession: 'Immediate Registration',
    });
    setHighlightsInput('DTCP Approved Layout\n60ft & 33ft Wide Blacktop Roads\nUnderground Drainage & Electricity');
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({ ...proj });
    setHighlightsInput((proj.highlights || []).join('\n'));
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.location) {
      showToast('Please fill in required project fields.');
      return;
    }

    const cleanedHighlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      id: projectForm.id || `proj-${Date.now()}`,
      title: projectForm.title || 'Untitled Project',
      zone: projectForm.zone || 'Hyderabad Corridor',
      location: projectForm.location || 'Telangana',
      state: projectForm.state || 'telangana',
      propertyType: projectForm.propertyType || 'plot',
      status: projectForm.status || 'ongoing',
      image: projectForm.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      shortDesc: projectForm.shortDesc || '',
      highlights: cleanedHighlights.length > 0 ? cleanedHighlights : ['Clear Title Layout'],
      startingPrice: projectForm.startingPrice || 'Price on Request',
      plotsAvailable: Number(projectForm.plotsAvailable) || 0,
      totalArea: projectForm.totalArea || '',
      configuration: projectForm.configuration || '',
      approvalType: projectForm.approvalType || 'Approved Layout',
      reraNumber: projectForm.reraNumber || 'Verified Title',
      possession: projectForm.possession || 'Ready',
      isFeatured: projectForm.isFeatured || false,
    };

    dbService.setDocument(FirestoreCollections.VENTURES, projectToSave.id, projectToSave)
      .catch(err => console.error('Error saving project to Firestore:', err));

    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === projectToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = projectToSave;
        return copy;
      }
      return [projectToSave, ...prev];
    });

    setIsProjectModalOpen(false);
    showToast(editingProject ? `Updated project "${projectToSave.title}"` : `Added new project "${projectToSave.title}"`);
  };

  const handleDeleteProject = (proj: Project) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Project "${proj.title}"?`,
      message: `Are you sure you want to permanently delete "${proj.title}"? This venture will immediately be removed from the public website inventory.`,
      confirmLabel: 'Yes, Delete Project',
      isDanger: true,
      onConfirm: () => {
        dbService.deleteDocument(FirestoreCollections.VENTURES, proj.id)
          .catch(err => console.error('Error deleting project from Firestore:', err));
        setProjects(prev => prev.filter(p => p.id !== proj.id));
        closeConfirmModal();
        showToast(`Deleted "${proj.title}"`);
      },
    });
  };

  // ============================================
  // MEMBER ACCOUNTS FORM STATE & HANDLERS
  // ============================================
  const [memberForm, setMemberForm] = useState<Partial<MemberAccount> & { plainPassword?: string }>({
    name: '',
    phone: '',
    email: '',
    tier: 'Gold',
    venture: 'Royal City (Shadnagar HMDA Phase 1)',
    plotNo: 'Plot #15',
    areaSqYd: 200,
    regNumber: 'HMDA/LO/2024/099',
    paidAmount: 1500000,
    totalAmount: 2500000,
    staycationCredits: 2,
    kycStatus: 'Verified',
    status: 'Active',
    plainPassword: '',
  });

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: `SVS-MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      phone: '',
      email: '',
      tier: 'Gold',
      venture: projects[0]?.title || 'Royal City (Shadnagar HMDA Phase 1)',
      plotNo: 'Plot #' + Math.floor(10 + Math.random() * 90),
      areaSqYd: 200,
      regNumber: 'HMDA/LO/2024/099',
      paidAmount: 1500000,
      totalAmount: 2500000,
      staycationCredits: 2,
      kycStatus: 'Verified',
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      notes: 'Active investor profile',
      plainPassword: 'member123'
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (m: MemberAccount) => {
    setEditingMember(m);
    setMemberForm({ ...m, plainPassword: '' });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.phone) {
      showToast('Please fill in Member Name and Phone.');
      return;
    }

    let passwordHash = editingMember?.passwordHash;
    if (memberForm.plainPassword && memberForm.plainPassword.trim()) {
      passwordHash = await authService.hashPassword(memberForm.plainPassword.trim());
    } else if (!editingMember && (!passwordHash || !passwordHash.trim())) {
      passwordHash = await authService.hashPassword('member123');
    }

    const memberToSave: MemberAccount = {
      id: memberForm.id || `MEM-${Date.now()}`,
      memberId: memberForm.memberId || `SVS-MEM-${Date.now()}`,
      name: memberForm.name,
      phone: memberForm.phone,
      email: memberForm.email || 'N/A',
      passwordHash,
      city: memberForm.city || 'Hyderabad',
      country: memberForm.country || 'India',
      tier: memberForm.tier || 'Gold',
      venture: memberForm.venture || 'SVS Venture',
      plotNo: memberForm.plotNo || 'Plot #01',
      areaSqYd: Number(memberForm.areaSqYd) || 200,
      regNumber: memberForm.regNumber || '',
      paidAmount: Number(memberForm.paidAmount) || 0,
      totalAmount: Number(memberForm.totalAmount) || 0,
      staycationCredits: Number(memberForm.staycationCredits) || 0,
      kycStatus: (memberForm.kycStatus as any) || 'Verified',
      registeredDate: memberForm.registeredDate || new Date().toISOString().split('T')[0],
      status: (memberForm.status as any) || 'Active',
      notes: memberForm.notes || '',
    };

    dbService.setDocument(FirestoreCollections.MEMBERS, memberToSave.id, memberToSave)
      .catch(err => console.error('Error saving member to Firestore:', err));

    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === memberToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = memberToSave;
        return copy;
      }
      return [memberToSave, ...prev];
    });

    setIsMemberModalOpen(false);
    showToast(editingMember ? `Updated member "${memberToSave.name}" with secure bcrypt hash` : `Added new member "${memberToSave.name}" with bcrypt password`);
  };

  const handleDeleteMember = (m: MemberAccount) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Member "${m.name}"?`,
      message: `Are you sure you want to remove member account ${m.memberId} (${m.name})?`,
      confirmLabel: 'Yes, Delete Member',
      isDanger: true,
      onConfirm: () => {
        dbService.deleteDocument(FirestoreCollections.MEMBERS, m.id)
          .catch(err => console.error('Error deleting member from Firestore:', err));
        setMembers(prev => prev.filter(item => item.id !== m.id));
        closeConfirmModal();
        showToast(`Deleted member "${m.name}"`);
      },
    });
  };

  // App Ad Update Handlers
  const handleSaveAppAd = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.setDocument(FirestoreCollections.APP_ADS, 'main_ad', appAd)
      .catch(err => console.error('Error saving AppAd to Firestore:', err));
    showToast('Updated Member Companion App Banner settings!');
  };

  // ============================================
  // MEMBERSHIP CARD FORM STATE & HANDLERS (4 TIERS & CUSTOM)
  // ============================================
  const [membershipForm, setMembershipForm] = useState<Partial<MembershipCard>>({
    tier: '',
    subtitle: '',
    discountPerk: '',
    resortNights: '',
    features: [],
    accentColor: 'border-amber-400 text-amber-300',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
  });
  const [membershipFeaturesInput, setMembershipFeaturesInput] = useState('');

  const handleOpenAddMembershipCard = () => {
    setEditingMembershipCard(null);
    setMembershipForm({
      id: `card-${Date.now()}`,
      tier: '',
      subtitle: 'Exclusive Member Tier',
      discountPerk: '15% Flat Discount',
      resortNights: '4 Free Night Stays / Year',
      features: [
        'Dedicated Property Supervisor for Maintenance',
        'Annual Plot Cleaning & Boundary Inspection',
        'Discounted SVS Resort Stays & Banquet Access'
      ],
      accentColor: 'border-amber-400 text-amber-300',
      bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    });
    setMembershipFeaturesInput(
      'Dedicated Property Supervisor for Maintenance\nAnnual Plot Cleaning & Boundary Inspection\nDiscounted SVS Resort Stays & Banquet Access'
    );
    setIsMembershipModalOpen(true);
  };

  const handleOpenEditMembershipCard = (card: MembershipCard) => {
    setEditingMembershipCard(card);
    setMembershipForm({ ...card });
    setMembershipFeaturesInput((card.features || []).join('\n'));
    setIsMembershipModalOpen(true);
  };

  const handleSaveMembershipCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membershipForm.tier || !membershipForm.discountPerk) {
      showToast('Please fill in Tier Name and Discount Perk.');
      return;
    }

    const cleanedFeatures = membershipFeaturesInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const targetId = editingMembershipCard?.id || membershipForm.id || `tier-${(membershipForm.tier || 'custom').toLowerCase().trim()}`;

    const cardToSave: MembershipCard = {
      id: targetId,
      tier: (membershipForm.tier || 'Custom').trim(),
      subtitle: membershipForm.subtitle || 'Privilege Tier',
      discountPerk: membershipForm.discountPerk || '10% Flat Discount',
      resortNights: membershipForm.resortNights || '2 Free Night Stays / Year',
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ['Exclusive Member Privileges'],
      accentColor: membershipForm.accentColor || 'border-slate-300 text-slate-100',
      bgGradient: membershipForm.bgGradient || 'from-slate-900 via-slate-800 to-slate-950',
    };

    dbService.setDocument(FirestoreCollections.CARDS, cardToSave.id, cardToSave)
      .catch(err => console.error('Error saving card to Firestore:', err));

    setMembershipCards(prev => {
      const remaining = prev.filter(c => c.id !== cardToSave.id && c.tier.toLowerCase().trim() !== cardToSave.tier.toLowerCase().trim());
      return getMergedMembershipCards([...remaining, cardToSave]);
    });

    setIsMembershipModalOpen(false);
    showToast(editingMembershipCard ? `Saved changes to "${cardToSave.tier} Card" in database` : `Added new "${cardToSave.tier} Card"`);
  };

  const handleDeleteMembershipCard = (card: MembershipCard) => {
    setConfirmModal({
      isOpen: true,
      title: `Reset "${card.tier} Card"?`,
      message: `Are you sure you want to reset the "${card.tier}" card? Membership cards are always maintained as 4 core tiers (Platinum, Diamond, Gold, Silver). Resetting will restore standard defaults.`,
      confirmLabel: 'Yes, Reset Card',
      isDanger: true,
      onConfirm: () => {
        const targetId = card.id || `tier-${card.tier.toLowerCase().trim()}`;
        dbService.deleteDocument(FirestoreCollections.CARDS, targetId)
          .catch(err => console.error('Error deleting card from Firestore:', err));
        setMembershipCards(prev => {
          const remaining = prev.filter(c => (c.id || c.tier) !== targetId && c.tier.toLowerCase().trim() !== card.tier.toLowerCase().trim());
          return getMergedMembershipCards(remaining);
        });
        closeConfirmModal();
        showToast(`Reset "${card.tier} Card" to standard defaults`);
      },
    });
  };

  // ============================================
  // HOSPITALITY FORM STATE & HANDLERS
  // ============================================
  const [hospForm, setHospForm] = useState<Partial<HospitalityItem>>({
    id: '',
    type: 'resort',
    title: '',
    location: '',
    startingPrice: '',
    image: '',
    description: '',
    features: [],
    badge: '',
  });
  const [hospFeaturesInput, setHospFeaturesInput] = useState('');

  const handleOpenAddHospitality = () => {
    setEditingHospitality(null);
    setHospForm({
      id: `hosp-${Date.now()}`,
      type: 'resort',
      title: '',
      location: '',
      startingPrice: '₹4,500 / Night',
      image: '',
      description: '',
      features: ['Swimming Pool & Lawn Access', 'Complimentary Breakfast', 'Free High-Speed WiFi'],
      badge: 'Eco Retreat',
      capacity: '',
    });
    setHospFeaturesInput('Swimming Pool & Lawn Access\nComplimentary Breakfast\nFree High-Speed WiFi');
    setIsHospitalityModalOpen(true);
  };

  const handleOpenEditHospitality = (item: HospitalityItem) => {
    setEditingHospitality(item);
    setHospForm({ ...item });
    setHospFeaturesInput(item.features ? item.features.join('\n') : '');
    setIsHospitalityModalOpen(true);
  };

  const handleSaveHospitality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospForm.title || !hospForm.location) {
      showToast('Please provide Venue Title and Location.');
      return;
    }
    if (!hospForm.image) {
      showToast('Please upload an image for the venue.');
      return;
    }

    const cleanedFeatures = hospFeaturesInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const itemToSave: HospitalityItem = {
      id: hospForm.id || `hosp-${Date.now()}`,
      type: hospForm.type || 'resort',
      title: hospForm.title || 'Resort / Stay',
      location: hospForm.location || 'Hyderabad',
      startingPrice: hospForm.startingPrice || 'Contact for Tariff',
      image: hospForm.image,
      description: hospForm.description || '',
      features: cleanedFeatures,
      badge: hospForm.badge || 'Verified Venue',
      capacity: hospForm.capacity,
    };

    dbService.setDocument(FirestoreCollections.HOSPITALITY, itemToSave.id, itemToSave)
      .catch(err => console.error('Error saving hospitality item to Firestore:', err));

    setHospitality(prev => {
      const idx = prev.findIndex(h => h.id === itemToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = itemToSave;
        return copy;
      }
      return [itemToSave, ...prev];
    });

    setIsHospitalityModalOpen(false);
    showToast(editingHospitality ? `Updated "${itemToSave.title}"` : `Added "${itemToSave.title}"`);
  };

  const handleDeleteHospitality = (item: HospitalityItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete "${item.title}"?`,
      message: `Are you sure you want to remove "${item.title}" from the Club & Resorts directory?`,
      confirmLabel: 'Yes, Delete Venue',
      isDanger: true,
      onConfirm: () => {
        dbService.deleteDocument(FirestoreCollections.HOSPITALITY, item.id)
          .catch(err => console.error('Error deleting hospitality item from Firestore:', err));
        setHospitality(prev => prev.filter(h => h.id !== item.id));
        closeConfirmModal();
        showToast(`Deleted "${item.title}"`);
      },
    });
  };

  // ============================================
  // LEAD QUEUE HANDLERS & INSPECTOR
  // ============================================
  const handleLeadStatusChange = (leadId: string, newStatus: string) => {
    dbService.updateDocument(FirestoreCollections.LEADS, leadId, { status: newStatus })
      .catch(err => console.error('Error updating lead status in Firestore:', err));
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLeadForInspection && selectedLeadForInspection.id === leadId) {
      setSelectedLeadForInspection({ ...selectedLeadForInspection, status: newStatus });
    }
    showToast(`Lead status updated to "${newStatus}"`);
  };

  const handleAssignLeadToAssociate = (leadId: string, associateCode: string) => {
    const targetAsc = associates.find(a => a.associateCode === associateCode);
    const assignedNote = associateCode 
      ? `[Forwarded to Associate ${targetAsc?.name || associateCode} (${associateCode}) on ${new Date().toLocaleDateString()}]` 
      : '[Unassigned by Admin]';
    
    const updatedNotes = adminNoteInput 
      ? `${adminNoteInput}\n${assignedNote}` 
      : assignedNote;
    setAdminNoteInput(updatedNotes);

    dbService.updateDocument(FirestoreCollections.LEADS, leadId, { 
      assignedTo: associateCode,
      adminNotes: updatedNotes,
      formData: {
        ...(selectedLeadForInspection?.formData || {}),
        'Assigned Associate': associateCode,
        'Assigned Associate Name': targetAsc?.name || associateCode,
      }
    }).catch(err => console.error('Error assigning lead to associate in Firestore:', err));

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedTo: associateCode, adminNotes: updatedNotes } : l));
    if (selectedLeadForInspection && selectedLeadForInspection.id === leadId) {
      setSelectedLeadForInspection({ 
        ...selectedLeadForInspection, 
        assignedTo: associateCode,
        adminNotes: updatedNotes 
      });
    }
    showToast(associateCode ? `Lead forwarded to Partner ${targetAsc?.name || associateCode} (${associateCode})` : 'Lead marked as Unassigned');
  };

  const handleOpenLeadInspector = (lead: AdminLead) => {
    setSelectedLeadForInspection(lead);
    setAdminNoteInput(lead.adminNotes || '');
  };

  const handleSaveLeadAdminNotes = (leadId: string) => {
    dbService.updateDocument(FirestoreCollections.LEADS, leadId, { adminNotes: adminNoteInput })
      .catch(err => console.error('Error saving lead admin notes to Firestore:', err));
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, adminNotes: adminNoteInput } : l));
    if (selectedLeadForInspection && selectedLeadForInspection.id === leadId) {
      setSelectedLeadForInspection({ ...selectedLeadForInspection, adminNotes: adminNoteInput });
    }
    showToast('Admin followup notes saved successfully.');
  };

  const handleCopyLeadSummary = (lead: AdminLead) => {
    const lines = [
      `📋 *SVS TRUE WEALTH LEAD SUMMARY*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🆔 *Ref ID:* ${lead.id}`,
      `📂 *Category:* ${lead.category || 'General'}`,
      `📅 *Submission Date:* ${lead.date}`,
      `👤 *Customer Name:* ${lead.name}`,
      `📞 *Mobile:* ${lead.phone}`,
      `✉️ *Email:* ${lead.email || 'N/A'}`,
      lead.city ? `📍 *Location:* ${lead.city}${lead.country ? `, ${lead.country}` : ''}` : '',
      `🎯 *Service Requested:* ${lead.service || 'General Inquiry'}`,
      lead.preferredDate ? `🗓️ *Preferred Date:* ${lead.preferredDate}` : '',
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📝 *Submitted Form Fields:*`,
    ];

    if (lead.formData && Object.keys(lead.formData).length > 0) {
      Object.entries(lead.formData).forEach(([k, v]) => {
        lines.push(`• *${k}:* ${v}`);
      });
    } else if (lead.notes) {
      lines.push(`• *Notes / Details:* ${lead.notes}`);
    }

    if (lead.adminNotes) {
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`📌 *Internal Admin Notes:* ${lead.adminNotes}`);
    }

    const textToCopy = lines.filter(Boolean).join('\n');
    navigator.clipboard.writeText(textToCopy);
    showToast('Lead details copied to clipboard!');
  };

  const handleDeleteLead = (lead: AdminLead) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Lead "${lead.id}"?`,
      message: `Are you sure you want to delete the customer inquiry from ${lead.name} (${lead.phone})?`,
      confirmLabel: 'Yes, Delete Record',
      isDanger: true,
      onConfirm: () => {
        dbService.deleteDocument(FirestoreCollections.LEADS, lead.id)
          .catch(err => console.error('Error deleting lead from Firestore:', err));
        setLeads(prev => prev.filter(l => l.id !== lead.id));
        if (selectedLeadForInspection && selectedLeadForInspection.id === lead.id) {
          setSelectedLeadForInspection(null);
        }
        closeConfirmModal();
        showToast('Inquiry record deleted.');
      },
    });
  };

  // ============================================
  // ASSOCIATE PARTNER HANDLERS & APPROVAL WORKFLOW
  // ============================================
  const handleOpenAddAssociate = () => {
    setEditingAssociate(null);
    setAssociateForm({
      name: '',
      phone: '',
      email: '',
      city: 'Hyderabad',
      experienceYears: '2-5 Years',
      pincode: '500081',
      aadhaarPanNumber: '',
      commissionRate: 'Standard Tier (Direct Allocation)',
      password: 'associate123',
      status: 'Active',
      adminNotes: 'Directly onboarded by SVS Administration',
    });
    setIsAssociateModalOpen(true);
  };

  const handleOpenEditAssociate = (asc: AssociateAccount) => {
    setEditingAssociate(asc);
    setAssociateForm({
      name: asc.name || '',
      phone: asc.phone || '',
      email: asc.email || '',
      city: asc.city || '',
      experienceYears: asc.experienceYears || '2-5 Years',
      pincode: asc.pincode || '',
      aadhaarPanNumber: asc.aadhaarPanNumber || '',
      commissionRate: asc.commissionRate || 'Standard Tier (Direct Allocation)',
      password: '',
      status: asc.status || 'Active',
      adminNotes: asc.adminNotes || '',
    });
    setIsAssociateModalOpen(true);
  };

  const handleSaveAssociate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!associateForm.name.trim() || !associateForm.phone.trim()) {
      showToast('Please provide Associate Name and Phone Number.');
      return;
    }

    let passwordHash = editingAssociate?.passwordHash;
    if (associateForm.password && associateForm.password.trim()) {
      passwordHash = await authService.hashPassword(associateForm.password.trim());
    } else if (!editingAssociate && (!passwordHash || !passwordHash.trim())) {
      passwordHash = await authService.hashPassword('associate123');
    }

    const nowStr = new Date().toISOString().split('T')[0];
    const generatedCode = editingAssociate?.associateCode || `SVS-ASC-${Math.floor(100000 + Math.random() * 900000)}`;

    const ascToSave: AssociateAccount = {
      id: editingAssociate?.id || generatedCode,
      associateCode: generatedCode,
      name: associateForm.name.trim(),
      phone: associateForm.phone.trim(),
      email: associateForm.email.trim(),
      passwordHash,
      city: associateForm.city.trim() || 'Telangana',
      experienceYears: associateForm.experienceYears,
      pincode: associateForm.pincode.trim(),
      aadhaarPanNumber: associateForm.aadhaarPanNumber.trim(),
      commissionRate: associateForm.commissionRate,
      status: associateForm.status,
      timestamp: editingAssociate?.timestamp || Date.now(),
      registeredDate: editingAssociate?.registeredDate || nowStr,
      approvedDate: associateForm.status === 'Active' ? (editingAssociate?.approvedDate || nowStr) : undefined,
      activeReferrals: editingAssociate?.activeReferrals || 0,
      completedDeals: editingAssociate?.completedDeals || 0,
      totalEarnings: editingAssociate?.totalEarnings || 0,
      adminNotes: associateForm.adminNotes.trim(),
    };

    try {
      await firestoreService.saveAssociate(ascToSave);
      setAssociates(prev => {
        const idx = prev.findIndex(a => (a.id || a.associateCode) === ascToSave.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = ascToSave;
          return copy;
        }
        return [ascToSave, ...prev];
      });
      setIsAssociateModalOpen(false);
      showToast(editingAssociate ? `Updated Associate ${ascToSave.name}` : `Added Associate ${ascToSave.name} (${ascToSave.associateCode})`);
    } catch (err) {
      console.error('Error saving associate:', err);
      showToast('Error saving Associate Partner. Please retry.');
    }
  };

  const handleApproveAssociate = async (identifier: string, name?: string) => {
    try {
      const res = await firestoreService.approveAssociate(identifier, `Approved by SVS Administration`);
      const nowStr = new Date().toISOString().split('T')[0];

      setAssociates(prev => prev.map(a => 
        (a.id === identifier || a.associateCode === identifier || a.associateCode === res.associateCode) 
          ? { ...a, status: 'Active', approvedDate: nowStr } 
          : a
      ));

      setLeads(prev => prev.map(l => 
        (l.id === identifier || (l.notes && l.notes.includes(res.associateCode)))
          ? { ...l, status: 'Completed', adminNotes: `Approved as Active Associate Partner (${res.associateCode}) on ${nowStr}` }
          : l
      ));

      if (selectedLeadForInspection) {
        setSelectedLeadForInspection(prev => prev ? { 
          ...prev, 
          status: 'Completed', 
          adminNotes: `Approved as Active Associate Partner (${res.associateCode}) on ${nowStr}` 
        } : null);
      }

      showToast(`🎉 Associate Partner "${name || res.name}" (${res.associateCode}) Approved! They can now log in.`);
    } catch (err) {
      console.error('Error approving associate:', err);
      showToast('Failed to approve associate. Please check logs.');
    }
  };

  const handleToggleAssociateStatus = async (asc: AssociateAccount) => {
    const nextStatus = asc.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const updated: AssociateAccount = {
        ...asc,
        status: nextStatus,
        approvedDate: nextStatus === 'Active' ? (asc.approvedDate || new Date().toISOString().split('T')[0]) : asc.approvedDate,
      };
      await firestoreService.saveAssociate(updated);
      setAssociates(prev => prev.map(a => (a.id || a.associateCode) === (asc.id || asc.associateCode) ? updated : a));
      showToast(`Associate ${asc.name} is now ${nextStatus}`);
    } catch (err) {
      console.error('Error toggling associate status:', err);
      showToast('Failed to update associate status.');
    }
  };

  const handleDeleteAssociate = (asc: AssociateAccount) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Associate "${asc.name}"?`,
      message: `Are you sure you want to permanently delete Associate Partner account ${asc.associateCode} (${asc.name})? Their account will be removed and they will no longer have access to the partner portal.`,
      confirmLabel: 'Yes, Delete Associate',
      isDanger: true,
      onConfirm: async () => {
        try {
          await firestoreService.deleteAssociate(asc.id || asc.associateCode);
          setAssociates(prev => prev.filter(a => (a.id || a.associateCode) !== (asc.id || asc.associateCode)));
          closeConfirmModal();
          showToast(`Deleted Associate "${asc.name}"`);
        } catch (err) {
          console.error('Error deleting associate:', err);
          showToast('Failed to delete associate.');
        }
      },
    });
  };

  const handleCopyAssociateCredentials = (asc: AssociateAccount) => {
    const info = [
      `🏛️ SVS TRUE WEALTH - ASSOCIATE PARTNER ACCESS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 Name: ${asc.name}`,
      `🆔 Associate Code: ${asc.associateCode}`,
      `📞 Registered Mobile: ${asc.phone}`,
      `🌐 Portal: Open SVS Website -> "Associate Login"`,
      `🔑 Login Identifier: ${asc.associateCode} OR Mobile ${asc.phone}`,
      `🔒 Default Password: Provided during enrollment (or set by Admin)`,
      `Status: ${asc.status}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');
    navigator.clipboard.writeText(info);
    showToast(`Copied ${asc.name}'s login credentials to clipboard!`);
  };

  const handleRefreshDatabase = () => {
    firestoreService.listenLeads((remoteLeads) => setLeads(remoteLeads || []));
    firestoreService.listenMembers((remoteMembers) => setMembers(remoteMembers || []));
    firestoreService.listenAssociates((remoteAssociates) => setAssociates(remoteAssociates || []));
    showToast('Refreshed data directly from database.');
  };

  // Filtered Leads View
  const filteredLeads = leads.filter((lead) => {
    if (leadsCategoryFilter !== 'all' && (lead.category || 'General Inquiry') !== leadsCategoryFilter) return false;
    if (leadsStatusFilter !== 'all' && lead.status !== leadsStatusFilter) return false;
    if (leadsSearchQuery.trim()) {
      const q = leadsSearchQuery.toLowerCase();
      const matchBasic = 
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.service && lead.service.toLowerCase().includes(q)) ||
        lead.id.toLowerCase().includes(q) ||
        (lead.city && lead.city.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q));
      
      if (matchBasic) return true;

      // Check inside formData object
      if (lead.formData) {
        const matchFormData = Object.values(lead.formData).some((v) => 
          String(v).toLowerCase().includes(q)
        );
        if (matchFormData) return true;
      }
      return false;
    }
    return true;
  });

  // Filtered Projects View
  const filteredProjects = projects.filter((p) => {
    if (projectStateFilter !== 'all' && p.state !== projectStateFilter) return false;
    if (projectStatusFilter !== 'all' && p.status !== projectStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        (p.reraNumber && p.reraNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* TOAST NOTIFICATION - Positioned cleanly on top of / above SVS AI floating button */}
      {notification && (
        <div 
          id="admin-toast-notification"
          className="fixed bottom-24 right-5 sm:bottom-24 sm:right-6 z-[9999] px-4 py-3 bg-emerald-600/95 backdrop-blur-md border border-emerald-400/40 text-white rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-sm sm:max-w-md pointer-events-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span className="flex-1 leading-snug">{notification}</span>
          <button 
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-200 hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ADMIN TOPBAR */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
            SVS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base text-white">Central Admin Control Tower</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                LIVE CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Dynamic Management for Real Estate, NRI Services & Hospitality</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshDatabase}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Refresh Database Connection"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Refresh DB</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-black border border-rose-500/30 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* ADMIN NAVIGATION TABS */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Member Accounts ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Property Ventures ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'events'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            <span>Events & Summits ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'membership'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Membership Cards ({membershipCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hospitality')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'hospitality'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Club & Resorts ({hospitality.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Inquiries & Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('associates')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer relative ${
              activeTab === 'associates'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Associate Partners ({associates.length})</span>
            {associates.filter(a => a.status === 'Pending').length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                activeTab === 'associates' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950 animate-pulse'
              }`}>
                <span>{associates.filter(a => a.status === 'Pending').length} Pending</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">

        {/* ======================================================== */}
        {/* TAB 0: MEMBER ACCOUNTS & DYNAMIC PROMO CMS */}
        {/* ======================================================== */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Header & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  Verified Member Accounts & Sync Hub ({members.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Manage member tiers, plot allotments, staycation credits, and the in-app promo banner.
                </p>
              </div>

              <button
                onClick={handleOpenAddMember}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Member Account</span>
              </button>
            </div>

            {/* Member Search & Filters */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Search by Name, Member ID, Phone, Venture, or Plot..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={memberTierFilter}
                onChange={(e) => setMemberTierFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300"
              >
                <option value="all">All Tiers</option>
                <option value="Silver">Silver Tier</option>
                <option value="Gold">Gold Tier</option>
                <option value="Diamond">Diamond Tier</option>
                <option value="Platinum">Platinum Tier</option>
              </select>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members
                .filter((m) => {
                  const matchSearch =
                    m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                    m.memberId.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                    m.phone.includes(memberSearchQuery) ||
                    m.venture.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                    m.plotNo.toLowerCase().includes(memberSearchQuery.toLowerCase());
                  const matchTier = memberTierFilter === 'all' || m.tier === memberTierFilter;
                  return matchSearch && matchTier;
                })
                .map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          m.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          m.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                          m.tier === 'Gold' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          'bg-slate-500/20 text-slate-300 border-slate-500/40'
                        }`}>
                          {m.tier} Tier
                        </span>

                        <span className="font-mono text-xs font-bold text-slate-400">
                          {m.memberId}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-white">{m.name}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{m.phone}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5 text-xs">
                        <div className="text-emerald-400 font-bold">{m.plotNo} ({m.areaSqYd} Sq.Yds)</div>
                        <div className="text-slate-400 text-[11px] truncate">{m.venture}</div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400">Stay Credits:</span>
                          <span className="font-black text-amber-300">{m.staycationCredits} Nights</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleOpenEditMember(m)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMember(m)}
                        className="p-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 cursor-pointer transition-all"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* App Ad / Announcement Banner Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-white">Member Companion Mobile App Promo Banner (CMS)</h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-bold">Banner Status:</label>
                  <button
                    onClick={() => {
                      const updated = { ...appAd, isActive: !appAd.isActive };
                      setAppAd(updated);
                      dbService.setDocument(FirestoreCollections.APP_ADS, 'main_ad', updated)
                        .catch(err => console.error('Error saving AppAd banner status:', err));
                      showToast(`Member app promo banner ${updated.isActive ? 'Enabled' : 'Disabled'}`);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      appAd.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {appAd.isActive ? 'Active on Portal' : 'Hidden'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveAppAd} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Promo Title</label>
                  <input
                    type="text"
                    value={appAd.title}
                    onChange={(e) => setAppAd({ ...appAd, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Badge Text</label>
                  <input
                    type="text"
                    value={appAd.badge}
                    onChange={(e) => setAppAd({ ...appAd, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-bold">Subtitle & Marketing Message</label>
                  <input
                    type="text"
                    value={appAd.subtitle}
                    onChange={(e) => setAppAd({ ...appAd, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all"
                  >
                    Save Promo Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* ======================================================== */}
        {/* TAB 1: PROPERTY & LAND VENTURES MANAGER (FIRESTORE CRUD) */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <AdminVenturesTab onShowToast={showToast} />
        )}

        {/* ======================================================== */}
        {/* TAB: EVENTS & SUMMITS MANAGER (FIRESTORE CRUD) */}
        {/* ======================================================== */}
        {activeTab === 'events' && (
          <AdminEventsTab onShowToast={showToast} />
        )}

        {/* ======================================================== */}
        {/* TAB 2: SVS MEMBERSHIP PRIVILEGE CARDS (4 TIERS & CUSTOM) */}
        {/* ======================================================== */}
        {activeTab === 'membership' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Srivasudha Membership Privilege Cards ({membershipCards.length} Cards Live CMS)
                </h2>
                <p className="text-xs text-slate-400">
                  Manage the 4 core membership cards (Platinum, Diamond, Gold, Silver & any custom tiers) displayed directly in the public Srivasudha Membership Division.
                </p>
              </div>

              <button
                onClick={handleOpenAddMembershipCard}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Membership Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {membershipCards.map((card) => (
                <div
                  key={card.id || card.tier}
                  className={`rounded-3xl p-6 bg-gradient-to-b ${card.bgGradient || 'from-slate-900 via-slate-800 to-slate-950'} border border-slate-700/80 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${card.accentColor || 'border-slate-300 text-slate-100'}`}>
                        {card.tier} Tier
                      </span>
                      <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white">{card.tier} Card</h3>
                      <p className="text-xs text-slate-300">{card.subtitle}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                      <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                        <span>Discount Privilege:</span>
                        <span className="text-sm font-black text-emerald-400">{card.discountPerk}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center justify-between">
                        <span>Free Resort Stay:</span>
                        <span className="font-semibold text-slate-200">{card.resortNights}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Included Perks ({card.features?.length || 0}):</div>
                      <ul className="space-y-1.5">
                        {(card.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 border-t border-slate-700/60">
                    <button
                      onClick={() => handleOpenEditMembershipCard(card)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Card</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMembershipCard(card)}
                      className="py-2 px-3 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs border border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: HOSPITALITY & RESORTS CATALOG */}
        {/* ======================================================== */}
        {activeTab === 'hospitality' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-amber-400" />
                  SVS Club, Hotels & Resorts Catalog (Live CMS)
                </h2>
                <p className="text-xs text-slate-400">
                  Manage hospitality venues, tariffs, images, and banquet spaces shown on the Club & Resorts section.
                </p>
              </div>

              <button
                onClick={handleOpenAddHospitality}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Resort / Venue</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={hospSearchQuery}
                  onChange={(e) => setHospSearchQuery(e.target.value)}
                  placeholder="Search venues by title, location, or amenities..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                {hospSearchQuery && (
                  <button
                    onClick={() => setHospSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'All Venues', count: hospitality.length },
                  { id: 'resort', label: '🌴 Eco Resorts', count: hospitality.filter(h => h.type === 'resort').length },
                  { id: 'hotel', label: '🏨 Hotels', count: hospitality.filter(h => h.type === 'hotel').length },
                  { id: 'event', label: '🎉 Banquets', count: hospitality.filter(h => h.type === 'event').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHospTypeFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      hospTypeFilter === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      hospTypeFilter === tab.id ? 'bg-slate-900 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Venues Grid or Empty State */}
            {hospitality.filter(item => {
              const matchesSearch = hospSearchQuery === '' ||
                item.title.toLowerCase().includes(hospSearchQuery.toLowerCase()) ||
                (item.location && item.location.toLowerCase().includes(hospSearchQuery.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(hospSearchQuery.toLowerCase()));
              const matchesType = hospTypeFilter === 'all' || item.type === hospTypeFilter;
              return matchesSearch && matchesType;
            }).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto border border-slate-700">
                  <Home className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-white">No Hospitality Venues Found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {hospitality.length === 0 
                      ? 'No venues are currently in the database. Click below to add your first official resort, hotel suite, or banquet space.'
                      : 'No venues match your current search or category filter.'}
                  </p>
                </div>
                {hospitality.length === 0 ? (
                  <button
                    onClick={handleOpenAddHospitality}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add First Venue</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setHospSearchQuery('');
                      setHospTypeFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitality.filter(item => {
                  const matchesSearch = hospSearchQuery === '' ||
                    item.title.toLowerCase().includes(hospSearchQuery.toLowerCase()) ||
                    (item.location && item.location.toLowerCase().includes(hospSearchQuery.toLowerCase())) ||
                    (item.description && item.description.toLowerCase().includes(hospSearchQuery.toLowerCase()));
                  const matchesType = hospTypeFilter === 'all' || item.type === hospTypeFilter;
                  return matchesSearch && matchesType;
                }).map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase border border-slate-700">
                        {item.type}
                      </div>
                      {item.badge && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
                          {item.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        <h3 className="font-black text-sm text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                        
                        <div className="text-xs font-black text-amber-400 pt-1">
                          {item.startingPrice}
                        </div>

                        {item.features && item.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.features.slice(0, 3).map((f, i) => (
                              <span key={i} className="text-[10px] bg-slate-850 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                                {f}
                              </span>
                            ))}
                            {item.features.length > 3 && (
                              <span className="text-[10px] text-slate-500 self-center">
                                +{item.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditHospitality(item)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteHospitality(item)}
                          className="py-2 px-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-xl border border-rose-500/20 cursor-pointer transition-all"
                          title="Delete Venue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: UNIFIED CUSTOMER INQUIRIES & FULL FORM QUEUE */}
        {/* ======================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Header & KPI Summary */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-white">
                      Form Submissions & Leads Queue
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                      {leads.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time queue capturing all customer form submissions with full visitor profile, requested service, and submitted form parameters.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleRefreshDatabase}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    title="Refresh live leads directly from database"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Refresh Leads</span>
                  </button>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `svs_leads_export_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Exported leads queue to JSON.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* KPI Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Queue</div>
                  <div className="text-lg font-black text-white">{leads.length}</div>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 space-y-0.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">New / Uncontacted</div>
                  <div className="text-lg font-black text-emerald-300">
                    {leads.filter(l => (l.status || 'New') === 'New').length}
                  </div>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 space-y-0.5">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">Site Visits</div>
                  <div className="text-lg font-black text-amber-300">
                    {leads.filter(l => l.category === 'Site Visit' || l.status === 'Site Visit Scheduled').length}
                  </div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 space-y-0.5">
                  <div className="text-[10px] font-bold text-blue-400 uppercase">NRI Care Plans</div>
                  <div className="text-lg font-black text-blue-300">
                    {leads.filter(l => l.category === 'NRI Services').length}
                  </div>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 space-y-0.5">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">Hospitality</div>
                  <div className="text-lg font-black text-purple-300">
                    {leads.filter(l => l.category === 'Hospitality').length}
                  </div>
                </div>
                <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 space-y-0.5">
                  <div className="text-[10px] font-bold text-rose-400 uppercase">Partners & Jobs</div>
                  <div className="text-lg font-black text-rose-300">
                    {leads.filter(l => l.category === 'Associate Partner' || l.category === 'Career').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadsSearchQuery}
                    onChange={(e) => setLeadsSearchQuery(e.target.value)}
                    placeholder="Search by Applicant Name, Phone, Email, Ref ID, Venture, or any submitted field..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                  {leadsSearchQuery && (
                    <button
                      onClick={() => setLeadsSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Status:</span>
                  <select
                    value={leadsStatusFilter}
                    onChange={(e) => setLeadsStatusFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Statuses ({leads.length})</option>
                    <option value="New">🟢 New ({leads.filter(l => (l.status || 'New') === 'New').length})</option>
                    <option value="Contacted">🟡 Contacted ({leads.filter(l => l.status === 'Contacted').length})</option>
                    <option value="Site Visit Scheduled">🔵 Site Visit Scheduled ({leads.filter(l => l.status === 'Site Visit Scheduled').length})</option>
                    <option value="In Review">🟣 In Review ({leads.filter(l => l.status === 'In Review').length})</option>
                    <option value="Completed">✅ Completed ({leads.filter(l => l.status === 'Completed').length})</option>
                    <option value="Closed / Lost">❌ Closed / Lost ({leads.filter(l => l.status === 'Closed / Lost').length})</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Submissions', count: leads.length },
                  { id: 'Site Visit', label: 'Site Visits', count: leads.filter(l => l.category === 'Site Visit').length },
                  { id: 'NRI Services', label: 'NRI Care & Services', count: leads.filter(l => l.category === 'NRI Services').length },
                  { id: 'Hospitality', label: 'Hospitality & Resorts', count: leads.filter(l => l.category === 'Hospitality').length },
                  { id: 'Associate Partner', label: 'Associate Partners', count: leads.filter(l => l.category === 'Associate Partner').length },
                  { id: 'Career', label: 'Careers & HR', count: leads.filter(l => l.category === 'Career').length },
                  { id: 'Property', label: 'Property Inquiries', count: leads.filter(l => l.category === 'Property').length },
                  { id: 'General Inquiry', label: 'General Inquiries', count: leads.filter(l => (l.category || 'General Inquiry') === 'General Inquiry').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLeadsCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      leadsCategoryFilter === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      leadsCategoryFilter === tab.id ? 'bg-slate-900 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Queue List */}
            {filteredLeads.length === 0 ? (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-black text-white">No submissions match your active filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting "All Submissions" to see other form entries.
                </p>
                <button
                  onClick={() => {
                    setLeadsSearchQuery('');
                    setLeadsCategoryFilter('all');
                    setLeadsStatusFilter('all');
                  }}
                  className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredLeads.map((lead) => {
                  const categoryBadgeColor = 
                    lead.category === 'Site Visit' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                    lead.category === 'NRI Services' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                    lead.category === 'Hospitality' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                    lead.category === 'Associate Partner' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                    lead.category === 'Career' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' :
                    lead.category === 'Property' ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700';

                  const fieldsCount = lead.formData ? Object.keys(lead.formData).length : (lead.notes ? 3 : 1);

                  return (
                    <div 
                      key={lead.id}
                      className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-4 sm:p-5 shadow-lg space-y-4"
                    >
                      {/* Top Meta Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                            #{lead.id}
                          </span>
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${categoryBadgeColor}`}>
                            {lead.category || 'General Inquiry'}
                          </span>
                          <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                            Source: {lead.source || 'Website Form'}
                          </span>
                          {lead.assignedTo && (
                            <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-700/60 flex items-center gap-1">
                              <span>Assigned: {lead.assignedTo}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{lead.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Data Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* Customer Profile Column */}
                        <div className="lg:col-span-4 space-y-2">
                          <div className="space-y-0.5">
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Applicant / Customer</div>
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                              <span>{lead.name}</span>
                            </h3>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <a 
                                href={`tel:${lead.phone}`}
                                className="font-mono font-bold hover:text-amber-400 transition-colors"
                              >
                                {lead.phone}
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20SVS%20True%20Wealth.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold border border-emerald-500/30 transition-colors"
                                title="Open WhatsApp Chat"
                              >
                                WhatsApp
                              </a>
                            </div>

                            {lead.email && lead.email !== 'N/A' && (
                              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <a href={`mailto:${lead.email}`} className="hover:text-slate-200 truncate">
                                  {lead.email}
                                </a>
                              </div>
                            )}

                            {(lead.city || lead.country) && (
                              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{lead.city}{lead.country && lead.city ? `, ${lead.country}` : lead.country}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Service & Submitted Form Highlight */}
                        <div className="lg:col-span-5 space-y-2 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">
                              Service Requested & Intent
                            </div>
                            <div className="text-xs font-black text-white">
                              {lead.service || 'General Inquiry'}
                            </div>
                          </div>

                          {/* Quick Highlights from Form Fields */}
                          <div className="space-y-1 text-xs pt-1 border-t border-slate-800/60">
                            {lead.preferredDate && (
                              <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-semibold">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                <span>Preferred Date: {lead.preferredDate}</span>
                              </div>
                            )}

                            {lead.formData && Object.keys(lead.formData).length > 0 ? (
                              <div className="space-y-1">
                                {Object.entries(lead.formData).slice(0, 3).map(([key, val]) => (
                                  <div key={key} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                    <span className="text-slate-500 font-bold shrink-0">{key}:</span>
                                    <span className="font-medium text-slate-200 line-clamp-1">{String(val)}</span>
                                  </div>
                                ))}
                                {Object.keys(lead.formData).length > 3 && (
                                  <div className="text-[10px] text-amber-400 font-bold pt-0.5">
                                    + {Object.keys(lead.formData).length - 3} more form fields submitted
                                  </div>
                                )}
                              </div>
                            ) : (
                              lead.notes && (
                                <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                                  "{lead.notes}"
                                </p>
                              )
                            )}

                            {lead.adminNotes && (
                              <div className="mt-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 flex items-start gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-slate-400">Admin Note: </span>
                                  <span>{lead.adminNotes}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status & Actions Column */}
                        <div className="lg:col-span-3 flex flex-col justify-between gap-3 h-full">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500">Processing Status</label>
                            <select
                              value={lead.status || 'New'}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="New">🟢 New</option>
                              <option value="Contacted">🟡 Contacted</option>
                              <option value="Site Visit Scheduled">🔵 Site Visit Scheduled</option>
                              <option value="In Review">🟣 In Review</option>
                              <option value="Completed">✅ Completed</option>
                              <option value="Closed / Lost">❌ Closed / Lost</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => handleOpenLeadInspector(lead)}
                              className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Full Form</span>
                            </button>

                            <button
                              onClick={() => handleCopyLeadSummary(lead)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                              title="Copy Form Summary to Clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteLead(lead)}
                              className="p-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 transition-all cursor-pointer"
                              title="Delete Submission Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick Approve Action specifically for Associate Partner applications */}
                          {lead.category === 'Associate Partner' && (
                            <div className="pt-1">
                              {lead.status === 'Completed' ? (
                                <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-black flex items-center justify-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span>Partner Approved & Active</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleApproveAssociate(lead.id, lead.name)}
                                  className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  <span>Approve & Activate Partner</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ASSOCIATE PARTNERS & APPROVAL CMS */}
        {/* ======================================================== */}
        {activeTab === 'associates' && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-amber-400" />
                  <span>Associate Partner Network & Authorizations</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Review applicant profiles, approve pending registrations, adjust commission rates, and track referrals.
                </p>
              </div>

              <button
                onClick={handleOpenAddAssociate}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Associate Account</span>
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Associates</span>
                <div className="text-2xl font-black text-white">{associates.length}</div>
                <span className="text-[11px] text-slate-500">Registered network partners</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Partners</span>
                <div className="text-2xl font-black text-emerald-400">
                  {associates.filter(a => a.status === 'Active').length}
                </div>
                <span className="text-[11px] text-slate-500">Authorized & able to login</span>
              </div>

              <div className={`rounded-2xl p-4 space-y-1 border ${
                associates.filter(a => a.status === 'Pending').length > 0
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Approval</span>
                  {associates.filter(a => a.status === 'Pending').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="text-2xl font-black text-amber-300">
                  {associates.filter(a => a.status === 'Pending').length}
                </div>
                <span className="text-[11px] text-slate-400">
                  {associates.filter(a => a.status === 'Pending').length > 0 ? 'Requires admin action' : 'No pending reviews'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended</span>
                <div className="text-2xl font-black text-slate-400">
                  {associates.filter(a => a.status === 'Suspended').length}
                </div>
                <span className="text-[11px] text-slate-500">Access temporarily paused</span>
              </div>
            </div>

            {/* Associate Search & Filters */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={associateSearchQuery}
                  onChange={(e) => setAssociateSearchQuery(e.target.value)}
                  placeholder="Search by Name, Associate Code (e.g. SVS-ASC), Phone, Email, City..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                {associateSearchQuery && (
                  <button
                    onClick={() => setAssociateSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'All', count: associates.length },
                  { id: 'Pending', label: 'Pending Review', count: associates.filter(a => a.status === 'Pending').length },
                  { id: 'Active', label: 'Active', count: associates.filter(a => a.status === 'Active').length },
                  { id: 'Suspended', label: 'Suspended', count: associates.filter(a => a.status === 'Suspended').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAssociateStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      associateStatusFilter === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      associateStatusFilter === tab.id ? 'bg-slate-900 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Associates Grid */}
            {associates
              .filter((asc) => {
                const matchSearch =
                  asc.name.toLowerCase().includes(associateSearchQuery.toLowerCase()) ||
                  asc.associateCode.toLowerCase().includes(associateSearchQuery.toLowerCase()) ||
                  (asc.phone && asc.phone.includes(associateSearchQuery)) ||
                  (asc.email && asc.email.toLowerCase().includes(associateSearchQuery.toLowerCase())) ||
                  (asc.city && asc.city.toLowerCase().includes(associateSearchQuery.toLowerCase()));
                const matchStatus = associateStatusFilter === 'all' || asc.status === associateStatusFilter;
                return matchSearch && matchStatus;
              }).length === 0 ? (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-base font-black text-white">No Associate Partners found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {associateStatusFilter === 'Pending' 
                      ? 'No applications are currently awaiting approval.' 
                      : 'No records match your active search query or filter.'}
                  </p>
                  <button
                    onClick={() => {
                      setAssociateSearchQuery('');
                      setAssociateStatusFilter('all');
                    }}
                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {associates
                    .filter((asc) => {
                      const matchSearch =
                        asc.name.toLowerCase().includes(associateSearchQuery.toLowerCase()) ||
                        asc.associateCode.toLowerCase().includes(associateSearchQuery.toLowerCase()) ||
                        (asc.phone && asc.phone.includes(associateSearchQuery)) ||
                        (asc.email && asc.email.toLowerCase().includes(associateSearchQuery.toLowerCase())) ||
                        (asc.city && asc.city.toLowerCase().includes(associateSearchQuery.toLowerCase()));
                      const matchStatus = associateStatusFilter === 'all' || asc.status === associateStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((asc) => {
                      const isPending = asc.status === 'Pending';
                      const isActive = asc.status === 'Active';

                      return (
                        <div
                          key={asc.id || asc.associateCode}
                          className={`bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between transition-all ${
                            isPending
                              ? 'border-amber-500/50 shadow-amber-500/10 hover:border-amber-400'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Top Metadata */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                                {asc.associateCode}
                              </span>

                              {/* Status Badge */}
                              {isPending && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Approval</span>
                                </span>
                              )}
                              {isActive && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Active Partner</span>
                                </span>
                              )}
                              {asc.status === 'Suspended' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Suspended</span>
                                </span>
                              )}
                            </div>

                            {/* Associate Profile Details */}
                            <div>
                              <h3 className="text-base font-black text-white">{asc.name}</h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <span>{asc.city || 'Telangana'}</span>
                                {asc.experienceYears && <span>• {asc.experienceYears} Exp</span>}
                              </p>
                            </div>

                            {/* Contact Links */}
                            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/80">
                              <div className="flex items-center justify-between text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                                  <a href={`tel:${asc.phone}`} className="font-mono font-bold hover:text-amber-400">
                                    {asc.phone}
                                  </a>
                                </div>
                                <a
                                  href={`https://wa.me/${asc.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(asc.name)},%20regarding%20your%20SVS%20Associate%20Partner%20account.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold border border-emerald-500/30"
                                >
                                  WhatsApp
                                </a>
                              </div>

                              {asc.email && (
                                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <a href={`mailto:${asc.email}`} className="truncate hover:text-slate-200">
                                    {asc.email}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Commission & Verification Info */}
                            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-500">Commission Slab</span>
                                <span className="text-[11px] font-bold text-amber-300">
                                  {asc.commissionRate || 'Standard Tier'}
                                </span>
                              </div>

                              {asc.aadhaarPanNumber && (
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-slate-500">KYC / ID</span>
                                  <span className="text-[11px] font-mono text-slate-300">
                                    {asc.aadhaarPanNumber}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                                <span>Enrolled: {asc.registeredDate || 'N/A'}</span>
                                {asc.approvedDate && (
                                  <span className="text-emerald-400 font-semibold">Approved: {asc.approvedDate}</span>
                                )}
                              </div>
                            </div>

                            {/* Admin Notes if any */}
                            {asc.adminNotes && (
                              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>{asc.adminNotes}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Footer */}
                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            {/* Prominent Approve Button for Pending status */}
                            {isPending && (
                              <button
                                onClick={() => handleApproveAssociate(asc.id || asc.associateCode, asc.name)}
                                className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                              >
                                <UserCheck className="w-4 h-4" />
                                <span>Approve & Activate Account</span>
                              </button>
                            )}

                            {/* Utility Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyAssociateCredentials(asc)}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                                title="Copy Partner ID and Login Instructions"
                              >
                                <Copy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Copy ID</span>
                              </button>

                              <button
                                onClick={() => handleToggleAssociateStatus(asc)}
                                className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border-amber-500/30'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border-emerald-500/30'
                                }`}
                                title={isActive ? 'Temporarily suspend login' : 'Reactivate partner'}
                              >
                                {isActive ? 'Suspend' : 'Activate'}
                              </button>

                              <button
                                onClick={() => handleOpenEditAssociate(asc)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                                title="Edit Associate Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteAssociate(asc)}
                                className="p-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 cursor-pointer"
                                title="Delete Associate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL 0: FULL SUBMITTED FORM DETAILS INSPECTOR */}
      {/* ======================================================== */}
      {selectedLeadForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Submitted Form Details</h3>
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      #{selectedLeadForInspection.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{selectedLeadForInspection.category || 'General Inquiry'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {selectedLeadForInspection.date}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLeadForInspection(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer Contact Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Applicant Details</div>
                  <div className="text-base font-black text-white">{selectedLeadForInspection.name}</div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="font-mono font-bold">{selectedLeadForInspection.phone}</span>
                    {selectedLeadForInspection.email && (
                      <span className="text-slate-400">({selectedLeadForInspection.email})</span>
                    )}
                    {(selectedLeadForInspection.city || selectedLeadForInspection.country) && (
                      <span className="text-amber-400">
                        📍 {selectedLeadForInspection.city}
                        {selectedLeadForInspection.country ? `, ${selectedLeadForInspection.country}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/${selectedLeadForInspection.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLeadForInspection.name)},%20we%20have%20received%20your%20request%20for%20${encodeURIComponent(selectedLeadForInspection.service || 'SVS True Wealth services')}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedLeadForInspection.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Primary Service Target */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Target Service / Project
                </div>
                <div className="text-sm font-black text-amber-200">
                  {selectedLeadForInspection.service}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                  <span>Source Form: {selectedLeadForInspection.source}</span>
                  {selectedLeadForInspection.preferredDate && (
                    <span>• Preferred Date: <strong className="text-white">{selectedLeadForInspection.preferredDate}</strong></span>
                  )}
                </div>
              </div>

              {/* Complete Form Submitted Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400" />
                    <span>All Submitted Form Fields</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {selectedLeadForInspection.formData ? Object.keys(selectedLeadForInspection.formData).length : 1} parameter(s)
                  </span>
                </div>

                {selectedLeadForInspection.formData && Object.keys(selectedLeadForInspection.formData).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedLeadForInspection.formData).map(([label, value]) => {
                      const isLongText = String(value).length > 50 || String(value).includes('\n');

                      return (
                        <div 
                          key={label}
                          className={`bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 ${
                            isLongText ? 'md:col-span-2' : ''
                          }`}
                        >
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {label}
                          </div>
                          <div className="text-xs font-semibold text-white whitespace-pre-line leading-relaxed">
                            {String(value)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Form Submission Summary</div>
                    <div className="text-xs text-slate-200 whitespace-pre-line">
                      {selectedLeadForInspection.notes || 'No detailed form fields recorded for this entry.'}
                    </div>
                  </div>
                )}
              </div>

              {/* User Notes & Message Block */}
              {selectedLeadForInspection.notes && !selectedLeadForInspection.formData && (
                <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">User Message / Special Instructions</div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{selectedLeadForInspection.notes}"
                  </p>
                </div>
              )}

              {/* Admin Followup & Internal Notes Editor */}
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Internal Admin Followup & Team Notes</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Only visible to administrators</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                    <select
                      value={selectedLeadForInspection.status || 'New'}
                      onChange={(e) => handleLeadStatusChange(selectedLeadForInspection.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="New">🟢 New (Unassigned)</option>
                      <option value="Contacted">🟡 Contacted (Call / WhatsApp done)</option>
                      <option value="Site Visit Scheduled">🔵 Site Visit Scheduled</option>
                      <option value="In Review">🟣 In Review (Legal / Doc verification)</option>
                      <option value="Completed">✅ Completed (Enrolled / Booked)</option>
                      <option value="Closed / Lost">❌ Closed / Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Forward / Assign to Associate
                    </label>
                    <select
                      value={selectedLeadForInspection.assignedTo || ''}
                      onChange={(e) => handleAssignLeadToAssociate(selectedLeadForInspection.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="">-- Unassigned (Head Office) --</option>
                      {associates.filter(a => a.status === 'Active').map((asc) => (
                        <option key={asc.id || asc.associateCode} value={asc.associateCode}>
                          {asc.name} ({asc.associateCode}) {asc.city ? `- ${asc.city}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Followup Remarks</label>
                  <textarea
                    rows={3}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Spoke with client on phone. Interested in 300 sq yds plot. Scheduled driver Ramesh for pickup Sunday 10am."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveLeadAdminNotes(selectedLeadForInspection.id)}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      Save Admin Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyLeadSummary(selectedLeadForInspection)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Summary</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedLeadForInspection.category === 'Associate Partner' && selectedLeadForInspection.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleApproveAssociate(selectedLeadForInspection.id, selectedLeadForInspection.name);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve & Activate Partner Account</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLeadForInspection)}
                  className="px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold border border-rose-500/20 cursor-pointer transition-all"
                >
                  Delete Lead
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForInspection(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT PROJECT */}
      {/* ======================================================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                {editingProject ? 'Edit Venture Details' : 'Add New Real Estate Venture'}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. SVS Emerald County"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Zone / Corridor *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.zone}
                    onChange={(e) => setProjectForm({ ...projectForm, zone: e.target.value })}
                    placeholder="e.g. Shadnagar South Growth Corridor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Full Location Address *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Bangalore Highway (NH-44), Hyderabad, Telangana"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">State Provision *</label>
                  <select
                    value={projectForm.state}
                    onChange={(e) => setProjectForm({ ...projectForm, state: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="telangana">Telangana State</option>
                    <option value="andhra_pradesh">Andhra Pradesh State</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Property Asset Type *</label>
                  <select
                    value={projectForm.propertyType}
                    onChange={(e) => setProjectForm({ ...projectForm, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="plot">🌲 Open Land Plot</option>
                    <option value="villa">🏡 Gated Villa</option>
                    <option value="apartment">🏢 Residential Apartment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Project Status *</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="ongoing">🟢 Ongoing / Active</option>
                    <option value="completed">🏆 Completed & Delivered</option>
                    <option value="upcoming">🚀 Upcoming Pre-Launch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Starting Investment Price *</label>
                  <input
                    type="text"
                    value={projectForm.startingPrice}
                    onChange={(e) => setProjectForm({ ...projectForm, startingPrice: e.target.value })}
                    placeholder="e.g. ₹14,500 / sq.yd or ₹1.85 Cr"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Total Area / Acreage</label>
                  <input
                    type="text"
                    value={projectForm.totalArea}
                    onChange={(e) => setProjectForm({ ...projectForm, totalArea: e.target.value })}
                    placeholder="e.g. 55 Acres"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Plot / Unit Sizes</label>
                  <input
                    type="text"
                    value={projectForm.configuration}
                    onChange={(e) => setProjectForm({ ...projectForm, configuration: e.target.value })}
                    placeholder="e.g. 165 - 500 Sq. Yds"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Legal Approvals</label>
                  <input
                    type="text"
                    value={projectForm.approvalType}
                    onChange={(e) => setProjectForm({ ...projectForm, approvalType: e.target.value })}
                    placeholder="e.g. DTCP & TS-RERA"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">RERA Number</label>
                  <input
                    type="text"
                    value={projectForm.reraNumber}
                    onChange={(e) => setProjectForm({ ...projectForm, reraNumber: e.target.value })}
                    placeholder="e.g. P02400004921"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <DeviceImageUpload
                    label="Project Cover Image (From Device)"
                    value={projectForm.image}
                    onChange={(newImg) => setProjectForm({ ...projectForm, image: newImg })}
                    hint="Upload layout plan or venture hero image from your phone/computer (PNG, JPG)"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Short Description</label>
                  <textarea
                    rows={2}
                    value={projectForm.shortDesc}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                    placeholder="Brief highlights and advantages of this layout..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Key Highlights (One per line)</label>
                  <textarea
                    rows={3}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="DTCP Approved Layout&#10;60ft & 33ft Wide Blacktop Roads&#10;Underground Drainage"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SVS MEMBERSHIP CARD */}
      {/* ======================================================== */}
      {isMembershipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                {editingMembershipCard ? `Edit ${editingMembershipCard.tier} Card` : 'Add New SVS Membership Card'}
              </h3>
              <button onClick={() => setIsMembershipModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMembershipCard} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Tier Name *</label>
                  <input
                    type="text"
                    required
                    value={membershipForm.tier || ''}
                    onChange={(e) => setMembershipForm({ ...membershipForm, tier: e.target.value })}
                    placeholder="e.g. Platinum, Diamond, Gold, Silver"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Subtitle / Archetype</label>
                  <input
                    type="text"
                    value={membershipForm.subtitle || ''}
                    onChange={(e) => setMembershipForm({ ...membershipForm, subtitle: e.target.value })}
                    placeholder="e.g. Ultra-Luxury VIP Tier"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Discount Perk *</label>
                  <input
                    type="text"
                    required
                    value={membershipForm.discountPerk || ''}
                    onChange={(e) => setMembershipForm({ ...membershipForm, discountPerk: e.target.value })}
                    placeholder="e.g. 25% Flat Discount"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Free Resort Stays</label>
                  <input
                    type="text"
                    value={membershipForm.resortNights || ''}
                    onChange={(e) => setMembershipForm({ ...membershipForm, resortNights: e.target.value })}
                    placeholder="e.g. 12 Free Night Stays / Year"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Accent Color Theme</label>
                  <select
                    value={membershipForm.accentColor || 'border-amber-400 text-amber-300'}
                    onChange={(e) => setMembershipForm({ ...membershipForm, accentColor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="border-slate-300 text-slate-100">Platinum / Slate Bright</option>
                    <option value="border-cyan-400 text-cyan-300">Diamond / Cyan Aqua</option>
                    <option value="border-amber-400 text-amber-300">Gold / Amber Warm</option>
                    <option value="border-emerald-400 text-emerald-300">Silver / Emerald Green</option>
                    <option value="border-purple-400 text-purple-300">Royal Purple</option>
                    <option value="border-rose-400 text-rose-300">Ruby Rose</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Card Background Style</label>
                  <select
                    value={membershipForm.bgGradient || 'from-slate-900 via-slate-800 to-slate-950'}
                    onChange={(e) => setMembershipForm({ ...membershipForm, bgGradient: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="from-slate-900 via-slate-800 to-slate-950">Midnight Slate (Platinum)</option>
                    <option value="from-cyan-950 via-slate-900 to-slate-950">Deep Ocean Cyan (Diamond)</option>
                    <option value="from-amber-950 via-slate-900 to-slate-950">Rich Amber Gold (Gold)</option>
                    <option value="from-emerald-950 via-slate-900 to-slate-950">Forest Emerald (Silver)</option>
                    <option value="from-purple-950 via-slate-900 to-slate-950">Royal Velvet Purple</option>
                    <option value="from-rose-950 via-slate-900 to-slate-950">Crimson Elite Rose</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Included Perks & Privileges (One per line)</label>
                <textarea
                  rows={5}
                  value={membershipFeaturesInput}
                  onChange={(e) => setMembershipFeaturesInput(e.target.value)}
                  placeholder="Dedicated NRI Personal Relationship Supervisor&#10;Free Precast Wall Installation on Purchased Plots&#10;VIP Priority Access to Pre-Launch Ventures"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMembershipModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  {editingMembershipCard ? 'Save Card Changes' : 'Create Membership Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT MEMBER ACCOUNT */}
      {/* ======================================================== */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                {editingMember ? `Edit Member: ${editingMember.name}` : 'Add New Member Account'}
              </h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Member Full Name *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Member ID / Card No *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.memberId || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, memberId: e.target.value })}
                    placeholder="e.g. SVS-MEM-1082"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.phone || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="+91 98490 55432"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={memberForm.email || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    placeholder="member@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Membership Tier</label>
                  <select
                    value={memberForm.tier || 'Gold'}
                    onChange={(e) => setMemberForm({ ...memberForm, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Silver">Silver Tier</option>
                    <option value="Gold">Gold Tier</option>
                    <option value="Diamond">Diamond Tier</option>
                    <option value="Platinum">Platinum Tier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Complimentary Stay Credits</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={memberForm.staycationCredits || 0}
                    onChange={(e) => setMemberForm({ ...memberForm, staycationCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Allotted Venture</label>
                  <input
                    type="text"
                    value={memberForm.venture || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, venture: e.target.value })}
                    placeholder="e.g. Royal City (Shadnagar)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Plot Number & Facing</label>
                  <input
                    type="text"
                    value={memberForm.plotNo || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, plotNo: e.target.value })}
                    placeholder="e.g. Plot #15 (West Facing)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={memberForm.paidAmount || 0}
                    onChange={(e) => setMemberForm({ ...memberForm, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Total Plot Value (₹)</label>
                  <input
                    type="number"
                    value={memberForm.totalAmount || 0}
                    onChange={(e) => setMemberForm({ ...memberForm, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Member Login Password (Bcrypt Hash on Save)
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">10 Salt Rounds</span>
                </div>
                <input
                  type="text"
                  value={memberForm.plainPassword || ''}
                  onChange={(e) => setMemberForm({ ...memberForm, plainPassword: e.target.value })}
                  placeholder={editingMember ? "Leave blank to keep existing password" : "Enter password (e.g. member123)"}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  {editingMember
                    ? "If updated, the password will be securely re-hashed using bcryptjs before storing."
                    : "The plain password will be securely hashed with bcrypt (salt 10) before saving to the database."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  {editingMember ? 'Save Member Updates' : 'Create Member Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT HOSPITALITY ITEM */}
      {/* ======================================================== */}
      {isHospitalityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                {editingHospitality ? 'Edit Hospitality Venue' : 'Add New Stay / Resort'}
              </h3>
              <button onClick={() => setIsHospitalityModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHospitality} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Venue Title *</label>
                <input
                  type="text"
                  required
                  value={hospForm.title}
                  onChange={(e) => setHospForm({ ...hospForm, title: e.target.value })}
                  placeholder="e.g. SVS Palm Valley Eco-Resort"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Category Type</label>
                  <select
                    value={hospForm.type}
                    onChange={(e) => setHospForm({ ...hospForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="resort">🌴 Eco Resort</option>
                    <option value="hotel">🏨 Executive Hotel</option>
                    <option value="event">🎉 Banquet / Lawns</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Starting Tariff</label>
                  <input
                    type="text"
                    value={hospForm.startingPrice}
                    onChange={(e) => setHospForm({ ...hospForm, startingPrice: e.target.value })}
                    placeholder="e.g. ₹4,500 / Night"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Badge / Tag</label>
                  <input
                    type="text"
                    value={hospForm.badge || ''}
                    onChange={(e) => setHospForm({ ...hospForm, badge: e.target.value })}
                    placeholder="e.g. Flagship Partner, Eco Retreat"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Guest Capacity (Optional)</label>
                  <input
                    type="text"
                    value={hospForm.capacity || ''}
                    onChange={(e) => setHospForm({ ...hospForm, capacity: e.target.value })}
                    placeholder="e.g. 500 - 3,000 Guests"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Location Address</label>
                <input
                  type="text"
                  value={hospForm.location}
                  onChange={(e) => setHospForm({ ...hospForm, location: e.target.value })}
                  placeholder="e.g. Chevela - Vikarabad Green Belt, Hyderabad"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <DeviceImageUpload
                  label="Venue / Resort Image (From Device)"
                  value={hospForm.image}
                  onChange={(newImg) => setHospForm({ ...hospForm, image: newImg })}
                  hint="Upload resort, villa, or banquet photo from your device"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Description</label>
                <textarea
                  rows={2}
                  value={hospForm.description}
                  onChange={(e) => setHospForm({ ...hospForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Key Amenities / Features (One per line)</label>
                <textarea
                  rows={3}
                  value={hospFeaturesInput}
                  onChange={(e) => setHospFeaturesInput(e.target.value)}
                  placeholder="Infinity Swimming Pool&#10;Ayurvedic Spa&#10;Organic Dining"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHospitalityModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Save Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT ASSOCIATE PARTNER */}
      {/* ======================================================== */}
      {isAssociateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                {editingAssociate ? `Edit Associate: ${editingAssociate.name}` : 'Add New Associate Partner Account'}
              </h3>
              <button onClick={() => setIsAssociateModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssociate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Partner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={associateForm.name}
                    onChange={(e) => setAssociateForm({ ...associateForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Mobile Number (Login ID) *</label>
                  <input
                    type="tel"
                    required
                    value={associateForm.phone}
                    onChange={(e) => setAssociateForm({ ...associateForm, phone: e.target.value })}
                    placeholder="+91 98490 12345"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={associateForm.email}
                    onChange={(e) => setAssociateForm({ ...associateForm, email: e.target.value })}
                    placeholder="partner@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">City / Region</label>
                  <input
                    type="text"
                    value={associateForm.city}
                    onChange={(e) => setAssociateForm({ ...associateForm, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Real Estate Experience</label>
                  <select
                    value={associateForm.experienceYears}
                    onChange={(e) => setAssociateForm({ ...associateForm, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Fresher / Direct">Fresher / Direct</option>
                    <option value="1-2 Years">1-2 Years Experience</option>
                    <option value="2-5 Years">2-5 Years Experience</option>
                    <option value="5-10 Years">5-10 Years Experience</option>
                    <option value="10+ Years (Senior Lead)">10+ Years (Senior Lead)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Commission Slab Tier</label>
                  <select
                    value={associateForm.commissionRate}
                    onChange={(e) => setAssociateForm({ ...associateForm, commissionRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Standard Tier (Direct Allocation)">Standard Tier (Direct Allocation)</option>
                    <option value="Silver Associate (2.0% Direct)">Silver Associate (2.0% Direct)</option>
                    <option value="Gold Channel Partner (3.0% Direct)">Gold Channel Partner (3.0% Direct)</option>
                    <option value="Platinum Executive Lead (5.0% Direct)">Platinum Executive Lead (5.0% Direct)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Area Pincode</label>
                  <input
                    type="text"
                    value={associateForm.pincode}
                    onChange={(e) => setAssociateForm({ ...associateForm, pincode: e.target.value })}
                    placeholder="500081"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Aadhaar / PAN / GSTIN</label>
                  <input
                    type="text"
                    value={associateForm.aadhaarPanNumber}
                    onChange={(e) => setAssociateForm({ ...associateForm, aadhaarPanNumber: e.target.value })}
                    placeholder="ABCD1234E or 12-digit Aadhaar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">
                    {editingAssociate ? 'Reset Password (optional)' : 'Set Password *'}
                  </label>
                  <input
                    type="text"
                    value={associateForm.password}
                    onChange={(e) => setAssociateForm({ ...associateForm, password: e.target.value })}
                    placeholder={editingAssociate ? 'Leave empty to retain existing' : 'e.g. associate123'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    {editingAssociate ? 'Only enter if resetting password.' : 'Hashed securely with bcrypt on save.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[10px]">Account Status</label>
                  <select
                    value={associateForm.status}
                    onChange={(e) => setAssociateForm({ ...associateForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Active">🟢 Active (Authorized to Login)</option>
                    <option value="Pending">⏳ Pending Approval</option>
                    <option value="Suspended">🔴 Suspended (Login Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[10px]">Internal Admin Remarks</label>
                <input
                  type="text"
                  value={associateForm.adminNotes}
                  onChange={(e) => setAssociateForm({ ...associateForm, adminNotes: e.target.value })}
                  placeholder="e.g. Verified RERA broker license, allocated South Zone"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssociateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg cursor-pointer"
                >
                  {editingAssociate ? 'Save Changes' : 'Create & Authorize Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION / DELETE DIALOG MODAL (Reliable In-App) */}
      {/* ======================================================== */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-2xl shrink-0 ${confirmModal.isDanger ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">{confirmModal.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmModal.onConfirm()}
                className={`px-5 py-2 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                  confirmModal.isDanger
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
