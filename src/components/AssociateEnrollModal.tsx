import React from 'react';
import { X, UserCheck } from 'lucide-react';
import { AssociateEnrollForm } from './forms';

interface AssociateEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const AssociateEnrollModal: React.FC<AssociateEnrollModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Associate Partner Enrollment</h3>
              <p className="text-xs text-amber-400 font-semibold">Srivasuda True Wealth India Partner Program</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modular Enrollment Form */}
        <div className="p-6 overflow-y-auto">
          <AssociateEnrollForm onSuccess={onClose} onCancel={onClose} onOpenLogin={onOpenLogin} />
        </div>
      </div>
    </div>
  );
};
