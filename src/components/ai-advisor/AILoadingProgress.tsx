import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Search, Shield, Scale, FileText } from 'lucide-react';
import type { SupportedAILang } from '../../ai/types';

interface AILoadingProgressProps {
  lang: SupportedAILang;
  taskMode: string;
}

export const AILoadingProgress: React.FC<AILoadingProgressProps> = ({
  lang,
  taskMode,
}) => {
  const isAr = lang === 'ar';
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      labelEn: 'Sanitizing input & checking privacy boundaries',
      labelAr: 'تنقية المدخلات وتطبيق ضوابط حماية الخصوصية',
      icon: Shield,
    },
    {
      labelEn: 'Classifying legal intent & planning specialist route',
      labelAr: 'تصنيف القصد القانوني وتخطيط مسار الوكيل المتخصص',
      icon: Scale,
    },
    {
      labelEn: 'Resolving governing jurisdiction & statutory baseline',
      labelAr: 'تحديد الولاية القضائية المعنية والأسس التشريعية',
      icon: Search,
    },
    {
      labelEn: 'Retrieving & ranking verified knowledge-base statutes',
      labelAr: 'استرجاع وترتيب النصوص التشريعية المعتمدة في قاعدة المعرفة',
      icon: FileText,
    },
    {
      labelEn: 'Evaluating response validator & hallucination guard',
      labelAr: 'فحص مصفوفة التحقق ومنع التوليد غير الموثق',
      icon: CheckCircle2,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        <span className="text-sm font-semibold text-white">
          {isAr ? 'جاري معالجة الاستشارة القانونية...' : 'Processing Legal Advisory...'}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all ${
                isDone
                  ? 'text-emerald-400 opacity-90'
                  : isCurrent
                  ? 'text-cyan-300 font-medium'
                  : 'text-slate-500 opacity-50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span>{isAr ? s.labelAr : s.labelEn}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
