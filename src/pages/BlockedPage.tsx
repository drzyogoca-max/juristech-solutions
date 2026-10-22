import { useTranslation } from 'react-i18next';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

export default function BlockedPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 border-2 border-red-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            COMPLIANCE FIREWALL 403
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {isRtl
              ? 'الوصول محظور من نطاقك الجغرافي الحالي'
              : 'Access Restricted From Your Current Region'}
          </h1>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {isRtl
            ? 'نعتذر، الوصول لمنصة JurisTech Solutions محظور بشكل كامل ونهائي للزوار من دولة ليبيا والدول الخاضعة للعقوبات الاقتصادية الدولية والقيود الإقليمية المعتمدة (بما يشمل: LY, SY, IR, KP, CU, RU, BY, SD) وذلك امتثالاً للمتطلبات التنظيمية وسياسات الامتثال الدولي.'
            : 'Access to JurisTech Solutions is strictly restricted for visitors from Libya and jurisdictions subject to international economic sanctions and regulatory compliance mandates (including LY, SY, IR, KP, CU, RU, BY, SD) in accordance with global compliance frameworks.'}
        </p>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 font-mono">
          <Lock className="w-4 h-4 text-red-500" />
          <span>Status: 403 Forbidden (Sanctions & Regional Geofence Enforced)</span>
        </div>
      </div>
    </main>
  );
}
