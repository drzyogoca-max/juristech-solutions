import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck, DollarSign, BarChart3, ShieldAlert, Edit3, FileText, Lock, Sparkles
} from 'lucide-react';

import { useAuth } from '../lib/authContext';
import { verifyAdminAccess } from '../lib/adminGuard';

const OFFICIAL_ADMIN_EMAIL = 'drzyogo.ca@gmail.com';

export default function AdminNavSubbar() {
  const { i18n } = useTranslation();
  const { role, user, isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';
  const location = useLocation();

  const currentUserEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('juristech_user_email') : null);
  const isLocallyAuthed = verifyAdminAccess();
  const isOfficialAdmin = currentUserEmail === OFFICIAL_ADMIN_EMAIL || isLocallyAuthed || isAdmin || role === 'super-admin';

  // STRICT ISOLATION: Hide completely for regular customers/subscribers
  if (!isOfficialAdmin) {
    return null;
  }


  const adminTabs = [
    {
      to: '/admin',
      labelAr: 'خزينة الإدارة العامة',
      labelEn: 'Chairman Vault',
      icon: ShieldCheck,
      color: 'text-amber-400',
    },
    {
      to: '/admin/financial',
      labelAr: 'لوحة الإدارة والمالية',
      labelEn: 'Financial & Billing',
      icon: DollarSign,
      color: 'text-cyan-400',
    },
    {
      to: '/admin/receipt-review',
      labelAr: 'فحص الإيصالات البنكية (SWIFT Audit)',
      labelEn: 'SWIFT Bank Receipt Audit',
      icon: FileText,
      color: 'text-purple-400',
    },
    {
      to: '/admin/analytics',
      labelAr: 'التحليلات الجغرافية',
      labelEn: 'Geo-Analytics',
      icon: BarChart3,
      color: 'text-emerald-400',
    },
    {
      to: '/admin/anti-fraud',
      labelAr: 'مدقق الاحتيال المالي',
      labelEn: 'Anti-Fraud Auditor',
      icon: ShieldAlert,
      color: 'text-red-400',
    },
    {
      to: '/admin/review-queue',
      labelAr: 'طابور المراجعة وإدارة الحالات',
      labelEn: 'Review Queue & Automation',
      icon: Edit3,
      color: 'text-indigo-400',
    },
    {
      to: '/admin/checklist',
      labelAr: 'قائمة الجودة والاختبارات ✅',
      labelEn: 'Release CheckList QA ✅',
      icon: Sparkles,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/30 sticky top-14 z-30 shadow-lg" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider hidden sm:inline">
            {isRtl ? 'بوابة الإدارة العليا' : 'ADMIN CONTROL HUB'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.to;

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-amber-500/50 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
