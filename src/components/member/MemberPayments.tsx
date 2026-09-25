import React from 'react';
import { 
  CreditCard, Download, CheckCircle2, AlertCircle, 
  ArrowRight, DollarSign, Calendar, FileText, ShieldCheck
} from 'lucide-react';
import { useUserMetadata } from '../../hooks/useUserMetadata';

interface MemberPaymentsProps {
  loggedInUser?: string | null;
  onShowToast?: (msg: string) => void;
}

export const MemberPayments: React.FC<MemberPaymentsProps> = ({
  loggedInUser,
  onShowToast,
}) => {
  const { plotInfo, displayName, memberId, isLoading } = useUserMetadata(loggedInUser);

  const receipts = [
    {
      id: 'REC-2026-0881',
      date: '15th Jul 2026',
      installment: 'Installment #15',
      amount: '₹1,25,000',
      mode: 'NEFT / RTGS (HDFC Bank)',
      status: 'Paid & Verified',
    },
    {
      id: 'REC-2026-0742',
      date: '15th Jun 2026',
      installment: 'Installment #14',
      amount: '₹1,25,000',
      mode: 'NEFT / RTGS (HDFC Bank)',
      status: 'Paid & Verified',
    },
    {
      id: 'REC-2026-0610',
      date: '15th May 2026',
      installment: 'Installment #13',
      amount: '₹1,25,000',
      mode: 'NEFT / RTGS (HDFC Bank)',
      status: 'Paid & Verified',
    },
    {
      id: 'REC-2026-0489',
      date: '15th Apr 2026',
      installment: 'Installment #12',
      amount: '₹1,25,000',
      mode: 'Online UPI',
      status: 'Paid & Verified',
    },
  ];

  const handleDownloadReceipt = (id: string) => {
    if (onShowToast) {
      onShowToast(`Downloading Digitally Signed Receipt PDF [${id}]...`);
    }
  };

  const handleDownloadStatement = () => {
    if (onShowToast) {
      onShowToast('Downloading Full Installment Statement & Ledger (2025-2026 PDF)...');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            Payments & Receipts
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Installment <span className="text-emerald-700">Passbook Ledger</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {plotInfo.plotNo} @ {plotInfo.venture}
          </p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Consolidated Statement</span>
        </button>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2">
          <span className="text-xs font-bold uppercase text-slate-500">Total Plot Value</span>
          <div className="text-2xl font-black text-slate-900">
            ₹{(plotInfo.totalAmount / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500">Fixed Allotment Price (No Escalation)</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2">
          <span className="text-xs font-bold uppercase text-slate-500">
            Amount Cleared ({plotInfo.totalAmount > 0 ? Math.min(100, Math.round((plotInfo.paidAmount / plotInfo.totalAmount) * 100)) : 0}%)
          </span>
          <div className="text-2xl font-black text-emerald-800">
            ₹{(plotInfo.paidAmount / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Payment Schedule Verified
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-900">Next EMI Due</span>
            <AlertCircle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {plotInfo.nextEmiAmount > 0 ? `₹${plotInfo.nextEmiAmount.toLocaleString('en-IN')}` : 'No Pending EMI'}
          </div>
          <div className="text-xs font-bold text-amber-800">
            {plotInfo.nextEmiAmount > 0 ? `Due on ${plotInfo.nextEmiDueDate}` : 'Account in good standing'}
          </div>
        </div>
      </div>

      {/* Online NEFT / Account Details Box */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-700 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Official Escrow Collection Account
          </span>
          <h3 className="text-lg font-bold">
            Srivasudha True Wealth India Pvt Ltd
          </h3>
          <p className="text-xs text-emerald-100 font-mono">
            A/c: 50200088129941 | IFSC: HDFC0001283 | Branch: KPHB Colony, Hyderabad
          </p>
        </div>

        <button
          onClick={() => onShowToast && onShowToast('Copying NEFT bank details to clipboard...')}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>Copy Account Details</span>
        </button>
      </div>

      {/* Payment Receipts Ledger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Verified Installment Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.id}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{r.installment}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{r.amount}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.mode}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadReceipt(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-700 hover:text-white font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
