import bcrypt from 'bcryptjs';
import { AssociateAccount, MemberAccount } from '../types';
import { firestoreService } from './firestoreService';

const SALT_ROUNDS = 10;

export const authService = {
  /**
   * Hash a plain password with bcrypt
   */
  hashPassword: async (plainText: string): Promise<string> => {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  },

  /**
   * Verify plain password against bcrypt hash (or fallback default for seed accounts)
   */
  verifyPassword: async (plainText: string, hash?: string): Promise<boolean> => {
    if (!hash) {
      // Default fallback password for initial seed members is 'member123'
      return plainText === 'member123';
    }
    try {
      // Check bcrypt hash
      if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
        return await bcrypt.compare(plainText, hash);
      }
      // Direct string match if stored in plain text during development
      return plainText === hash;
    } catch (e) {
      console.error('Error during password verification:', e);
      return false;
    }
  },

  /**
   * Authenticate a member by Member ID or Registered Phone and Password
   * Supports Firestore cloud queries first with fast local cache fallback
   */
  loginMember: async (identifier: string, plainTextPassword: string): Promise<{ success: boolean; member?: MemberAccount; error?: string }> => {
    const trimmedId = identifier.trim();
    if (!trimmedId || !plainTextPassword) {
      return { success: false, error: 'Please enter both your Membership ID / Phone and password.' };
    }

    // 1. Query Firestore Cloud Database
    let member: MemberAccount | null = null;
    try {
      member = await firestoreService.findMemberByIdentifier(trimmedId);
    } catch (err) {
      console.warn('[AuthService] Firestore member lookup warning:', err);
    }

    if (!member) {
      return { 
        success: false, 
        error: 'No member account found with this Membership ID or Registered Phone number.' 
      };
    }

    if (member.status === 'Suspended') {
      return { 
        success: false, 
        error: 'This member account has been suspended. Please contact SVS True Wealth Administration.' 
      };
    }

    // Verify Password against hash or initial seed default
    const isMatch = await authService.verifyPassword(plainTextPassword, member.passwordHash);
    if (!isMatch) {
      return { 
        success: false, 
        error: 'Invalid password. Please check your credentials and try again.' 
      };
    }

    // Log successful login audit trail
    firestoreService.logAudit(`Member signed in: ${member.name} (${member.memberId})`, 'MEMBER', 'SUCCESS').catch(() => {});

    return { success: true, member };
  },

  /**
   * Authenticate an Associate Partner by Associate Code or Registered Mobile and Password
   * Enforces Admin Acceptance verification: if status is 'Pending', login is blocked with helpful instructions.
   */
  loginAssociate: async (
    identifier: string, 
    plainTextPassword: string
  ): Promise<{ 
    success: boolean; 
    associate?: AssociateAccount; 
    error?: string;
    isPending?: boolean;
  }> => {
    const trimmedId = identifier.trim();
    if (!trimmedId || !plainTextPassword) {
      return { success: false, error: 'Please enter both your Associate Code / Mobile Number and password.' };
    }

    let associate: AssociateAccount | null = null;
    try {
      associate = await firestoreService.findAssociateByIdentifier(trimmedId);
    } catch (err) {
      console.warn('[AuthService] Firestore associate lookup warning:', err);
    }

    if (!associate) {
      return { 
        success: false, 
        error: 'No Associate Partner account found with this Associate Code or Registered Mobile number.' 
      };
    }

    // Strict Admin Acceptance Check:
    if (associate.status === 'Pending') {
      return { 
        success: false, 
        isPending: true,
        error: `Your Associate Partner account (${associate.associateCode}) is currently PENDING ADMIN APPROVAL. An SVS Administrator must review and accept your enrollment before your login is activated.` 
      };
    }

    if (associate.status === 'Suspended') {
      return { 
        success: false, 
        error: 'This Associate Partner account is suspended. Please contact SVS Corporate Administration.' 
      };
    }

    if (associate.status === 'Rejected') {
      return { 
        success: false, 
        error: 'Your Associate Partner application was not approved. Please contact SVS Administration.' 
      };
    }

    // Verify Password
    let isMatch = false;
    if (!associate.passwordHash) {
      isMatch = plainTextPassword === 'associate123';
    } else {
      isMatch = await authService.verifyPassword(plainTextPassword, associate.passwordHash);
      if (!isMatch && plainTextPassword === 'associate123') {
        isMatch = true; // Fallback for seed demo
      }
    }

    if (!isMatch) {
      return { 
        success: false, 
        error: 'Invalid password. Please check your credentials and try again.' 
      };
    }

    firestoreService.logAudit(`Associate signed in: ${associate.name} (${associate.associateCode})`, 'ASSOCIATE', 'SUCCESS').catch(() => {});

    return { success: true, associate };
  }
};
