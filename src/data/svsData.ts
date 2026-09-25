import { Project, MembershipCard, NRICountry, ServiceDivision, CareerPosition, BranchLocation, Testimonial, HospitalityItem, NriTierConfig, MemberAppAd } from '../types';

// Dynamic ventures are added and managed directly by SVS Administration in Firestore.
export const PROJECTS_DATA: Project[] = [];

export const CANONICAL_MEMBERSHIP_TIERS = ['Platinum', 'Diamond', 'Gold', 'Silver'];

export const MEMBERSHIP_CARDS: MembershipCard[] = [
  {
    id: 'tier-platinum',
    tier: 'Platinum',
    subtitle: 'Ultra-Luxury VIP Tier',
    discountPerk: '25% Flat Discount',
    resortNights: '12 Free Night Stays / Year',
    features: [
      'Dedicated NRI Personal Relationship Supervisor',
      'Free Precast Wall Installation on Purchased Plots',
      'VIP Priority Access to Pre-Launch Venture Bookings',
      'Complimentary Airport Pickups & Luxury Cab Rentals',
      'Free Legal Document Audit & Digital Geo-Tagging'
    ],
    accentColor: 'border-slate-300 text-slate-100',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-950',
  },
  {
    id: 'tier-diamond',
    tier: 'Diamond',
    subtitle: 'Premium Executive Tier',
    discountPerk: '20% Flat Discount',
    resortNights: '8 Free Night Stays / Year',
    features: [
      'Dedicated Property Supervisor for Maintenance',
      'Annual Plot Cleaning, Painting & Boundary Checks',
      '10% Discount on SVS Club & Resort Room Bookings',
      'Priority Resale Assistance for Land Assets',
      'Passport & Travel Concierge Services'
    ],
    accentColor: 'border-cyan-400 text-cyan-300',
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
  },
  {
    id: 'tier-gold',
    tier: 'Gold',
    subtitle: 'Family & Investor Tier',
    discountPerk: '15% Flat Discount',
    resortNights: '5 Free Night Stays / Year',
    features: [
      'Bi-Monthly Real-Time Photo/Video Updates of Plots',
      'Discounted Interior & Remodeling Services',
      'Free Event Hall Booking at SVS Clubs (1 Event/yr)',
      'Complimentary Land Valuation Reports'
    ],
    accentColor: 'border-amber-400 text-amber-300',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
  },
  {
    id: 'tier-silver',
    tier: 'Silver',
    subtitle: 'Standard Member Tier',
    discountPerk: '10% Flat Discount',
    resortNights: '2 Free Night Stays / Year',
    features: [
      'Quarterly Property Status Inspection Reports',
      'Access to SVS Member Community Portal',
      'Free Booking Concierge for Cab & Hotel Stays'
    ],
    accentColor: 'border-emerald-400 text-emerald-300',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
  }
];

/**
 * Merges cloud-fetched membership cards with the canonical 4 cards.
 * Ensures the 4 core tiers (Platinum, Diamond, Gold, Silver) are ALWAYS present
 * in proper order, overlaying any admin modifications saved in Firestore.
 */
export const getMergedMembershipCards = (cloudCards: MembershipCard[] = []): MembershipCard[] => {
  const cardMap = new Map<string, MembershipCard>();

  // 1. Initialize with canonical 4 tiers
  MEMBERSHIP_CARDS.forEach((c) => {
    const key = c.tier.toLowerCase().trim();
    cardMap.set(key, { ...c });
  });

  // 2. Overlay any documents retrieved from Firestore
  (cloudCards || []).forEach((cloudCard) => {
    if (!cloudCard) return;
    let key = cloudCard.tier ? cloudCard.tier.toLowerCase().trim() : '';
    if (!key && cloudCard.id) {
      if (cloudCard.id.includes('platinum')) key = 'platinum';
      else if (cloudCard.id.includes('diamond')) key = 'diamond';
      else if (cloudCard.id.includes('gold')) key = 'gold';
      else if (cloudCard.id.includes('silver')) key = 'silver';
    }
    if (!key) return;

    const base = cardMap.get(key);
    cardMap.set(key, {
      ...(base || {}),
      ...cloudCard,
      id: cloudCard.id || base?.id || `tier-${key}`,
      tier: cloudCard.tier || base?.tier || (key.charAt(0).toUpperCase() + key.slice(1)),
      features: Array.isArray(cloudCard.features) && cloudCard.features.length > 0 
        ? cloudCard.features 
        : (base?.features || []),
    });
  });

  // 3. Guarantee the 4 canonical cards are always returned in exact hierarchical order
  const ordered: MembershipCard[] = [];
  CANONICAL_MEMBERSHIP_TIERS.forEach((t) => {
    const key = t.toLowerCase();
    if (cardMap.has(key)) {
      ordered.push(cardMap.get(key)!);
      cardMap.delete(key);
    }
  });

  // 4. Append any custom tiers if admin created extra cards
  cardMap.forEach((extraCard) => {
    ordered.push(extraCard);
  });

  return ordered;
};

