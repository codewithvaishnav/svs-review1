import React, { useState } from 'react';
import { UserCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { authService } from '../../../services/authService';

interface MemberLoginFormProps {
  onSuccess: (username: string, memberId?: string) => void;
  onCancel?: () => void;
}

export const MemberLoginForm: React.FC<MemberLoginFormProps> = ({ onSuccess, onCancel }) => {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [authenticatedMemberName, setAuthenticatedMemberName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!membershipId.trim() || !password.trim()) {
      setErrorMsg('Please enter your Membership ID / Registered Phone and Password.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService.loginMember(membershipId.trim(), password);

      if (!result.success || !result.member) {
        setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      setAuthenticatedMemberName(result.member.name);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(result.member!.name, result.member!.memberId || result.member!.id);
      }, 700);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('An error occurred during authentication. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoFill = (id: string, pass: string) => {
    setMembershipId(id);
    setPassword(pass);
    setErrorMsg('');
  };

  if (isSuccess) {
    return (
      <div className="py-6 text-center space-y-3 animate-in fade-in">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
        <h4 className="text-lg font-bold text-slate-900">Welcome, {authenticatedMemberName}!</h4>
        <p className="text-xs text-slate-600">
          Sign in successful. Opening your dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            Member Account
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <Lock className="w-3 h-3 text-slate-400" />
            Secure
          </span>
        </div>
        
        {/* Quick Demo Fill Options for testing */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleDemoFill('SVS-MEM-1082', 'member123')}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
          >
            Rahul (Diamond)
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('SVS-PLT-2024-8890', 'member123')}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 cursor-pointer"
          >
            Vikram (Platinum)
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('SVS-GLD-2024-3301', 'member123')}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer"
          >
            Kavitha (Gold)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">
          Membership ID or Mobile Number *
        </label>
        <input
          type="text"
          required
          value={membershipId}
          onChange={(e) => setMembershipId(e.target.value)}
          placeholder="e.g. SVS-MEM-1082 or +91 98490 55432"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Password *</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded accent-emerald-700" />
          <span>Remember me</span>
        </label>
        <span className="text-[10px] text-slate-400">
          Demo password: <code className="text-amber-800 font-mono">member123</code>
        </span>
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
          className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
