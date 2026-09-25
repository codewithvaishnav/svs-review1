import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { firestoreService, FirestoreUserProfile } from '../services/firestoreService';
import { MemberAccount, FirestoreCollections } from '../types';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PlotInfo {
  venture: string;
  plotNo: string;
  areaSqYd: number;
  regNumber: string;
  paidAmount: number;
  totalAmount: number;
  balanceAmount: number;
  staycationCredits: number;
  nextEmiDueDate: string;
  nextEmiAmount: number;
  documentStatus: string;
  supervisor: string;
  latestPhotoUrl: string;
  dronePhotoUrl: string;
  boundaryPhotoUrl: string;
}

export interface UseUserMetadataResult {
  // Primary records
  member: MemberAccount | null;
  userProfile: FirestoreUserProfile | null;
  
  // Loading & Error States
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  
  // Normalized Accessors
  displayName: string;
  memberId: string;
  email: string;
  phone: string;
  tier: string;
  kycStatus: string;
  isVerified: boolean;
  staycationCredits: number;
  plotInfo: PlotInfo;
  
  // Actions
  refetch: () => Promise<void>;
  updateMember: (updates: Partial<MemberAccount>) => Promise<boolean>;
}

/**
 * Unified useUserMetadata hook:
 * Fetches the full member profile and authentication metadata directly from
 * Firestore by UID (or active session identifier) immediately upon login.
 * 
 * Establishes real-time snapshot sync so any cloud-side changes made by admins
 * (e.g. plot allotment, payments, staycation credits, KYC status) immediately update.
 */
