import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  Layers,
  Check,
  Globe
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

interface JurisdictionPreset {
  code: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  lawsAr: string;
  lawsEn: string;
}

export default function InteractiveCustomerJourneyMap() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('GLOBAL');

  const jurisdictions: JurisdictionPreset[] = [
    {
      code: 'GLOBAL',
      flag: '🌐',
      nameAr: 'المعايير الدولية (Global Standards)',
      nameEn: 'International Standards (UNCITRAL / ICC Paris)',
      lawsAr: 'اتفاقية الأمم المتحدة (CISG 1980)، قانون الأونسيترال النموذجي، وقواعد غرفة التجارة الدولية (ICC Paris Incoterms 2020)',
      lawsEn: 'UN CISG 1980, UNCITRAL Model Law, & ICC Paris Incoterms 2020',
    },
    {
      code: 'JO',
      flag: '🇯🇴',
      nameAr: 'المملكة الأردنية الهاشمية',
      nameEn: 'Hashemite Kingdom of Jordan',
      lawsAr: 'قانون التجارة الأردني رقم 12، القانون المدني الأردني رقم 43، وتعديلات 2026',
      lawsEn: 'Jordanian Commercial Code No. 12 & Civil Code No. 43 (Updated 2026)',
    },
    {
      code: 'SA',
      flag: '🇸🇦',
      nameAr: 'المملكة العربية السعودية',
      nameEn: 'Kingdom of Saudi Arabia',
      lawsAr: 'نظام المعاملات المدنية السعودي (م/191)، نظام الشركات الجديد (مرسوم ملكي م/132)، ونظام العمل والتجارة الإلكترونية',
      lawsEn: 'Saudi Civil Transactions Law (M/191) & New Companies Law (M/132)',
    },
    {
      code: 'AE',
      flag: '🇦🇪',
      nameAr: 'الإمارات العربية المتحدة',
      nameEn: 'United Arab Emirates',
      lawsAr: 'مرسوم بقانون اتحادي بشأن المعاملات المدنية، قانون الشركات التجارية الاتحادي، وقواعد محاكم دبي المالية DIFC / ADGM',
      lawsEn: 'UAE Commercial Transactions Law & DIFC / ADGM Courts Jurisdiction',
    },
    {
      code: 'QA',
      flag: '🇶🇦',
      nameAr: 'دولة قطر',
      nameEn: 'State of Qatar',
      lawsAr: 'القانون المدني القطري رقم 22 لسنة 2004 وقوانين مركز قطر للمال QFC',
      lawsEn: 'Qatari Civil Code No. 22 & Qatar Financial Centre (QFC) Regulations',
    },
    {
      code: 'EG',
      flag: '🇪🇬',
      nameAr: 'جمهورية مصر العربية',
      nameEn: 'Arab Republic of Egypt',
      lawsAr: 'القانون المدني المصري رقم 131، قانون التجارة رقم 17، وتعديلات الهيئة العامة للاستثمار GAFI',
      lawsEn: 'Egyptian Civil Code No. 131 & GAFI Investment Law Regulations',
    },
    {
      code: 'US',
      flag: '🇺🇸',
      nameAr: 'الولايات المتحدة (US Federal & Delaware)',
      nameEn: 'United States (Federal & Delaware Commercial Code)',
      lawsAr: 'قانون التجارة الموحد الأمريكي (UCC)، قوانين ولاية دلاوير للشركات Delaware General Corporation Law (DGCL)',
      lawsEn: 'Uniform Commercial Code (UCC) & Delaware General Corporation Law (DGCL)',
    },
  ];

  const activeJurisdictionObj = jurisdictions.find((j) => j.code === selectedJurisdiction) || jurisdictions[0];

  const steps: JourneyStep[] = [
    {
      stepNumber: 1,
      id: 'diagnosis',
      icon: Sparkles,
      titleAr: '1. الاستشارة والتشخيص الذكي الفوري (AI Legal Discovery)',
      titleEn: '1. AI Legal Diagnosis & Discovery',
      subtitleAr: 'مستشار تشريعي فوري معزز بمحركات المعرفة القانونية',
      subtitleEn: 'Instant statutory legal counsel powered by specialized legal reasoning',
      descriptionAr: 'اطرح أي استفسار قانوني أو أرفق مستنداتك مباشرة للمستشار الذكي ليقوم بتحديد الولاية القضائية والقوانين الحاكمة بدقة وتأصيل مباشر.',
      descriptionEn: 'Submit complex legal queries or attach draft documents to the live AI Concierge for instant statutory classification and jurisdiction alignment.',
      featuresAr: [
        'تحليل فوري عبر اختصاصات تشريعية متعددة (الأردن، السعودية، الإمارات، مصر، دولياً)',
        'استيعاب دقيق للمستندات المتعددة (PDF, DOCX, TXT) خلال ثوانٍ',
        'تأصيل قانوني مباشر من أمهات الأنظمة واللوائح والقرارات السارية'
      ],
      featuresEn: [
        'Instant multi-jurisdiction mapping across regional & international codes',
        'Accurate document processing (PDF, DOCX, TXT) in seconds',
        'Direct citation of applicable statutory codes & commercial precedents'
      ],
      metricAr: 'استجابة وتحليل فوري خلال ثوانٍ',
      metricEn: 'Instant Real-time AI Analysis',
      ctaTextAr: 'بدء الاستشارة الفورية',
      ctaTextEn: 'Start Live AI Counsel',
      targetRoute: '/chat',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      accentGradient: 'from-cyan-500 to-blue-600',
    },
    {
      stepNumber: 2,
      id: 'contracts',
      icon: BookOpen,
      titleAr: '2. مستودع العقود المليوني واستوديو الصياغة (1M+ Contract Data Lake)',
      titleEn: '2. 1M+ Contract Repository & FIDIC Studio',
      subtitleAr: 'نماذج سيادية معتمدة محكمة ومصنفة 10/10',
      subtitleEn: 'Institutional templates rated 10/10 with full preambles & SLAs',
      descriptionAr: 'اختر أو ولد عقودك الذكية من مكتبة العقود الموثقة المحدثة (عقود بيع، خدمات، توريد، FIDIC، مقاولات، وتراخيص) مع تصدير نظيف لـ Word و PDF.',
      descriptionEn: 'Generate or select battle-tested contracts from our certified template library (Commercial Sales, Services, FIDIC, Software & IP) with clean Word/PDF export.',
      featuresAr: [
        'بنود تفصيلية شاملة للضمانات وسقف المسؤولية والتحكيم وفض النزاعات بتصنيف 10/10',
        'فصل لغوي نقي 100%: صياغة عربية فصيحة ومحكمة وإنجليزية دولية رفيعة',
        'تصدير فوري بضغطة واحدة إلى Word (.docx) و PDF جاهزة للتوقيع'
      ],
      featuresEn: [
        'Comprehensive 10/10 clauses covering indemnities, liability caps & arbitration',
        '100% pure linguistic isolation: Formal Arabic & Global Legal English',
        'One-click instant export to formatted Word (.docx) and signed PDF'
      ],
      metricAr: '+1,000,000 نموذج معتمد ومحدث لعام 2026',
      metricEn: '1,000,000+ Certified & Updated 2026 Templates',
      ctaTextAr: 'تصفح مستودع العقود المليوني',
      ctaTextEn: 'Explore 1M+ Template Repository',
      targetRoute: '/templates',
      badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
      accentGradient: 'from-indigo-500 to-purple-600',
    },
    {
      stepNumber: 3,
      id: 'audit',
      icon: ShieldAlert,
      titleAr: '3. تدقيق المخاطر وكشف الثغرات (Automated Risk Radar)',
      titleEn: '3. AI Risk Audit & Vulnerability Radar',
      subtitleAr: 'فحص مالي وتشريعي متعدد المحاور لكشف الشروط غير المتوازنة',
      subtitleEn: 'Multi-axis financial & statutory scan for unbalanced terms & gaps',
      descriptionAr: 'يقوم المحرك بفحص العقد بنداً بنداً لكشف تفاوت الالتزامات، والشروط الجزائية المرتفعة، وسقوف المسؤولية المنقوصة مع تقديم صياغات بديلة حمائية.',
      descriptionEn: 'Automated clause-by-clause audit detecting power imbalances, unconscionable penalties, missing indemnity caps, and conflicting dispute resolution clauses.',
      featuresAr: [
        'مؤشر شدة المخاطر الملون (🔴 حرج / 🟡 متوسط / 🟢 آمن)',
        'كشف الثغرات الصامتة في حقوق الملكية الفكرية والسرية وسقوف الالتزام',
        'مقترحات تعديل حمائية جاهزة للتفاوض (Executive Redlines)'
      ],
      featuresEn: [
        'Traffic-light risk severity index (🔴 Critical / 🟡 Medium / 🟢 Safe)',
        'Detection of silent gaps in IP rights, liability caps, and confidentiality',
        'Ready-to-use protective redlines tailored for commercial leverage'
      ],
      metricAr: 'فحص وقائي شامل للثغرات',
      metricEn: 'Comprehensive Statutory Risk Audit',
      ctaTextAr: 'تدقيق عقدك الآن',
      ctaTextEn: 'Audit Contract Risk Now',
      targetRoute: '/enterprise-audit',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      accentGradient: 'from-amber-500 to-orange-600',
    },
    {
      stepNumber: 4,
      id: 'negotiation',
      icon: Handshake,
      titleAr: '4. محاكي التفاوض والردود القانونية (Negotiation Simulator)',
      titleEn: '4. Negotiation & Counter-Offer Simulator',
      subtitleAr: 'استراتيجيات تفاوض وصياغة ردود متوازنة لتأمين مصالحك',
      subtitleEn: 'Tactical counter-offers and commercial terms maximizing deal leverage',
      descriptionAr: 'محاكي تفاوض ذكي يصوغ ردوداً قانونية دبلوماسية وحازمة لمواجهة الشروط الصعبة للطرف الآخر والوصول إلى أفضل شروط تعاقدية بأسرع وقت.',
      descriptionEn: 'Simulate corporate negotiations and generate diplomatic, legally robust counter-offers to neutralize aggressive clauses while closing deals faster.',
      featuresAr: [
        'توليد 3 بدائل تفاوضية: (صارم / متوازن / مرن مع الحماية)',
        'مذكرات تبرير قانونية مقنعة مدعومة بالأعراف التجارية السائدة',
        'تسريع وتيرة إغلاق الصفقات وتقليص دورة التفاوض'
      ],
      featuresEn: [
        '3 tactical options: (Firm Assertive / Balanced Commercial / Flexible Protected)',
        'Persuasive statutory legal justifications backed by commercial standards',
        'Accelerated corporate transaction closing velocity'
      ],
      metricAr: 'تسريع دورة التفاوض والاتفاق',
      metricEn: 'Accelerated Deal Closing & Consensus',
      ctaTextAr: 'فتح محاكي التفاوض',
      ctaTextEn: 'Launch Negotiation Simulator',
      targetRoute: '/negotiation',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      accentGradient: 'from-emerald-500 to-teal-600',
    },
    {
      stepNumber: 5,
      id: 'vault-retainer',
      icon: Lock,
      titleAr: '5. التوقيع الرقمي والخزنة المشفرة AES-256 (Sovereign Vault & E-Sign)',
      titleEn: '5. Sovereign E-Sign, Vault & Enterprise Retainer',
      subtitleAr: 'أرشفة مشفرة، طوابع زمنية موثقة SHA-256، وحماية متواصلة',
      subtitleEn: 'Encrypted vault, digital timestamps, and continuous institutional protection',
      descriptionAr: 'توقيع إلكتروني معتمد بطوابع زمنية مشفرة SHA-256، وتخزين في الخزنة السحابية المؤمنة بـ AES-256، مع توفير خطط اشتراك مؤسسية ملائمة للشركات ورواد الأعمال.',
      descriptionEn: 'Legally binding e-signatures with cryptographic timestamps, AES-256 encrypted sovereign vaulting, and enterprise legal protection tiers.',
      featuresAr: [
        'خزنة سحابية سيادية مشفرة بالكامل مع سجل تدقيق غير قابل للتعديل',
        'توقيعات رقمية معتمدة مع طوابع زمنية مؤرخة',
        'متابعة مستمرة ومراقبة استباقية لكافة العقود والامتثال التشغيلي'
      ],
      featuresEn: [
        'Sovereign encrypted vault with tamper-proof immutable audit logs',
        'Official digital certificates and verifiable cryptographic timestamps',
        'Proactive statutory compliance monitoring for business operations'
      ],
      metricAr: 'حماية وأرشفة مشفرة 24/7',
      metricEn: '24/7 Encrypted Sovereign Vault',
      ctaTextAr: 'الترقية والاشتراك المؤسسي',
      ctaTextEn: 'Upgrade to Enterprise Retainer',
      targetRoute: '/payment',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      accentGradient: 'from-purple-500 to-pink-600',
    },
  ];

  const currentStep = steps[activeStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 px-4 border-y border-slate-800 font-sans">
      {/* Background Glowing Ambient Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header Banner */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الخريطة التفاعلية العالمية لسير العمل في المنظومة (Flow Map 10/10)' : 'Interactive Global Platform Workflow Map (Rated 10/10)'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            {isRtl ? (
              <>خارطة الطريق التشغيلية التفاعلية من الفكرة إلى <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">الحماية المؤسسية 10/10</span></>
            ) : (
              <>Interactive Platform Flow Map from Idea to <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">10/10 Sovereign Protection</span></>
            )}
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {isRtl
              ? 'اختر ولايتك القضائية، ثم استكشف المحطات الخمس الرئيسية لتوليد وتدقيق وتوقيع وحفظ العقود السيادية بأعلى معايير الأمان.'
              : 'Select your target jurisdiction, then explore the 5 core execution stages for generating, auditing, and vaulting contracts.'}
          </p>

          {/* Interactive Regional Jurisdiction Selector Bar */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              {isRtl ? 'اختر الدولة / النطاق القضائي:' : 'Select Jurisdiction:'}
            </span>
            {jurisdictions.map((j) => (
              <button
                key={j.code}
                onClick={() => setSelectedJurisdiction(j.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  selectedJurisdiction === j.code
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{j.flag}</span>
                <span>{isRtl ? j.nameAr.split(' ')[0] : j.code}</span>
              </button>
            ))}
          </div>

          {/* Active Jurisdiction Statutory Alignment Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 max-w-2xl mx-auto space-y-1">
            <div className="flex items-center justify-between font-bold text-cyan-400">
              <span className="flex items-center gap-1.5">
                <span>{activeJurisdictionObj.flag}</span>
                <span>{isRtl ? activeJurisdictionObj.nameAr : activeJurisdictionObj.nameEn}</span>
              </span>
              <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-cyan-300">STATUTORY ALIGNED</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono text-center">
              {isRtl ? activeJurisdictionObj.lawsAr : activeJurisdictionObj.lawsEn}
            </p>
          </div>
        </div>

        {/* ── Interactive Sequential Roadmap Progress Bar ── */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-slate-800 rounded-full z-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* 5 Sequential Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative z-10">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl border text-right transition-all flex flex-col items-center sm:items-start text-center sm:text-right gap-3 cursor-pointer group ${
                    isActive
                      ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/30 scale-[1.02]'
                      : isPast
                      ? 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110 ${
                        isActive
                          ? `bg-gradient-to-r ${s.accentGradient} text-white shadow-md`
                          : isPast
                          ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {isRtl ? 'المرحلة' : 'Step'} {s.stepNumber}
                    </span>
                  </div>

                  <div className="space-y-1 w-full text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                    <h4 className={`text-xs font-bold line-clamp-1 transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-200'
                    }`}>
                      {isRtl ? s.titleAr : s.titleEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 font-sans">
                      {isRtl ? s.metricAr : s.metricEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Stage Interactive Deep-Dive Card ── */}
        <div
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-700 shadow-2xl space-y-8 relative overflow-hidden font-sans"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Top Stage Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${currentStep.accentGradient} text-white shadow-lg`}>
                <StepIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className={`inline-block text-[11px] font-bold uppercase px-3 py-1 rounded-full border ${currentStep.badgeColor}`}>
                  {isRtl ? `المرحلة 0${currentStep.stepNumber} من 05 • ${currentStep.metricAr}` : `Phase 0${currentStep.stepNumber} of 05 • ${currentStep.metricEn}`}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {isRtl ? currentStep.titleAr : currentStep.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                  {isRtl ? currentStep.subtitleAr : currentStep.subtitleEn}
                </p>
              </div>
            </div>

            {/* Direct CTA Action Button */}
            <button
              onClick={() => navigate(currentStep.targetRoute)}
              className={`px-6 py-3.5 rounded-2xl bg-gradient-to-r ${currentStep.accentGradient} hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer`}
            >
              <span>{isRtl ? currentStep.ctaTextAr : currentStep.ctaTextEn}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Description & Detailed Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Detailed Overview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'الأثر القانوني والتشغيلي للعميل' : 'Client Commercial & Legal Impact'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isRtl ? currentStep.descriptionAr : currentStep.descriptionEn}
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400">{isRtl ? 'القيمة المضافة المعيارية:' : 'Standard Value Metric:'}</div>
                <div className="text-lg font-black text-emerald-400 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{isRtl ? currentStep.metricAr : currentStep.metricEn}</span>
                </div>
              </div>
            </div>

            {/* Right: Key Deliverables Checklist (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'المزايا الفورية المضمنة في هذه المرحلة' : 'Instant Deliverables Included'}</span>
              </h4>

              <div className="space-y-3">
                {(isRtl ? currentStep.featuresAr : currentStep.featuresEn).map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Navigator Stepper Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isRtl ? 'المرحلة السابقة' : 'Previous Phase'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {steps.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveStepIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    dotIdx === activeStepIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isRtl ? 'المرحلة التالية' : 'Next Phase'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
