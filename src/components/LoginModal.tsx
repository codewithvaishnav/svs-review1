import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, Briefcase, Server, Sparkles, Mail, Key } from 'lucide-react';
import { MemberLoginForm, AssociateLoginForm, AdminLoginForm } from './forms';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'member' | 'associate' | 'admin';
  onLoginSuccess?: (role: 'member' | 'associate' | 'admin', username: string, memberId?: string) => void;
  isLoggedIn?: boolean;
  userRole?: string;
  loggedInUser?: string | null;
  onNavigateToDashboard?: (role: string) => void;
  onOpenEnrollment?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'member',
  onLoginSuccess,
  isLoggedIn = false,
  userRole = 'guest',
  loggedInUser = null,
  onNavigateToDashboard,
  onOpenEnrollment,
}) => {
  const [role, setRole] = useState<'member' | 'associate' | 'admin'>(initialRole);
  const { loginDemo } = useAuth();

  if (!isOpen) return null;

  const handleSuccess = (username: string, memberId?: string) => {
    loginDemo(role, username);
    if (onLoginSuccess) {
      onLoginSuccess(role, username, memberId);
    }
  };

  const isSessionActive = isLoggedIn && userRole !== 'guest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Sign In</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selection Tabs (Only interactive if no session is active) */}
        {!isSessionActive && (
          <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold p-1 gap-1">
            <button
              onClick={() => setRole('member')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'member'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Member</span>
            </button>
            <button
              onClick={() => setRole('associate')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'associate'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Associate</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Modular Form or Active Single Session View */}
        <div className="p-6">
          {isSessionActive ? (
            <div className="py-6 px-4 text-center space-y-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Welcome back, {loggedInUser || 'Member'}!
                </h4>
                <p className="text-xs text-slate-600">
                  You are already signed in to your account.
                </p>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToDashboard) {
                      onNavigateToDashboard(userRole);
                    }
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {role === 'member' && (
                <MemberLoginForm onSuccess={handleSuccess} onCancel={onClose} />
              )}
              {role === 'associate' && (
                <AssociateLoginForm 
                  onSuccess={handleSuccess} 
                  onCancel={onClose} 
                  onOpenEnrollment={() => {
                    onClose();
                    if (onOpenEnrollment) onOpenEnrollment();
                  }}
                />
              )}
              {role === 'admin' && (
                <AdminLoginForm onSuccess={handleSuccess} onCancel={onClose} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

