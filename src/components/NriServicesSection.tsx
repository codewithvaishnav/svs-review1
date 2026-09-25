import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, MapPin, FileText, CheckCircle2, 
  PhoneCall, Building, Hotel, Car, Clock, 
  UserCheck, CreditCard, Sparkles, ArrowRight, 
  ChevronDown, ChevronUp, Send, X, AlertCircle, Search, HelpCircle,
  Globe2
} from 'lucide-react';
import { NRI_COUNTRIES, DEFAULT_NRI_TIERS } from '../data/svsData';
import { NriTier, FirestoreCollections } from '../types';
import { dbService } from '../services/dbService';

interface NriServicesSectionProps {
  selectedCountryName?: string;
  onSelectCountry?: (countryName: string) => void;
  onOpenConsultation?: () => void;
}

export interface NriSubService {
  id: string;
  name: string;
  summary: string;
  deliverables: string[];
  turnaroundTime: string;
}

export interface NriMainService {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  iconName: string;
  subServices: NriSubService[];
}

/**
 * Functional NRI Main Services and Sub-Services Directory
 * Structured for zero fluff, clear deliverables, and immediate enquiry routing.
 */
/**
 * Functional NRI Main Services and Sub-Services Directory
 * Matches the exact 8 categories and sub-services from "WE ARE ALWAYS AT YOUR SERVICE".
 */