export function useUserMetadata(overrideIdentifier?: string | null): UseUserMetadataResult {
  const { currentUser, userProfile: authProfile } = useAuth();
  
  const [member, setMember] = useState<MemberAccount | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUserProfile | null>(authProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user profile from auth if updated
  useEffect(() => {
    if (authProfile) {
      setUserProfile(authProfile);
    }
  }, [authProfile]);

  const effectiveUid = currentUser?.uid || null;
  const effectiveIdentifier = overrideIdentifier || (currentUser ? currentUser.uid : null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch userProfile from users collection by UID if available
      if (effectiveUid) {
        const uProfile = await firestoreService.getUserProfile(effectiveUid);
        if (uProfile) {
          setUserProfile(uProfile);
        }
      }

      // 2. Resolve member document
      let foundMember: MemberAccount | null = null;

      // STEP 1 (Highest Priority): Lookup by explicit overrideIdentifier if provided
      if (overrideIdentifier && overrideIdentifier.trim()) {
        const clean = overrideIdentifier.trim().toLowerCase();
        
        // A. Direct check via enhanced Firestore lookup
        foundMember = await firestoreService.findMemberByIdentifier(overrideIdentifier);

        // B. If not found, scan all members in Firestore with fuzzy name/id match
        if (!foundMember) {
          try {
            const allMembers = await dbService.getDocuments<MemberAccount>(FirestoreCollections.MEMBERS);
            foundMember = allMembers.find(m => {
              const mName = m.name?.toLowerCase() || '';
              const mFirst = mName.split(' ')[0] || '';
              return (
                m.id.toLowerCase() === clean ||
                m.memberId.toLowerCase() === clean ||
                mName === clean ||
                mName.includes(clean) ||
                clean.includes(mName) ||
                (mFirst.length >= 3 && (clean.includes(mFirst) || mName.startsWith(clean))) ||
                (m.phone && m.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')) ||
                (m.email && m.email.toLowerCase() === clean)
              );
            }) || null;
          } catch (e) {
            console.warn('[useUserMetadata] Firestore scan error:', e);
          }
        }
      }

      // STEP 2: If no overrideIdentifier was provided (or lookup yielded nothing), check authenticated user
      if (!foundMember && currentUser) {
        try {
          const allMembers = await dbService.getDocuments<MemberAccount>(FirestoreCollections.MEMBERS);
          foundMember = allMembers.find(m => 
            (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
            (currentUser.phoneNumber && m.phone && m.phone.replace(/\D/g, '') === currentUser.phoneNumber.replace(/\D/g, '')) ||
            (m.id === currentUser.uid)
          ) || null;
        } catch (e) {}

        // Direct UID check
        if (!foundMember && effectiveUid) {
          foundMember = await dbService.getDocument<MemberAccount>(FirestoreCollections.MEMBERS, effectiveUid);
        }
      }

      // If not found in Firestore, foundMember stays null

      setMember(foundMember);
    } catch (err: any) {
      console.error('[useUserMetadata:Error]:', err);
      setError(err?.message || 'Failed to fetch member metadata from Firestore');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUid, effectiveIdentifier, currentUser?.email, currentUser?.phoneNumber, currentUser?.displayName, userProfile?.name, userProfile?.phone, userProfile?.email]);

  // Initial fetch upon login / identity change
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Real-time Firestore subscription to member document
  useEffect(() => {
    if (!member?.id) return;

    let unsubscribe: Unsubscribe;
    try {
      const docRef = doc(db, FirestoreCollections.MEMBERS, member.id);
      unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const liveData = snap.data() as MemberAccount;
          setMember(liveData);
        }
      }, (err) => {
        console.warn('[useUserMetadata:SnapshotWarning]:', err);
      });
    } catch (e) {
      console.warn('[useUserMetadata:SubscriptionError]:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [member?.id]);

  // Update member document in Firestore
  const updateMember = useCallback(async (updates: Partial<MemberAccount>): Promise<boolean> => {
    if (!member?.id) return false;
    try {
      const updated = { ...member, ...updates };
      await dbService.updateDocument(FirestoreCollections.MEMBERS, member.id, updates);
      setMember(updated);
      await firestoreService.logAudit(`Member ${member.name} updated profile details`, 'MEMBER', 'SUCCESS');
      return true;
    } catch (e: any) {
      console.error('[useUserMetadata:UpdateError]:', e);
      setError(e?.message || 'Failed to update member profile in Firestore');
      return false;
    }
  }, [member]);

  // Derived normalized plotInfo from DB member document
  const plotInfo: PlotInfo = useMemo(() => {
    const paid = member?.paidAmount ?? 0;
    const total = member?.totalAmount ?? 0;
    const balance = Math.max(0, total - paid);
    
    // Read directly from member document in DB
    const dueEmiAmount = member?.nextEmiAmount ?? (balance === 0 && total > 0 ? 0 : 0);
    const dueEmiDate = member?.nextEmiDueDate || (balance === 0 && total > 0 ? 'Completed / Nil' : '');
    const docStatus = member?.documentStatus || '';

    return {
      venture: member?.venture || '',
      plotNo: member?.plotNo || '',
      areaSqYd: member?.areaSqYd || 0,
      regNumber: member?.regNumber || '',
      paidAmount: paid,
      totalAmount: total,
      balanceAmount: balance,
      staycationCredits: member?.staycationCredits ?? 0,
      nextEmiDueDate: dueEmiDate,
      nextEmiAmount: dueEmiAmount,
      documentStatus: docStatus,
      supervisor: 'SVS Project Supervisor',
      latestPhotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      dronePhotoUrl: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80',
      boundaryPhotoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    };
  }, [member]);

  return {
    member,
    userProfile,
    isLoading,
    loading: isLoading,
    error,
    displayName: member?.name || userProfile?.name || currentUser?.displayName || overrideIdentifier || null,
    memberId: member?.memberId || member?.id || (overrideIdentifier && overrideIdentifier.startsWith('SVS-') ? overrideIdentifier : null),
    email: member?.email || userProfile?.email || currentUser?.email || null,
    phone: member?.phone || userProfile?.phone || null,
    tier: member?.tier || null,
    kycStatus: member?.kycStatus || null,
    isVerified: member?.kycStatus === 'Verified',
    staycationCredits: member?.staycationCredits ?? null,
    plotInfo,
    refetch: fetchProfile,
    updateMember,
  };
}