export const NRI_COUNTRIES: NRICountry[] = [
  {
    code: 'sg',
    name: 'Singapore',
    flagUrl: 'https://flagcdn.com/w40/sg.png',
    activeNriClients: 450,
    timeZone: 'SGT (UTC+8)',
    deskManager: 'K. Sridhar Rao (Senior Vice President - SEA)',
    deskPhone: '+65 9123 4567 / +91 91771 23456',
    deskLocation: 'High Street Centre, North Bridge Road, Singapore',
    poaProcess: 'Attestation at High Commission of India (HCI) Singapore (31 Grange Rd). Full assistance with draft preparation.',
    bankingGuidance: 'Direct SGD to INR remittance support through DBS / OCBC / State Bank of India Singapore branch.',
    topCorridors: ['Shadnagar NH-44 Corridor', 'Yadadri Temple Expressway', 'Regional Ring Road (RRR) Phase 1'],
    featuredTestimonial: {
      clientName: 'Murali Krishna & Archana',
      city: 'Jurong East, Singapore',
      investment: '2 Plots in SVS Emerald County (300 sq.yds)',
      quote: 'Living in Singapore, I was worried about plot encroachment back home. SVS executed precast boundary walls, geo-tagged my land, and HCI Singapore POA attestation was handled smoothly by Mr. Sridhar.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'HCI Singapore POA & Spot Registration',
        desc: 'Complete Power of Attorney drafting tailored for Indian High Commission in Singapore attestation rules.',
        tag: 'Singapore Special',
      },
      {
        title: 'DBS & SBI NRE Wire Coordination',
        desc: 'Clear title verification for seamless foreign currency telegraphic transfers directly to SVS Escrow accounts.',
        tag: 'Banking',
      },
      {
        title: 'Changi to Hyderabad Travel Concierge',
        desc: 'Complimentary airport pickup in luxury cab and complimentary resort stay at SVS Club whenever you visit Hyderabad.',
        tag: 'VIP Benefit',
      },
    ],
  },
  {
    code: 'us',
    name: 'USA',
    flagUrl: 'https://flagcdn.com/w40/us.png',
    activeNriClients: 1200,
    timeZone: 'EST / CST / PST (US Hours Support)',
    deskManager: 'Dr. Venkat Reddy & Anita Sharma (North America Desk Leads)',
    deskPhone: '+1 (408) 555-0199 / +91 91771 23456',
    deskLocation: 'Dallas / Fort Worth Rep Office & Bay Area Consultation Desk',
    poaProcess: 'Apostille certification via Secretary of State + Indian Consulate (San Francisco / Chicago / New York / Houston).',
    bankingGuidance: 'USD wire transfers via Chase / Bank of America to ICICI / HDFC NRE accounts with 100% tax clearance documents.',
    topCorridors: ['IIT Hyderabad Kandi Belt (Sangareddy)', 'Shamshabad Airport Corridor', 'Vikarabad Eco-Resort Belt'],
    featuredTestimonial: {
      clientName: 'Srinivasulu Challa',
      city: 'Bay Area (San Jose, CA), USA',
      investment: '500 sq.yd Villa Plot in Sadashivpet',
      quote: 'With an 11.5 hour time difference, SVS US Desk handles video updates on US time zones! They sent live drone footage of my plot near IIT Kandi and handled my California Apostille flawlessly.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'US Timezone Evening Video Inspections',
        desc: 'Live 4K drone and video walkthroughs scheduled conveniently during PST/EST evening hours.',
        tag: 'US Special',
      },
      {
        title: 'US Apostille & Consulate Legal Guidance',
        desc: 'Step-by-step guidance for US Secretary of State Apostille and Indian Consulate POA legalization.',
        tag: 'Legal',
      },
      {
        title: 'High-Yield Tech Corridor Investments',
        desc: 'Curated villa layouts specifically near Financial District, Neopolis, and IIT Hyderabad expansion zones.',
        tag: 'High Growth',
      },
    ],
  },
  {
    code: 'gb',
    name: 'UK',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    activeNriClients: 680,
    timeZone: 'GMT / BST (UK Desk Hours)',
    deskManager: 'Rajeshwar Goud (London Representative)',
    deskPhone: '+44 20 7946 0912 / +91 91771 23456',
    deskLocation: 'Hounslow / Wembley London Desk',
    poaProcess: 'UK Notary Public certification + Legalisation Office (FCO Milton Keynes) + High Commission of India London.',
    bankingGuidance: 'GBP sterling transfers via HSBC / Barclays to Indian NRE accounts with zero conversion loss guarantee.',
    topCorridors: ['Yadadri Highway Spiritual Belt', 'Regional Ring Road (RRR) Junctions', 'Farmland & Organic Retreats'],
    featuredTestimonial: {
      clientName: 'Vikram & Sunitha Rao',
      city: 'Wembley, London, UK',
      investment: 'SVS Divine Residency Plot & Resort Pass',
      quote: 'SVS managed my London FCO legalization smoothly. Whenever our family travels from Heathrow to Hyderabad, their driver meets us at RGIA airport and takes us straight to our Yadadri site!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'UK FCO & HCI London Legal Attestation',
        desc: 'Direct coordination with London Notaries and FCO Milton Keynes for fast POA clearance.',
        tag: 'UK Special',
      },
      {
        title: 'Farmland & Eco-Resort Property Desk',
        desc: 'Specialized focus on high-yield sandalwood farm plots and managed organic retreats for UK NRIs.',
        tag: 'Eco-Land',
      },
      {
        title: 'Heathrow-RGIA Flight Chauffeur Concierge',
        desc: 'Dedicated airport transfer car service waiting at Hyderabad International Airport on your arrival.',
        tag: 'Travel Perks',
      },
    ],
  },
  {
    code: 'my',
    name: 'Malaysia',
    flagUrl: 'https://flagcdn.com/w40/my.png',
    activeNriClients: 390,
    timeZone: 'MYT (UTC+8)',
    deskManager: 'R. Subramaniam (Kuala Lumpur Office)',
    deskPhone: '+60 3-2110 8899 / +91 91771 23456',
    deskLocation: 'Brickfields (Little India), Kuala Lumpur',
    poaProcess: 'Attestation at High Commission of India Kuala Lumpur (Mon’t Kiara). Complete notary assistance.',
    bankingGuidance: 'MYR Ringgit to INR wire transfers through Maybank / CIMB / Bank of India KL.',
    topCorridors: ['Shadnagar Industrial Belt', 'Vijayawada Highway Highway Ventures'],
    featuredTestimonial: {
      clientName: 'Devi & Karthik',
      city: 'Kuala Lumpur, Malaysia',
      investment: 'SVS Royal Enclave Plot',
      quote: 'The SVS KL desk in Brickfields made purchasing land in Hyderabad so straightforward. They cleared all DTCP documents, built my compound wall, and send monthly photo updates.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'HCI Kuala Lumpur Document Services',
        desc: 'Personal doorstep document pickup in KL and Selangor for HCI attestation.',
        tag: 'Malaysia Special',
      },
      {
        title: 'Precast Wall & Security Guarantee',
        desc: 'Guaranteed 6-foot precast concrete boundary wall with painted owner nameplate within 14 days.',
        tag: 'Asset Protection',
      },
      {
        title: 'Spot Registration & EC Certificate',
        desc: 'Clear Encumbrance Certificate (EC) issued instantly upon final remittance.',
        tag: 'Legal Security',
      },
    ],
  },
  {
    code: 'th',
    name: 'Thailand',
    flagUrl: 'https://flagcdn.com/w40/th.png',
    activeNriClients: 210,
    timeZone: 'ICT (UTC+7)',
    deskManager: 'Anand Kumar (Bangkok NRI Services)',
    deskPhone: '+66 2 653 1200 / +91 91771 23456',
    deskLocation: 'Sukhumvit Road, Bangkok',
    poaProcess: 'Indian Embassy Bangkok attestation with full legal draft review in English and Telugu.',
    bankingGuidance: 'THB Baht to INR wire transfers via Bangkok Bank / Kasikornbank NRE accounts.',
    topCorridors: ['Sangareddy West Belt', 'Aerospace & Pharma Hill Corridor'],
    featuredTestimonial: {
      clientName: 'Ramesh Varma',
      city: 'Bangkok, Thailand',
      investment: '2 Apartments & SVS Membership Card',
      quote: 'SVS handles tenant selection and rent collection for my 2 apartments in Hyderabad. Money comes right into my NRE account every single month without fail.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'Bangkok Embassy Legal Coordination',
        desc: 'Full assistance for Thai Indian diaspora with Embassy of India Bangkok attestation.',
        tag: 'Thailand Special',
      },
      {
        title: 'Flat Rental & Tenant Management',
        desc: 'End-to-end apartment tenant screening, maintenance, and monthly rent deposit in India.',
        tag: 'Rental Income',
      },
      {
        title: 'Suvarnabhumi to Hyderabad Concierge',
        desc: 'Direct flight arrival welcome concierge with private cab and SVS Resort stay pass.',
        tag: 'Concierge',
      },
    ],
  },
  {
    code: 'ae',
    name: 'UAE & Gulf',
    flagUrl: 'https://flagcdn.com/w40/ae.png',
    activeNriClients: 890,
    timeZone: 'GST (UTC+4 - Dubai Time)',
    deskManager: 'P. Ravinder Reddy & Sameer Ahmed (Middle East Operations)',
    deskPhone: '+971 4 397 8800 / +91 91771 23456',
    deskLocation: 'Bur Dubai / Business Bay Representative Desk, Dubai, UAE',
    poaProcess: 'Attestation at Indian Consulate Dubai (CGI Dubai) / Embassy of India Abu Dhabi + IVS Global processing.',
    bankingGuidance: 'AED Dirham tax-free remittance through Emirates NBD / Mashreq / LuLu Exchange directly to SVS NRE Escrow.',
    topCorridors: ['Shamshabad International Airport Zone', 'Commercial Highway Frontage Plots', 'Yadadri Mega Townships'],
    featuredTestimonial: {
      clientName: 'Mohammed Imran & Family',
      city: 'Deira, Dubai, UAE',
      investment: 'Commercial Plot in Shamshabad & Platinum Card',
      quote: 'Living in Dubai for 15 years, SVS is the most reliable developer I have seen. Their Dubai Bur Dubai office gave me the original land papers, arranged my CGI Dubai POA, and my plot value has doubled!',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    },
    specialServices: [
      {
        title: 'IVS Global & CGI Dubai Fast-Track POA',
        desc: 'In-person help at IVS Global Dubai / Abu Dhabi for Indian Consulate Power of Attorney attestation.',
        tag: 'Gulf Special',
      },
      {
        title: 'Tax-Free Dirham Remittance Escrow',
        desc: '100% compliant remittance documentation ensuring zero tax friction and transparent bank receipts.',
        tag: 'Tax Free',
      },
      {
        title: 'Bur Dubai Physical Consultation Office',
        desc: 'Meet our senior SVS team directly in Bur Dubai / Business Bay for land document verification.',
        tag: 'Dubai Office',
      },
    ],
  },
];

