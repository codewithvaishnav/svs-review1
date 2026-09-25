import React, { useState } from 'react';
import { Users, Lock, CheckCircle2, AlertCircle, ArrowRight, Briefcase, Eye, EyeOff, Clock, ShieldCheck } from 'lucide-react';
import { authService } from '../../../services/authService';

interface AssociateLoginFormProps {
  onSuccess: (username: string, associateCode?: string) => void;
  onCancel?: () => void;
  onOpenEnrollment?: () => void;
}

export const AssociateLoginForm: React.FC<AssociateLoginFormProps> = ({ onSuccess, onCancel, onOpenEnrollment }) => {
  const [associateCode, setAssociateCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setPendingNotice(null);

    if (!associateCode.trim() || !password.trim()) {
      setErrorMsg('Please enter your Associate Code or Mobile Number and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.loginAssociate(associateCode, password);
      setIsLoading(false);

      if (!result.success) {
        if (result.isPending) {
          setPendingNotice(result.error || 'Your application is awaiting Admin Acceptance.');
        } else {
          setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
        }
        return;
      }

      setIsSuccess(true);
      const asc = result.associate;
      const displayName = asc?.name || asc?.associateCode || associateCode.trim();
      const code = asc?.associateCode || associateCode.trim();

      setTimeout(() => {
        onSuccess(displayName, code);
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('An unexpected error occurred during login. Please try again.');
    }
  };

  const handleDemoFill = (code = 'SVS-ASC-441', pwd = 'associate123') => {
    setAssociateCode(code);
    setPassword(pwd);
    setErrorMsg('');
    setPendingNotice(null);
  };

  if (isSuccess) {
    return (
      <div className="py-6 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-amber-600 mx-auto animate-bounce" />
        <h4 className="text-lg font-bold text-slate-900">Login Successful!</h4>
        <p className="text-xs text-slate-600">
          Opening verified Associate Partner Dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-800 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
            Associate Partner Portal
          </span>
          <button
            type="button"
            onClick={() => handleDemoFill('SVS-ASC-441', 'associate123')}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer"
          >
            Auto-Fill Demo
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Sign in with your Associate Code (or registered 10-digit mobile) and account password.
        </p>
      </div>

      {pendingNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <span>Pending Admin Approval</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            {pendingNotice}
          </p>
          <div className="pt-1 text-[10px] text-slate-600">
            <strong>Admin Note:</strong> If you are an administrator testing this workflow, switch to the <strong>Admin Portal</strong> to review and click <em>"Approve & Activate"</em> on this Associate record.
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">
          Associate ID or Mobile Number *
        </label>
        <input
          type="text"
          required
          value={associateCode}
          onChange={(e) => setAssociateCode(e.target.value)}
          placeholder="e.g. SVS-ASC-441 or +91 98490 88210"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Password *</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your account password"
            className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-600 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
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
          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <span>Log In to Associate Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <div className="pt-2 text-center border-t border-slate-100 space-y-1">
        <p className="text-[11px] text-slate-500">
          Not registered as an Associate Partner yet?{' '}
          {onOpenEnrollment ? (
            <button
              type="button"
              onClick={onOpenEnrollment}
              className="text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
            >
              Enroll as Associate Partner
            </button>
          ) : (
            <span className="font-semibold text-amber-700">Apply via Partner Enrollment</span>
          )}
        </p>
        <p className="text-[10px] text-slate-400">
          Demo Active Associate: <button type="button" onClick={() => handleDemoFill('SVS-ASC-441', 'associate123')} className="underline font-mono text-amber-700 hover:text-amber-800">SVS-ASC-441</button> / pwd: <span className="font-mono">associate123</span>
        </p>
      </div>
    </form>
  );
};
