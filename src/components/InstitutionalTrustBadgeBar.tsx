/**
 * src/components/InstitutionalTrustBadgeBar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Certified Sovereign Security & Institutional Trust Badges
 * Features clear, high-contrast statutory badges with icons and definitive titles.
 */

import React from 'react';
import { ShieldCheck, Scale, Lock, Globe, CheckCircle2 } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

export default function InstitutionalTrustBadgeBar() {
  const { l, isRtl } = usePlatformLocale();

  const badges = [
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgBorder: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/60',
      titleAr: 'توقيع إلكتروني مشفر SHA-256',
      titleEn: 'SHA-256 Cryptographic E-Seal',
      tagAr: 'معتمد دولياً',
      tagEn: 'Certified Seal',
    },
    {
      icon: Scale,
      iconColor: 'text-cyan-400',
      bgBorder: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-400/60',
      titleAr: 'معايير التحكيم الدولي ICC 2020',
      titleEn: 'ICC Paris 2020 Arbitration',
      tagAr: 'غرفة باريس وCRCICA',
      tagEn: 'ICC & CRCICA',
    },
    {
      icon: Lock,
      iconColor: 'text-amber-400',
      bgBorder: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400/60',
      titleAr: 'تشفير وحماية بنكية 256-bit SSL',
      titleEn: 'Bank-Grade 256-bit SSL',
      tagAr: 'حماية E2EE',
      tagEn: 'E2EE Shield',
    },
    {
      icon: Globe,
      iconColor: 'text-purple-400',
      bgBorder: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400/60',
      titleAr: 'مطابق لقوانين 15+ دولة وسيادة',
      titleEn: '15+ Sovereign Legal Frameworks',
      tagAr: 'الخليج ومصر والدولي',
      tagEn: 'GCC, EG & Global',
    },
  ];

  return (
    <div className="py-6 px-2 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${b.bgBorder} transition-all duration-200 shadow-lg flex items-center gap-3.5 bg-slate-900/80 backdrop-blur-md`}
            >
              <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${b.iconColor} shrink-0 shadow-inner`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {l(b.tagAr, b.tagEn)}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {l(b.titleAr, b.titleEn)}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