export const SERVICE_DIVISIONS: ServiceDivision[] = [
  {
    id: 'housing',
    title: 'Housing Development Division',
    subtitle: 'Apartments, Gated Villas & Infrastructure',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Developing eco-friendly gated communities, multi-story apartments, luxury standalone villas, and master-planned layouts.',
    features: ['RERA & HMDA Compliant', 'Eco-friendly Green Building Standards', '24/7 Security & Gated Community', 'In-house Architecture & Construction'],
  },
  {
    id: 'real-estate',
    title: 'Real Estate & Plot Division',
    subtitle: 'Open Plots, Land Investments & Geo-Tagging',
    iconName: 'Landmark',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Helping regular families and NRI investors acquire high-appreciation open plots with 100% clear titles and instant spot registration.',
    features: ['Precast Wall & Security Setup', 'Plot Painting & Numbering', 'Digital Map Geo-Tagging', 'Resale & Valuation Guarantee'],
  },
  {
    id: 'nri-services',
    title: 'NRI Property Management Division',
    subtitle: 'Dedicated Supervisors for Overseas Property Owners',
    iconName: 'Globe',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Complete remote management for your land and apartments in India. We act as your trusted eyes and ears on the ground.',
    features: ['Dedicated On-site Supervisor', 'Live Photo & Video Inspection Reports', 'Legal Registration & POA Assistance', 'Tenant Screening & Rent Collection'],
  },
  {
    id: 'club-resorts',
    title: 'Club & Resorts Division',
    subtitle: 'Luxury Hotel, Resort & Event Booking',
    iconName: 'Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Unwind at SVS luxury resort properties or easily book family retreats, destination weddings, and premium hotel stays.',
    features: ['4-Star Luxury Resort Access', 'Event & Wedding Hall Booking', 'Exclusive SVS Dining Privileges', 'Special Discounts for SVS Cardholders'],
  },
  {
    id: 'foundation',
    title: 'Srivasuda Foundation',
    subtitle: 'Community Welfare, Education & Social Responsibility',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    description: 'Empowering local communities through educational scholarships, green plantation drives, and rural healthcare initiatives.',
    features: ['Clean Water & Sanitation Drives', 'Youth Skill Development Centers', 'Mass Tree Plantation in Ventures', 'Free Healthcare Camps'],
  }
];

