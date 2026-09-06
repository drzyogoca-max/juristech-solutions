/**
 * src/components/team/TeamManagementModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Real Multi-Tenant Team Management UI
 * Sprint 02 (Phase 7)
 *
 * Implements organization member management across all 8 canonical SaaS roles:
 * Owner, Admin, Legal, Compliance, Finance, Procurement, Analyst, Viewer.
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  UserPlus,
  UserCheck,
  UserX,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Building2,
  Lock,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { usePlatformLocale } from '../../lib/universalTranslator';
import { SaaSRole, OrganizationMember } from '../../types/saas';
import { teamService } from '../../services/teamService';
import { canRolePerform } from '../../security/rbacResolver';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CANONICAL_ROLES: readonly SaaSRole[] = [
  'Owner',
  'Admin',
  'Legal',
  'Compliance',
  'Finance',
  'Procurement',
  'Analyst',
  'Viewer',
];

const ROLE_COLORS: Record<SaaSRole, string> = {
  Owner: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Admin: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  Legal: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Compliance: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Finance: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Procurement: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Analyst: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Viewer: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { organization, currentRole } = useSaaS();
  const { isRtl } = usePlatformLocale();

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<SaaSRole>('Viewer');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const canManage = canRolePerform(currentRole, 'ADMIN');

  useEffect(() => {
    if (isOpen && organization) {
      loadMembers();
      setStatusMessage(null);
      setShowInviteForm(false);
    }
  }, [isOpen, organization]);

  function loadMembers() {
    if (!organization) return;
    let list = teamService.listMembers(organization.id);
    if (list.length === 0) {
      // Seed initial owner entry if empty
      const defaultOwner: OrganizationMember = {
        id: `mem_owner_${organization.id}`,
        organizationId: organization.id,
        userId: organization.ownerUserId,
        userEmail: 'owner@juristech.solutions',
        fullName: `${organization.name} Executive Owner`,
        role: 'Owner',
        status: 'ACTIVE',
        joinedAt: organization.createdAt,
      };
      list = [defaultOwner];
      teamService.saveMembers(organization.id, list);
    }
    setMembers(list);
  }

  if (!isOpen || !organization) return null;

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const res = teamService.inviteMember({
      organizationId: organization!.id,
      email: inviteEmail.trim(),
      role: inviteRole,
      fullName: inviteName.trim() || undefined,
      actorRole: currentRole,
    });

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setInviteEmail('');
      setInviteName('');
      setInviteRole('Viewer');
      setShowInviteForm(false);
      loadMembers();
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  }

  function handleToggleStatus(member: OrganizationMember) {
    let res;
    if (member.status === 'ACTIVE') {
      res = teamService.suspendMember({
        organizationId: organization!.id,
        memberId: member.id,
        actorRole: currentRole,
      });
    } else {
      res = teamService.activateMember({
        organizationId: organization!.id,
        memberId: member.id,
        actorRole: currentRole,
      });
    }

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      loadMembers();
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  }

  function handleChangeRole(memberId: string, newRole: SaaSRole) {
    const res = teamService.changeRole({
      organizationId: organization!.id,
      memberId,
      newRole,
      actorRole: currentRole,
    });

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      loadMembers();
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  }

  function handleRemove(memberId: string) {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من إزالة هذا العضو نهائياً؟' : 'Are you sure you want to remove this member?')) {
      return;
    }

    const res = teamService.removeMember({
      organizationId: organization!.id,
      memberId,
      actorRole: currentRole,
    });

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      loadMembers();
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isRtl ? 'إدارة أعضاء الفريق والصلاحيات' : 'Team Governance & RBAC Membership'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {organization.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRtl
                  ? 'نموذج الصلاحيات ذو الـ 8 أدوار المعيارية وحماية الحدود المؤسسية.'
                  : '8 Canonical SaaS Roles with privilege escalation protection and multi-tenant isolation.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
              statusMessage.isError
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {statusMessage.isError ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Top Controls: Invite button & Roster Count */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-semibold">
            {isRtl ? 'الأعضاء النشطون في المؤسسة:' : 'Active Members:'}{' '}
            <span className="text-cyan-400 font-mono font-bold">{members.length}</span> / {organization.seatLimit} {isRtl ? 'مقعد' : 'seats'}
          </div>

          {canManage ? (
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRtl ? 'دعوة عضو جديد' : 'Invite Member'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{isRtl ? 'صلاحيات القراءة فقط' : 'Read-only view'}</span>
            </div>
          )}
        </div>

        {/* Invite Member Drawer */}
        {showInviteForm && canManage && (
          <form
            onSubmit={handleInvite}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-700 space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>{isRtl ? 'إرسال دعوة انضمام للمؤسسة' : 'Send Team Invitation'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {isRtl ? 'البريد الإلكتروني المهني' : 'Work Email'}
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="lawyer@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {isRtl ? 'الاسم الكامل (اختياري)' : 'Full Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder={isRtl ? 'سارة المنصور' : 'Sarah Al-Mansoor'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {isRtl ? 'الدور والصلاحية (Role)' : 'Assigned Role'}
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as SaaSRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {CANONICAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {isRtl ? 'تأكيد وإرسال الدعوة' : 'Send Invite'}
              </button>
            </div>
          </form>
        )}

        {/* Members Roster Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                  <th className="p-3.5">{isRtl ? 'العضو' : 'Member'}</th>
                  <th className="p-3.5">{isRtl ? 'الدور (RBAC Role)' : 'Assigned Role'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                  {canManage && <th className="p-3.5 text-right">{isRtl ? 'الإجراءات' : 'Actions'}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {members.map((member) => {
                  const isOwner = member.role === 'Owner';
                  const isSelf = member.userEmail.toLowerCase() === 'owner@juristech.solutions';

                  return (
                    <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Email */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{member.fullName || member.userEmail}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{member.userEmail}</div>
                      </td>

                      {/* Role Dropdown / Badge */}
                      <td className="p-3.5">
                        {canManage && !isOwner ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value as SaaSRole)}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border ${ROLE_COLORS[member.role]} bg-slate-900 focus:outline-none`}
                          >
                            {CANONICAL_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold border ${ROLE_COLORS[member.role]}`}
                          >
                            {member.role}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            member.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {member.status === 'ACTIVE' ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>{isRtl ? 'نشط' : 'Active'}</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>{isRtl ? 'موقوف' : 'Suspended'}</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      {canManage && (
                        <td className="p-3.5 text-right">
                          {!isOwner && (
                            <div className="inline-flex items-center gap-2">
                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleStatus(member)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                  member.status === 'ACTIVE'
                                    ? 'text-rose-400 hover:bg-rose-500/10'
                                    : 'text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                                title={member.status === 'ACTIVE' ? 'Suspend access' : 'Activate access'}
                              >
                                {member.status === 'ACTIVE' ? (isRtl ? 'إيقاف' : 'Suspend') : isRtl ? 'تفعيل' : 'Activate'}
                              </button>

                              {/* Remove Member */}
                              <button
                                onClick={() => handleRemove(member.id)}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                {isRtl ? 'حذف' : 'Remove'}
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{isRtl ? 'جميع الصلاحيات خاضعة لقواعد تدقيق الأمان المعتمدة في مصفوفة RBAC.' : 'All permissions strictly enforced by the canonical RBAC matrix.'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
