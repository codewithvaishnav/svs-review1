/**
 * SVS SRIVASUDHA COMPREHENSIVE KNOWLEDGE BASE
 * Grounding data for AI Assistant with answers across all queries:
 * Ventures, Farmlands, Villas, Apartments, Approvals, Pricing, Process, NRI, Resales, Clubs, Careers, Contact.
 */

export interface SystemKnowledgeEntry {
  id: string;
  category: 'mission' | 'proptech' | 'enrollment' | 'projects' | 'nri' | 'resorts' | 'membership' | 'faq' | 'contact';
  title: string;
  keywords: string[];
  summary: string;
}

export const SVS_CORE_MISSION = {
  organization: "SVS Srivasudha Real Estate & Infrastructure",
  helpline: "+91 86888 81283",
  alternatePhone: "+91 91212 12345",
  email: "info@svssrivasudha.com",
  experience: "20+ Years of Excellence & Trust (Founded 2004)",
  headquarters: "SVS Towers, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
  branches: [
    "Hyderabad HQ: Jubilee Hills, Road No. 36",
    "Visakhapatnam (Vizag): MVP Colony, Sector 4",
    "Vijayawada: MG Road, Near Benz Circle",
    "Bangalore: Indiranagar, 100ft Road",
    "Goa: Panaji City Centre"
  ],
  mission: "Empowering homebuyers and investors with 100% legal, clear-title, high-appreciation real estate assets including HMDA/DTCP approved open plots, luxury farmlands, gated communities, and eco-resorts.",
  pillars: [
    "Absolute Legal Transparency (DTCP/HMDA/RERA clear titles & digital passbooks)",
    "PropTech Innovation (4K drone spatial surveys, 360° VR tours, digital land analytics)",
    "Customer Trust & Lifetime Asset Appreciation",
    "Integrated Eco-Resort & Club Privileges"
  ]
};

export const SVS_PROJECTS_SUMMARY = `
VENTURES & LOCATIONS OVERVIEW:
SVS Srivasudha True Wealth India develops premier DTCP, HMDA, and TS-RERA approved open plot layouts, gated villas, and community farm projects across high-growth corridors in Telangana and Andhra Pradesh.

All active ventures, plots inventory, phase layouts, and live prices per square yard are managed and updated dynamically in real-time by SVS Administration in our centralized cloud database.

STANDARD INFRASTRUCTURE & AMENITIES IN SVS VENTURES:
• 100% Clear Title & Immediate Spot Registration
• 60ft, 40ft, and 33ft Wide Blacktop Roads with Curbing
• Underground Drainage System & Water Pipeline to each plot
• Electricity with Transformer & LED Street Lighting
• Compound wall around entire layout with Grand Entrance Arch & 24/7 Security
• Overhead Water Tank & Rainwater Harvesting Pits
• Landscaped Parks, Children's Play Arena & Avenue Plantations
• 100% Vastu Compliant Layout
`;

