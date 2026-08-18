import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, Lock, Scale, CheckCircle2, Globe, FileCheck2 } from 'lucide-react';

export default function InstitutionalTrustBadgeBar() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const badges = [
    {
      icon: ShieldCheck,
      titleAr: 'توقيع إلكتروني مشفر SHA-256',
      titleEn: 'SHA-256 Cryptographic E-Seal',
      subtitleAr: 'معتمد دولياً وبنص المادة 223 مدني',
      subtitleEn: 'UNCITRAL Model Law Compliant',
    },
    {
      icon: Scale,
      titleAr: 'موافق لمعايير التحكيم الدولي ICC 2020',
      titleEn: 'ICC Paris 2020 Arbitration Standards',
      subtitleAr: 'مركز CRCICA و SCCA معتمد',
      subtitleEn: 'CRCICA & SCCA Tribunal Certified',
    },
    {
      icon: Lock,
      titleAr: 'حماية وتشفير عالي 256-bit SSL',
      titleEn: 'Bank-Grade 256-bit SSL Protection',
      subtitleAr: 'خزنة سيادية مشفرة بالكامل',
      subtitleEn: 'Zero Data Leak Guarantee',
    },
    {
      icon: Globe,
      titleAr: 'مطابق لقوانين 15+ دولة',
      titleEn: '15+ Sovereign Jurisdiction Codes',
      subtitleAr: 'الخليج ومصر والاتحاد الأوروبي',
      subtitleEn: 'GCC, EU GDPR, UK & US Civil Codes',
    },
  ];

  return (
    <div className="bg-slate-900/90 border-y border-slate-200 dark:border-slate-800 py-6 px-4 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 hover:border-cyan-500/30 transition-all shadow-lg group"
            >
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                  {isRtl ? b.titleAr : b.titleEn}
                </h4>
                <p className="text-[11px] text-slate-300 font-sans truncate font-medium">
                  {isRtl ? b.subtitleAr : b.subtitleEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
