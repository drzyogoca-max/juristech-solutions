/**
 * src/components/InteractiveCustomerJourneyMap.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive Sovereign Customer Journey Map for JurisTech Solutions v2026
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  Sparkles,
  BookOpen,
  ShieldAlert,
  Handshake,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  TrendingUp,
  Scale,
  Cpu,
  FileCheck,
  ChevronRight,
  Globe2,
  Award,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface JourneyStep {
  stepNumber: number;
  id: string;
  icon: React.ElementType;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  metricAr: string;
  metricEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  targetRoute: string;
  badgeColor: string;
  accentGradient: string;
}

export default function InteractiveCustomerJourneyMap() {
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps: JourneyStep[] = [
    {
      stepNumber: 1,
      id: 'vault-crypto',
      icon: Lock,
      titleAr: '1. الإيداع والتشفير السيادي (Zero-Knowledge Ingestion)',
      titleEn: '1. Zero-Knowledge Cryptographic Vault Ingestion',
      subtitleAr: 'تشفير AES-GCM-256 محلي مع توليد بصمة SHA-256 وشهادة عدم التلاعب',
      subtitleEn: 'Client-side AES-GCM-256 encryption with verifiable SHA-256 tamper-proof seals',
      descriptionAr: 'يتم تشفير أي مستند أو عقد يرفعه العميل محلياً في متصفحه قبل إرساله، مع استخراج بصمته الرقمية SHA-256 وإصدار شهادة سلامة مستندية معتمدة تثبت عدم تعرضه للتعديل.',
      descriptionEn: 'Contracts are encrypted client-side via military-grade AES-GCM-256, generating a certified SHA-256 mathematical fingerprint and downloadable Certificate of Integrity.',
      featuresAr: [
        'تشفير وفك تشفير محلي 100% بدون إمكانية وصول السيرفر لمفتاحك الخاص',
        'توليد شهادات أمان وبصمات غير قابلة للتزوير مقبولة أمام المحاكم والتحكيم',
        'مختبر فحص جنائي فوري للتحقق من سلامة أي مستند بمجرد لصقه'
      ],
      featuresEn: [
        '100% Client-side zero-knowledge encryption preventing server-side leakage',
        'Court-admissible SHA-256 certificates of integrity & non-tampering',
        'Instant forensic hash laboratory to verify document authenticity'
      ],
      metricAr: 'أمان عسكري EAL6+ بمفاتيح PBKDF2',
      metricEn: 'Military-Grade EAL6+ Security',
      ctaTextAr: 'فتح الخزنة المشفرة',
      ctaTextEn: 'Open Encrypted Vault',
      targetRoute: '/vault',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      accentGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    },
    {
      stepNumber: 2,
      id: 'statutory-risk-radar',
      icon: ShieldAlert,
      titleAr: '2. الفحص التشريعي المعمق عبر المحاور الـ 8 (Deep Risk Radar)',
      titleEn: '2. Deep 8-Axis Statutory Risk Radar',
      subtitleAr: 'فحص سقف المسؤوليات المالية، البنود التعسفية، ومطابقة ICC 2020',
      subtitleEn: 'Liability capping audit, abusive clause detection & ICC 2020 compliance',
      descriptionAr: 'تحليل دقيق لبنود العقد عبر 8 محاور تشريعية تفصيلية تكشف فخاخ المسؤولية غير المحدودة، غرامات التأخير الباطلة، وثغرات الملكية الفكرية بموجب القوانين النافذة.',
      descriptionEn: 'Deep statutory audit evaluating agreements across 8 rigorous axes to isolate uncapped liabilities, punitive delay penalties, and hidden IP ownership traps.',
      featuresAr: [
        'فحص إلزامي لسقف المسؤولية المالية والأضرار التبعية (Consequential Damages)',
        'كشف بنود الإذعان والفسخ الانفرادي (م/149 مدني مصري، م/98 مدني سعودي)',
        'مواءمة شروط القوة القاهرة والظروف الطارئة وفق معايير ICC Paris 2020'
      ],
      featuresEn: [
        'Mandatory liability capping & indirect consequential damages audit',
        'Detection of unilateral adhesion & unfair termination clauses',
        'Strict harmonization with ICC Paris 2020 Force Majeure standards'
      ],
      metricAr: 'فحص شامل بـ 8 محاور تشريعية دقيقة',
      metricEn: 'Exhaustive 8-Axis Statutory Audit',
      ctaTextAr: 'بدء فحص المخاطر 8-Axis',
      ctaTextEn: 'Launch 8-Axis Risk Radar',
      targetRoute: '/risk',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      accentGradient: 'from-amber-400 via-orange-500 to-yellow-600',
    },
    {
      stepNumber: 3,
      id: 'executive-drafting',
      icon: FileText,
      titleAr: '3. استوديو الصياغة والبدائل الحمائية (Executive Redlining)',
      titleEn: '3. Executive Redlines & Full Drafting Studio',
      subtitleAr: 'توليد عقود متكاملة وصياغات بديلة جاهزة للتفاوض الفوري',
      subtitleEn: 'Instant enforceable contract generation & executive protective redlines',
      descriptionAr: 'توليد عقود قانونية متكاملة لجميع المجالات التجارية (بيع مركبات، إيجار، عمل، NDA، توريد، برمجيات، شراكة، ديون) مع صياغات بديلة تحمي مصالحك بنسبة 100%.',
      descriptionEn: 'Generate enforceable multi-jurisdiction contracts across 10 commercial categories, equipped with protective executive counter-clauses ready for instant execution.',
      featuresAr: [
        'مكتبة عقود شاملة ومطابقة للقوانين المصرية والخليجية والدولية',
        'صياغة بنود بديلة رادعة (Executive AI Redlines) قابلة للاقتباس والدمج المباشر',
        'محرر تفاعلي لتعديل الشروط الخاصة والغرامات والتحكيم بضغطة زر'
      ],
      featuresEn: [
        'Complete enforceable contracts library compliant with regional & global codes',
        'Protective executive AI redlines ready for immediate contract addendums',
        'Interactive studio for dynamic clause reformulation & dispute clauses'
      ],
      metricAr: '10 قطاعات تعاقدية متكاملة',
      metricEn: '10 Comprehensive Contract Suites',
      ctaTextAr: 'فتح استوديو العقود',
      ctaTextEn: 'Launch Drafting Studio',
      targetRoute: '/contracts',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      accentGradient: 'from-cyan-400 via-sky-500 to-indigo-600',
    },
    {
      stepNumber: 4,
      id: 'negotiation-copilot',
      icon: Handshake,
      titleAr: '4. مساعد التفاوض وحسم المنازعات (Negotiation Copilot)',
      titleEn: '4. AI Negotiation Copilot & Strategy Room',
      subtitleAr: 'حساب قوة الموقف التفاوضي وتوليد العروض المقابلة التكتيكية',
      subtitleEn: 'Leverage scoring, tactical counter-offers & settlement mediation',
      descriptionAr: 'محاكاة استراتيجية لموقف الطرف الآخر، مع حساب مؤشر القوة التفاوضية واقتراح حلول وسطى تحافظ على أرباحك وتغلق الصفقة بأعلى حماية تشريعية.',
      descriptionEn: 'Simulate counter-party positions, quantify leverage scores, and formulate tactically engineered counter-proposals that accelerate deal closing.',
      featuresAr: [
        'محاكي العروض المقابلة (Counter-Offer Simulator) لتسريع التوافق',
        'حساب درجة النفوذ والقوة التفاوضية (Leverage Score) بالأرقام',
        'خارطة طريق لتسوية المنازعات الودية قبل التصعيد القضائي'
      ],
      featuresEn: [
        'Tactical Counter-Offer Simulator accelerating consensus',
        'Quantified negotiation leverage & deal power scoring',
        'Pre-litigation alternative dispute resolution (ADR) roadmaps'
      ],
      metricAr: 'تسريع إغلاق الصفقات بنسبة 75%',
      metricEn: '75% Faster Deal Closing',
      ctaTextAr: 'غرفة التفاوض الذكي',
      ctaTextEn: 'Enter Negotiation Room',
      targetRoute: '/negotiation',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      accentGradient: 'from-purple-400 via-violet-500 to-indigo-600',
    },
    {
      stepNumber: 5,
      id: 'execution-notarization',
      icon: FileCheck,
      titleAr: '5. التوقيع الإلكتروني والتوثيق الرسمي (E-Sign & Registry)',
      titleEn: '5. Certified Execution & Notarization Roadmap',
      subtitleAr: 'توقيع رقمي معتمد ودليل إجرائي للشهر العقاري والمرور والغرف التجارية',
      subtitleEn: 'Digital signature pad with official procedural roadmaps & notarization guides',
      descriptionAr: 'توقيع المستندات إلكترونياً مع توفير دليل إجرائي خطوة بخطوة للتوثيق لدى مكاتب الشهر العقاري، إدارات المرور، ومنصات إيجار والغرف التجارية لتفادي أي بطلان.',
      descriptionEn: 'Execute agreements via compliant e-signatures with complete statutory roadmaps for notarization before real estate registries, traffic departments, and commercial chambers.',
      featuresAr: [
        'لوحة توقيع إلكتروني E-Signature مدعومة بأختام التوثيق الرقمية',
        'دليل المستندات والرسوم والجهات الحكومية المختصة لإنهاء الإجراءات',
        'تصدير فوري بصيغ PDF و Word عالية الدقة جاهزة للطباعة والتوقيع'
      ],
      featuresEn: [
        'Compliant e-signature pad with cryptographic tamper-evident seals',
        'Step-by-step procedural roadmap for public notary & commercial registry',
        'Multi-format export (PDF, Word) formatted for immediate official stamping'
      ],
      metricAr: 'جاهزية قانونية وإجرائية 100%',
      metricEn: '100% Statutory Execution Readiness',
      ctaTextAr: 'مستودع العقود والتوثيق',
      ctaTextEn: 'View Verified Repository',
      targetRoute: '/repository',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      accentGradient: 'from-blue-400 via-indigo-500 to-sky-600',
    },
    {
      stepNumber: 6,
      id: 'ma-war-room',
      icon: Building2,
      titleAr: '6. صفقات الاندماج وحوكمة الشركات (Enterprise M&A Hub)',
      titleEn: '6. Enterprise M&A & Corporate Governance Hub',
      subtitleAr: 'فحص نافٍ للجهالة، تقييم صفقات الاستحواذ، وحوكمة تأسيس الشركات',
      subtitleEn: 'Comprehensive M&A due diligence, EBITDA deal valuation & incorporation',
      descriptionAr: 'منظومة متكاملة لخدمة الصفقات الكبرى تشمل الفحص النافي للجهالة، ومطابقة قوانين حماية المنافسة ومنع الاحتكار، وحساب مضاعفات EBITDA لتأسيس وهيكلة الكيانات الكبرى.',
      descriptionEn: 'Full-suite institutional M&A engine conducting deep due diligence, EBITDA valuation modeling, antitrust merger control checks, and global corporate incorporation.',
      featuresAr: [
        'فحص نافٍ للجهالة قانوني ومالي شامل لمستندات الاستحواذ',
        'مرشد تأسيس وحوكمة الشركات (مصر، السعودية، الإمارات، قطر، ديلاوير، بريطانيا)',
        'فحص إخطار أجهزة حماية المنافسة والاندماج الاقتصادي'
      ],
      featuresEn: [
        'Comprehensive legal & financial due diligence audit suite',
        'Multi-jurisdiction corporate formation wizard (Egypt, GCC, Delaware, UK)',
        'Antitrust merger control & competition authority clearance auditor'
      ],
      metricAr: 'جاهزية لصفقات تتجاوز $100M+',
      metricEn: '$100M+ Deal Architecture',
      ctaTextAr: 'منصة الاستحواذ M&A',
      ctaTextEn: 'Open M&A Platform',
      targetRoute: '/acquisition',
      badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
      accentGradient: 'from-rose-400 via-pink-500 to-amber-500',
    },
  ];

  const activeStep = steps[activeStepIndex];

  return (
    <div className="relative w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>{l('الخريطة التفاعلية السيادية لرحلة العميل 2026', 'Interactive Sovereign Customer Journey Map 2026')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {l('كيف تحول JurisTech أوراقك إلى حصن قانوني وتجاري متكامل؟', 'How JurisTech Transforms Your Contracts into Fortress-Grade Assets')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {l(
            'مسار هندسي متسلسل وواضح من 6 مراحل يأخذ بيدك من لحظة إيداع وتشفير المستند حتى التدقيق، والتفاوض، والتوثيق والاعتماد المؤسسي.',
            'A seamless 6-stage interactive transformation pathway from cryptographic deposit to 8-axis risk audit, redlining, negotiation, and official execution.'
          )}
        </p>
      </div>

      {/* Step Selector Tabs (Desktop / Mobile Horizontal Scroll) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 rounded-2xl border transition-all text-start flex flex-col justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-102 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                  isActive ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step.stepNumber}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <span className={`text-xs font-bold truncate block ${isActive ? 'text-white font-black' : 'text-slate-400'}`}>
                {isRtl ? step.titleAr.split('(')[0] : step.titleEn.split('(')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${activeStep.badgeColor}`}>
                {isRtl ? `المرحلة رقم ${activeStep.stepNumber}` : `Stage ${activeStep.stepNumber}`}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {isRtl ? activeStep.metricAr : activeStep.metricEn}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? activeStep.titleAr : activeStep.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium">
              {isRtl ? activeStep.subtitleAr : activeStep.subtitleEn}
            </p>
          </div>

          <button
            onClick={() => navigate(activeStep.targetRoute)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-xl shadow-cyan-500/20 cursor-pointer shrink-0"
          >
            <span>{isRtl ? activeStep.ctaTextAr : activeStep.ctaTextEn}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isRtl ? activeStep.descriptionAr : activeStep.descriptionEn}
        </p>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(isRtl ? activeStep.featuresAr : activeStep.featuresEn).map((feat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200 leading-relaxed font-sans">{feat}</span>
            </div>
          ))}
        </div>

        {/* Navigation Step Arrows */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{l('المرحلة السابقة', 'Previous Stage')}</span>
          </button>

          <span className="text-slate-500 font-mono">
            {activeStepIndex + 1} / {steps.length}
          </span>

          <button
            onClick={() => setActiveStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
          >
            <span>{l('المرحلة التالية', 'Next Stage')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