export const NRI_FUNCTIONAL_SERVICES: NriMainService[] = [
  {
    id: 'property-services',
    title: 'Property Services ?',
    categoryTag: 'Real Estate & Assets',
    description: 'Complete sales, resale, construction, renovation, registration documents, and property management.',
    iconName: 'shield',
    subServices: [
      {
        id: 'prop-sales',
        name: 'A) Sales',
        summary: 'Direct buying assistance for verified plots, flats, and villas with clean titles.',
        deliverables: [
          'Verified property portfolio matching',
          'End-to-end title & link document verification',
          'Registration & Sub-Registrar slot coordination'
        ],
        turnaroundTime: 'Immediate Assistance'
      },
      {
        id: 'prop-resale',
        name: 'B) Resale',
        summary: 'Resale support through our 10,000+ verified member network without middleman spam.',
        deliverables: [
          'Prevailing market valuation appraisal',
          'Direct matching with pre-qualified buyers',
          'Complete legal & registration settlement support'
        ],
        turnaroundTime: 'Custom Timeline'
      },
      {
        id: 'prop-renovation',
        name: 'C) Renovation',
        summary: 'Interior upgrades, painting, civil repairs, and structural remodeling for existing properties.',
        deliverables: [
          'Detailed site inspection & itemized quotation',
          'Quality material procurement & skilled supervision',
          'Before/after progress photos uploaded to portal'
        ],
        turnaroundTime: 'Project Based'
      },
      {
        id: 'prop-construction',
        name: 'D) Construction',
        summary: 'Custom villa, independent house, and compound wall construction with progress monitoring.',
        deliverables: [
          'Architectural layout & structural engineering design',
          'Stage-wise construction updates & drone inspections',
          'Municipal permission & completion certificate assistance'
        ],
        turnaroundTime: 'Project Based'
      },
      {
        id: 'prop-rental',
        name: 'E) Rental',
        summary: 'Tenant background check, agreement drafting, and monthly rent collection directly to NRE/NRO account.',
        deliverables: [
          'Rigorous tenant police & identity verification',
          '11-month e-stamped legal rental agreement',
          'Direct monthly bank transfer & invoice tracking'
        ],
        turnaroundTime: 'Ongoing Service'
      },
      {
        id: 'prop-flat-services',
        name: 'F) Flat Services',
        summary: 'Dedicated apartment care including plumbing, electrical, maintenance, and association dues support.',
        deliverables: [
          'Routine check of plumbing, electrical & fittings',
          'Society/association maintenance dues coordination',
          'Deep cleaning between tenant transitions'
        ],
        turnaroundTime: '3 to 5 Days'
      },
      {
        id: 'prop-registration',
        name: 'G) Registration Documents Services',
        summary: 'Assistance with Encumbrance Certificate (EC), certified copies, POA attestation, and stamp duty.',
        deliverables: [
          '30-year Encumbrance Certificate (EC) search & retrieval',
          'Power of Attorney (POA) drafting & attestation guidance',
          'Certified sale deed retrieval from Sub-Registrar'
        ],
        turnaroundTime: '48 to 72 Hours'
      },
      {
        id: 'prop-management',
        name: 'H) Property Management',
        summary: 'Comprehensive hands-off caretaker service for open plots, independent houses, and apartments.',
        deliverables: [
          'Bi-weekly physical inspection by SVS Field Officer',
          'Weed/bush clearing and boundary stone repainting',
          'Monthly timestamped video audit report'
        ],
        turnaroundTime: 'Ongoing Bi-Weekly'
      },
      {
        id: 'prop-insurance',
        name: 'I) House Insurance',
        summary: 'Comprehensive property insurance against natural calamities, fire, theft, and structural damage.',
        deliverables: [
          'Policy quotation from top national insurers',
          'End-to-end claim assistance & documentation',
          'Annual renewal tracking & reminders'
        ],
        turnaroundTime: '3 Business Days'
      },
      {
        id: 'prop-safety-monitoring',
        name: 'J) Flat Safety & Monetering',
        summary: '24/7 CCTV surveillance integration, smart lock inspections, and periodic safety checkups.',
        deliverables: [
          'Live IP CCTV camera setup with mobile app access',
          'Periodic lock & door seal integrity inspections',
          'Instant alert notification to owner on suspicious entry'
        ],
        turnaroundTime: '5 Days Setup'
      },
      {
        id: 'prop-legal',
        name: 'K) Legal',
        summary: 'Title scrutiny, Pahani/Adangal verification, legal opinions, and litigation checks by empanelled advocates.',
        deliverables: [
          '30-year title search & due diligence report',
          'Revenue record check (Dharani, Pahani, 1B, FMB)',
          'Signed legal opinion by High Court advocate'
        ],
        turnaroundTime: '5 Business Days'
      }
    ]
  },
  {
    id: 'sales-purchase',
    title: 'Sales & Purchase ?',
    categoryTag: 'Layouts & Properties',
    description: 'Verified HMDA layouts, DTCP layouts, open plots, residential flats, and luxury villas.',
    iconName: 'map',
    subServices: [
      {
        id: 'sp-hmda',
        name: 'A) HMDA Layouts',
        summary: 'Verified HMDA-approved residential plots with clear titles and bank loan eligibility.',
        deliverables: [
          'Verified HMDA layout approval copy',
          '40/30 ft blacktop roads & underground drainage check',
          'Direct site visit & layout booking support'
        ],
        turnaroundTime: 'Immediate Assistance'
      },
      {
        id: 'sp-dtcp',
        name: 'B) DTCP Layouts',
        summary: 'DTCP-approved open plots in high-growth corridors and district headquarters.',
        deliverables: [
          'DTCP technical layout plan verification',
          'Revenue survey number correlation',
          'Clear demarcation with boundary stones'
        ],
        turnaroundTime: 'Immediate Assistance'
      },
      {
        id: 'sp-plots',
        name: 'C) Plots',
        summary: 'Open residential, commercial, and farm plots in prime investment zones.',
        deliverables: [
          'Title-clear open plots with EC verification',
          'Geo-tagged boundary survey report',
          'Assistance with registration & mutation'
        ],
        turnaroundTime: 'Immediate Assistance'
      },
      {
        id: 'sp-flats',
        name: 'D) Flats',
        summary: 'Ready-to-move and under-construction apartments in gated communities and standalone towers.',
        deliverables: [
          'RERA-approved project verification',
          'Floor plan & Vastu compliance check',
          'Home loan negotiation & processing support'
        ],
        turnaroundTime: 'Immediate Assistance'
      },
      {
        id: 'sp-villas',
        name: 'E) Villas (old & new)',
        summary: 'Premium luxury villas and independent houses (both newly constructed and resale properties).',
        deliverables: [
          'Structural audit & inspection report',
          'Gated community amenity & security assessment',
          'Complete legal & registration assistance'
        ],
        turnaroundTime: 'Immediate Assistance'
      }
    ]
  },
  {
    id: 'medical-service',
    title: 'Medical Service ?',
    categoryTag: 'Health & Senior Care',
    description: 'Senior citizen caretakers, hospital coordination, ambulance, medication, and doctor consultations.',
    iconName: 'user',
    subServices: [
      {
        id: 'med-caretaker',
        name: 'A) Senior Citizen Care Taker',
        summary: 'Vetted, compassionate caretakers for elderly family members residing in India.',
        deliverables: [
          'Background-verified trained elderly caretakers',
          'Daily check-ins & health monitoring reports to NRIs',
          'Assistance with daily activities & nutrition'
        ],
        turnaroundTime: '24 to 48 Hours'
      },
      {
        id: 'med-hospital',
        name: 'B) Hospital Service',
        summary: 'Priority admission coordination, insurance billing support, and hospital care assistance.',
        deliverables: [
          'Coordination with top multi-specialty hospitals',
          'Assistance with admission & discharge formalities',
          'Regular medical status updates to overseas family'
        ],
        turnaroundTime: 'Immediate / Emergency'
      },
      {
        id: 'med-ambulance',
        name: 'C) Ambulance Service',
        summary: '24/7 emergency and non-emergency ambulance coordination with ICU/ALS support.',
        deliverables: [
          'Rapid dispatch of BLS/ALS ambulance',
          'Direct coordination with nearest emergency hospital',
          'Real-time transit tracking'
        ],
        turnaroundTime: 'Emergency Dispatch'
      },
      {
        id: 'med-medication',
        name: 'D) Medication Service',
        summary: 'Regular doorstep delivery of prescribed medicines and monthly refill management.',
        deliverables: [
          'Timely prescription refills from genuine pharmacies',
          'Doorstep delivery to parents/family in India',
          'Monthly medication adherence check'
        ],
        turnaroundTime: 'Scheduled Monthly'
      },
      {
        id: 'med-doctor',
        name: 'E) Doctor Consultation',
        summary: 'Arranging specialist doctor appointments, tele-consultations, and home visits.',
        deliverables: [
          'Booking appointments with top specialists',
          'Coordination of video tele-consultations with NRI family',
          'Medical report analysis & explanation'
        ],
        turnaroundTime: '24 Hours'
      },
      {
        id: 'med-nursing',
        name: 'F) Nursing Care',
        summary: 'Professional home nursing care for post-operative recovery, dressings, and vitals monitoring.',
        deliverables: [
          'Certified nurses for home nursing support',
          'Daily vitals check & medical log maintenance',
          'Coordination with treating physician'
        ],
        turnaroundTime: '24 to 48 Hours'
      },
      {
        id: 'med-checkup',
        name: 'G) Medical check up',
        summary: 'Comprehensive master health checkup packages with sample collection at home.',
        deliverables: [
          'Home blood & diagnostic sample collection',
          'Complete master health checkup battery',
          'Digital medical reports uploaded to portal'
        ],
        turnaroundTime: '24 Hours Booking'
      },
      {
        id: 'med-emergency',
        name: 'H) Emergency Call Services',
        summary: 'Dedicated 24/7 emergency hotline for instant medical response and field officer dispatch.',
        deliverables: [
          '24x7 priority hotline for NRI family members',
          'Immediate on-ground executive dispatch during emergencies',
          'Direct coordination with hospital emergency ward'
        ],
        turnaroundTime: '24/7 Immediate'
      }
    ]
  },
  {
    id: 'tracking-service',
    title: 'Tracking Service ?',
    categoryTag: 'Work Progress & Monitoring',
    description: 'Assessment information, work progress timelines, inspection reports, and photo downloads.',
    iconName: 'clock',
    subServices: [
      {
        id: 'track-assessment',
        name: 'A) Any Assesment Information',
        summary: 'Detailed assessment reports on property tax, municipal valuations, and layout status.',
        deliverables: [
          'Property assessment number & tax ledger verification',
          'Municipal layout assessment status check',
          'Digital copy of current assessment records'
        ],
        turnaroundTime: '2 Business Days'
      },
      {
        id: 'track-progress-info',
        name: 'B) Work Progress Information',
        summary: 'Real-time updates on ongoing construction, renovation, or legal documentation works.',
        deliverables: [
          'Weekly status update on project milestones',
          'Direct communication channel with field engineer',
          'Issue escalation & resolution tracking'
        ],
        turnaroundTime: 'Weekly Updates'
      },
      {
        id: 'track-timeline',
        name: 'C) Time Line Information',
        summary: 'Clear project timeline tracking showing completed stages and upcoming target dates.',
        deliverables: [
          'Gantt/milestone schedule for construction or legal work',
          'Alert notifications on stage completion',
          'Revised completion estimates if weather/statutory delays occur'
        ],
        turnaroundTime: 'On Request'
      },
      {
        id: 'track-report',
        name: 'D) Work Progress Report',
        summary: 'Formal PDF audit report with supervisor sign-off, measurements, and quality checks.',
        deliverables: [
          'Comprehensive PDF audit report',
          'Quality inspection check sheet',
          'Financial utilization summary against budget'
        ],
        turnaroundTime: 'Bi-Weekly / Monthly'
      },
      {
        id: 'track-photos',
        name: 'E) Photos Download on work Progress',
        summary: 'High-resolution photo and video gallery downloads of your site from the member portal.',
        deliverables: [
          'HD timestamped site photos & drone footage',
          'Easy download archive in NRI member portal',
          'Before-and-after visual comparison view'
        ],
        turnaroundTime: 'Updated Bi-Weekly'
      }
    ]
  },
  {
    id: 'ghmc-govt-services',
    title: 'GHMC/Govt Services ?',
    categoryTag: 'Government & Municipal',
    description: 'Municipality tax, planning, permissions, birth/death certificates, PAN, Aadhaar, and life certificates.',
    iconName: 'file',
    subServices: [
      {
        id: 'govt-muni-tax',
        name: 'A) Muncipality Tax',
        summary: 'Calculation, payment, and receipt retrieval for GHMC and municipal property taxes.',
        deliverables: [
          'Property tax demand calculation & verification',
          'Online/offline municipal tax payment execution',
          'Digital receipt archiving in member portal'
        ],
        turnaroundTime: '3 Business Days'
      },
      {
        id: 'govt-muni-planning',
        name: 'B) Muncipality Planning',
        summary: 'Direct coordination with municipal town planning for layout compliance, LRS, and BRS schemes.',
        deliverables: [
          'LRS / BRS application status tracking',
          'Coordination with town planning officers',
          'Regularization certificate retrieval'
        ],
        turnaroundTime: '7 to 14 Business Days'
      },
      {
        id: 'govt-permission',
        name: 'C) Property Permission',
        summary: 'Building permit application, occupancy certificates, and municipal sanction plans.',
        deliverables: [
          'Building permission application filing (DPMS)',
          'Architectural plan compliance checking',
          'Occupancy & completion certificate coordination'
        ],
        turnaroundTime: 'As per GHMC timeline'
      },
      {
        id: 'govt-birth-cert',
        name: 'D) Birth Certificate',
        summary: 'Assistance with municipal birth certificate issuance, name inclusion, and certified copies.',
        deliverables: [
          'Application for certified copies from GHMC/MeeSeeva',
          'Name correction or delayed registration support',
          'Courier delivery to NRI overseas address'
        ],
        turnaroundTime: '5 to 10 Business Days'
      },
      {
        id: 'govt-aadhaar',
        name: 'E) Aadhaar Related',
        summary: 'Guidance and appointment scheduling for Aadhaar address update, mobile linking, and biometrics.',
        deliverables: [
          'Appointment booking at authorized Aadhaar Kendra',
          'Document checklist & form preparation',
          'Escort assistance during India visit'
        ],
        turnaroundTime: '24 Hours Scheduling'
      },
      {
        id: 'govt-tax-related',
        name: 'F) Tax Related',
        summary: 'Expert support for PAN-Aadhaar linking, property TDS (Form 26QB), and capital gains tax compliance.',
        deliverables: [
          'Form 26QB (TDS on sale of property) filing support',
          'Direct coordination with certified Chartered Accountants',
          'Challan & Form 16B retrieval'
        ],
        turnaroundTime: '3 to 5 Business Days'
      },
      {
        id: 'govt-death-cert',
        name: 'G) Death Certificate',
        summary: 'Fast-track assistance for municipal death certificate registration and certified copies.',
        deliverables: [
          'GHMC/Municipal registration & copy retrieval',
          'Legal heir certificate guidance',
          'Secure courier delivery to overseas address'
        ],
        turnaroundTime: '5 to 7 Business Days'
      },
      {
        id: 'govt-pancard',
        name: 'H) Pan Card',
        summary: 'New PAN card application, correction, change of address, or NRI PAN conversion.',
        deliverables: [
          'Online PAN application preparation & filing',
          'NRI/Foreign address verification guidance',
          'Physical PAN card delivery tracking'
        ],
        turnaroundTime: '7 to 14 Days'
      },
      {
        id: 'govt-life-cert',
        name: 'I) Life certificate for SR.Citizens',
        summary: 'Digital Jeevan Pramaan / Life Certificate submission for senior citizen pensioners.',
        deliverables: [
          'Doorstep biometric Jeevan Pramaan submission',
          'Pension disbursing bank record updating',
          'Confirmation receipt delivery'
        ],
        turnaroundTime: '2 Business Days'
      },
      {
        id: 'govt-passport-visa',
        name: 'J) Pass Port & Visa Services',
        summary: 'Assistance with passport renewal appointments, police verification guidance, and visa processing support.',
        deliverables: [
          'Passport Seva Kendra appointment booking',
          'Police verification coordination support',
          'OCI card application & document guidance'
        ],
        turnaroundTime: '3 to 5 Business Days'
      }
    ]
  },
  {
    id: 'personal-service',
    title: 'Personal Service ?',
    categoryTag: 'Personal & Concierge',
    description: 'Hotel & resort booking, event services, educational institution services, bank loans, tax, and GST.',
    iconName: 'sparkles',
    subServices: [
      {
        id: 'pers-hotel',
        name: 'A) Hotel Booking',
        summary: 'Preferred rates and confirmed bookings at luxury and business hotels.',
        deliverables: [
          'Corporate discount rates at partner hotels',
          'Complimentary room upgrades where available',
          'Custom check-in/check-out timing coordination'
        ],
        turnaroundTime: 'Immediate Booking'
      },
      {
        id: 'pers-resort',
        name: 'B) Resort Booking',
        summary: 'Reservations at Srivasuda Club Resort and partner weekend retreats for family staycations.',
        deliverables: [
          'Member-exclusive resort booking rates',
          'Family dining & recreation club access',
          'Custom event & gathering arrangements'
        ],
        turnaroundTime: 'Immediate Booking'
      },
      {
        id: 'pers-event',
        name: 'C) Event Service',
        summary: 'Complete event management for housewarmings (Gruhapravesam), family functions, and celebrations.',
        deliverables: [
          'Venue booking & decoration setup',
          'Priest coordination & traditional ritual arrangements',
          'Catering & guest hospitality management'
        ],
        turnaroundTime: 'Custom Timeline'
      },
      {
        id: 'pers-edu',
        name: 'D) Educational Institution Services',
        summary: 'Admissions guidance, document retrieval, and transcripts from universities/schools in Telangana.',
        deliverables: [
          'University transcript & degree verification retrieval',
          'School/college admission guidance for returning NRIs',
          'Secure courier of official sealed envelopes'
        ],
        turnaroundTime: '5 to 10 Business Days'
      },
      {
        id: 'pers-loans',
        name: 'E) Bank Loans',
        summary: 'NRI home loan, plot loan, and loan against property processing with top public & private banks.',
        deliverables: [
          'Pre-approved NRI loan eligibility assessment',
          'Doorstep/digital document collection',
          'Dedicated banking RM for quick sanction & disbursement'
        ],
        turnaroundTime: '7 to 14 Business Days'
      },
      {
        id: 'pers-tax',
        name: 'F) Tax Services',
        summary: 'Income tax return (ITR) filing, NRE/NRO tax advisory, and Form 15CA/15CB for remittances.',
        deliverables: [
          'Annual ITR filing by qualified Chartered Accountant',
          'Capital gains tax computation & optimization',
          'Form 15CA/15CB certification for fund repatriation'
        ],
        turnaroundTime: '3 to 5 Business Days'
      },
      {
        id: 'pers-gst',
        name: 'G) GST Service',
        summary: 'GST registration, monthly/quarterly return filing, and compliance for NRI commercial property owners.',
        deliverables: [
          'GST registration for commercial rental income',
          'Monthly/Quarterly GST return filing (GSTR-1, GSTR-3B)',
          'Annual GST reconciliation report'
        ],
        turnaroundTime: 'Scheduled Filing'
      },
      {
        id: 'pers-finance',
        name: 'H) Finance & Insurence',
        summary: 'Wealth management advisory, health/life insurance coordination, and portfolio structuring.',
        deliverables: [
          'Custom financial portfolio & asset allocation review',
          'Health & life insurance policy comparison & issuance',
          'Nomination & estate planning support'
        ],
        turnaroundTime: '2 Business Days'
      },
      {
        id: 'pers-reservation',
        name: 'I) Reservation (Bus, Train & Flight)',
        summary: 'Concierge ticket reservations for domestic and international travel across India.',
        deliverables: [
          'Flight, train & luxury bus ticket booking',
          'Itinerary optimization & seat preferences',
          'Instant re-booking assistance during delays'
        ],
        turnaroundTime: 'Immediate Booking'
      }
    ]
  },
  {
    id: 'cab-service',
    title: 'Cab Service ?',
    categoryTag: 'Transport & Travel',
    description: 'Airport pickup & drop, chauffeur driver service, rental vehicles, car selling, repairs, and tour packages.',
    iconName: 'car',
    subServices: [
      {
        id: 'cab-airport',
        name: 'A) Airport Pick up & Drop',
        summary: 'Punctual, chauffeur-driven luxury SUV/sedan transit to and from the international airport.',
        deliverables: [
          'Meet & Greet welcome at airport arrival gate',
          'Sanitized AC sedan/SUV with experienced chauffeur',
          'Real-time flight tracking for delayed arrivals'
        ],
        turnaroundTime: '24 Hours Prior Notice'
      },
      {
        id: 'cab-driver',
        name: 'B) Driver Service',
        summary: 'On-demand professional, background-verified chauffeurs for your personal car during India visits.',
        deliverables: [
          'Verified, courteous, and multilingual drivers',
          'Daily or weekly hiring packages',
          'Thorough familiarity with city routes & offices'
        ],
        turnaroundTime: '12 Hours Prior Notice'
      },
      {
        id: 'cab-rental',
        name: 'C) Rental Vehicle',
        summary: 'Self-drive or chauffeur-driven luxury and economy car rentals for short and extended stays.',
        deliverables: [
          'Wide fleet of well-maintained sedans & SUVs',
          'Flexible daily, weekly, or monthly rental tariffs',
          'Doorstep vehicle delivery & pickup'
        ],
        turnaroundTime: '24 Hours Prior Notice'
      },
      {
        id: 'cab-selling',
        name: 'D) Car Selling',
        summary: 'Hassle-free resale of your existing vehicle with RTO ownership transfer.',
        deliverables: [
          'Professional valuation & inspection report',
          'Matching with verified buyers for best cash price',
          'Complete RTO ownership transfer & NOC assistance'
        ],
        turnaroundTime: '3 to 7 Business Days'
      },
      {
        id: 'cab-repair',
        name: 'E) Car Repair Service',
        summary: 'Periodic servicing, mechanical repairs, battery replacement, and detailing for stored NRI vehicles.',
        deliverables: [
          'Doorstep pickup & drop to authorized service center',
          'Transparent estimate & genuine spare parts guarantee',
          'Battery trickle-charge & tire maintenance for stored cars'
        ],
        turnaroundTime: '2 to 4 Days'
      },
      {
        id: 'cab-tour',
        name: 'F) Car Tour Package',
        summary: 'Custom temple tour, heritage sightseeing, and weekend getaway car packages across Telangana & Andhra.',
        deliverables: [
          'Customized sightseeing & pilgrimage itineraries',
          'All-inclusive toll, parking & driver allowance pricing',
          'Luxury AC vehicles for comfortable family travel'
        ],
        turnaroundTime: '48 Hours Prior Notice'
      },
      {
        id: 'cab-maintenance',
        name: 'G) Car Maintenance',
        summary: 'Regular engine warmup, washing, and caretaking for cars kept in your garage while you are abroad.',
        deliverables: [
          'Bi-weekly engine warmup & battery check',
          'Monthly interior & exterior washing',
          'Annual insurance & emission (PUC) renewal tracking'
        ],
        turnaroundTime: 'Ongoing Monthly'
      },
      {
        id: 'cab-insurance',
        name: 'H) Car Insurance',
        summary: 'Instant vehicle insurance renewal, zero-depreciation add-ons, and accident claim coordination.',
        deliverables: [
          'Comparative quotes from top motor insurers',
          'Instant digital policy issuance & renewal',
          'Cashless claim settlement support at workshops'
        ],
        turnaroundTime: '24 Hours'
      }
    ]
  },
  {
    id: 'other-services',
    title: 'Any Other Services ?',
    categoryTag: 'Custom & Miscellaneous',
    description: 'Electricity bills, plot boundary fix, catering, packers & movers, cremation services, and manpower.',
    iconName: 'check',
    subServices: [
      {
        id: 'oth-electricity',
        name: 'A) Electricity Bills',
        summary: 'Timely TSSPDCL electricity bill monitoring, payment execution, and meter reading checks.',
        deliverables: [
          'Monthly bill tracking & payment before due date',
          'Resolution of billing discrepancies or meter faults',
          'Digital receipt storage in member portal'
        ],
        turnaroundTime: 'Monthly Cycle'
      },
      {
        id: 'oth-construction',
        name: 'B) Flat Construction',
        summary: 'Turnkey interior finishing, civil modifications, and structural works for new apartments.',
        deliverables: [
          'Complete interior execution & supervision',
          'High-grade materials with quality assurance checks',
          'Stage-wise photo updates to overseas owner'
        ],
        turnaroundTime: 'Project Based'
      },
      {
        id: 'oth-boundary-fix',
        name: 'C) Plot Boundry Fix',
        summary: 'Re-fixing boundary stones, fencing repair, and demarcation in coordination with village surveyor.',
        deliverables: [
          'Physical re-marking of plot corners with RCC stones',
          'Barbed wire or mesh fencing installation/repair',
          'Photographic proof & surveyor sign-off'
        ],
        turnaroundTime: '5 to 7 Days'
      },
      {
        id: 'oth-catering',
        name: 'D) Catering Service',
        summary: 'High-quality hygienic catering for family gatherings, housewarmings, and special occasions.',
        deliverables: [
          'Custom authentic Telugu & North Indian menu planning',
          'Hygienic preparation & professional buffet service',
          'Complete tableware & cleanup management'
        ],
        turnaroundTime: '48 Hours Booking'
      },
      {
        id: 'oth-custom-request',
        name: 'E) Any Other Services not in the list by Request',
        summary: 'Custom concierge task or special on-ground request handled by our executive support desk.',
        deliverables: [
          'Dedicated Member Support Officer assignment',
          'Custom feasibility assessment & transparent quote',
          'Reliable end-to-end execution of your unique request'
        ],
        turnaroundTime: 'Custom Timeline'
      },
      {
        id: 'oth-fencing-fix',
        name: 'F) Fencing Fix',
        summary: 'Repair and reinforcement of damaged boundary walls, barbed wire, or chain-link fencing.',
        deliverables: [
          'Site inspection & structural damage assessment',
          'Rapid repair & reinforcement work',
          'Post-repair video walkthrough report'
        ],
        turnaroundTime: '3 to 5 Days'
      },
      {
        id: 'oth-packers',
        name: 'G) Packers & Movers',
        summary: 'Professional, damage-free household shifting, packaging, and relocation.',
        deliverables: [
          'High-grade bubble wrapping & protective packing',
          'GPS-tracked container transportation',
          'Unpacking & furniture setup at destination'
        ],
        turnaroundTime: '48 Hours Prior Notice'
      },
      {
        id: 'oth-cremation',
        name: 'H) Cremation Services',
        summary: 'Dignified, respectful end-to-end funeral and cremation assistance during family bereavements.',
        deliverables: [
          '24/7 immediate ambulance & freezer box arrangement',
          'Coordination of cremation ground & traditional rituals',
          'Assistance with municipal death certificate documentation'
        ],
        turnaroundTime: 'Immediate 24/7'
      },
      {
        id: 'oth-manpower',
        name: 'I) Man Power Services',
        summary: 'Provision of skilled security guards, domestic helpers, drivers, and maintenance staff.',
        deliverables: [
          'Background-verified skilled manpower deployment',
          'Flexible daily, monthly, or annual contracts',
          'Immediate replacement guarantee in case of leave'
        ],
        turnaroundTime: '2 to 3 Business Days'
      }
    ]
  }
];

