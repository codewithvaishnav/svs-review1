import React from 'react';
import { 
  FileText, Download, ShieldCheck, CheckCircle2, 
  Lock, Eye, Award, ExternalLink, Building
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';

interface MemberVaultProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
}

export const MemberVault: React.FC<MemberVaultProps> = ({
  loggedInUser,
  onShowToast,
}) => {
  const { plotInfo, displayName, memberId, isLoading } = useUserMetadata(loggedInUser);

  const documents = [
    {
      id: `DOC-EC-${memberId}`,
      title: 'Certified Form 15 Encumbrance Certificate (EC)',
      category: 'Legal Title Document',
      date: 'Updated July 2026',
      size: '2.4 MB PDF',
      description: `Official Government of Telangana EC verifying clear unbroken title for ${plotInfo.plotNo} @ ${plotInfo.venture}.`,
      verifiedBy: 'SVS Senior Legal Advocate',
    },
    {
      id: `DOC-PB-${memberId}`,
      title: 'Digital Land Passbook & Allotment Certificate',
      category: 'Ownership Record',
      date: 'Issued Jan 2024',
      size: '1.8 MB PDF',
      description: `Signed plot allotment certificate for ${displayName} (${memberId}) with boundary specifications.`,
      verifiedBy: 'SVS Board of Directors',
    },
    {
      id: `DOC-HMDA-${plotInfo.regNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
      title: 'HMDA Layout Approval Master Plan Copy',
      category: 'Government Approval',
      date: `LP No. ${plotInfo.regNumber}`,
      size: '5.6 MB High-Res PDF',
      description: `Official HMDA approved layout plan highlighting ${plotInfo.plotNo}, 40ft road, and amenities.`,
      verifiedBy: 'HMDA Town Planning Wing',
    },
    {
      id: `DOC-AGR-${memberId}`,
      title: 'Agreement of Sale & Registration Draft',
      category: 'Sale Agreement',
      date: 'Registered Feb 2024',
      size: '3.1 MB PDF',
      description: `Signed agreement of sale with registered terms for ${plotInfo.plotNo} @ ${plotInfo.venture}.`,
      verifiedBy: 'Sub-Registrar Office, Shadnagar',
    },
    {
      id: `DOC-SUR-${memberId}`,
      title: 'Geo-Tagged Plot Survey Boundary Map',
      category: 'Survey & Coordinates',
      date: 'Verified June 2026',
      size: '1.2 MB PDF',
      description: `Precise GPS survey coordinates for 4 corner boundary pillars of ${plotInfo.plotNo}.`,
      verifiedBy: 'SVS Chief Surveyor',
    },
  ];

  const handleDownloadDoc = (docTitle: string) => {
    if (onShowToast) {
      onShowToast(`Downloading ${docTitle} to your device (Digitally Signed PDF)...`);
    }
  };

  const handleDownloadAllVault = () => {
    if (onShowToast) {
      onShowToast('Compressing and downloading Complete Legal Document Vault (ZIP - 14.1 MB)...');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
            Legal & Document Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Certified <span className="text-cyan-700">Property Legal Vault</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {plotInfo.plotNo} @ {plotInfo.venture} | All documents digitally signed.
          </p>
        </div>

        <button
          onClick={handleDownloadAllVault}
          className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete Vault (ZIP)</span>
        </button>
      </div>

      {/* Security Guarantee Box */}
      <div className="p-6 rounded-3xl bg-emerald-50 text-slate-900 border border-emerald-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900">256-Bit Encrypted SVS Member Legal Vault</h4>
            <p className="text-xs text-slate-600">
              Every document is verified against Government of Telangana Registration & Stamps department records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          100% Clear Title Guaranteed
        </div>
      </div>

      {/* Document Cards List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-cyan-400 transition-all flex flex-wrap items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
                  {doc.category}
                </span>
                <span className="text-xs text-slate-500">{doc.date}</span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-mono font-bold text-slate-600">{doc.size}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {doc.description}
              </p>

              <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Verified & Digitally Signed by {doc.verifiedBy}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownloadDoc(doc.title)}
                className="px-5 py-3 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Copy</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
