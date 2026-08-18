import { useTranslation } from 'react-i18next';
import { Upload, AlertTriangle, MessageSquare, Download, CheckCircle2, ArrowRight, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const steps = [
    {
      num: '01',
      titleAr: 'الرفع الذكي والتفريغ الآلي (OCR Engine)',
      titleEn: 'Smart Upload & Native OCR Extraction',
      descAr: 'ارفق عقودك بصيغ (PDF, DOCX, TXT) لتستخرج التقنية نصوص البنود بلغتها الأصلية 100% دون أي تحريف.',
      descEn: 'Attach contracts (PDF, DOCX, TXT) for multi-stage OCR extraction preserving 100% native language integrity.',
      icon: Upload,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    },
    {
      num: '02',
      titleAr: 'الفحص الحراري وتوليد الصياغات البديلة',
      titleEn: 'Heatmap Audit & Zero-Risk Redlines',
      descAr: 'يحلل الذكاء الاصطناعي مصفوفات المخاطر والالتزامات ويُصدر صياغات حامية بديلة موثقة بقوانين دولتك.',
      descEn: 'AI analyzes liability vectors and generates zero-risk statutory redline rewrites grounded in local codes.',
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
    },
    {
      num: '03',
      titleAr: 'غرفة التوافق الرقمي والختم التشفيري',
      titleEn: 'AI Compromise Room & Cryptographic E-Sign',
      descAr: 'حل النزاعات والبنود المتضاربة آلياً وتوقيع وثيقة التوافق المعتمدة بالختم الرقمي المشفر SHA-256.',
      descEn: 'Automated conflict mediation and certified digital sealing with cryptographic SHA-256 timestamps.',
      icon: MessageSquare,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400',
    },
    {
      num: '04',
      titleAr: 'التصدير المزدوج والاعتماد الرسمي',
      titleEn: 'Bilingual PDF/Word Export & Official Seals',
      descAr: 'تصدير وثائق العقود والاتفاقيات باللغتين العربية والإنجليزية الجاهزة للتنفيذ بمحاكم الاستثمار.',
      descEn: 'Export ready-to-execute bilingual contract agreements bearing official platform digital seals.',
      icon: Download,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    },
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{isRtl ? 'آلية العمل التفاعلية المعتمدة' : 'Interactive Platform Architecture'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'كيف تعمل منصة JurisTech Solutions؟' : 'How JurisTech Solutions Operates'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {isRtl
              ? 'رحلة متكاملة في 4 خطوات تحوّل العقود والنزاعات إلى اتفاقيات قانونية محصنة ومختومة رقمياً خلال ثوانٍ'
              : 'A seamless 4-step workflow converting complex contracts into digitally sealed, statutory-compliant agreements.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`bg-gradient-to-b ${step.color} p-6 rounded-3xl border space-y-4 shadow-xl relative flex flex-col justify-between hover:scale-102 transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-slate-600 dark:text-slate-400 opacity-60">{step.num}</span>
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">{isRtl ? step.titleAr : step.titleEn}</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                    {isRtl ? step.descAr : step.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-sans text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isRtl ? 'معالجة ذكية' : 'AI Processing'}</span>
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {isRtl ? (step.num === '01' ? 'تشخيص تشريعي' : step.num === '02' ? 'كشف الثغرات' : step.num === '03' ? 'صياغة وقائية' : 'أرشفة موثقة') : 'Statutory Aligned'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl font-sans">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isRtl ? 'جاهز لبدء فحص عقدك الآن؟' : 'Ready to Audit Your Contract Now?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                {isRtl ? 'استخرج البنود وحلل المخاطر مجاناً بدون الحاجة للتسجيل المسبق.' : 'Instantly extract clauses and check risks with zero pre-registration.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('trigger-concierge-chatbot', {
                detail: { message: isRtl ? 'أريد إجراء الفحص المجاني للعقد الأول ومطابقة ثغرات المسؤولية.' : 'I want to run a free contract audit and check for liability loopholes.' }
              }));
            }}
            aria-label={isRtl ? 'بدء الفحص السريع للعقد' : 'Start Quick Contract Audit'}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-98 shrink-0"
          >
            <span>{isRtl ? 'ابدأ الفحص الفوري للعقد' : 'Start Instant Contract Audit'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </section>
  );
}