export const NriServicesSection: React.FC<NriServicesSectionProps> = ({
  onOpenConsultation,
}) => {
  // Accordion open state (default to first main service open)
  const [openMainId, setOpenMainId] = useState<string>('property-services');
  const [searchQuery, setSearchQuery] = useState('');
  const [nriTiers] = useState<NriTier[]>(DEFAULT_NRI_TIERS);

  // Enquiry modal state
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{ main: NriMainService; sub: NriSubService }[]>([]);
  const [isMembershipMode, setIsMembershipMode] = useState(false);
  const [selectedMembershipTier, setSelectedMembershipTier] = useState<string>('Gold Executive');
  const [membershipDuration, setMembershipDuration] = useState<'1 Year' | '2 Years' | '3 Years'>('1 Year');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [enquiryRefId, setEnquiryRefId] = useState('');

  // Toggle main accordion
  const handleToggleAccordion = (id: string) => {
    setOpenMainId((prev) => (prev === id ? '' : id));
  };

  // Toggle sub-service in selection basket
  const handleToggleService = (main: NriMainService, sub: NriSubService) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.sub.id === sub.id);
      if (exists) {
        return prev.filter((item) => item.sub.id !== sub.id);
      } else {
        return [...prev, { main, sub }];
      }
    });
  };

  // Open Enquiry modal for a single sub-service
  const handleOpenSingleEnquire = (main: NriMainService, sub: NriSubService) => {
    setSelectedServices([{ main, sub }]);
    setIsMembershipMode(false);
    setSubmittedSuccess(false);
    setEnquireModalOpen(true);
  };

  // Open modal from bottom floating bar (multi-select)
  const handleOpenBasketEnquire = () => {
    if (selectedServices.length === 0) return;
    if (selectedServices.length > 3) {
      setIsMembershipMode(true);
    }
    setSubmittedSuccess(false);
    setEnquireModalOpen(true);
  };

  // Remove a specific service from selected basket
  const handleRemoveService = (subId: string) => {
    setSelectedServices((prev) => {
      const updated = prev.filter((item) => item.sub.id !== subId);
      if (updated.length === 0) {
        setEnquireModalOpen(false);
      } else if (updated.length <= 3 && isMembershipMode) {
        // user can stay or toggle
      }
      return updated;
    });
  };

  // Submit form
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || selectedServices.length === 0) return;

    // Strict Rule: If more than 3 services, force membership mode
    if (!isMembershipMode && selectedServices.length > 3) {
      setIsMembershipMode(true);
      return;
    }

    setIsSubmitting(true);

    const refId = isMembershipMode 
      ? `MEM-${Math.floor(100000 + Math.random() * 900000)}`
      : `NRI-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnquiryRefId(refId);

    const serviceNames = selectedServices.map((s) => s.sub.name).join(', ');
    const mainCategories = Array.from(new Set(selectedServices.map((s) => s.main.title))).join(', ');

    const leadPayload = {
      id: refId,
      name: fullName,
      phone: phone,
      email: email || 'N/A',
      country: countryOfResidence || 'Overseas',
      category: 'NRI Services',
      service: isMembershipMode 
        ? `NRI Care Membership (${selectedMembershipTier} - ${membershipDuration})` 
        : `NRI On-Demand Services (${selectedServices.length} Selected)`,
      source: isMembershipMode ? 'NRI Annual Membership Flow' : 'NRI On-Demand Services Flow',
      notes: isMembershipMode 
        ? `Tier: ${selectedMembershipTier} | Plan: ${membershipDuration} | Included Services: ${selectedServices.length} | Country: ${countryOfResidence || 'N/A'} | Msg: ${userMessage}`
        : `Categories: ${mainCategories} | Country: ${countryOfResidence || 'N/A'} | Selected Count: ${selectedServices.length} | Msg: ${userMessage}`,
      formData: {
        'Client Full Name': fullName,
        'Contact Phone': phone,
        'Email Address': email || 'Not Provided',
        'Country of Residence': countryOfResidence || 'Not Specified',
        'Enquiry Mode': isMembershipMode ? 'Annual Care Membership Retainer' : 'On-Demand Custom Services',
        'Membership Plan Tier': isMembershipMode ? selectedMembershipTier : 'N/A (Individual Services)',
        'Membership Duration': isMembershipMode ? membershipDuration : 'N/A',
        'Selected Services Breakdown': selectedServices.map(s => `• ${s.main.title}: ${s.sub.name} (TAT: ${s.sub.turnaroundTime})`).join('\n'),
        'Total Services Selected': `${selectedServices.length} Service(s)`,
        'Consultation Query / Notes': userMessage || 'Standard consultation requested',
      }
    };

    dbService.setDocument(FirestoreCollections.LEADS, refId, leadPayload)
      .catch((err) => console.error('[NriServicesSection] Failed to write lead to Firestore:', err))
      .finally(() => {
        setIsSubmitting(false);
        setSubmittedSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setCountryOfResidence('');
        setUserMessage('');
      });
  };

  // Filter services based on search query
  const filteredServices = NRI_FUNCTIONAL_SERVICES.map((main) => {
    if (!searchQuery.trim()) return main;
    const q = searchQuery.toLowerCase();
    const matchesMain = main.title.toLowerCase().includes(q) || main.description.toLowerCase().includes(q);
    const matchedSubs = main.subServices.filter(
      (sub) => sub.name.toLowerCase().includes(q) || sub.summary.toLowerCase().includes(q)
    );
    if (matchesMain || matchedSubs.length > 0) {
      return {
        ...main,
        subServices: matchedSubs.length > 0 ? matchedSubs : main.subServices
      };
    }
    return null;
  }).filter((item): item is NriMainService => item !== null);

  return (
    <section id="nri-division" className="py-12 sm:py-16 bg-white text-slate-900 border-t border-slate-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Dedicated NRI Hero Showcase */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-50 text-slate-900 p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              WE ARE ALWAYS AT YOUR SERVICE • GLOBAL INDIAN INVESTOR DESK
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 font-serif">
              Invest in Prime Land & Manage Property from <span className="text-emerald-700">Anywhere in the World</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
              End-to-end legal title verification, remote live drone site inspections, NRE/NRO rupee remittance, GPA registration, and 8 specialized on-ground concierge service categories for overseas Indians.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-amber-700">3,200+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">NRI Investors</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">100%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clear Title (TS RERA)</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-slate-800">18+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Countries Served</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-emerald-800">24/7</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concierge Desk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overseas Branches (USA, UK, Singapore, Malaysia, UAE, Thailand) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                Our Overseas Branches
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Local branch offices and time-zone aligned support for overseas buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NRI_COUNTRIES.map((country) => (
              <div 
                key={country.code} 
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs hover:border-emerald-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={country.flagUrl} 
                      alt={country.name} 
                      className="w-7 h-4.5 object-cover rounded border border-slate-200 shadow-xs" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{country.name} Branch</h4>
                      <span className="text-[10px] font-mono text-slate-500">{country.timeZone.split('(')[0].trim()}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    {country.activeNriClients}+ Investors
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-start justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Branch Lead:</span>
                    <span className="text-slate-900 font-semibold text-right">{country.deskManager}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">City / Area:</span>
                    <span className="text-slate-700 text-right">{country.deskLocation}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Phone Support:</span>
                    <span className="text-emerald-700 font-mono font-bold text-right">{country.deskPhone.split('/')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Header featuring brochure slogan */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4 border-t border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            WE ARE ALWAYS AT YOUR SERVICE
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif">
            NRI & Member Services Directory
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Select a primary service category below to open its sub-services list. Click any sub-service to submit an immediate consultation enquiry directly to our Admin & Member Support Desk.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-3 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service (e.g. Sales, Construction, Tax, Senior Citizen, Cab, Electricity)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Accordion List */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No Matching Services Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any NRI sub-service matching "{searchQuery}". Try a different keyword or browse all categories.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredServices.map((mainService) => {
              const isOpen = openMainId === mainService.id || searchQuery.trim().length > 0;

              return (
                <div
                  key={mainService.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  {/* Main Service Header (Clickable Accordion Trigger) */}
                  <div
                    onClick={() => handleToggleAccordion(mainService.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {mainService.categoryTag}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {mainService.subServices.length} Sub-Services
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          {mainService.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 sm:line-clamp-none">
                          {mainService.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 hidden sm:inline-block">
                        {isOpen ? 'Collapse' : 'View Sub-Services'}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sub-Services Expanded List */}
                  {isOpen && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-6 space-y-4">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Available Sub-Services under {mainService.title}:
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mainService.subServices.map((subService) => {
                          const isSelected = selectedServices.some((s) => s.sub.id === subService.id);
                          return (
                            <div
                              key={subService.id}
                              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                                isSelected 
                                  ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500' 
                                  : 'bg-white border-slate-200 hover:border-emerald-500'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleService(mainService, subService);
                                      }}
                                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-emerald-600 border-emerald-600 text-white font-black text-xs' 
                                          : 'border-slate-300 bg-white hover:border-emerald-600 text-transparent'
                                      }`}
                                    >
                                      ✓
                                    </button>
                                    <h4 className="text-sm font-bold text-slate-900">
                                      {subService.name}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                    {subService.turnaroundTime}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                                  {subService.summary}
                                </p>

                                {/* Deliverables checklist */}
                                <div className="pt-1 pl-6 space-y-1">
                                  {subService.deliverables.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2 pl-6 border-t border-slate-100 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleService(mainService, subService)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-emerald-600 text-white font-bold' 
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                  }`}
                                >
                                  {isSelected ? '✓ Added to Basket' : '+ Add to Request'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenSingleEnquire(mainService, subService)}
                                  className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  Request Only This
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Functional Help Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Need a Custom NRI Service Not Listed Above?
              </h4>
              <p className="text-xs text-slate-600">
                Our NRI Support Desk handles custom property power of attorney, tax certificates, and litigation assistance.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Contact NRI Desk Executive
          </button>
        </div>

      </div>

      {/* Floating Bottom Basket Bar */}
      {selectedServices.length > 0 && !enquireModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300 w-auto max-w-[90vw]">
          <div className="bg-white border border-emerald-500 shadow-xl px-5 py-3 rounded-full flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {selectedServices.length}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block whitespace-nowrap">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service Selected' : 'Services in Basket'}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline block whitespace-nowrap">
                  Ready for single combined request
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenBasketEnquire}
              className="px-4 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Proceed to Request
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Sub-Service Enquiry Form (Light Mode) */}
      {enquireModalOpen && selectedServices.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                    isMembershipMode
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {isMembershipMode ? 'Annual Care Membership' : `Pay-As-You-Go (${selectedServices.length} Selected)`}
                  </span>
                  {selectedServices.length > 3 && !isMembershipMode && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Exceeds 3 Services Limit
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">
                  {isMembershipMode 
                    ? 'Annual NRI Property Care Membership Enrollment' 
                    : (selectedServices.length === 1 ? `Request: ${selectedServices[0].sub.name}` : 'Multi-Service On-Demand Request')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMembershipMode 
                    ? 'Comprehensive year-round property protection, recurring visits & dedicated manager.' 
                    : 'Pay per service on-demand (Maximum 3 services per single request).'}
                </p>
              </div>
              <button
                onClick={() => setEnquireModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    {isMembershipMode ? 'Membership Application Received!' : 'Service Request Submitted Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {isMembershipMode 
                      ? <>Your application for the <strong className="text-amber-800">{selectedMembershipTier} ({membershipDuration})</strong> plan covering <strong className="text-emerald-800">{selectedServices.length} selected services</strong> has been assigned to a Senior NRI Client Partner.</>
                      : <>We have logged your request for <strong className="text-emerald-800">{selectedServices.map(s => s.sub.name).join(', ')}</strong>. An SVS Executive will coordinate the immediate execution.</>}
                  </p>
                  <div className="pt-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold">
                      Reference ID: {enquiryRefId}
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setEnquireModalOpen(false);
                      setSelectedServices([]);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                
                {/* Selected Services Basket Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      Chosen Services ({selectedServices.length}):
                    </span>
                    {!isMembershipMode && selectedServices.length <= 3 && (
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {3 - selectedServices.length} more on-demand slot{3 - selectedServices.length === 1 ? '' : 's'} available
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {selectedServices.map((item) => (
                      <span 
                        key={item.sub.id} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-800 shadow-xs"
                      >
                        <span>{item.sub.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(item.sub.id)}
                          className="text-slate-400 hover:text-rose-600 ml-1 font-bold text-xs cursor-pointer"
                          title="Remove service"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* STRICT LIMIT NOTICE */}
                {selectedServices.length > 3 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-start gap-2.5 text-xs text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-amber-900 text-xs">
                          Membership Required for 4+ Services
                        </h5>
                        <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                          Single / On-demand requests support a maximum of <strong>3 services</strong>. Since you have selected <strong>{selectedServices.length} services</strong>, you qualify for our <strong>Annual NRI Property Care Membership</strong> which covers recurring visits, unlimited inspections, and bundled savings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Switcher Banner */}
                {selectedServices.length >= 2 && selectedServices.length <= 3 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Planning multiple or recurring services throughout the year? Save more with our <strong>Annual NRI Property Care Membership</strong>.
                      </p>
                    </div>
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsMembershipMode(!isMembershipMode)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          isMembershipMode
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isMembershipMode ? '✓ Enquiring as Annual Membership' : 'Switch to Membership Enquiry'}
                      </button>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {isMembershipMode ? 'Membership perks active' : 'Or continue with on-demand'}
                      </span>
                    </div>
                  </div>
                )}

                {/* MEMBERSHIP CONFIGURATION CARD */}
                {(isMembershipMode || selectedServices.length > 3) && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Select Membership Plan Tier
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        Covers All {selectedServices.length} Selected Services
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {nriTiers.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedMembershipTier(item.name)}
                          className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            selectedMembershipTier === item.name
                              ? 'bg-white border-emerald-600 text-slate-900 shadow-xs ring-1 ring-emerald-600'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase text-amber-700 block">{item.tag}</span>
                            <span className="text-[10px] font-bold text-emerald-700">{item.price}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 block mt-0.5">{item.name}</span>
                          <span className="text-[10px] text-slate-500 block mt-1 leading-tight">{item.tagline}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs font-medium text-slate-700">Plan Duration:</span>
                      <div className="flex items-center gap-1.5">
                        {(['1 Year', '2 Years', '3 Years'] as const).map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setMembershipDuration(dur)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                              membershipDuration === dur
                                ? 'bg-emerald-700 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Naidu"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (408) 555-0192"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Country / City of Residence
                    </label>
                    <input
                      type="text"
                      value={countryOfResidence}
                      onChange={(e) => setCountryOfResidence(e.target.value)}
                      placeholder="e.g. Dallas, USA / Dubai, UAE"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Requirement or Property Location
                  </label>
                  <textarea
                    rows={2}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Provide property survey number, location, or any specific instructions..."
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEnquireModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                      isMembershipMode || selectedServices.length > 3
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting 
                      ? 'Submitting...' 
                      : (isMembershipMode || selectedServices.length > 3 ? 'Submit Membership Application' : 'Submit Service Request')}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
