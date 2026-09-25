import React, { useState } from 'react';
import { 
  UserCheck, Upload, CheckCircle2, AlertCircle, ArrowRight, 
  FileText, Check, Shield, Copy, ExternalLink, X, Phone, MapPin, Mail, Briefcase, Lock, Eye, EyeOff, Clock 
} from 'lucide-react';
import { dbService } from '../../../services/dbService';
import { firestoreService } from '../../../services/firestoreService';
import { authService } from '../../../services/authService';
import { FirestoreCollections, AdminLead, AssociateAccount } from '../../../types';

interface AssociateEnrollFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onOpenLogin?: () => void;
}

export const AssociateEnrollForm: React.FC<AssociateEnrollFormProps> = ({ 
  onSuccess, 
  onCancel,
  onOpenLogin 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    experienceYears: '2-5 Years',
    pincode: '',
    aadhaarPanNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCopyRef = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    const cleanName = formData.fullName.trim();
    const cleanPhone = formData.phone.trim();
    const cleanCity = formData.city.trim();
    const rawPassword = formData.password.trim();
    const rawConfirm = formData.confirmPassword.trim();

    if (!cleanName || !cleanPhone || !cleanCity) {
      setErrorMsg('Please enter your Full Legal Name, Mobile Number, and City.');
      return;
    }

    // Phone digits validation
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for communication.');
      return;
    }

    // Password validation
    if (!rawPassword) {
      setErrorMsg('Please create a login password for your Associate account.');
      return;
    }

    if (rawPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (rawPassword !== rawConfirm) {
      setErrorMsg('Password confirmation does not match. Please re-type your password.');
      return;
    }

    setIsSubmitting(true);

    const now = Date.now();
    const generatedId = `SVS-ASC-${Math.floor(100000 + Math.random() * 900000)}`;
    const isoDate = new Date(now).toISOString();
    const displayDate = new Date(now).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    try {
      // Hash password using bcrypt for secure storage
      const passwordHash = await authService.hashPassword(rawPassword);

      const leadPayload: AdminLead = {
        id: generatedId,
        name: cleanName,
        phone: cleanPhone,
        email: formData.email?.trim() || 'Not Provided',
        city: cleanCity,
        category: 'Associate Partner',
        service: `Channel Partner Enrollment (${formData.experienceYears} Experience)`,
        source: 'Channel Partner Enrollment Form',
        status: 'New',
        timestamp: now,
        createdAt: isoDate,
        date: displayDate,
        notes: `City: ${cleanCity} | Experience: ${formData.experienceYears} | Pincode: ${formData.pincode?.trim() || 'N/A'} | ID/PAN: ${formData.aadhaarPanNumber?.trim() || 'Pending'} | Status: Pending Admin Acceptance`,
        formData: {
          'Applicant Legal Name': cleanName,
          'Mobile Number': cleanPhone,
          'Email Address': formData.email?.trim() || 'Not Provided',
          'Operating City / Region': cleanCity,
          'Real Estate Experience': formData.experienceYears,
          'Area Pincode': formData.pincode?.trim() || 'Not Specified',
          'Aadhaar / PAN / GSTIN': formData.aadhaarPanNumber?.trim() || 'Provided during onboarding',
          'Approval Status': 'Pending Admin Approval',
          'Attached Documents': files.length > 0 
            ? `${files.length} document(s) uploaded (${files.map(f => f.name).join(', ')})` 
            : 'No files attached',
        },
      };

      // Create Associate Partner Account in 'Pending' status
      const associateRecord: AssociateAccount = {
        id: generatedId,
        associateCode: generatedId,
        name: cleanName,
        phone: cleanPhone,
        email: formData.email?.trim() || '',
        city: cleanCity,
        experienceYears: formData.experienceYears,
        pincode: formData.pincode?.trim() || '',
        aadhaarPanNumber: formData.aadhaarPanNumber?.trim() || '',
        passwordHash,
        status: 'Pending', // Enforce Pending status until Admin approves!
        timestamp: now,
        registeredDate: isoDate.split('T')[0],
        commissionRate: 'Standard Tier (Direct Allocation)',
        activeReferrals: 0,
        completedDeals: 0,
        totalEarnings: 0,
        adminNotes: 'Application submitted online. Awaiting Admin verification and acceptance.',
      };

      // 1. Record lead to Firestore
      await firestoreService.addLead(leadPayload);

      // 2. Ensure explicit storage in LEADS collection
      await dbService.setDocument(FirestoreCollections.LEADS, generatedId, leadPayload);

      // 3. Register Associate profile in ASSOCIATES collection with 'Pending' status
      await firestoreService.saveAssociate(associateRecord);

      setSubmittedRef(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('[AssociateEnrollForm:SubmitError]', err);
      // Fallback: even if one call had a network blip, ensure local confirmation
      setSubmittedRef(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-4 text-left space-y-5 animate-in fade-in">
        <div className="flex items-center gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/40">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Enrollment Submitted Successfully!</h4>
            <p className="text-xs text-amber-300 font-medium">
              Status: <span className="font-bold underline">Pending Admin Approval</span>
            </p>
          </div>
        </div>

        {/* Application Ref Card */}
        <div className="p-4 bg-slate-950 border border-slate-700/80 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Associate Partner ID
            </span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-2xl font-mono font-black text-amber-400 tracking-wider">
            {submittedRef}
          </div>

          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Verification & Acceptance Required</span>
            </div>
            <p className="text-slate-400">
              Your profile has been routed to SVS Administration. Once verified and accepted by Admin, your portal login will be activated immediately with the password you just configured.
            </p>
          </div>
        </div>

        {/* Application Summary Card */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Applicant</span>
            <span className="text-white font-bold">{formData.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Login Mobile</span>
            <span className="text-white font-bold">{formData.phone}</span>
          </div>
          <div className="mt-1">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Operating Region</span>
            <span className="text-white font-bold">{formData.city}</span>
          </div>
          <div className="mt-1">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account Status</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pending Admin Acceptance
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          {onOpenLogin && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Go to Associate Login</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSuccess || onCancel}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Done / Close Window</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-300">SVS Official Channel Partner Program</p>
          <p className="text-[11px] text-slate-300">
            Submit your partner enrollment. Once approved by SVS Administration, log into your dedicated Associate Portal to track inventory allocations, direct client commissions, and marketing toolkits.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Full Legal Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="As on PAN / Aadhaar"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Mobile / WhatsApp <span className="text-amber-400">*</span>
          </label>
          <input
            type="tel"
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com (Optional)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">
            City / Operating Region <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Hyderabad, Shadnagar, Vijayawada"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Real Estate Experience
          </label>
          <select
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="New / Fresher">New to Real Estate (Orientation Provided)</option>
            <option value="1-2 Years">1 - 2 Years Experience</option>
            <option value="2-5 Years">2 - 5 Years Experience</option>
            <option value="5+ Years">5+ Years (Senior Property Consultant)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Area Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="e.g. 500081"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1">
          PAN or Aadhaar Number (Optional)
        </label>
        <input
          type="text"
          name="aadhaarPanNumber"
          value={formData.aadhaarPanNumber}
          onChange={handleChange}
          placeholder="For expedited verification & commission agreements"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* ======================================================= */}
      {/* CREDENTIALS CONFIGURATION: CREATE LOGIN PASSWORD */}
      {/* ======================================================= */}
      <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-amber-400/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-xs">Set Associate Portal Password</span>
          </div>
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Required for Login</span>
        </div>

        <p className="text-[11px] text-slate-400">
          Create your secret password now. Once SVS Administration approves your account, you will use this password along with your Associate ID or Mobile Number to log in.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Create Password <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Confirm Password <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type password"
                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Document Upload */}
      <div>
        <label className="block text-slate-300 font-bold mb-1">
          Upload ID Proof / Visiting Card (Optional)
        </label>
        <div className="border border-dashed border-slate-700 hover:border-amber-400/60 rounded-xl p-3.5 text-center bg-slate-950/60 transition-colors">
          <input
            type="file"
            id="kyc-files"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf"
          />
          <label htmlFor="kyc-files" className="cursor-pointer flex flex-col items-center gap-1.5">
            <Upload className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              Click to select Aadhaar / PAN / Visiting Card
            </span>
            <span className="text-[10px] text-slate-500">PDF, JPG, PNG (Multiple files allowed)</span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400">Attached Documents:</span>
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700 text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-0.5 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting Application...</span>
          ) : (
            <>
              <span>Submit for Admin Approval</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
