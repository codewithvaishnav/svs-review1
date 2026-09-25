/**
 * REST API Client Service
 * 
 * Clean, decoupled API calls matching standard backend architecture
 */
import { MemberAccount, MemberAppAd, AdminLead, FirestoreCollections } from '../types';
import { dbService } from './dbService';
import { firestoreService } from './firestoreService';
import { where, orderBy, limit } from 'firebase/firestore';

export interface MemberBookingRequest {
  id?: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  serviceType: string;
  preferredDate?: string;
  guestCount?: number;
  notes?: string;
  status?: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  adminNotes?: string;
  formData?: Record<string, any>;
}

export const memberApi = {
  // 1. Get Member Profile directly from Firestore by memberId, email, phone, or name
  getProfile: async (identifier: string): Promise<MemberAccount | null> => {
    if (!identifier || !identifier.trim()) return null;
    const cleanId = identifier.trim();

    try {
      // First attempt direct document fetch (if docId matches memberId or id)
      const directDoc = await dbService.getDocument<MemberAccount>(FirestoreCollections.MEMBERS, cleanId);
      if (directDoc) return directDoc;

      // Query Firestore collection for matches on memberId, email, phone, or name
      const allMembers = await dbService.getDocuments<MemberAccount>(FirestoreCollections.MEMBERS);
      const normalizedQuery = cleanId.toLowerCase();
      const normalizedPhone = cleanId.replace(/[^0-9]/g, '');

      const match = allMembers.find((m) => {
        const mId = (m.memberId || m.id || '').toLowerCase();
        const mName = (m.name || '').toLowerCase();
        const mEmail = (m.email || '').toLowerCase();
        const mPhone = (m.phone || '').replace(/[^0-9]/g, '');

        return (
          mId === normalizedQuery ||
          mName === normalizedQuery ||
          mEmail === normalizedQuery ||
          (normalizedPhone.length >= 6 && mPhone.includes(normalizedPhone))
        );
      });

      if (match) return match;

      // Also fallback to firestoreService if needed
      return await firestoreService.findMemberByIdentifier(cleanId);
    } catch (err) {
      console.error('[memberApi:getProfileError] Failed to fetch member profile from Firestore:', err);
      return null;
    }
  },

  // 2. Get All Members directly from Firestore
  getAllMembers: async (): Promise<MemberAccount[]> => {
    try {
      const members = await dbService.getDocuments<MemberAccount>(FirestoreCollections.MEMBERS);
      return members;
    } catch (err) {
      console.error('[memberApi:getAllMembersError]:', err);
      return [];
    }
  },

  // 3. Save / Update Member Profile directly into Firestore
  saveMember: async (member: MemberAccount): Promise<void> => {
    const docId = member.id || member.memberId || `MEM-${Date.now()}`;
    await dbService.setDocument(FirestoreCollections.MEMBERS, docId, { ...member, id: docId });
    await firestoreService.logAudit(`Saved member account: ${member.name} (${member.memberId})`, 'ADMIN', 'SUCCESS');
  },

  // 4. Delete Member directly from Firestore
  deleteMember: async (id: string): Promise<void> => {
    await dbService.deleteDocument(FirestoreCollections.MEMBERS, id);
    await firestoreService.logAudit(`Deleted member account: ${id}`, 'ADMIN', 'SUCCESS');
  },

  // 5. Submit a Booking / Service Request from Member Portal directly into Firestore
  submitRequest: async (req: MemberBookingRequest): Promise<AdminLead> => {
    const leadId = req.id || `SVS-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const leadRecord: AdminLead = {
      id: leadId,
      name: req.memberName,
      phone: req.memberPhone,
      category: 'Hospitality',
      service: `Member Request: ${req.serviceType}`,
      source: 'Member Portal Booking Form',
      preferredDate: req.preferredDate,
      status: req.status || 'New',
      notes: req.notes || `Submitted by Member ID ${req.memberId}`,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      formData: {
        'Member ID': req.memberId,
        'Member Name': req.memberName,
        'Service / Venue': req.serviceType,
        'Preferred Date': req.preferredDate || 'N/A',
        'Guest Count': String(req.guestCount || 1),
        'Special Requests / Notes': req.notes || 'None',
        ...(req.formData || {})
      }
    };

    await dbService.setDocument(FirestoreCollections.LEADS, leadId, leadRecord);
    return leadRecord;
  },

  // 6. Get Requests belonging to a specific Member directly from Firestore
  getMemberRequests: async (memberId: string): Promise<AdminLead[]> => {
    try {
      const allLeads = await dbService.getDocuments<AdminLead>(FirestoreCollections.LEADS, [
        orderBy('timestamp', 'desc'),
        limit(100)
      ]);
      return allLeads.filter(
        (l) =>
          (l.formData && l.formData['Member ID'] === memberId) ||
          (l.notes && l.notes.includes(memberId)) ||
          (l.id && l.id.startsWith('SVS-REQ-'))
      );
    } catch (err) {
      console.error('[memberApi:getMemberRequestsError]:', err);
      return [];
    }
  },

  // 7. Get App Banner Ad Config directly from Firestore
  getAppAd: async (): Promise<MemberAppAd> => {
    try {
      const doc = await dbService.getDocument<MemberAppAd>('settings', 'member_app_ad');
      if (doc) return doc;
    } catch (e) {
      console.warn('Could not read app ad config from Firestore:', e);
    }
    return {
      id: 'ad-member-app',
      title: 'Download SVS True Wealth Member App',
      subtitle: 'Track your venture plots, passbook, and complimentary resort stays in real-time.',
      badge: 'Official Mobile App',
      downloadUrl: 'https://svssrivasudha.com/app-download',
      isActive: true,
      features: [
        'Live Geo-Fenced Plot Boundary View',
        'Download Digitally Signed Encumbrance Certificates',
        '1-Tap Weekend Wooden Cottage Stays Reservation',
        'Direct Priority Line to Dedicated Relationship Manager'
      ]
    };
  },

  // 8. Update App Banner Ad Config directly into Firestore
  saveAppAd: async (ad: MemberAppAd): Promise<void> => {
    await dbService.setDocument('settings', 'member_app_ad', ad);
  }
};

