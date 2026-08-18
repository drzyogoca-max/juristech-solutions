import { useTranslation } from 'react-i18next';
import { Loader2, Sparkles, Shield, Cpu, FileText } from 'lucide-react';

interface SkeletonProps {
  stage?: string;
}

export default function ContractAnalysisSkeleton({ stage }: SkeletonProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-pulse font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Stage */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>{stage || (isRtl ? 'عقل الذكاء الاصطناعي يعمل الآن' : 'AI Neural Engine Processing')}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {isRtl ? 'جاري تحليل بنود العقد والامتثال التشريعي...' : 'Auditing Contract Provisions & Governing Statutory Compliance...'}
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono">
          Sub-second Processing Pipeline
        </span>
      </div>

      {/* Animated Skeleton Lines */}
      <div className="space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-800/70 rounded-xl w-full animate-pulse" />
        <div className="h-4 bg-slate-800/70 rounded-xl w-5/6 animate-pulse" />
        <div className="h-4 bg-slate-800/70 rounded-xl w-4/6 animate-pulse" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
          <div className="h-3 bg-slate-850 rounded-lg w-full" />
          <div className="h-3 bg-slate-850 rounded-lg w-3/4" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
          <div className="h-3 bg-slate-850 rounded-lg w-full" />
          <div className="h-3 bg-slate-850 rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  );
}
