import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Server } from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess: (username: string) => void;
  onCancel?: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess, onCancel }) => {
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminUser.trim() || !adminPass.trim()) {
      setErrorMsg('Please enter Admin Username and Security Key.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(adminUser || 'svsadmin');
      }, 600);
    }, 800);
  };

  

  if (isSuccess) {
    return (
      <div className="py-6 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
        <h4 className="text-lg font-bold text-slate-900">Login Successful!</h4>
        <p className="text-xs text-slate-600">
          Opening admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
         <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-700" />
            Admin Account
          </span>
          
        </div>
        <p className="text-[11px] text-slate-500">
          Manage project plots, verify leads, handle bookings, and update records.
        </p>
      </div>   

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">
          Admin Username *
        </label>
        <input
          type="text"
          required
          value={adminUser}
          onChange={(e) => setAdminUser(e.target.value)}
          placeholder="e.g. svsadmin"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Password *</label>
        <input
          type="password"
          required
          value={adminPass}
          onChange={(e) => setAdminPass(e.target.value)}
          placeholder="Enter password (e.g. admin123)"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="pt-2 flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
