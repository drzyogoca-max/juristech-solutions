import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, Zap, Key } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useTranslation } from 'react-i18next';
import { verifyAdminAccess, grantAdminAuth } from '../lib/adminGuard';

const OFFICIAL_ADMIN_EMAIL = 'drzyogo.ca@gmail.com';

export default function MasterAdminToolbar() {
  const { setRole, role, user } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const currentUserEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('juristech_user_email') : null);
  const isLocallyAuthed = verifyAdminAccess();
  const isOfficialAdmin = currentUserEmail === OFFICIAL_ADMIN_EMAIL || isLocallyAuthed || role === 'super-admin';

  // SECURITY ENFORCEMENT:
  // If the visitor is NOT logged in as drzyogo.ca@gmail.com and NOT authed with Chairman passcode,
  // do NOT render this toolbar at all! Keeps the window 100% invisible for regular visitors & other emails.
  if (!isOfficialAdmin) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/40 text-white py-2 px-4 text-xs z-[90]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-amber-300">
            {isRtl ? 'حالة النظام والصلاحيات:' : 'System Access Status:'}
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>SUPER ADMIN — drzyogo.ca@gmail.com (ALL ACCESS UNLOCKED)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{isRtl ? 'حساب الأدمن المعتمد — فتح كامل وتحميل مجاني 100%' : 'Official Admin Clearance Active — Unlimited Gratis Downloads'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
