import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Shield, ShieldCheck, UserCheck, Key, Lock, CheckCircle2,
  AlertTriangle, X, Edit3, Globe, Sparkles, Cpu, Award, Zap
} from 'lucide-react';
import { rbacService, UserAccount, UserRole } from '../services/rbacService';
import { OFFICIAL_ADMIN_EMAILS } from '../lib/adminGuard';

interface RbacUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RbacUserManagementModal({ isOpen, onClose }: RbacUserManagementModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Client / Viewer');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'rules'>('rules');

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

  const ADMIN_RULES = [
    {
      id: 'rule-all-sites',
      titleAr: '1. السيادة والتحكم الشامل بكافة المواقع (All Websites & Domains Governance)',
      titleEn: '1. Universal Cross-Website Super Admin Access',
      descAr: 'يمتلك حساب السوبر أدمن (Dr. Mohammad Mustafa - drzyogo.ca@gmail.com) صلاحيات مطلقة وغير مقيدة على كافة نطاقات ومواقع المنصة (www.juristech.solutions، لوحات التحكم، وخدمات الـ API).',
      descEn: 'Super Admin holds unconditional access across all domains, sub-sites, APIs, and client portals with zero restrictions.',
      icon: Globe,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
    },
    {
      id: 'rule-gratis-ai',
      titleAr: '2. استخدام غير محدود لمحركات الذكاء الاصطناعي (Unlimited Google AI Pro & M&A)',
      titleEn: '2. Unlimited High-Tier AI & M&A Sovereign Engines',
      descAr: 'تخطي مجاني فوري لكافة جدران الدفع وتوليد لا نهائي لتقارير الاستحواذ M&A، المحاكاة القضائية، كشف التزوير والاحتيال، وتصدير ملفات Word و PDF.',
      descEn: 'Full bypass of all subscription paywalls with unlimited runs of Google Gemini Pro Ultra, M&A Intelligence, and litigation simulation.',
      icon: Cpu,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
    },
    {
      id: 'rule-billing-override',
      titleAr: '3. حوكمة المالية واعتماد إيصالات SWIFT و Binance Pay',
      titleEn: '3. SWIFT & Binance Pay Transaction Approval Authority',
      descAr: 'صلاحية اعتماد وتفعيل اشتراكات الشركات يدوياً، تمديد الفترات الزمنية، وإلغاء أو تعديل الفواتير الضريبية وسندات الصرف.',
      descEn: 'Authority to manually approve wire transfers, verify crypto hash receipts, extend licenses, and issue proforma invoices.',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 'rule-security-logs',
      titleAr: '4. سجلات التدقيق الجنائية ومسح الكاش العالمي (Audit Logs & Cache Purge)',
      titleEn: '4. Immutable Audit Logs & Production Cache Control',
      descAr: 'الوصول المباشر لسجلات الأمان بتشفير AES-256، رصد عناوين IP المشبوهة، وإجراء مسح كاش فوري وتحديث أرقام الإصدار بضغطة واحدة.',
      descEn: 'Direct access to tamper-proof forensic audit trails, IP blocking radar, and single-click global production cache purges.',
      icon: Lock,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isRtl ? 'قواعد وصلاحيات الأدمن وإدارة المستخدمين (Admin Rules & RBAC)' : 'Sovereign Admin Rules & Role-Based Access Control'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Super Admin Cleared
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'التحكم الشامل في قواعد النظام، صلاحيات المواقع، وحسابات المشتركين' : 'Universal rules governing all websites, services, and subscriber privileges'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isRtl ? 'قواعد الأدمن وحوكمة المواقع' : 'Admin Sovereign Rules & Multi-Site Matrix'}</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إدارة المستخدمين والأدوار' : 'User Accounts & Roles (RBAC)'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Admin Rules & Multi-Site Matrix */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-300">
                  {isRtl ? 'معلومات اعتماد السوبر أدمن المعتمد للمنظومة:' : 'Official Certified Super Admin Identity:'}
                </h4>
                <div className="text-xs text-slate-300 font-mono flex flex-wrap gap-2">
                  <span className="text-white font-bold">drzyogo.ca@gmail.com</span>
                  <span>|</span>
                  <span>juristech.solutions@outlook.com</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ADMIN_RULES.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div key={rule.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border ${rule.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-xs text-white">
                        {isRtl ? rule.titleAr : rule.titleEn}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isRtl ? rule.descAr : rule.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Users Roster Table */}
        {activeTab === 'users' && (
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
        )}

      </div>
    </div>
  );
}
