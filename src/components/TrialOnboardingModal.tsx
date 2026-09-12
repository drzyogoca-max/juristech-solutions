/**
 * src/components/TrialOnboardingModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Lightweight Customer Trial Onboarding Wizard
 * Sprint 05 Phase 3B: Time-to-Value in < 60 Seconds
 *
 * Guiding flow:
 *  1. Welcome & 14-Day Free Trial Benefit Summary (5 queries/day, 2 contract drafts).
 *  2. Step 1: Select Primary Legal Jurisdiction (KSA, UAE, Egypt, Qatar, Jordan).
 *  3. Step 2: Select 1-Click Initial Legal Goal (Consultation, Contract, Dispute).
 *  4. Route to /ai-advisor with preloaded jurisdiction & prompt for explicit execution.
 *
 * CRITICAL QUOTA SAFETY:
 *  Preloads input and jurisdiction into /ai-advisor but DOES NOT automatically
 *  execute the query, ensuring zero unintentional quota consumption.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Scale,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Globe,
  X,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { conversionTracker } from '../growth/conversionTracker';

export interface TrialOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type OnboardingJurisdiction = 'SA' | 'AE' | 'EG' | 'QA' | 'JO';
export type OnboardingLegalGoal = 'consultation' | 'contract' | 'dispute';

export const ONBOARDING_JURISDICTIONS: Array<{
  code: OnboardingJurisdiction;
  nameAr: string;
  nameEn: string;
  flag: string;
  statuteAr: string;
  statuteEn: string;
}> = [
  {
    code: 'SA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    statuteAr: 'نظام المعاملات المدنية ونظام الشركات',
    statuteEn: 'Civil Transactions Law & Companies Law',
  },
  {
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    statuteAr: 'قانون المعاملات التجارية 50/2022 وتشريعات DIFC/ADGM',
    statuteEn: 'Commercial Law 50/2022 & DIFC/ADGM',
  },
  {
    code: 'EG',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    statuteAr: 'القانون المدني وقانون الشركات ومحاكم الاستثمار',
    statuteEn: 'Civil Code & Investment Judiciary',
  },
  {
    code: 'QA',
    nameAr: 'دولة قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    statuteAr: 'القانون المدني 22/2004 وغرفة QICCA للتحكيم',
    statuteEn: 'Civil Code 22/2004 & QICCA Arbitration',
  },
  {
    code: 'JO',
    nameAr: 'المملكة الأردنية الهاشمية',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    statuteAr: 'القانون المدني 43/1976 وقانون الشركات 22/1997',
    statuteEn: 'Civil Code 43/1976 & Companies Law',
  },
];

export const ONBOARDING_GOALS: Array<{
  id: OnboardingLegalGoal;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: typeof FileText;
  prompts: Record<OnboardingJurisdiction, { ar: string; en: string }>;
}> = [
  {
    id: 'consultation',
    titleAr: 'استشارة واستفسار نظامي',
    titleEn: 'Statutory Legal Consultation',
    descAr: 'التحقق من صحة المعاملات والاشتراطات النظامية المعمول بها',
    descEn: 'Verify statutory validity and regulatory requirements',
    icon: Scale,
    prompts: {
      SA: {
        ar: 'ما هي المتطلبات النظامية الأساسية لصحة نفاذ العقود والاتفاقيات التجارية في المملكة العربية السعودية وفق نظام المعاملات المدنية ونظام الشركات؟',
        en: 'What are the essential statutory requirements for enforceable commercial contracts under Saudi Civil Transactions Law?',
      },
      AE: {
        ar: 'ما هي الشروط والأركان القانونية لصحة المعاملات التجارية وتفادي النزاعات في دولة الإمارات وفق قانون المعاملات التجارية؟',
        en: 'What are the essential legal conditions for valid commercial transactions under UAE Commercial Law?',
      },
      EG: {
        ar: 'ما هي الضوابط القانونية الأساسية لإنشاء وإبرام العقود والاتفاقيات التجارية طبقاً للقانون المدني المصري؟',
        en: 'What are the core legal rules for forming commercial agreements under the Egyptian Civil Code?',
      },
      QA: {
        ar: 'ما هي الأحكام القانونية الأساسية لصحة نفاذ العقود والالتزامات التجارية في دولة قطر وفق القانون المدني؟',
        en: 'What are the statutory requirements for enforceable commercial contracts in Qatar under Civil Code 22/2004?',
      },
      JO: {
        ar: 'ما هي الأركان والشروط القانونية لإبرام العقود والاتفاقيات التجارية وصحتها وفق القانون المدني الأردني؟',
        en: 'What are the legal requisites for valid commercial contracts under the Jordanian Civil Code?',
      },
    },
  },
  {
    id: 'contract',
    titleAr: 'إرشادات صياغة العقود',
    titleEn: 'Contract Drafting Guidance',
    descAr: 'أفضل البنود لحماية الحقوق وسقف المسؤولية والتعويضات',
    descEn: 'Key clauses to limit liability and safeguard corporate interests',
    icon: FileText,
    prompts: {
      SA: {
        ar: 'ما هي البنود الجوهرية الواجب إدراجها في عقود تقديم الخدمات لحماية حقوق الشركة وتحديد سقف المسؤولية والشرط الجزائي في السعودية؟',
        en: 'What critical clauses should be included in a service contract to cap liability and enforce liquidated damages under Saudi law?',
      },
      AE: {
        ar: 'ما هي البنود الإلزامية في عقود الخدمات وحماية الملكية الفكرية وتحديد التعويضات في دولة الإمارات؟',
        en: 'What mandatory provisions are needed in UAE service agreements for IP protection and liability limitation?',
      },
      EG: {
        ar: 'ما هي البنود الأساسية الواجب تضمينها في عقود التوريد والخدمات للحد من مخاطر الإخلال بالالتزامات وتحديد الاختصاص في مصر؟',
        en: 'What clauses are recommended in Egyptian supply and service contracts to mitigate breach and clarify jurisdiction?',
      },
      QA: {
        ar: 'ما هي أفضل الممارسات لصياغة بنود تحديد المسؤولية والإنهاء في عقود الخدمات التجارية في دولة قطر؟',
        en: 'What are the best practices for drafting termination and liability limitation clauses under Qatari law?',
      },
      JO: {
        ar: 'ما هي البنود الحيوية لصياغة اتفاقية خدمات تجارية متكاملة تحد من النزاعات التعاقدية وفق القانون الأردني؟',
        en: 'What vital clauses are required in a commercial services agreement to prevent disputes under Jordanian law?',
      },
    },
  },
  {
    id: 'dispute',
    titleAr: 'فض النزاعات والتحكيم التجاري',
    titleEn: 'Dispute Resolution & Arbitration',
    descAr: 'صياغة شروط التحكيم والوساطة المعتمدة لتفادي التقاضي الطويل',
    descEn: 'Arbitration and amicable settlement clauses to avoid prolonged litigation',
    icon: AlertTriangle,
    prompts: {
      SA: {
        ar: 'ما هي آليات تسوية النزاعات التجارية والتحكيم المعتمدة وفق نظام التحكيم السعودي (مقر SCCA) واشتراطات صحة شرط التحكيم؟',
        en: 'What are the recognized commercial arbitration mechanisms and clause requirements under the Saudi Arbitration Law and SCCA rules?',
      },
      AE: {
        ar: 'ما هي إجراءات التحكيم التجاري المعتمدة في مراكز التحكيم الإماراتية (مثل DIAC) وشروط صحة بند التحكيم؟',
        en: 'What are the valid commercial arbitration requirements under UAE Federal Arbitration Law and DIAC rules?',
      },
      EG: {
        ar: 'ما هي إجراءات وقواعد التحكيم التجاري المعتمدة لتسوية منازعات العقود (مثل مركز القاهرة CRCICA) طبقاً للقانون المصري؟',
        en: 'What are the legal rules for commercial arbitration clauses under Egyptian Law No. 27/1994 and CRCICA rules?',
      },
      QA: {
        ar: 'ما هي اشتراطات صحة شرط التحكيم التجاري وآليات حل النزاعات وفق قانون التحكيم القطري ومحكمة QICCA؟',
        en: 'What makes an arbitration clause valid under Qatari Arbitration Law No. 2/2017 and QICCA rules?',
      },
      JO: {
        ar: 'ما هي ضوابط واشتراطات شرط التحكيم التجاري كبديل للتقاضي وفق قانون التحكيم الأردني؟',
        en: 'What are the statutory parameters for a binding commercial arbitration clause under the Jordanian Arbitration Law?',
      },
    },
  },
];

export default function TrialOnboardingModal({ isOpen, onClose }: TrialOnboardingModalProps) {
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<OnboardingJurisdiction>('SA');
  const [selectedGoal, setSelectedGoal] = useState<OnboardingLegalGoal>('consultation');

  if (!isOpen) return null;

  const handleCompleteAndNavigate = () => {
    // 1. Mark non-sensitive UX onboarding state
    try {
      localStorage.setItem('juristech_onboarding_completed', 'true');
    } catch {}

    // 2. Derive prompt for selected jurisdiction and goal
    const goalConfig = ONBOARDING_GOALS.find((g) => g.id === selectedGoal) || ONBOARDING_GOALS[0];
    const promptObj = goalConfig.prompts[selectedJurisdiction] || goalConfig.prompts['SA'];
    const promptText = isRtl ? promptObj.ar : promptObj.en;

    // 3. Optional analytics event
    try {
      conversionTracker.trackStage('AI_STARTED', { currentTier: 'free', featureContext: `Onboarding:${selectedJurisdiction}:${selectedGoal}` });
    } catch {}

    // 4. Close modal and navigate to /ai-advisor with preloaded values
    onClose();

    navigate('/ai-advisor', {
      state: {
        jurisdiction: selectedJurisdiction,
        prompt: promptText,
        fromOnboarding: true,
      },
    });
  };

  const currentGoalData = ONBOARDING_GOALS.find((g) => g.id === selectedGoal) || ONBOARDING_GOALS[0];
  const previewPrompt = isRtl
    ? currentGoalData.prompts[selectedJurisdiction]?.ar
    : currentGoalData.prompts[selectedJurisdiction]?.en;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          aria-label={l('إغلاق', 'Close')}
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip & Trial Benefits */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{l('فترة تقييم مجانية (14 يوماً)', '14-Day Free Evaluation Active')}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono">
              {l('5 استشارات AI يومياً', '5 Daily AI Queries')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
              {l('عقدين مدى الحياة', '2 Lifetime Contracts')}
            </span>
          </div>

          <h2 id="onboarding-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {l('مرحباً بك في منصة جوريستك للذكاء الاصطناعي السيادي', 'Welcome to JurisTech Sovereign Legal AI')}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {l(
              'ابدأ استشارتك القانونية الأولى خلال ثوانٍ. حدد ولايتك القضائية وموضوع اهتمامك لتجهيز التحليل القانوني المتخصص.',
              'Unlock your first legal analysis in seconds. Select your primary jurisdiction and legal goal to prepare your tailored advisory.'
            )}
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              step === 1 ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center font-mono">1</span>
            <span>{l('الولاية القضائية', 'Jurisdiction')}</span>
          </button>

          <span className="text-slate-600">→</span>

          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              step === 2 ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] flex items-center justify-center font-mono">2</span>
            <span>{l('الهدف القانوني الأولي', 'First Legal Goal')}</span>
          </button>
        </div>

        {/* STEP 1: Jurisdiction Selector */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {l('اختر الولاية القضائية الأساسية لشركتك:', 'Select Primary Legal Jurisdiction:')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ONBOARDING_JURISDICTIONS.map((j) => {
                const isSelected = selectedJurisdiction === j.code;
                return (
                  <button
                    key={j.code}
                    type="button"
                    onClick={() => setSelectedJurisdiction(j.code)}
                    className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl select-none shrink-0 mt-0.5">{j.flag}</span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-black truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                          {isRtl ? j.nameAr : j.nameEn}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                        {isRtl ? j.statuteAr : j.statuteEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>{l('التالي: تحديد الهدف القانوني', 'Next: Choose Legal Goal')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: First Legal Goal Selector & Pre-Seeded Prompt Preview */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {l('اختر المهمة القانونية الأولى للبدء بها:', 'Select Your First Legal Task:')}
            </label>

            <div className="space-y-2">
              {ONBOARDING_GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                const IconComponent = g.icon;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {isRtl ? g.titleAr : g.titleEn}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {isRtl ? g.descAr : g.descEn}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Prompt Preview Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                {l('معاينة السؤال الذي سيتم تجهيزه في المستشار القانوني:', 'Prepared Query Preview (Ready in Advisor):')}
              </span>
              <p className="text-slate-300 font-sans leading-relaxed text-xs">
                "{previewPrompt}"
              </p>
            </div>

            {/* Quota Safeguard Notice */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                {l(
                  'سيتم تجهيز الاستشارة دون خصم من رصيدك حتى تضغط «بدء التحليل» بنفسك.',
                  'The query will be preloaded without deducting your quota until you click "Start Analysis".'
                )}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                {l('السابق', 'Back')}
              </button>

              <button
                type="button"
                onClick={handleCompleteAndNavigate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{l('فتح المستشار وبدء الاستشارة (أقل من 30 ثانية) ⚡', 'Launch AI Advisor (Under 30s) ⚡')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{l('الخطة الحالية: تجربة مجانية', 'Active Tier: Free Trial')}</span>
          <span>{l('أدوات المؤسسات تتطلب ترقية لاحقة', 'Institutional Core requires upgrade')}</span>
        </div>
      </div>
    </div>
  );
}