export const FAQ_KNOWLEDGE_ENTRIES: SystemKnowledgeEntry[] = [
  {
    id: "purpose-mission",
    category: "mission",
    title: "About SVS, Legacy & Mission",
    keywords: [
      "purpose", "mission", "vision", "goal", "objective", "aim", "why", "about", 
      "motto", "pillar", "values", "overview", "established", "meaning", "who", 
      "stand for", "srivasudha", "company", "legacy", "experience", "founder", "trust"
    ],
    summary: `🌟 **About SVS Srivasudha (20+ Years Legacy):**\n• Established in 2004, SVS is a premier infrastructure and real estate developer headquartered in Jubilee Hills, Hyderabad.\n• **Mission:** Provide 100% legally clear, RERA & DTCP/HMDA approved open plots, luxury villas, and farmlands with high capital appreciation.\n• **Core Pillars:** 100% title transparency, proptech innovations (4K drone mapping, 360° VR tours), and integrated eco-resort privileges.`
  },
  {
    id: "locations-pricing",
    category: "projects",
    title: "Venture Locations, Approvals & Price Rates",
    keywords: [
      "location", "where", "venture", "project", "layout", "site", "hyderabad", 
      "shadnagar", "yadadri", "vizag", "visakhapatnam", "vijayawada", "goa", 
      "bangalore", "kothur", "mucherla", "shamshabad", "sadashivpet", "sangareddy",
      "plots", "price", "rate", "sq yd", "cost", "sqft", "flat", "apartment", "villa", "budget", "kharidna"
    ],
    summary: `📍 **SVS Projects & Pricing Information:**\n• All active ventures, phase layouts, and square yard rates are maintained live by SVS Administration.\n• Layouts are fully approved by DTCP / HMDA / TS-RERA / VMRDA with immediate spot registration.\n• For current plot inventory, live square yard rates, and site visit scheduling, explore the Ventures section in the app or call our advisory team at +91 86888 81283.`
  },
  {
    id: "free-site-visit",
    category: "projects",
    title: "Complimentary AC Cab Site Inspection",
    keywords: [
      "cab", "visit", "inspect", "site visit", "free cab", "car", "pick up", 
      "inspection", "see plot", "travel", "transport", "booking", "schedule", "view", "pickup"
    ],
    summary: `🚗 **Free Doorstep AC Cab Site Visit:**\n• SVS provides complimentary doorstep AC cab pick-up & drop anywhere in Hyderabad for you and your family.\n• An authorized SVS project specialist accompanies you to show layout boundaries, physical amenities, and legal link documents.\n• Completely free of cost with zero booking charges or purchase obligations.\n• To schedule, contact our helpline at +91 86888 81283 or submit a site visit request in the app.`
  },
  {
    id: "legal-approval-process",
    category: "projects",
    title: "Legal Approvals, Title Deeds & Registration Process",
    keywords: [
      "legal", "clear title", "dtcp", "hmda", "rera", "vmrda", "crda", "registration", 
      "ec", "encumbrance", "mutation", "passbook", "documents", "loan", "bank loan", "emi", "bank"
    ],
    summary: `📜 **Legal Clearance & Registration Process:**\n• **100% Legal Clear Titles:** All ventures possess government-approved DTCP / HMDA / VMRDA / CRDA master plan sanctions and valid RERA numbers.\n• **Encumbrance Free:** 30-year certified Encumbrance Certificates (EC) and legal opinion certificates are provided prior to booking.\n• **Spot Registration & Mutation:** Direct registration in your name with government digital passbook allotment.\n• **Bank Loan Assistance:** Pre-approved by major banks (SBI, HDFC, ICICI, Axis Bank) up to 70-80% of property value.`
  },
  {
    id: "nri-services",
    category: "nri",
    title: "NRI Overseas Investment & Support Desk",
    keywords: [
      "nri", "overseas", "foreign", "usa", "uae", "dubai", "uk", "singapore", 
      "australia", "abroad", "remote", "diaspora", "fema", "nre", "nro", "wire", "power of attorney", "poa"
    ],
    summary: `🌍 **SVS Global NRI Investment Desk:**\n• **Dedicated Country Coordinators:** Timezone-matched support across 15+ countries (USA, UAE, UK, Australia, Singapore, Europe).\n• **100% Remote Purchase:** Virtual 360° VR plot walkthroughs, transparent digital legal verification, and power of attorney (POA) registration guidance.\n• **Property Safeguard:** Periodic HD boundary photos and maintenance status reports sent to overseas owners.\n• **NRI Helpline:** Call/WhatsApp +91 86888 81283 or email nri@svssrivasudha.com.`
  },
  {
    id: "membership-privileges",
    category: "membership",
    title: "SVS Privilege Membership Cards & Perks",
    keywords: [
      "membership", "card", "privilege", "silver", "gold", "platinum", "tier", 
      "discount", "benefits", "perks", "club card", "enrol", "membership price", "card cost"
    ],
    summary: `💳 **SVS Privilege Membership Tiers:**\n• **Silver Card (₹25,000 / 3 Years):** 5% plot pre-launch discount + 2 complimentary resort nights/year + club dining discount.\n• **Gold Card (₹50,000 / 5 Years):** 8% pre-launch discount + 4 complimentary resort nights/year + swimming pool & sports access.\n• **Platinum Card (₹1,00,000 / 5 Years):** 12% priority plot discount + 8 complimentary resort nights/year + VIP banquet passes + dedicated relationship manager.`
  },
  {
    id: "resorts-hospitality",
    category: "resorts",
    title: "SVS Club & Eco-Resort Bookings",
    keywords: [
      "resort", "club", "staycation", "stay", "hotel", "suite", "pool", 
      "vacation", "holiday", "room", "book", "reservation", "cottage", "banquet", "event", "lawn", "wedding", "party"
    ],
    summary: `🏖️ **SVS Club & Eco-Resorts:**\n• **Royal Palm Eco Resort & Country Club:** Features premium deluxe cottages, swimming pools, multi-cuisine dining, cricket turf, and bonfire zones.\n• **Banquet & Open Lawns:** Available for family weddings, receptions, and corporate offsites (capacity: 100 to 2,500 guests).\n• Plot owners and Privilege Card members receive discounted member tariffs and complimentary yearly room vouchers.`
  },
  {
    id: "associate-careers",
    category: "enrollment",
    title: "Join as Business Associate, Partner or Careers",
    keywords: [
      "join", "enroll", "register", "associate", "partner", "member", 
      "career", "job", "apply", "work", "agent", "marketing", "signup", "become", 
      "commission", "earnings", "income", "salary", "incentive"
    ],
    summary: `🤝 **Partnering with SVS:**\n• **Business Associate / Channel Partner:** Zero-cost enrollment. Earn up to 5% direct plot sales commission, hierarchical referral bonuses, and track leads in real time on the associate dashboard.\n• **Careers & Hiring:** Current openings in Real Estate Sales, Civil Engineering, Legal Advisory, and PropTech Development. Send your resume to careers@svssrivasudha.com.`
  },
  {
    id: "ai-proptech",
    category: "proptech",
    title: "SVS AI PropTech & Spatial Drone Suite",
    keywords: [
      "tech", "technology", "ai", "drone", "360", "vr", "virtual", "spatial", 
      "proptech", "survey", "mapping", "gis", "analytics", "digital", "feature", 
      "software", "suite", "section"
    ],
    summary: `💻 **SVS AI PropTech Platform:**\n• **4K Aerial Drone Mapping:** Precise topographical surveys and digital plot demarcation.\n• **360° VR Walkthroughs:** Immersive layout exploration from any mobile device or browser.\n• **AI Appreciation Estimator:** Historical data & highway infrastructure growth modeling to forecast 3-year and 5-year land appreciation.`
  },
  {
    id: "contact-support",
    category: "contact",
    title: "Helpline, Office Locations & Contact Details",
    keywords: [
      "contact", "phone", "call", "number", "email", "address", "helpline", 
      "whatsapp", "office", "headquarters", "support", "talk", "agent", "human", "hours", "timing"
    ],
    summary: `📞 **SVS Contact & Support:**\n• **Direct Helpline / WhatsApp:** +91 86888 81283\n• **Alternate Phone:** +91 91212 12345\n• **General Email:** info@svssrivasudha.com\n• **Headquarters:** SVS Towers, Road No. 36, Jubilee Hills, Hyderabad - 500033\n• **Operating Hours:** Monday to Sunday, 9:00 AM – 8:00 PM IST.`
  }
];

