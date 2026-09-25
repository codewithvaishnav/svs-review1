import { 
  db, 
  auth,
  signInAnonymously,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from '../lib/firebase';
import { AdminLead, AssociateAccount, MemberAccount, Project } from '../types';
import { UserRole } from '../lib/rbac';

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  registeredPlot?: string;
  createdAt: string;
  photoURL?: string;
}

export interface FirestorePlot {
  id: string;
  venture: string;
  plotNumber: string;
  sizeSqYd: number;
  pricePerSqYd: number;
  status: 'AVAILABLE' | 'BOOKED' | 'REGISTERED';
  assignedTo?: string;
}

export interface FirestoreAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  status: string;
  createdAt?: any;
}

const DEFAULT_PLOTS: FirestorePlot[] = [
  { id: 'P-101', venture: 'Royal City (Shadnagar HMDA)', plotNumber: 'Plot #14', sizeSqYd: 200, pricePerSqYd: 12500, status: 'AVAILABLE' },
  { id: 'P-102', venture: 'Royal City (Shadnagar HMDA)', plotNumber: 'Plot #15', sizeSqYd: 250, pricePerSqYd: 12500, status: 'BOOKED', assignedTo: 'SVS-MEM-1082 (Rahul Sharma)' },
  { id: 'P-103', venture: 'Paradise Valley (Yadadri)', plotNumber: 'Plot #42', sizeSqYd: 300, pricePerSqYd: 9800, status: 'REGISTERED', assignedTo: 'SVS-MEM-2041 (Priya Nair)' },
  { id: 'P-104', venture: 'Gold County (Kothur)', plotNumber: 'Plot #08', sizeSqYd: 180, pricePerSqYd: 14000, status: 'AVAILABLE' },
  { id: 'P-105', venture: 'Aerocity Phase 1 (Mucherla)', plotNumber: 'Plot #88', sizeSqYd: 500, pricePerSqYd: 18500, status: 'BOOKED', assignedTo: 'SVS-MEM-3099 (Anand Verma)' },
];

export const DEFAULT_ASSOCIATES: AssociateAccount[] = [
  {
    id: 'SVS-ASC-441',
    associateCode: 'SVS-ASC-441',
    name: 'Rajesh Varma',
    phone: '+91 98490 88210',
    email: 'rajesh.varma@svsassociates.in',
    city: 'Hyderabad',
    experienceYears: '5+ Years',
    pincode: '500081',
    status: 'Active',
    commissionRate: 'Direct Master Tier (4.5%)',
    activeReferrals: 14,
    completedDeals: 8,
    totalEarnings: 385000,
    registeredDate: '2024-01-15',
    approvedDate: '2024-01-16',
    adminNotes: 'Senior Channel Partner - Hyderabad West Corridor',
    timestamp: 1705276800000,
  },
  {
    id: 'SVS-ASC-512',
    associateCode: 'SVS-ASC-512',
    name: 'Suresh Babu K.',
    phone: '+91 94401 23987',
    email: 'suresh.babu@channelpartner.in',
    city: 'Vijayawada',
    experienceYears: '2-5 Years',
    pincode: '520002',
    status: 'Active',
    commissionRate: 'Standard Tier (Direct Allocation)',
    activeReferrals: 6,
    completedDeals: 3,
    totalEarnings: 140000,
    registeredDate: '2024-03-10',
    approvedDate: '2024-03-12',
    adminNotes: 'AP Capital Corridor Associate',
    timestamp: 1710028800000,
  },
];

