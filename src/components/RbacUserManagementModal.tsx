import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Shield, ShieldCheck, UserCheck, Key, Lock, CheckCircle2, AlertTriangle, X, Edit3 } from 'lucide-react';
import { rbacService, UserAccount, UserRole } from '../services/rbacService';

interface RbacUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RbacUserManagementModal({ isOpen, onClose }: RbacUserManagementModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Client / Viewer');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsers(rbacService.getUsers());
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await rbacService.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(rbacService.getUsers());
        setSuccessMsg(isRtl ? `تم تحديث صلاحية المستخدم بنجاح إلى (${newRole})` : res.message);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isRtl ? 'إدارة المستخدمين والأدوار والصلاحيات (RBAC)' : 'Role-Based Access Control (RBAC) Management'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'إدارة الأدوار والتأكد من تفعيل 2FA لكافة الحسابات الإدارية' : 'Manage user roles and 2FA authentication state'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Users Roster Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {isRtl ? 'سجل الحسابات والأدوار المعتمدة' : 'Registered User Accounts'}
          </h4>

          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{u.fullName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      u.role === 'Super Admin' || u.role === 'Admin'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : u.role === 'Lawyer'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>{u.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      {u.is_two_factor_enabled ? (isRtl ? '2FA مفعّل' : '2FA Active') : (isRtl ? '2FA غير مفعّل' : 'No 2FA')}
                    </span>
                  </div>
                </div>

                {/* Role Modifier Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    disabled={loading || u.role === 'Super Admin'}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Client / Viewer">Client / Viewer</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