/**
 * Robust context search engine that handles ANY query intelligently.
 */
export function semanticSearchContext(query: string, isLoggedIn: boolean = false): string {
  const cleanQuery = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  if (!cleanQuery) {
    return "Hello! I am SVS AI Concierge. How can I assist you today with our HMDA/DTCP approved plots, luxury villas, free site visit cabs, membership benefits, or NRI services?";
  }

  const words = cleanQuery.split(/\s+/).filter(w => w.length > 1);

  const synonymMap: Record<string, string[]> = {
    purpose: ["mission", "vision", "about", "why", "who", "goal", "motto", "meaning", "srivasudha", "legacy", "company", "owner", "background"],
    mission: ["purpose", "vision", "goal", "aim", "motto"],
    tech: ["proptech", "drone", "360", "vr", "virtual", "ai", "digital", "software", "suite"],
    join: ["enroll", "register", "associate", "apply", "partner", "career", "become", "signup", "work", "commission", "job"],
    ec: ["encumbrance", "deed", "title", "legal", "passbook", "document"],
    location: ["venture", "project", "place", "where", "site", "city", "hyderabad", "shadnagar", "yadadri", "shamshabad", "vizag", "goa", "bangalore", "amaravati", "sadashivpet", "price", "rate", "cost", "plot", "villa", "apartment"],
    resort: ["club", "hotel", "stay", "staycation", "room", "booking", "suite", "pool", "lawn", "banquet", "cottage"],
    membership: ["card", "silver", "gold", "platinum", "tier", "privilege", "discount"],
    visit: ["cab", "inspection", "car", "travel", "transport", "see", "view", "pickup", "free"]
  };

  const expandedTokens = new Set<string>(words);
  for (const word of words) {
    if (synonymMap[word]) {
      synonymMap[word].forEach(s => expandedTokens.add(s));
    }
  }

  // Score knowledge entries
  let bestEntry: SystemKnowledgeEntry | null = null;
  let maxScore = 0;

  for (const entry of FAQ_KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const token of expandedTokens) {
      if (entry.keywords.includes(token)) score += 3;
      if (entry.title.toLowerCase().includes(token)) score += 4;
      if (entry.summary.toLowerCase().includes(token)) score += 1;
    }

    if (score > maxScore) {
      maxScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && maxScore >= 2) {
    return bestEntry.summary;
  }

  // Generic fallback with helpful grounding
  return `Namaste! 🙏 I am SVS AI Concierge. Here is how I can help:\n• **Approved Ventures & Pricing:** Government-approved DTCP/HMDA layouts with instant registration.\n• **Free AC Cab Visit:** Doorstep pick-up & drop across Hyderabad at zero cost.\n• **NRI Investment Desk:** Dedicated overseas support and remote booking.\n• **Privilege Membership:** 5% to 12% plot discounts and complimentary resort staycations.\n• **Direct Helpline:** Call or WhatsApp us at **+91 86888 81283** (9 AM – 8 PM IST).`;
}
