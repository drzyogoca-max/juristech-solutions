import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Forbidden403Page() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glowing Security Badge */}
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            HTTP 403 FORBIDDEN — RBAC GUARD ACTIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isRtl ? '403 محظور — الوصول مقتصر حصرياً على الإدارة' : '403 Forbidden — Admin Access Only'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {isRtl
              ? 'عذراً، هذه المنطقة واللوحة الإدارية مخصصة حصرياً لأصحاب صلاحيات الأدمن العليا (Admin Only). ليس لديك الصلاحيات الكافية للوصول لهذا المسار.'
              : 'Access Denied. You do not possess super administrator authorization to access this restricted route.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="font-bold text-red-400">Strict RBAC Authorization Guard</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {isRtl ? 'تم تسجيل محاولة الوصول لأغراض الحوكمة والأمان.' : 'Access attempt logged for audit and security compliance.'}
          </p>
        </div>

        {/* Redirect Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/admin"
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 font-black text-slate-950 text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>{isRtl ? 'تسجيل دخول الإدارة (Admin Login)' : 'Admin Passcode Login'}</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <span>{isRtl ? 'الرئيسية' : 'User Dashboard'}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
