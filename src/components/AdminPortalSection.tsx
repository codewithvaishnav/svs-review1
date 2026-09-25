import React, { useState } from 'react';
import { 
  ShieldCheck, Users, FileText, CheckCircle2, XCircle, Clock, 
  Search, SlidersHorizontal, Lock, ShieldAlert, Key, Database, 
  Building2, Plus, Edit3, Save, RefreshCw, Layers
} from 'lucide-react';
import { UserRole, ROLE_DEFINITIONS } from '../lib/rbac';

interface AdminPortalSectionProps {
  onShowToast?: (msg: string) => void;
}

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredPlot?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

interface DemoPlot {
  id: string;
  venture: string;
  plotNumber: string;
  sizeSqYd: number;
  pricePerSqYd: number;
  status: 'AVAILABLE' | 'BOOKED' | 'REGISTERED';
  assignedTo?: string;
}

export const AdminPortalSection: React.FC<AdminPortalSectionProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'users' | 'legal' | 'audit'>('inventory');

  // Sample Plot Inventory State
  const [plots, setPlots] = useState<DemoPlot[]>([
    { id: 'P-101', venture: 'Royal City (Shadnagar HMDA)', plotNumber: 'Plot #14', sizeSqYd: 200, pricePerSqYd: 12500, status: 'AVAILABLE' },
    { id: 'P-102', venture: 'Royal City (Shadnagar HMDA)', plotNumber: 'Plot #15', sizeSqYd: 250, pricePerSqYd: 12500, status: 'BOOKED', assignedTo: 'SVS-MEM-1082 (Rahul Sharma)' },
    { id: 'P-103', venture: 'Paradise Valley (Yadadri)', plotNumber: 'Plot #42', sizeSqYd: 300, pricePerSqYd: 9800, status: 'REGISTERED', assignedTo: 'SVS-MEM-2041 (Priya Nair)' },
    { id: 'P-104', venture: 'Gold County (Kothur)', plotNumber: 'Plot #08', sizeSqYd: 180, pricePerSqYd: 14000, status: 'AVAILABLE' },
    { id: 'P-105', venture: 'Aerocity Phase 1 (Mucherla)', plotNumber: 'Plot #88', sizeSqYd: 500, pricePerSqYd: 18500, status: 'BOOKED', assignedTo: 'SVS-MEM-3099 (Anand Verma)' },
  ]);

  // Sample Users State for RBAC Role Management
  const [users, setUsers] = useState<DemoUser[]>([
    { id: 'U-1', name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'member', registeredPlot: 'Royal City #15', status: 'ACTIVE' },
    { id: 'U-2', name: 'Vikram Reddy (Field Associate)', email: 'vikram.r@svs.in', role: 'associate', status: 'ACTIVE' },
    { id: 'U-3', name: 'Ananya Rao', email: 'ananya@example.com', role: 'guest', status: 'ACTIVE' },
    { id: 'U-4', name: 'System Admin HQ', email: 'admin@svssrivasudha.com', role: 'admin', status: 'ACTIVE' },
  ]);

  // Pending Legal EC Approvals
  const [ecDocuments, setEcDocuments] = useState([
    { id: 'EC-901', member: 'Rahul Sharma (Plot #15)', venture: 'Shadnagar Phase 1', docType: 'Form 15 Legal EC (2010-2026)', status: 'APPROVED' },
    { id: 'EC-902', member: 'Priya Nair (Plot #42)', venture: 'Yadadri Hillview', docType: 'Certified Title Deed & EC Passbook', status: 'PENDING' },
    { id: 'EC-903', member: 'Anand Verma (Plot #88)', venture: 'Mucherla Pharma City', docType: 'Encumbrance Certificate Download Request', status: 'PENDING' },
  ]);

  // System Audit Trail
  const [auditLogs, setAuditLogs] = useState([
    { id: 'AUD-501', timestamp: '2 mins ago', actor: 'svsadmin (ADMIN)', action: 'Updated Plot #15 price to ₹12,500/sq.yd', status: 'SUCCESS' },
    { id: 'AUD-500', timestamp: '12 mins ago', actor: 'SVS-ASC-441 (ASSOCIATE)', action: 'Accessed Business Associate Lead Pipeline', status: 'SUCCESS' },
    { id: 'AUD-499', timestamp: '25 mins ago', actor: 'Anonymous Visitor (GUEST)', action: 'Attempted POST /api/admin/roles/grant', status: 'BLOCKED (403)' },
  ]);

  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const handleStartEditPlot = (plot: DemoPlot) => {
    setEditingPlotId(plot.id);
    setEditPrice(plot.pricePerSqYd);
  };

  const handleSavePlotPrice = (plotId: string) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, pricePerSqYd: editPrice } : p))
    );
    setEditingPlotId(null);
    if (onShowToast) onShowToast(`Updated price per sq.yd for plot ${plotId} to ₹${editPrice.toLocaleString()}`);

    // Add Audit Log
    setAuditLogs((prev) => [
      {
        id: `AUD-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: 'Just now',
        actor: 'svsadmin (ADMIN)',
        action: `Updated price for plot ${plotId} to ₹${editPrice.toLocaleString()}/sq.yd`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);
  };

  const handleUserRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (onShowToast) onShowToast(`Updated user role for ${userId} to ${newRole.toUpperCase()}`);

    // Add Audit Log
    setAuditLogs((prev) => [
      {
        id: `AUD-${Math.floor(500 + Math.random() * 500)}`,
        timestamp: 'Just now',
        actor: 'svsadmin (ADMIN)',
        action: `Changed User ${userId} Role to ${newRole.toUpperCase()}`,
        status: 'SUCCESS',
      },
      ...prev,
    ]);
  };

  const handleEcApprove = (ecId: string) => {
    setEcDocuments((prev) =>
      prev.map((doc) => (doc.id === ecId ? { ...doc, status: 'APPROVED' } : doc))
    );
    if (onShowToast) onShowToast(`EC Document ${ecId} successfully verified & published to Member Portal.`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Dashboard Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              SVS Governance & System Administration
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admin Governance Portal
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Manage plot inventories, user RBAC role assignments, Encumbrance Certificate legal approvals, and real-time security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 space-y-0.5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">System Status</div>
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Active (RBAC Enforced)
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 space-y-0.5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Active Role</div>
              <div className="font-bold text-slate-900">
                ADMINISTRATOR
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Plot & Venture Allotments</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User RBAC Role Management</span>
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>EC Legal Verification Desk</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* Tab 1: Plot Inventory Allotments */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                Venture Plot Inventory & Pricing Controls
              </h3>
              <p className="text-xs text-slate-500">
                Update plot statuses, adjust square yard rates, and review allotment owners.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4">Plot Ref</th>
                  <th className="py-3 px-4">Venture Project</th>
                  <th className="py-3 px-4">Plot No / Size</th>
                  <th className="py-3 px-4">Price (per sq.yd)</th>
                  <th className="py-3 px-4">Allotment Status</th>
                  <th className="py-3 px-4">Assigned Member</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plots.map((plot) => (
                  <tr key={plot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{plot.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{plot.venture}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{plot.plotNumber} ({plot.sizeSqYd} sq.yds)</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      {editingPlotId === plot.id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-28 px-2 py-1 rounded bg-white border border-emerald-600 text-slate-900 text-xs font-bold focus:outline-none"
                        />
                      ) : (
                        `₹${plot.pricePerSqYd.toLocaleString()}/sq.yd`
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        plot.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : plot.status === 'BOOKED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {plot.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {plot.assignedTo || '— Unassigned —'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {editingPlotId === plot.id ? (
                        <button
                          onClick={() => handleSavePlotPrice(plot.id)}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" /> <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEditPlot(plot)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> <span>Edit Rate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User RBAC Role Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                User Account & Security Role Governance
              </h3>
              <p className="text-xs text-slate-500">
                Explicitly assign or upgrade roles across Member, Associate, and Admin tiers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name / Contact</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Associated Plot</th>
                  <th className="py-3 px-4 text-right">Change Role (RBAC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{user.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${ROLE_DEFINITIONS[user.role].badgeBg} ${ROLE_DEFINITIONS[user.role].badgeText}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {user.registeredPlot || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleUserRoleChange(user.id, e.target.value as UserRole)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="guest">Guest</option>
                        <option value="member">Member</option>
                        <option value="associate">Associate</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Legal EC Verification Desk */}
      {activeTab === 'legal' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              Encumbrance Certificate (EC) Verification Desk
            </h3>
            <p className="text-xs text-slate-500">
              Approve legal EC title documents to make them downloadable in Member Property Portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ecDocuments.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{doc.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{doc.docType}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.member} — {doc.venture}</p>
                </div>
                {doc.status === 'PENDING' ? (
                  <button
                    onClick={() => handleEcApprove(doc.id)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> <span>Approve & Publish EC</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Verified & Accessible by Member</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Live System Audit Logs & RBAC Inspections
              </h3>
              <p className="text-xs text-slate-500">
                Immutable audit record of administrative edits, access evaluations, and blocked unauthorized requests.
              </p>
            </div>
            <button
              onClick={() => onShowToast && onShowToast('Refreshed security audit logs.')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh Logs</span>
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    <span className="font-bold text-slate-800">{log.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Actor: {log.actor}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  log.status.includes('SUCCESS')
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
