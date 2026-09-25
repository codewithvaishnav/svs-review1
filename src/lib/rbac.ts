export type UserRole = 'admin' | 'associate' | 'member' | 'guest';

export interface PermissionDefinition {
  key: string;
  label: string;
  description: string;
  category: 'Public' | 'Member Protection' | 'Associate Portal' | 'Admin Governance';
  allowedRoles: UserRole[];
}

export const PERMISSIONS: PermissionDefinition[] = [
  {
    key: 'VIEW_PUBLIC_PROJECTS',
    label: 'Browse Public Ventures & Plots',
    description: 'Access venture locations, plot layouts, brochures, and contact forms.',
    category: 'Public',
    allowedRoles: ['guest', 'member', 'associate', 'admin'],
  },
  {
    key: 'SUBMIT_INQUIRY',
    label: 'Submit Purchase / Consultation Inquiry',
    description: 'Submit contact requests and request site visits.',
    category: 'Public',
    allowedRoles: ['guest', 'member', 'associate', 'admin'],
  },
  {
    key: 'ACCESS_MEMBER_CCTV',
    label: '24/7 Live Plot CCTV Streams',
    description: 'Stream camera feeds of purchased plot locations for remote inspection.',
    category: 'Member Protection',
    allowedRoles: ['member', 'admin'],
  },
  {
    key: 'DOWNLOAD_PROPERTY_EC',
    label: 'Download Encumbrance Certificates (EC)',
    description: 'Access official government EC documents and legal title deeds.',
    category: 'Member Protection',
    allowedRoles: ['member', 'admin'],
  },
  {
    key: 'VIEW_MEMBER_PASSBOOK',
    label: 'Digital Land Passbook & Installments',
    description: 'View land allotment ledger, payment history, and passbook statements.',
    category: 'Member Protection',
    allowedRoles: ['member', 'admin'],
  },
  {
    key: 'BOOK_MEMBER_RESORT_DISCOUNT',
    label: 'Resort Staycation & Member Rates',
    description: 'Book SVS Eco-Resort suites with member-exclusive staycation credits.',
    category: 'Member Protection',
    allowedRoles: ['member', 'admin'],
  },
  {
    key: 'ACCESS_ASSOCIATE_PIPELINE',
    label: 'Business Associate CRM Pipeline',
    description: 'Manage prospective buyer leads, site visit bookings, and referral links.',
    category: 'Associate Portal',
    allowedRoles: ['associate', 'admin'],
  },
  {
    key: 'VIEW_COMMISSION_STRUCTURE',
    label: 'Commission Ledger & Payouts',
    description: 'Track venture plot sales commissions, tier rewards, and payouts.',
    category: 'Associate Portal',
    allowedRoles: ['associate', 'admin'],
  },
  {
    key: 'MANAGE_VENTURE_INVENTORY',
    label: 'Plot Allotment & Pricing Management',
    description: 'Update plot availability statuses (Available, Booked, Registered) & pricing.',
    category: 'Admin Governance',
    allowedRoles: ['admin'],
  },
  {
    key: 'MANAGE_USER_ROLES',
    label: 'User Role Governance & Credentials',
    description: 'Assign or revoke Member, Associate, and Admin roles across the system.',
    category: 'Admin Governance',
    allowedRoles: ['admin'],
  },
  {
    key: 'APPROVE_EC_DOCUMENTS',
    label: 'Legal EC Upload & Approval',
    description: 'Upload verified legal EC documents to member plots.',
    category: 'Admin Governance',
    allowedRoles: ['admin'],
  },
  {
    key: 'VIEW_SYSTEM_AUDIT_LOGS',
    label: 'System Audit Logs & Security Metrics',
    description: 'Inspect security event logs, access attempts, and API activity.',
    category: 'Admin Governance',
    allowedRoles: ['admin'],
  },
];

/**
 * DEFAULT GUEST FALLBACK RESOLVER:
 * If a user is unauthenticated, or has an unassigned/unknown role string,
 * they automatically resolve to 'guest' - eliminating unnecessary database records
 * for millions of public visitors while strictly enforcing security.
 */
export function getEffectiveRole(isLoggedIn: boolean, role?: string): UserRole {
  if (!isLoggedIn || !role) {
    return 'guest';
  }
  const cleanRole = role.toLowerCase().trim();
  if (cleanRole === 'admin' || cleanRole === 'associate' || cleanRole === 'member') {
    return cleanRole as UserRole;
  }
  return 'guest';
}

/**
 * Checks if a role has access to a specific permission key.
 */
export function hasPermission(role: UserRole, permissionKey: string): boolean {
  const perm = PERMISSIONS.find((p) => p.key === permissionKey);
  if (!perm) return false;
  return perm.allowedRoles.includes(role);
}

export interface RoleInfo {
  role: UserRole;
  title: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  typicalUser: string;
  demoCredential: { username: string; label: string };
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleInfo> = {
  guest: {
    role: 'guest',
    title: 'Guest / Public Visitor',
    badgeBg: 'bg-slate-200 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-300 dark:border-slate-700',
    description: 'Implicit default role for any unauthenticated visitor or website browser.',
    typicalUser: 'General public exploring real estate ventures, NRI services, or career positions.',
    demoCredential: { username: 'Anonymous Guest', label: 'No Login Required' },
  },
  member: {
    role: 'member',
    title: 'Verified Plot Member',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-500/40',
    description: 'Authenticated plot buyer with access to personal land plot assets and documents.',
    typicalUser: 'Property owners, plot buyers, resort club card holders.',
    demoCredential: { username: 'SVS-MEM-1082', label: 'Member ID Login' },
  },
  associate: {
    role: 'associate',
    title: 'Business Associate',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-500/40',
    description: 'Channel partner and agent managing lead pipelines and sales commissions.',
    typicalUser: 'Real estate agents, field advisors, NRI referral partners.',
    demoCredential: { username: 'SVS-ASC-441', label: 'Associate Code Login' },
  },
  admin: {
    role: 'admin',
    title: 'System Administrator',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    borderColor: 'border-cyan-500/40',
    description: 'Full administrative access for user roles, plot allotments, legal ECs, and audit logs.',
    typicalUser: 'SVS Management, IT Security Team, Legal Compliance Officers.',
    demoCredential: { username: 'svsadmin', label: 'Admin Portal Login' },
  },
};
