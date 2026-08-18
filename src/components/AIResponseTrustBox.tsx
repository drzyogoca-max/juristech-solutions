import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AIResponseTrustBoxProps {
  sourceClause?: string;
  assumption?: string;
  confidenceLevel?: number;
  disclaimer?: string;
}

export const AIResponseTrustBox: React.FC<AIResponseTrustBoxProps> = ({
  sourceClause,
  assumption,
  confidenceLevel = 98,
  disclaimer,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const defaultClause = isRtl
    ? 'المادة 147/2 من القانون المدني ونظام المعاملات الإلكترونية واللوائح التجارية ذات الصلة.'
    : 'Civil Code Article 147/2 & Applicable Regional E-Commerce Decrees.';

  const defaultAssumption = isRtl
    ? 'سريان العقد وتوافقه مع اللوائح الإقليمية المعتمدة والمعايير القضائية للشركات.'
    : 'Contract validity under applicable corporate statutory frameworks and judicial standards.';

  const defaultDisclaimer = isRtl
    ? 'المعلومات المقدمة استرشادية فقط ولا تغني عن استشارة محامٍ مرخص.'
    : 'Provided for informational purposes only; does not constitute formal legal advice.';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-slate-50 dark:bg-slate-900/90 border-l-4 border-cyan-500 p-4 rounded-r-2xl my-4 text-sm font-sans shadow-md border border-slate-200 dark:border-slate-800 transition-all"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-cyan-500" />
        <span>{isRtl ? 'صندوق الشفافية والموثوقية القانونية (AI Trust & Transparency)' : 'AI Trust & Transparency Box'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5 text-cyan-500" />
            {isRtl ? 'البند المرجعي / المستند السند:' : 'Reference Statutory Clause:'}
          </span>
          <p className="text-slate-700 dark:text-slate-300 font-mono text-xs p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
            {sourceClause || defaultClause}
          </p>
        </div>

        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {isRtl ? 'الافتراض والأساس القانوني:' : 'Legal Assumption & Basis:'}
          </span>
          <p className="text-slate-700 dark:text-slate-300 text-xs p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
            {assumption || defaultAssumption}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 mt-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isRtl ? 'مستوى الثقة والموثوقية:' : 'AI Confidence Level:'}
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg font-black font-mono">
            {confidenceLevel}%
          </span>
        </div>

        <div className="text-slate-400 dark:text-slate-400 text-[11px] flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{disclaimer || defaultDisclaimer}</span>
        </div>
      </div>
    </div>
  );
};

export default AIResponseTrustBox;