export const CAREER_POSITIONS: CareerPosition[] = [
  {
    id: 'c-1',
    title: 'Customer Relationship Associate (CRA)',
    department: 'Client Relations & NRI Desk',
    location: 'KPHB Corporate Office, Hyderabad',
    type: 'Full-time',
  },
  {
    id: 'c-2',
    title: 'Customer Relationship Officer (CRO)',
    department: 'Sales & Advisory',
    location: 'Karimnagar / Hyderabad',
    type: 'Full-time',
  },
  {
    id: 'c-3',
    title: 'Field Officer & Site Supervisor',
    department: 'Property Maintenance & Plot Care',
    location: 'Shadnagar / Sadashivpet / Yadadri',
    type: 'Full-time',
  },
  {
    id: 'c-4',
    title: 'Senior Support Desk Executive',
    department: 'Member Care & Support',
    location: 'Hyderabad / Singapore Desk',
    type: 'Full-time',
  },
  {
    id: 'c-5',
    title: 'Business Development Manager (BDM)',
    department: 'Land Acquisition & Partnerships',
    location: 'Hyderabad Head Office',
    type: 'Full-time',
  },
];

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    id: 'b-corp',
    city: 'Hyderabad Head Office (Corporate)',
    address: 'MIG 550, Road No. 1, KPHB Colony, Kukatpally, Hyderabad - 500072, Telangana, India',
    email: 'info@srivasudatruewealthindia.com',
    phone: '+91 86888 81283',
    isCorporate: true,
  },
  {
    id: 'b-karimnagar',
    city: 'Karimnagar Branch',
    address: 'House No 2-10-376, Jyothinagar, Near Post Office, Karimnagar - 505001, Telangana, India',
    email: 'karimnagar@srivasudatruewealthindia.com',
    phone: '+91 99887 76655',
  },
  {
    id: 'b-nizamabad',
    city: 'Nizamabad Branch',
    address: 'Main Road, Near Bus Stand Complex, Nizamabad - 503001, Telangana',
    email: 'nizamabad@srivasudatruewealthindia.com',
    phone: '+91 98480 12345',
  },
  {
    id: 'b-warangal',
    city: 'Warangal Branch',
    address: 'Hanamkonda Main Circle, Near Public Garden, Warangal - 506001',
    email: 'warangal@srivasudatruewealthindia.com',
    phone: '+91 98481 67890',
  },
  {
    id: 'b-guntur',
    city: 'Guntur Branch (Andhra Pradesh)',
    address: 'Lakshmipuram Main Road, Opposite City Mall, Guntur - 522007, AP',
    email: 'guntur@srivasudatruewealthindia.com',
    phone: '+91 86322 11000',
  },
  {
    id: 'b-singapore',
    city: 'Singapore Overseas NRI Desk',
    address: 'Anson Road, International Plaza #14-02, Singapore 079903',
    email: 'singapore@srivasudatruewealthindia.com',
    phone: '+65 6789 0123',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    name: 'Srinivas Rao K.',
    role: 'Senior Software Architect',
    location: 'USA (Dallas, Texas)',
    quote: 'Managing my 3 plots in Shadnagar from America was a nightmare until I joined SVS Srivasudha. Their supervisor installed precast walls, sent monthly video updates, and handled my spot registration seamlessly!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't-2',
    name: 'Anitha & Rajesh Reddy',
    role: 'NRI Investors',
    location: 'Singapore',
    quote: 'We hold Platinum Membership cards. The resort night stays in Hyderabad are incredible for our annual India trips, and the 25% plot discount gave us unmatched ROI.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't-3',
    name: 'Major General V. K. Sharma (Retd)',
    role: 'Defence Veteran & Plot Owner',
    quote: 'Over 20 years of experience is visible in their professionalism. 100% clear titles, DTCP approvals, and complete transparency in every transaction.',
    location: 'Hyderabad, India',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

export const DEFAULT_NRI_TIERS: NriTierConfig[] = [
  {
    id: 'silver-care',
    name: 'Silver Care',
    subtitle: 'Essential Land & Plot Security',
    annualFee: '₹24,999 / Year',
    tag: 'Standard',
    features: [
      'Quarterly Physical Site Inspection & Geo-tagged High-Res Photos',
      'Boundary Wall & Encroachment Vigilance Check',
      'Municipal & Gram Panchayat Property Tax Filing Assistance',
      'Online Digital Document & EC Title Vault Access',
      'Dedicated Relationship Manager on WhatsApp / Call'
    ],
    recommendedFor: 'Open Plots & Farmlands',
    color: 'slate',
  },
  {
    id: 'gold-executive',
    name: 'Gold Executive',
    subtitle: 'Comprehensive Property & Legal Protection',
    annualFee: '₹49,999 / Year',
    tag: 'Most Popular',
    popular: true,
    features: [
      'Bi-Monthly Physical Site Inspection with 4K Drone Walkthroughs',
      'Annual Certified Encumbrance Certificate (EC) Verification',
      'Civil Maintenance & Compound Wall Repair Coordination',
      'Property Rent Collection & Tenant Liaison (for built houses)',
      'Government Revenue Office (Tahsil / Sub-Registrar) Document Representation',
      'Priority 24-Hour Emergency Site Visit Dispatch'
    ],
    recommendedFor: 'Villas, Built Houses & High-Value Plots',
    color: 'amber',
  },
  {
    id: 'platinum-sovereign',
    name: 'Platinum Sovereign',
    subtitle: 'VIP Portfolio Care & Wealth Advisory',
    annualFee: '₹99,999 / Year',
    tag: 'VIP Elite',
    features: [
      'Monthly Complete Property Health Check & Live Stream Inspection',
      'Full-Scale Legal Opinion by Senior High Court Advocate',
      'Complete Property Resale, Liquidation & Market Price Guidance',
      'Airport Concierge Pickup & Complimentary SVS Resort Stay Pass',
      '24/7 Dedicated Senior NRI Client Partner & WhatsApp Priority Group',
      'Complete Land Mutation & Layout Regularization Handholding'
    ],
    recommendedFor: 'Multi-Property Portfolios & Commercial Assets',
    color: 'emerald',
  },
];

export const DEFAULT_HOSPITALITY_ITEMS: HospitalityItem[] = [];

export const DEFAULT_APP_AD: MemberAppAd = {
  id: 'ad-01',
  title: 'Download SVS True Wealth Mobile App',
  subtitle: 'Unlock 24/7 Live 4K Plot CCTV Feeds, Instant Certified EC Downloads, and 1-Click Resort Stay Reservations.',
  badge: 'Exclusive Member Companion',
  downloadUrl: 'https://svstrue-wealth.app.link',
  features: [
    'Live 24/7 CCTV Camera Plot Streaming',
    'Certified Encumbrance Certificate (EC) Vault',
    'Complimentary Staycation & Clubhouse Bookings',
    'Instant Digital Passbook & Payment Receipts'
  ],
  isActive: true,
};
