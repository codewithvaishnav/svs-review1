export enum FirestoreCollections {
  LEADS = 'leads',
  BOOKINGS = 'bookings',
  PLOTS = 'plots',
  VENTURES = 'ventures',
  MEMBERS = 'members',
  ASSOCIATES = 'associates',
  AUDIT_LOGS = 'auditLogs',
  CARDS = 'membership_cards',
  HOSPITALITY = 'hospitality',
  APP_ADS = 'app_ads',
  EVENTS = 'events',
}

export interface Project {
  id: string;
  title: string;
  zone: string;
  location: string;
  state: 'telangana' | 'andhra_pradesh';
  propertyType: 'plot' | 'villa' | 'apartment';
  status: 'ongoing' | 'completed' | 'upcoming';
  image: string;
  gallery?: string[];
  shortDesc: string;
  highlights: string[];
  plotsAvailable?: number;
  totalArea?: string;
  configuration?: string;
  approvalType?: string;
  reraNumber?: string;
  possession?: string;
  startingPrice?: string;
  brochureUrl?: string;
  isFeatured?: boolean;
}

export interface MembershipCard {
  id?: string;
  tier: string;
  subtitle: string;
  discountPerk: string;
  resortNights: string;
  features: string[];
  accentColor: string;
  bgGradient: string;
}

export interface NRICountry {
  code: string;
  name: string;
  flagUrl: string;
  activeNriClients: number;
  timeZone: string;
  deskManager: string;
  deskPhone: string;
  deskLocation: string;
  poaProcess: string;
  bankingGuidance: string;
  topCorridors: string[];
  featuredTestimonial: {
    clientName: string;
    city: string;
    investment: string;
    quote: string;
    avatar: string;
  };
  specialServices: Array<{
    title: string;
    desc: string;
    tag: string;
  }>;
}

export interface ServiceDivision {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  image: string;
  description: string;
  features: string[];
}

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface BranchLocation {
  id: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  isCorporate?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface MemberAccount {
  id: string;
  memberId: string;
  name: string;
  phone: string;
  email: string;
  passwordHash?: string;
  city?: string;
  country?: string;
  tier: 'Silver' | 'Gold' | 'Diamond' | 'Platinum' | string;
  venture: string;
  plotNo: string;
  areaSqYd: number;
  regNumber?: string;
  paidAmount: number;
  totalAmount: number;
  nextEmiDueDate?: string;
  nextEmiAmount?: number;
  documentStatus?: string;
  staycationCredits: number;
  kycStatus: 'Verified' | 'Pending' | 'Action Needed';
  address?: string;
  panNo?: string;
  nomineeName?: string;
  registeredDate: string;
  status: 'Active' | 'Suspended' | 'In Review';
  notes?: string;
}

export interface MemberAppAd {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  downloadUrl: string;
  features: string[];
  isActive: boolean;
}

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  country?: string;
  category?: string;
  service?: string;
  source?: string;
  status?: string;
  createdAt?: string | number;
  timestamp?: string | number;
  date?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  adminNotes?: string;
  formData?: Record<string, any>;
  assignedTo?: string;
  venture?: string;
  plotNo?: string;
}

export interface NriTierConfig {
  id: string;
  name: string;
  subtitle: string;
  annualFee: string;
  tag: string;
  features: string[];
  recommendedFor: string;
  color: string;
  popular?: boolean;
}

export type NriTier = NriTierConfig;

export interface HospitalityItem {
  id: string;
  type: 'hotel' | 'resort' | 'event';
  title: string;
  location: string;
  startingPrice: string;
  image: string;
  description: string;
  features: string[];
  capacity?: string;
  badge?: string;
}

export interface SvsEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  badge?: string;
  image?: string;
  description: string;
  perks: string[];
  capacity?: string;
  createdAt?: number;
}

export interface AssociateAccount {
  id: string;
  associateCode: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  experienceYears?: string;
  pincode?: string;
  aadhaarPanNumber?: string;
  passwordHash?: string;
  status: 'Pending' | 'Active' | 'Suspended' | 'Rejected';
  commissionRate?: string;
  activeReferrals?: number;
  completedDeals?: number;
  totalEarnings?: number;
  registeredDate?: string;
  approvedDate?: string;
  adminNotes?: string;
  timestamp?: number;
  documents?: string[];
}