export const DEFAULT_MEMBERS: MemberAccount[] = [
  {
    id: 'MEM-1082',
    memberId: 'SVS-MEM-1082',
    name: 'Rahul Sharma',
    phone: '+91 98490 55432',
    email: 'rahul.sharma@example.com',
    tier: 'Diamond',
    venture: 'Royal City (Shadnagar HMDA)',
    plotNo: 'Plot #14',
    areaSqYd: 250,
    regNumber: 'DOC-HYD-2023-8891',
    paidAmount: 3125000,
    totalAmount: 3125000,
    staycationCredits: 12,
    kycStatus: 'Verified',
    registeredDate: '2023-08-14',
    status: 'Active',
    notes: 'Premium Diamond Member - Fully Registered Plot',
    city: 'Hyderabad',
    country: 'India',
  },
  {
    id: 'MEM-8890',
    memberId: 'SVS-PLT-2024-8890',
    name: 'Vikram Reddy',
    phone: '+91 98480 12345',
    email: 'vikram.reddy@example.com',
    tier: 'Platinum',
    venture: 'Paradise Valley (Yadadri)',
    plotNo: 'Plot #42',
    areaSqYd: 300,
    regNumber: 'DOC-YAD-2024-4412',
    paidAmount: 2940000,
    totalAmount: 2940000,
    staycationCredits: 8,
    kycStatus: 'Verified',
    registeredDate: '2024-02-10',
    status: 'Active',
    notes: 'Platinum Tier Investor - Resort privileges active',
    city: 'Hyderabad',
    country: 'India',
  },
  {
    id: 'MEM-3301',
    memberId: 'SVS-GLD-2024-3301',
    name: 'Kavitha Rao',
    phone: '+91 99890 98765',
    email: 'kavitha.rao@example.com',
    tier: 'Gold',
    venture: 'Gold County (Kothur)',
    plotNo: 'Plot #08',
    areaSqYd: 180,
    regNumber: 'DOC-KTR-2024-1102',
    paidAmount: 2520000,
    totalAmount: 2520000,
    staycationCredits: 4,
    kycStatus: 'Verified',
    registeredDate: '2024-05-18',
    status: 'Active',
    notes: 'Gold Club Member - Regular staycation user',
    city: 'Hyderabad',
    country: 'India',
  },
  {
    id: 'MEM-3099',
    memberId: 'SVS-MEM-3099',
    name: 'Anand Verma',
    phone: '+91 97000 11223',
    email: 'anand.verma@example.com',
    tier: 'Diamond',
    venture: 'Aerocity Phase 1 (Mucherla)',
    plotNo: 'Plot #88',
    areaSqYd: 500,
    regNumber: 'DOC-MCH-2024-9021',
    paidAmount: 9250000,
    totalAmount: 9250000,
    staycationCredits: 15,
    kycStatus: 'Verified',
    registeredDate: '2024-01-20',
    status: 'Active',
    notes: 'Commercial Villa & Farm land plot owner',
    city: 'Bengaluru',
    country: 'India',
  },
  {
    id: 'MEM-2041',
    memberId: 'SVS-MEM-2041',
    name: 'Priya Nair',
    phone: '+91 96555 44332',
    email: 'priya.nair@example.com',
    tier: 'Silver',
    venture: 'Royal City (Shadnagar HMDA)',
    plotNo: 'Plot #22',
    areaSqYd: 200,
    regNumber: 'DOC-SHD-2023-5561',
    paidAmount: 2500000,
    totalAmount: 2500000,
    staycationCredits: 6,
    kycStatus: 'Verified',
    registeredDate: '2023-11-05',
    status: 'Active',
    notes: 'HMDA Approved plot investment',
    city: 'Chennai',
    country: 'India',
  },
];

// Helper to sanitize data for Firestore (recursively removes undefined fields)
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// Ensure an authenticated session exists (signs in anonymously if needed)
async function ensureAuth() {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    // Non-blocking fallback
  }
}

