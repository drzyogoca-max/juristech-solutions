/**
 * src/pages/PaymentPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strategic Pricing & Payment Gateway
 * 3-Tier Pricing: Startup $49 / SMEs $139 / Enterprise $349/mo
 * Positioned 30% below global market rates for maximum competitiveness.
 * Updated: August 2026
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign, Shield, Zap, Lock, Building2, CheckCircle2, CreditCard,
  Globe, Mail, Sparkles, Star, ArrowRight, Users, TrendingUp, Cpu,
  ShieldCheck, BarChart3, FileText, Wifi, Crown, Building
} from 'lucide-react';
import BankWireModal from '../components/BankWireModal';
import BinancePayModal from '../components/BinancePayModal';
import DigitalInvoiceModal from '../components/DigitalInvoiceModal';
import { activateUserSubscription, BillingTransaction } from '../lib/financialGateway';
import SEO from '../components/SEO';

interface Plan {
  id: 'startup' | 'sme' | 'enterprise';
  tierKey: 'pro' | 'pro' | 'enterprise';
  badge: string;
  badgeAr: string;
  nameEn: string;
  nameAr: string;
  targetEn: string;
  targetAr: string;
  price: number;
  globalPrice: number;
  billingEn: string;
  billingAr: string;
  descEn: string;
  descAr: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
  featuresEn: string[];
  featuresAr: string[];
  contractLimit: string;
  contractLimitAr: string;
  apiAccess: string;
  apiAccessAr: string;
  security: string;
  securityAr: string;
  support: string;
  supportAr: string;
  highlight?: boolean;
}

const SUPPORT_EMAIL = 'juristech.solutions@outlook.com';

export default function PaymentPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [selectedWirePlan, setSelectedWirePlan] = useState<Plan | null>(null);
  const [selectedBinancePlan, setSelectedBinancePlan] = useState<Plan | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);

  const plans: Plan[] = [
    {
      id: 'startup',
      tierKey: 'pro',
      badge: 'Startup',
      badgeAr: 'الشركات الناشئة',
      nameEn: 'Micro / Startup',
      nameAr: 'حزمة الشركات الصغرى',
      targetEn: 'Freelancers, Individuals & New Startups',
      targetAr: 'المبرمجون، الأفراد، والشركات الناشئة حديثاً',
      price: billingAnnual ? 39 : 49,
      globalPrice: 70,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Essential legal AI for entrepreneurs. Fast answers, zero complexity.',
      descAr: 'الذكاء الاصطناعي القانوني الأساسي للرياديين. إجابات سريعة، بدون تعقيد.',
      color: 'cyan',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/5',
      icon: <Zap className="w-7 h-7" />,
      contractLimit: 'Up to 10 contracts / month',
      contractLimitAr: 'حتى 10 عقود شهرياً',
      apiAccess: 'Not included',
      apiAccessAr: 'غير متاح',
      security: 'Standard encryption + Basic Auth',
      securityAr: 'تشفير قياسي + مصادقة أساسية',
      support: 'Email support',
      supportAr: 'دعم عبر البريد الإلكتروني',
      featuresEn: [
        'Multilingual AI Legal Chatbot (7 languages)',
        'Basic legislative queries & direct answers',
        'Up to 10 contract uploads/month',
        'Risk flag detection on contracts',
        'PDF export with official seal',
        'Standard AES-256 encryption',
      ],
      featuresAr: [
        'مساعد قانوني ذكي متعدد اللغات (7 لغات)',
        'استفسارات تشريعية أساسية ومباشرة',
        'رفع حتى 10 عقود شهرياً',
        'كشف علامات المخاطر في العقود',
        'تصدير PDF مع الختم الرسمي',
        'تشفير AES-256 قياسي',
      ],
    },
    {
      id: 'sme',
      tierKey: 'pro',
      badge: 'SMEs',
      badgeAr: 'الشركات المتوسطة',
      nameEn: 'SMEs Package',
      nameAr: 'حزمة الشركات المتوسطة',
      targetEn: 'Small & Medium Companies Seeking Rapid Growth',
      targetAr: 'الشركات الصغيرة والمتوسطة التي تبحث عن نمو متسارع',
      price: billingAnnual ? 111 : 139,
      globalPrice: 200,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Advanced analysis with smart contract drafting & visual dashboards.',
      descAr: 'تحليلات متقدمة مع صياغة العقود الذكية ولوحات تحكم بصرية.',
      color: 'indigo',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-500/5',
      icon: <Users className="w-7 h-7" />,
      contractLimit: 'Up to 50 contracts / month',
      contractLimitAr: 'حتى 50 عقداً شهرياً',
      apiAccess: 'Basic ERP integration',
      apiAccessAr: 'تكامل أساسي مع منصات إدارة العقود',
      security: 'Advanced encryption + 2FA',
      securityAr: 'تشفير متقدم + المصادقة الثنائية (2FA)',
      support: 'Interactive dashboard + visual reports',
      supportAr: 'لوحة قيادة تفاعلية أساسية وتقارير بصرية',
      highlight: true,
      featuresEn: [
        'Everything in Startup Plan',
        'Advanced AI contract analysis (8-Axis Framework)',
        'Up to 50 contract uploads/month with risk reports',
        'Smart contract drafting & redline suggestions',
        'Interactive KPI dashboard & visual analytics',
        'Basic API/ERP platform integration',
        'Two-Factor Authentication (2FA)',
        'Advanced AES-256 + TLS 1.3 encryption',
      ],
      featuresAr: [
        'كل مزايا الحزمة الصغرى',
        'تحليل عقود متقدم بالذكاء الاصطناعي (إطار 8 محاور)',
        'رفع حتى 50 عقداً شهرياً مع تقارير مخاطر مفصلة',
        'صياغة العقود الذكية واقتراحات التعديل',
        'لوحة قياس تفاعلية وتحليلات بصرية',
        'تكامل أساسي مع API/ERP',
        'التحقق الثنائي (2FA)',
        'تشفير متقدم AES-256 + TLS 1.3',
      ],
    },
    {
      id: 'enterprise',
      tierKey: 'enterprise',
      badge: 'Enterprise',
      badgeAr: 'المؤسسات',
      nameEn: 'Enterprise Package',
      nameAr: 'حزمة الشركات الكبرى والمؤسسات',
      targetEn: 'Corporations, Financial Institutions & Major Legal Departments',
      targetAr: 'الشركات الكبرى، المؤسسات المالية، والإدارات القانونية الضخمة',
      price: billingAnnual ? 279 : 349,
      globalPrice: 500,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Unlimited cross-border legal intelligence with full security stack.',
      descAr: 'استشارات معمقة ومخصصة للتشريعات العابرة للحدود مع أعلى مستويات الأمان.',
      color: 'amber',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/5',
      icon: <Crown className="w-7 h-7" />,
      contractLimit: 'Unlimited contracts + instant gap detection',
      contractLimitAr: 'عقود غير محدودة مع رصد فوري للثغرات القانونية',
      apiAccess: 'Full ERP & enterprise system integration',
      apiAccessAr: 'تكامل كامل مع أنظمة ERP والأنظمة المؤسسية الضخمة',
      security: 'E2EE + Live Security Radar + Audit Logs',
      securityAr: 'تشفير شامل (E2EE) + رادار أمني حي + سجلات تدقيق',
      support: 'Integrated admin dashboard + executive priority support',
      supportAr: 'لوحة إدارية تفاعلية متكاملة + دعم تنفيذي فوري',
      featuresEn: [
        'Everything in SMEs Plan',
        'Unlimited contract uploads & real-time legal gap radar',
        'Full cross-border legislative analysis (ICC/DIAC/LCIA)',
        'Complete API & ERP enterprise system integration',
        'End-to-End Encryption (E2EE) + Live Security Radar',
        'SHA-256 tamper-proof audit trail logs',
        'Multi-user team management & departmental accounts',
        'Dedicated executive priority support 24/7',
        'Custom AI fine-tuning for your jurisdiction',
      ],
      featuresAr: [
        'كل مزايا الحزمة المتوسطة',
        'عقود غير محدودة مع رادار قانوني فوري للثغرات',
        'تحليل تشريعي عابر للحدود (ICC/DIAC/LCIA)',
        'تكامل كامل مع API وأنظمة ERP المؤسسية',
        'تشفير شامل (E2EE) + رادار أمني حي',
        'سجلات تدقيق SHA-256 غير قابلة للتلاعب',
        'إدارة فرق متعددة وحسابات قسمية',
        'دعم تنفيذي مخصص على مدار الساعة',
        'ضبط دقيق للذكاء الاصطناعي حسب اختصاصك القانوني',
      ],
    },
  ];

  const comparisonRows = [
    {
      featureEn: 'Monthly Price',
      featureAr: 'السعر الشهري',
      startup: '$49',
      sme: '$139',
      enterprise: '$349',
      highlight: true,
    },
    {
      featureEn: 'Global Market Rate',
      featureAr: 'السعر العالمي المقارن',
      startup: '$70',
      sme: '$200',
      enterprise: '$500',
    },
    {
      featureEn: 'Target Entities',
      featureAr: 'الكيانات المستهدفة',
      startup: isRtl ? 'مبرمجون، أفراد، ناشئون' : 'Freelancers & Startups',
      sme: isRtl ? 'شركات صغيرة ومتوسطة' : 'SMEs & Growth Companies',
      enterprise: isRtl ? 'مؤسسات كبرى ومالية' : 'Corporations & Finance',
    },
    {
      featureEn: 'Contract Analysis',
      featureAr: 'تحليل العقود',
      startup: isRtl ? 'أساسية ومباشرة' : 'Basic & Direct',
      sme: isRtl ? 'متقدمة + صياغة ذكية' : 'Advanced + Smart Drafting',
      enterprise: isRtl ? 'معمقة + عابرة للحدود' : 'Deep + Cross-Border',
    },
    {
      featureEn: 'Contract Upload Limit',
      featureAr: 'حد رفع العقود',
      startup: isRtl ? 'حتى 10 / شهر' : 'Up to 10 / month',
      sme: isRtl ? 'حتى 50 / شهر' : 'Up to 50 / month',
      enterprise: isRtl ? 'غير محدود' : 'Unlimited',
    },
    {
      featureEn: 'API / ERP Integration',
      featureAr: 'تكامل API/ERP',
      startup: '—',
      sme: isRtl ? 'أساسي' : 'Basic',
      enterprise: isRtl ? 'كامل' : 'Full Enterprise',
    },
    {
      featureEn: 'Security Level',
      featureAr: 'مستوى الأمان',
      startup: isRtl ? 'تشفير قياسي' : 'Standard Encryption',
      sme: isRtl ? 'تشفير متقدم + 2FA' : 'Advanced + 2FA',
      enterprise: isRtl ? 'E2EE + رادار حي' : 'E2EE + Live Radar',
    },
    {
      featureEn: 'Support',
      featureAr: 'الدعم الفني',
      startup: isRtl ? 'بريد إلكتروني' : 'Email Support',
      sme: isRtl ? 'لوحة تفاعلية + تقارير' : 'Dashboard + Reports',
      enterprise: isRtl ? 'تنفيذي فوري 24/7' : 'Executive Priority 24/7',
    },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    indigo: 'text-indigo-400',
    amber: 'text-amber-400',
  };

  const bgMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10',
    indigo: 'bg-indigo-500/10',
    amber: 'bg-amber-500/10',
  };

  return (
    <main className={`p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-100 font-sans`} dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO
        title={`${isRtl ? 'خطط الاشتراك والأسعار' : 'Pricing & Subscription Plans'} | JurisTech Solutions`}
        description={isRtl
          ? 'هيكل التسعير الاستراتيجي لمنصة JurisTech Solutions — 3 باقات تنافسية أقل 30% من السوق العالمي'
          : 'JurisTech Solutions strategic pricing — 3 competitive tiers positioned 30% below global market rates'}
      />

      <div className="max-w-7xl mx-auto space-y-14">

        {/* ── Hero Header ──────────────────────────────────────────────── */}
        <div className="text-center space-y-5 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-amber-400 text-slate-950" />
            <span>{isRtl ? 'تسعير استراتيجي — أقل 30% من السوق العالمي' : 'Strategic Pricing — 30% Below Global Market Rates'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {isRtl ? 'الهيكل التسعيري الاستراتيجي' : 'Strategic Pricing Architecture'}
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {isRtl
              ? 'ثلاث باقات مصممة لكل حجم من أحجام الشركات — من الرياديين إلى المؤسسات الكبرى — بأسعار أقل 30% من نظيراتها العالمية لضمان أعلى تنافسية.'
              : 'Three tiers engineered for every company size — from startups to global corporations — priced 30% below global equivalents for maximum market competitiveness.'}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!billingAnnual ? 'text-white' : 'text-slate-500'}`}>
              {isRtl ? 'شهرياً' : 'Monthly'}
            </span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billingAnnual ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${billingAnnual ? (isRtl ? 'translate-x-1' : 'translate-x-7') : (isRtl ? 'translate-x-7' : 'translate-x-1')}`} />
            </button>
            <span className={`text-sm font-bold ${billingAnnual ? 'text-amber-400' : 'text-slate-500'}`}>
              {isRtl ? 'سنوياً (وفر 20%)' : 'Annual (Save 20%)'}
            </span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'GDPR Compliant' },
              { icon: <Lock className="w-3.5 h-3.5" />, label: 'AES-256 E2EE' },
              { icon: <Globe className="w-3.5 h-3.5" />, label: isRtl ? '15+ دولة' : '15+ Jurisdictions' },
              { icon: <Wifi className="w-3.5 h-3.5" />, label: isRtl ? 'توفر 99.5%' : '99.5% Uptime' },
              { icon: <Zap className="w-3.5 h-3.5" />, label: isRtl ? 'تفعيل فوري' : 'Instant Activation' },
            ].map(({ icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3 Pricing Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 border flex flex-col justify-between ${plan.borderColor} ${plan.bgColor} ${
                plan.highlight ? 'ring-2 ring-indigo-500/40 shadow-2xl shadow-indigo-500/10 scale-[1.02]' : 'shadow-xl'
              } bg-slate-900 transition-all hover:scale-[1.01] hover:shadow-2xl group`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                  ⭐ {isRtl ? 'الأكثر طلباً' : 'Most Popular'}
                </div>
              )}

              {/* Tier badge */}
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${bgMap[plan.color]} ${colorMap[plan.color]} border border-current/20 mb-4 self-start`}>
                {isRtl ? plan.badgeAr : plan.badge}
              </div>

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl ${bgMap[plan.color]} ${colorMap[plan.color]} border border-current/20`}>
                  {plan.icon}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">{isRtl ? plan.nameAr : plan.nameEn}</h2>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{isRtl ? plan.targetAr : plan.targetEn}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-end gap-2 flex-wrap">
                  <span className={`text-5xl font-black ${colorMap[plan.color]}`}>${plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{isRtl ? plan.billingAr : plan.billingEn}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 line-through">${plan.globalPrice} {isRtl ? 'عالمياً' : 'globally'}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {isRtl ? 'وفر 30%' : 'Save 30%'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                {isRtl ? plan.descAr : plan.descEn}
              </p>

              {/* Feature list */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {(isRtl ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${colorMap[plan.color]}`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Quick specs */}
              <div className="space-y-2 mb-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-[10px] font-mono">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{isRtl ? 'حد العقود:' : 'Contracts:'}</span>
                  <span className="text-slate-200 font-bold text-right">{isRtl ? plan.contractLimitAr : plan.contractLimit}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">API/ERP:</span>
                  <span className="text-slate-200 font-bold text-right">{isRtl ? plan.apiAccessAr : plan.apiAccess}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{isRtl ? 'الأمان:' : 'Security:'}</span>
                  <span className="text-slate-200 font-bold text-right">{isRtl ? plan.securityAr : plan.security}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{isRtl ? 'الدعم:' : 'Support:'}</span>
                  <span className="text-slate-200 font-bold text-right">{isRtl ? plan.supportAr : plan.support}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedBinancePlan(plan)}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-slate-950 transition-all shadow-lg text-sm active:scale-95 cursor-pointer bg-gradient-to-r ${
                    plan.id === 'enterprise' ? 'from-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-300 shadow-amber-500/20' :
                    plan.id === 'sme' ? 'from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 shadow-indigo-500/20' :
                    'from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-cyan-500/20'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{isRtl ? `اشترك الآن عبر Binance Pay — $${plan.price}` : `Subscribe via Binance Pay — $${plan.price}`}</span>
                </button>

                <button
                  onClick={() => setSelectedWirePlan(plan)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-amber-300 border border-amber-500/20 transition-all text-xs active:scale-95 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>{isRtl ? 'التحويل البنكي SWIFT' : 'Bank Wire SWIFT Transfer'}</span>
                </button>

                <button disabled className="w-full flex items-center justify-between py-2.5 px-4 rounded-2xl bg-slate-800/50 text-slate-500 border border-slate-700/50 font-bold text-xs cursor-not-allowed opacity-60">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'Pi Network Web3' : 'Pi Network Web3 Gateway'}</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {isRtl ? 'قريباً' : 'Coming Soon'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Comparison Table ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              {isRtl ? 'جدول مقارنة الحزم الاستراتيجي' : 'Strategic Package Comparison Table'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isRtl ? 'مقارنة شاملة بين الباقات الثلاث والسوق العالمي' : 'Full comparison across all three tiers vs. global market rates'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 shadow-2xl">
            <table className="w-full text-sm" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="p-4 text-left font-black text-slate-400 text-xs uppercase tracking-wider w-1/4">
                    {isRtl ? 'الميزة' : 'Feature'}
                  </th>
                  {[
                    { label: isRtl ? 'الصغرى\n$49 / شهر' : 'Startup\n$49 / mo', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: isRtl ? 'المتوسطة\n$139 / شهر' : 'SMEs\n$139 / mo', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: isRtl ? 'الكبرى\n$349 / شهر' : 'Enterprise\n$349 / mo', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  ].map(({ label, color, bg }) => (
                    <th key={label} className={`p-4 text-center font-black text-xs uppercase tracking-wider w-1/4 ${color} ${bg}`}>
                      {label.split('\n').map((l, i) => <div key={i} className={i === 1 ? 'text-[10px] font-mono opacity-80 mt-0.5' : ''}>{l}</div>)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`hover:bg-slate-900/60 transition-colors ${row.highlight ? 'bg-slate-900/40' : ''}`}>
                    <td className="p-4 font-bold text-slate-300 text-xs">{isRtl ? row.featureAr : row.featureEn}</td>
                    {[row.startup, row.sme, row.enterprise].map((val, j) => (
                      <td key={j} className={`p-4 text-center text-xs font-bold ${
                        row.highlight
                          ? j === 0 ? 'text-cyan-400' : j === 1 ? 'text-indigo-400' : 'text-amber-400'
                          : 'text-slate-300'
                      }`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Market Positioning Strip ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <TrendingUp className="w-6 h-6" />, color: 'emerald', titleEn: '30% Below Global Rates', titleAr: 'أقل 30% من السوق العالمي', descEn: 'Designed to outcompete LegalZoom, Ironclad & similar platforms.', descAr: 'مصمم للتفوق على LegalZoom وIronclad والمنصات المماثلة.' },
            { icon: <Users className="w-6 h-6" />, color: 'cyan', titleEn: 'All Company Sizes', titleAr: 'لكل أحجام الشركات', descEn: 'From solo entrepreneurs to Fortune 500 legal departments.', descAr: 'من رياديين أفراد إلى إدارات قانونية لكبرى الشركات.' },
            { icon: <ShieldCheck className="w-6 h-6" />, color: 'amber', titleEn: 'Instant Activation', titleAr: 'تفعيل فوري ومباشر', descEn: 'Automated subscription activation via Binance Pay or SWIFT.', descAr: 'تفعيل اشتراك تلقائي فوري عبر Binance Pay أو التحويل SWIFT.' },
          ].map(({ icon, color, titleEn, titleAr, descEn, descAr }) => (
            <div key={titleEn} className={`p-5 rounded-2xl bg-${color}-500/8 border border-${color}-500/20 space-y-3`}>
              <div className={`text-${color}-400`}>{icon}</div>
              <h3 className="font-black text-white text-sm">{isRtl ? titleAr : titleEn}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{isRtl ? descAr : descEn}</p>
            </div>
          ))}
        </div>

        {/* ── Official Payment Details ─────────────────────────────────── */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>{isRtl ? 'بوابات الدفع الرسمية المعتمدة' : 'Official Certified Payment Gateways'}</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Binance Pay */}
            <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-400 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  Binance Pay (Active Merchant)
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">Zero Fees</span>
              </div>
              <p className="text-xs text-slate-400">{isRtl ? 'تحويل فوري لحسابنا المعتمد لدى Binance:' : 'Instant transfer to our official Binance Merchant account:'}</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20 text-xs font-mono space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-500">Email:</span><strong className="text-amber-300 select-all">Drzyogo.ca@gmail.com</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">User ID:</span><strong className="text-amber-300 select-all">User-444da</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Currency:</span><strong className="text-amber-300">USDT (TRC-20 / BEP-20)</strong></div>
              </div>
            </div>

            {/* SWIFT */}
            <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  SWIFT Bank Wire
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">Verified</span>
              </div>
              <p className="text-xs text-slate-400">{isRtl ? 'بيانات الحساب البنكي المعتمد للتسوية:' : 'Official beneficiary bank settlement coordinates:'}</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 text-xs font-mono space-y-1.5">
                <div className="flex justify-between gap-3"><span className="text-slate-500 shrink-0">Beneficiary:</span><span className="text-emerald-300 font-bold select-all">MHAMMAD MUSTAFA MHAMMAD</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500 shrink-0">Bank:</span><span className="text-emerald-300 font-bold">Al Baraka Bank — Egypt</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500 shrink-0">IBAN:</span><span className="text-emerald-300 font-bold select-all text-[10px]">EG310022012880211102491757001</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500 shrink-0">SWIFT:</span><span className="text-emerald-300 font-bold select-all">ABRKEGCAXXX</span></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">{isRtl ? 'بوابة مالية مشفرة 100% مع فاتورة موثقة' : '100% Encrypted Payment Gateway & Verified Digital Invoices'}</p>
                <p className="text-xs text-slate-400 font-mono">AES-256 · TLS 1.3 · SHA-256 Audit Trail</p>
              </div>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              <Mail className="w-4 h-4" />
              <span>{isRtl ? `الدعم المالي: ${SUPPORT_EMAIL}` : `Financial Support: ${SUPPORT_EMAIL}`}</span>
            </a>
          </div>
        </div>

      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {selectedBinancePlan && (
        <BinancePayModal
          isOpen={!!selectedBinancePlan}
          onClose={() => setSelectedBinancePlan(null)}
          packageName={isRtl ? selectedBinancePlan.nameAr : selectedBinancePlan.nameEn}
          packagePrice={selectedBinancePlan.price}
        />
      )}

      {selectedWirePlan && (
        <BankWireModal
          isOpen={!!selectedWirePlan}
          onClose={() => setSelectedWirePlan(null)}
          packageName={isRtl ? selectedWirePlan.nameAr : selectedWirePlan.nameEn}
          packagePrice={selectedWirePlan.price}
          packageType="subscription"
        />
      )}

      {activeInvoice && (
        <DigitalInvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          transaction={activeInvoice}
        />
      )}
    </main>
  );
}
