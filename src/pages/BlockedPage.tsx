import { useTranslation } from 'react-i18next';
import { ShieldAlert, Lock } from 'lucide-react';

export default function BlockedPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10 animate-pulse text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {isRtl ? 'عذراً، هذه المنصة غير متاح الوصول إليها من نطاقك الجغرافي الحالي.' : 'Access restricted in your region.'}
        </h1>

        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {isRtl
            ? 'نعتذر، الوصول لمنصة JurisTech Solutions محظور حالياً للزوار من النطاق الجغرافي المحدد (Country Code: LY) وفق السياسات المعتمدة.'
            : 'We apologize, access to JurisTech Solutions is restricted for visitors from Libya (Country Code: LY) in accordance with regional compliance policies.'}
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 font-mono">
          <Lock className="w-4 h-4 text-red-400" />
          <span>Status: 403 Forbidden (Geographic Restriction Active)</span>
        </div>
      </div>
    </main>
  );
}