export const firestoreService = {
  // 1. Initialize & Check Firestore connectivity
  seedDatabaseIfEmpty: async () => {
    try {
      await ensureAuth();
    } catch (err) {
      console.warn('Firestore database initialization note:', err);
    }
  },

  // 2. User Profiles & RBAC
  getUserProfile: async (uid: string): Promise<FirestoreUserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as FirestoreUserProfile;
      }
      return null;
    } catch (e) {
      console.error('Error fetching user profile from Firestore:', e);
      return null;
    }
  },

  saveUserProfile: async (user: FirestoreUserProfile): Promise<void> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, sanitizeForFirestore(user), { merge: true });
    } catch (e) {
      console.error('Error saving user profile to Firestore:', e);
    }
  },

  updateUserRole: async (uid: string, role: UserRole): Promise<void> => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { role });
      await firestoreService.logAudit(`Updated role for user ${uid} to ${role.toUpperCase()}`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error updating user role in Firestore:', e);
    }
  },

  listenUsers: (callback: (users: FirestoreUserProfile[]) => void) => {
    try {
      const q = query(collection(db, 'users'));
      return onSnapshot(q, (snapshot) => {
        const list: FirestoreUserProfile[] = [];
        snapshot.forEach((d) => list.push(d.data() as FirestoreUserProfile));
        callback(list);
      }, (err) => console.warn('Users listener error:', err));
    } catch (err) {
      console.warn('Users listen error:', err);
      return () => {};
    }
  },

  // 3. Leads & Inquiries
  addLead: async (lead: AdminLead): Promise<AdminLead> => {
    const id = lead.id || `SVS-INQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const docData: AdminLead = {
      ...lead,
      id,
      timestamp: lead.timestamp || Date.now(),
      status: lead.status || 'New',
      createdAt: lead.createdAt || new Date().toISOString(),
    };
    
    const cleanDoc = sanitizeForFirestore(docData);
    
    try {
      await ensureAuth();
      await setDoc(doc(db, 'leads', id), cleanDoc);
      console.log('[Firestore] Lead recorded successfully:', id);
      
      // Fire-and-forget audit log so it never blocks or fails lead creation
      firestoreService.logAudit(`New inquiry created: ${docData.service || 'General'} by ${docData.name}`, 'PublicUser', 'SUCCESS').catch(() => {});
      return docData;
    } catch (e: any) {
      console.error('[Firestore Lead Submission Error]:', e?.message || e);
      return docData;
    }
  },

  listenLeads: (callback: (leads: AdminLead[]) => void) => {
    try {
      const colRef = collection(db, 'leads');
      return onSnapshot(colRef, (snapshot) => {
        const leads: AdminLead[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as AdminLead;
          leads.push({ ...data, id: d.id });
        });
        // Sort descending by timestamp or createdAt or id
        leads.sort((a, b) => {
          const timeA = Number(a.timestamp) || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = Number(b.timestamp) || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        callback(leads);
      }, (err) => console.warn('Leads listener error:', err));
    } catch (err) {
      console.warn('Leads listen error:', err);
      return () => {};
    }
  },

  updateLeadStatus: async (leadId: string, status: string, adminNotes?: string): Promise<void> => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      const updateData: any = { status };
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      await updateDoc(leadRef, updateData);
      await firestoreService.logAudit(`Updated lead ${leadId} status to "${status}"`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error updating lead status in Firestore:', e);
    }
  },

  deleteLead: async (leadId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      await firestoreService.logAudit(`Deleted inquiry lead ${leadId}`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error deleting lead from Firestore:', e);
    }
  },

  // 4. Plots Inventory Management
  listenPlots: (callback: (plots: FirestorePlot[]) => void) => {
    try {
      const q = query(collection(db, 'plots'));
      return onSnapshot(q, (snapshot) => {
        const plots: FirestorePlot[] = [];
        snapshot.forEach((doc) => plots.push(doc.data() as FirestorePlot));
        callback(plots);
      }, (err) => console.warn('Plots listener error:', err));
    } catch (err) {
      console.warn('Plots listen error:', err);
      return () => {};
    }
  },

  savePlot: async (plot: FirestorePlot): Promise<void> => {
    try {
      await setDoc(doc(db, 'plots', plot.id), plot, { merge: true });
      await firestoreService.logAudit(`Updated plot ${plot.id} rate to ₹${plot.pricePerSqYd}/sq.yd`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error saving plot to Firestore:', e);
    }
  },

  // 5. Member Accounts
  listenMembers: (callback: (members: MemberAccount[]) => void) => {
    try {
      const q = query(collection(db, 'members'));
      return onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial default members if collection is empty
          for (const mem of DEFAULT_MEMBERS) {
            try {
              await setDoc(doc(db, 'members', mem.id), sanitizeForFirestore(mem));
            } catch (err) {
              console.warn('Error auto-seeding member:', err);
            }
          }
          callback(DEFAULT_MEMBERS);
          return;
        }

        const list: MemberAccount[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as MemberAccount));
        callback(list);
      }, (err) => {
        console.warn('Members listener error:', err);
        callback(DEFAULT_MEMBERS);
      });
    } catch (err) {
      console.warn('Members listen error:', err);
      callback(DEFAULT_MEMBERS);
      return () => {};
    }
  },

  findMemberByIdentifier: async (identifier: string): Promise<MemberAccount | null> => {
    try {
      await ensureAuth();
      const cleanId = identifier.trim().toLowerCase();
      const normalizedPhone = identifier.replace(/[^0-9]/g, '');

      // 1. Check direct document ID
      const directDocRef = doc(db, 'members', identifier.trim());
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        return directSnap.data() as MemberAccount;
      }

      // 2. Query all members in Firestore to match memberId, id, name, email, or phone
      const snap = await getDocs(collection(db, 'members'));
      for (const d of snap.docs) {
        const data = d.data() as MemberAccount;
        const dName = data.name?.toLowerCase() || '';
        const dFirst = dName.split(' ')[0] || '';
        if (
          (data.id && data.id.toLowerCase() === cleanId) ||
          (data.memberId && data.memberId.toLowerCase() === cleanId) ||
          (dName && (dName === cleanId || dName.includes(cleanId) || cleanId.includes(dName))) ||
          (dFirst && dFirst.length >= 3 && (cleanId.includes(dFirst) || dName.startsWith(cleanId))) ||
          (normalizedPhone.length >= 6 && data.phone && data.phone.replace(/[^0-9]/g, '') === normalizedPhone) ||
          (data.email && data.email.toLowerCase() === cleanId)
        ) {
          return data;
        }
      }

      // 3. Fallback to default demo seed members if not yet written to cloud
      for (const def of DEFAULT_MEMBERS) {
        const defName = def.name.toLowerCase();
        if (
          def.id.toLowerCase() === cleanId ||
          def.memberId.toLowerCase() === cleanId ||
          defName.includes(cleanId) ||
          (normalizedPhone.length >= 6 && def.phone.replace(/[^0-9]/g, '') === normalizedPhone) ||
          def.email.toLowerCase() === cleanId
        ) {
          return def;
        }
      }

      // Record not found in Firestore cloud database
      return null;
    } catch (err) {
      console.error('Error finding member by identifier in Firestore:', err);
      for (const def of DEFAULT_MEMBERS) {
        if (def.memberId.toLowerCase() === identifier.trim().toLowerCase()) {
          return def;
        }
      }
      return null;
    }
  },

  saveMember: async (member: MemberAccount): Promise<void> => {
    try {
      await ensureAuth();
      const cleanData = sanitizeForFirestore(member);
      await setDoc(doc(db, 'members', member.id), cleanData, { merge: true });
      await firestoreService.logAudit(`Saved member account: ${member.name} (${member.memberId})`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error saving member to Firestore:', e);
    }
  },

  // 6. Security Audit Logs
  logAudit: async (action: string, actor: string = 'ADMIN', status: string = 'SUCCESS'): Promise<void> => {
    try {
      const id = `AUD-${Date.now().toString().slice(-6)}`;
      const logItem: FirestoreAuditLog = {
        id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor,
        action,
        status,
      };
      await setDoc(doc(db, 'auditLogs', id), logItem);
    } catch (e) {
      console.warn('Could not write audit log to Firestore:', e);
    }
  },

  listenAuditLogs: (callback: (logs: FirestoreAuditLog[]) => void) => {
    try {
      const q = query(collection(db, 'auditLogs'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const list: FirestoreAuditLog[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as FirestoreAuditLog));
        callback(list);
      }, (err) => console.warn('Audit logs listener error:', err));
    } catch (err) {
      console.warn('Audit logs listen error:', err);
      return () => {};
    }
  },

  // 7. Channel Partners & Associate Accounts
  listenAssociates: (callback: (associates: AssociateAccount[]) => void) => {
    try {
      const q = query(collection(db, 'associates'));
      return onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial defaults if collection is empty
          for (const asc of DEFAULT_ASSOCIATES) {
            try {
              await setDoc(doc(db, 'associates', asc.id), sanitizeForFirestore(asc));
            } catch (err) {
              console.warn('Error auto-seeding associate:', err);
            }
          }
          callback(DEFAULT_ASSOCIATES);
          return;
        }

        const list: AssociateAccount[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });

        // Sort: Pending first so admin sees pending approvals at the top, then newest
        list.sort((a, b) => {
          if (a.status === 'Pending' && b.status !== 'Pending') return -1;
          if (a.status !== 'Pending' && b.status === 'Pending') return 1;
          return (b.timestamp || 0) - (a.timestamp || 0);
        });

        callback(list);
      }, (err) => {
        console.warn('Associates listener error:', err);
        callback(DEFAULT_ASSOCIATES);
      });
    } catch (err) {
      console.warn('Associates subscribe failed:', err);
      callback(DEFAULT_ASSOCIATES);
      return () => {};
    }
  },

  saveAssociate: async (associate: AssociateAccount): Promise<void> => {
    try {
      await ensureAuth();
      const docId = associate.id || associate.associateCode;
      const cleanData = sanitizeForFirestore({
        ...associate,
        id: docId,
        timestamp: associate.timestamp || Date.now(),
      });
      await setDoc(doc(db, 'associates', docId), cleanData, { merge: true });
      await firestoreService.logAudit(`Saved associate partner: ${associate.name} (${associate.associateCode}) - Status: ${associate.status}`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error saving associate to Firestore:', e);
      throw e;
    }
  },

  approveAssociate: async (associateId: string, adminNotes?: string): Promise<{ associateCode: string; name: string }> => {
    try {
      await ensureAuth();
      const cleanId = associateId.trim();
      const nowStr = new Date().toISOString().split('T')[0];
      let targetDocRef = doc(db, 'associates', cleanId);
      let snap = await getDoc(targetDocRef);
      let data: AssociateAccount | null = snap.exists() ? (snap.data() as AssociateAccount) : null;

      // If not found by direct doc ID, scan associates collection for matching code/phone/id
      if (!data) {
        const snapAll = await getDocs(collection(db, 'associates'));
        for (const d of snapAll.docs) {
          const item = d.data() as AssociateAccount;
          if (
            d.id === cleanId ||
            item.associateCode?.toLowerCase() === cleanId.toLowerCase() ||
            (item.phone && cleanId.replace(/[^0-9]/g, '').length >= 10 && item.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
          ) {
            targetDocRef = d.ref;
            data = item;
            break;
          }
        }
      }

      // If still not found, check if a lead with this ID exists and create the associate record
      if (!data) {
        const leadRef = doc(db, 'leads', cleanId);
        const leadSnap = await getDoc(leadRef);
        if (leadSnap.exists()) {
          const leadData = leadSnap.data() as AdminLead;
          const newAscCode = cleanId.startsWith('SVS-ASC-') ? cleanId : `SVS-ASC-${Math.floor(100000 + Math.random() * 900000)}`;
          const newAssociate: AssociateAccount = {
            id: newAscCode,
            associateCode: newAscCode,
            name: leadData.name || 'Associate Partner',
            phone: leadData.phone || '',
            email: leadData.email && leadData.email !== 'Not Provided' ? leadData.email : '',
            city: leadData.city || 'Telangana',
            experienceYears: (leadData.formData?.['Real Estate Experience'] as string) || '2-5 Years',
            pincode: (leadData.formData?.['Area Pincode'] as string) || '',
            aadhaarPanNumber: (leadData.formData?.['Aadhaar / PAN / GSTIN'] as string) || '',
            status: 'Active',
            timestamp: Date.now(),
            registeredDate: nowStr,
            approvedDate: nowStr,
            commissionRate: 'Standard Tier (Direct Allocation)',
            activeReferrals: 0,
            completedDeals: 0,
            totalEarnings: 0,
            adminNotes: adminNotes || `Approved and onboarded by SVS Administration on ${nowStr}.`,
          };

          targetDocRef = doc(db, 'associates', newAscCode);
          await setDoc(targetDocRef, newAssociate);
          data = newAssociate;

          // Update lead status
          await updateDoc(leadRef, {
            status: 'Completed',
            adminNotes: `Approved as Active Associate Partner (${newAscCode}) on ${nowStr}`
          });

          await firestoreService.logAudit(`Approved associate partner from lead: ${data.name} (${data.associateCode})`, 'ADMIN', 'SUCCESS');
          return { associateCode: data.associateCode, name: data.name };
        } else {
          throw new Error(`Associate with ID ${cleanId} not found in database.`);
        }
      }

      // If data was found in associates collection, update it to Active
      await updateDoc(targetDocRef, {
        status: 'Active',
        approvedDate: nowStr,
        ...(adminNotes ? { adminNotes } : {}),
      });

      await firestoreService.logAudit(`Approved associate partner: ${data.name || cleanId} (${data.associateCode || cleanId})`, 'ADMIN', 'SUCCESS');

      // Also mark corresponding lead as 'Completed' if matching
      try {
        const leadsSnap = await getDocs(collection(db, 'leads'));
        for (const leadDoc of leadsSnap.docs) {
          const leadData = leadDoc.data() as AdminLead;
          const phoneMatch = leadData.phone && data.phone && 
            leadData.phone.replace(/[^0-9]/g, '') === data.phone.replace(/[^0-9]/g, '');
          const codeMatch = leadData.id === cleanId || (leadData.notes && leadData.notes.includes(data.associateCode));
          if (phoneMatch || codeMatch) {
            await updateDoc(leadDoc.ref, {
              status: 'Completed',
              adminNotes: `Approved as Active Associate Partner (${data.associateCode}) on ${nowStr}`
            });
          }
        }
      } catch (err) {
        console.warn('Could not auto-update lead for approved associate:', err);
      }

      return { associateCode: data.associateCode || cleanId, name: data.name || 'Associate Partner' };
    } catch (e) {
      console.error('Error approving associate in Firestore:', e);
      throw e;
    }
  },

  deleteAssociate: async (associateId: string): Promise<void> => {
    try {
      await ensureAuth();
      await deleteDoc(doc(db, 'associates', associateId));
      await firestoreService.logAudit(`Deleted associate account: ${associateId}`, 'ADMIN', 'SUCCESS');
    } catch (e) {
      console.error('Error deleting associate from Firestore:', e);
      throw e;
    }
  },

  findAssociateByIdentifier: async (identifier: string): Promise<AssociateAccount | null> => {
    try {
      await ensureAuth();
      const cleanId = identifier.trim();
      const cleanDigits = cleanId.replace(/[^0-9]/g, '');

      // Check direct doc ID
      const directRef = doc(db, 'associates', cleanId);
      const directSnap = await getDoc(directRef);
      if (directSnap.exists()) {
        return { id: directSnap.id, ...(directSnap.data() as any) };
      }

      // Query collection
      const snap = await getDocs(collection(db, 'associates'));
      for (const docSnap of snap.docs) {
        const item = { id: docSnap.id, ...(docSnap.data() as any) } as AssociateAccount;
        if (item.associateCode && item.associateCode.toLowerCase() === cleanId.toLowerCase()) {
          return item;
        }
        if (item.id && item.id.toLowerCase() === cleanId.toLowerCase()) {
          return item;
        }
        if (cleanDigits.length >= 10 && item.phone && item.phone.replace(/[^0-9]/g, '').includes(cleanDigits)) {
          return item;
        }
        if (item.email && item.email.toLowerCase() === cleanId.toLowerCase()) {
          return item;
        }
      }

      // Fallback check against in-memory default seeds
      for (const def of DEFAULT_ASSOCIATES) {
        if (def.associateCode.toLowerCase() === cleanId.toLowerCase() || 
            (cleanDigits.length >= 10 && def.phone.replace(/[^0-9]/g, '').includes(cleanDigits))) {
          return def;
        }
      }

      return null;
    } catch (e) {
      console.warn('Error querying associate by identifier:', e);
      // Fallback to default demo seed
      for (const def of DEFAULT_ASSOCIATES) {
        if (def.associateCode.toLowerCase() === identifier.trim().toLowerCase()) {
          return def;
        }
      }
      return null;
    }
  }
};
