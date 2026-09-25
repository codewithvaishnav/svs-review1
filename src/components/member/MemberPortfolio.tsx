import React, { useState } from 'react';
import { 
  Building, MapPin, Camera, CheckCircle2, Calendar, 
  ExternalLink, Eye, ArrowRight, ShieldCheck, User,
  Layers, Download, RefreshCw, AlertCircle
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';
import { firestoreService } from '../../services/firestoreService';

interface MemberPortfolioProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const MemberPortfolio: React.FC<MemberPortfolioProps> = ({
  loggedInUser,
  onShowToast,
  onNavigateTab,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('July 2026');
  const { 
    displayName, 
    memberId, 
    plotInfo, 
    phone, 
    email,
    member,
    isLoading 
  } = useUserMetadata(loggedInUser);

  const plotDetails = {
    venture: plotInfo.venture,
    plotNo: plotInfo.plotNo,
    areaSqYd: plotInfo.areaSqYd,
    regNumber: plotInfo.regNumber,
    supervisor: 'Suresh Kumar (+91 98490 12345)',
    latestPhotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    dronePhotoUrl: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80',
    boundaryPhotoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
  };

  const auditLogs: Record<string, {
    date: string;
    status: 'verified' | 'inspected';
    notes: string;
    boundaryStones: string;
    plantation: string;
    securityPatrol: string;
    inspector: string;
  }> = {
    'July 2026': {
      date: '28th July 2026',
      status: 'verified',
      notes: 'Boundary stones freshly whitewashed. Road clearing around Plot #15 verified. Avenue trees healthy.',
      boundaryStones: '100% Intact & Numbered (#15)',
      plantation: 'Watered & Thriving (2 Teak / 2 Fruit Plants)',
      securityPatrol: 'Daily 3-Tier Security Active',
      inspector: 'Suresh Kumar (Senior Supervisor)',
    },
    'June 2026': {
      date: '25th June 2026',
      status: 'verified',
      notes: 'Monsoon weed clearance completed along 40ft blacktop road. Drainage line checked.',
      boundaryStones: '100% Intact & Numbered (#15)',
      plantation: 'Healthy - Monsoon Growth Active',
      securityPatrol: 'Daily 3-Tier Security Active',
      inspector: 'Suresh Kumar (Senior Supervisor)',
    },
    'May 2026': {
      date: '29th May 2026',
      status: 'inspected',
      notes: 'Summer drip watering verified for avenue plantation. Solar streetlights operational.',
      boundaryStones: '100% Intact & Numbered (#15)',
      plantation: 'Regular Drip Irrigation Active',
      securityPatrol: 'Daily 3-Tier Security Active',
      inspector: 'Rajesh G. (Field Audit Specialist)',
    },
  };

  const currentAudit = auditLogs[selectedMonth] || auditLogs['July 2026'];

  const handleDownloadReport = () => {
    if (onShowToast) {
      onShowToast(`Downloading Certified Plot Inspection Report for ${selectedMonth} (PDF)...`);
    }
  };

  const handleRequestInspection = async () => {
    const inspId = `INSP-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await firestoreService.addLead({
        id: inspId,
        name: displayName,
        phone: member?.phone || phone,
        email: member?.email || email,
        category: 'Site Inspection Request',
        service: `Supervisor Audit: ${plotInfo.plotNo} @ ${plotInfo.venture}`,
        status: 'New',
        source: 'Member Portfolio',
        notes: `Physical verification requested for ${plotInfo.plotNo} (${plotInfo.venture}) for ${selectedMonth}. Supervisor: ${plotDetails.supervisor}`,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        formData: {
          'Member ID': memberId,
          'Member Name': displayName,
          'Inspection ID': inspId,
          'Plot': plotInfo.plotNo,
          'Venture': plotInfo.venture,
          'Inspection Month': selectedMonth,
          'Assigned Supervisor': plotDetails.supervisor,
        }
      });
    } catch (err) {
      console.warn('Could not persist inspection request:', err);
    }

    if (onShowToast) {
      onShowToast('Site Inspection Request submitted to Firestore! Our SVS Member Support Desk will contact you within 24 hours.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            My Properties & Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {plotInfo.plotNo} — <span className="text-emerald-700">{member?.kycStatus === 'Verified' ? 'HMDA / DTCP Title Verified' : `${member?.kycStatus || 'Title Verified'}`}</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {plotInfo.venture} | Reg. LP No: <strong className="font-mono text-slate-900">{plotInfo.regNumber}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRequestInspection}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Request Live Video Call Audit
          </button>
          
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            Download {selectedMonth} Report
          </button>
        </div>
      </div>

      {/* Property Specifications Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[11px] font-bold uppercase">Plot Dimensions</span>
          <div className="text-lg font-black text-slate-900">200 Sq.Yds (36 x 50 Ft)</div>
          <div className="text-xs text-emerald-800 font-bold">100% Vaastu Compliant</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[11px] font-bold uppercase">Road Access</span>
          <div className="text-lg font-black text-slate-900">40 Ft Blacktop Road</div>
          <div className="text-xs text-slate-600">Direct Highway Connecting Access</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[11px] font-bold uppercase">HMDA LP Registration</span>
          <div className="text-lg font-black text-slate-900 font-mono">{plotInfo.regNumber}</div>
          <div className="text-xs text-emerald-800 font-bold">Clear Title Form 15</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[11px] font-bold uppercase">Field Supervisor</span>
          <div className="text-lg font-black text-slate-900">{plotInfo.supervisor.split(' ')[0]} {plotInfo.supervisor.split(' ')[1]}</div>
          <div className="text-xs text-slate-600">Dedicated Site Custodian</div>
        </div>
      </div>

      {/* Monthly Audit Selector & Inspector Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-700" />
              Monthly Physical Plot Audit & Verification
            </h3>
            <p className="text-xs text-slate-600">
              Every month, our site engineering team inspects your plot boundary stones, avenue plantation, and road access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['July 2026', 'June 2026', 'May 2026'] as const).map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMonth === month
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-900">Boundary Stones</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{currentAudit.boundaryStones}</div>
            <p className="text-[11px] text-slate-600">GPS geo-coordinates tagged & numbered.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-900">Avenue Plantation</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{currentAudit.plantation}</div>
            <p className="text-[11px] text-slate-600">Regular watering & soil care verified.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-900">Security & Road Access</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{currentAudit.securityPatrol}</div>
            <p className="text-[11px] text-slate-600">24/7 CCTV & guard patrol logs clear.</p>
          </div>
        </div>

        {/* Inspector Remarks Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-900">
              Supervisor Notes ({currentAudit.date}):
            </span>{' '}
            <span className="text-slate-600">{currentAudit.notes}</span>
          </div>
          <span className="text-slate-600 font-medium">Verified by: {currentAudit.inspector}</span>
        </div>

        {/* Photo Gallery Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Site Audit Photo Gallery ({selectedMonth})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-xs">
              <img 
                src={plotInfo.latestPhotoUrl} 
                alt="Front Road & Boundary View" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold">Front Road & Plot #15 Boundary</span>
                <span className="text-slate-200 text-[10px]">Photo Date: {currentAudit.date}</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-xs">
              <img 
                src={plotInfo.dronePhotoUrl} 
                alt="Drone Top View" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold">Drone Top-down Aerial View</span>
                <span className="text-slate-200 text-[10px]">40ft Road & Avenue Trees</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-xs">
              <img 
                src={plotInfo.boundaryPhotoUrl} 
                alt="Boundary Pillar Whitewash" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-xs font-bold">Boundary Pillar #15 Inspection</span>
                <span className="text-slate-200 text-[10px]">Geo-tagged: 17.0729° N, 78.2045° E</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
