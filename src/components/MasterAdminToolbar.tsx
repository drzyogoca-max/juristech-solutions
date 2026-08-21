import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Settings, Users, LogOut } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { verifyAdminAccess, isAuthorizedAdminEmail } from '../lib/adminGuard';
import RbacUserManagementModal from './RbacUserManagementModal';

export default function MasterAdminToolbar() {
  const { user, isAdmin, is2FAVerified, logoutAdmin } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [showRbac, setShowRbac] = useState(false);

  // STRICT ISOLATION GUARD:
  // Must be verified admin with active session (never render for guest / unauthenticated visits)
  const isSessionAuthed = verifyAdminAccess();
  const isSupabaseAdmin = user && isAuthorizedAdminEmail(user?.email);
  const isVerifiedAdmin = isAdmin && (isSessionAuthed || (isSupabaseAdmin && is2FAVerified));

  if (!isVerifiedAdmin) {
    return null;
  }

  const displayEmail = user?.email || (typeof window !== 'undefined' ? sessionStorage.getItem('juristech_admin_email') : null) || 'drzyogo.ca@gmail.com';

  return (
    <>
      <RbacUserManagementModal isOpen={showRbac} onClose={() => setShowRbac(false)} />
      <div className="w-full bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/40 text-white py-2 px-4 text-xs z-[90]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2 font-mono flex-wrap">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-amber-300">
              {isRtl ? 'صلاحيات الإدارة السيادية الكاملة:' : 'Sovereign Super Admin Privileges:'}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>SUPER ADMIN — {displayEmail} (ACTIVE AUTH)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Action: Open Admin Rules & RBAC */}
            <button
              onClick={() => setShowRbac(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-500/40 font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Users className="w-3 h-3 text-indigo-400" />
              <span>{isRtl ? 'قواعد وصلاحيات الأدمن (RBAC)' : 'Admin Rules & RBAC'}</span>
            </button>

            {/* Quick Action: Open Master Admin Dashboard */}
            <Link
              to="/admin"
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1 transition-all shadow cursor-pointer"
            >
              <Settings className="w-3 h-3 text-slate-950" />
              <span>{isRtl ? 'لوحة التحكم المركزية' : 'Admin Control Panel'}</span>
            </Link>

            {/* Logout Admin Session */}
            <button
              onClick={logoutAdmin}
              className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold flex items-center gap-1 transition-all cursor-pointer"
              title={isRtl ? 'إنهاء جلسة الأدمن وقفل اللوحة' : 'Lock & End Admin Session'}
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>{isRtl ? 'قفل الجلسة' : 'Lock'}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
