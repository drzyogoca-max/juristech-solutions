/**
 * src/pages/PaymentPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strategic Pricing & Sovereign Payment Gateway
 * Enhanced with 2026 Sovereign AI Services (Google AI Pro, M&A Intelligence,
 * Virtual Litigation, Stylometric Fraud Detection, Cross-Border Compliance).
 * 3-Tier Pricing: Startup $49 / SMEs $139 / Enterprise $349/mo (30% Discounted).
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign, Shield, Zap, Lock, Building2, CheckCircle2, CreditCard,
  Globe, Mail, Sparkles, Star, ArrowRight, Users, TrendingUp, Cpu,
  ShieldCheck, BarChart3, FileText, Wifi, Crown, Building, Smartphone,
  BrainCircuit, Scale, ShieldAlert, Award
} from 'lucide-react';
import BankWireModal from '../components/BankWireModal';
import BinancePayModal from '../components/BinancePayModal';
import InstaPayModal from '../components/InstaPayModal';
import ProformaInvoiceModal from '../components/ProformaInvoiceModal';
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
  const [selectedInstaPayPlan, setSelectedInstaPayPlan] = useState<Plan | null>(null);
  const [selectedProformaPlan, setSelectedProformaPlan] = useState<Plan | null>(null);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);

  const plans: Plan[] = [
    {
      id: 'startup',
      tierKey: 'pro',
      badge: 'Startup',
      badgeAr: 'الشركات الناشئة',
      nameEn: 'Micro / Startup Tier',
      nameAr: 'حزمة الشركات الصغرى والناشئة',
      targetEn: 'Founders, Freelancers & Emerging Ventures',
      targetAr: 'المؤسسون، رواد الأعمال، والشركات الناشئة حديثاً',
      price: billingAnnual ? 39 : 49,
      globalPrice: 70,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Essential sovereign legal AI with multi-format PDF & Word processing.',
      descAr: 'الذكاء الاصطناعي القانوني الأساسي مع معالجة وتصدير ملفات PDF و Word.',
      color: 'cyan',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/5',
      icon: <Zap className="w-7 h-7" />,
      contractLimit: 'Up to 10 contracts / month',
      contractLimitAr: 'حتى 10 عقود شهرياً',
      apiAccess: 'Standard Web Interface',
      apiAccessAr: 'واجهة ويب قياسية',
      security: 'Standard AES-256 encryption',
      securityAr: 'تشفير قياسي AES-256',
      support: 'Direct Email Support (15-min SLA)',
      supportAr: 'دعم مباشر عبر البريد الإلكتروني',
      featuresEn: [
        'Google Gemini Pro Sovereign Legal Advisor (7 Languages)',
        'Up to 10 Contract Ingestions (PDF, Word, TXT)',
        'Standard Statutory Risk & Penalty Detection',
        'Certified PDF & Word (.docx) Document Export',
        'Regional Coverage (Saudi Arabia, UAE, Egypt, Jordan)',
        'Standard AES-256 Cryptographic Cloud Vault',
      ],
      featuresAr: [
        'المستشار القانوني السيادي مدعوم بـ Google Gemini Pro (7 لغات)',
        'رفع وتفريغ حتى 10 عقود شهرياً (PDF, Word, TXT)',
        'كشف المخاطر التشريعية والشروط الجزائية الأساسية',
        'تصدير معتمد بصيغ PDF و Word (.docx) بالختم الرسمي',
        'تغطية تشريعية إقليمية (السعودية، الإمارات، مصر، الأردن)',
        'خزنة سحابية مؤمنة بتشفير AES-256 قياسي',
      ],
    },
    {
      id: 'sme',
      tierKey: 'pro',
      badge: 'SMEs & Growth',
      badgeAr: 'الشركات المتوسطة والنمو',
      nameEn: 'SMEs & Growth Package',
      nameAr: 'حزمة الشركات المتوسطة والنمو المتسارع',
      targetEn: 'Small & Medium Enterprises & Investment Funds',
      targetAr: 'الشركات المتوسطة، صناديق الاستثمار، ومكاتب المحاماة المتطورة',
      price: billingAnnual ? 111 : 139,
      globalPrice: 200,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Autonomous AI Negotiation, Virtual Litigation Simulation & 8-Axis Risk Audit.',
      descAr: 'وكلاء التفاوض الآلي، محاكاة النزاعات القضائية، وتدقيق المخاطر الشامل.',
      color: 'indigo',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-500/5',
      icon: <BrainCircuit className="w-7 h-7" />,
      contractLimit: 'Up to 50 contracts / month',
      contractLimitAr: 'حتى 50 عقداً شهرياً',
      apiAccess: 'Basic ERP & Webhook Integration',
      apiAccessAr: 'تكامل أساسي مع أنظمة ERP والويب هوك',
      security: 'Advanced AES-256 + 2FA TOTP',
      securityAr: 'تشفير متقدم AES-256 + المصادقة الثنائية (2FA)',
      support: 'Interactive Dashboard & Visual Analytics',
      supportAr: 'لوحة قيادة تفاعلية + تقارير بصرية فورية',
      highlight: true,
      featuresEn: [
        'Everything in Startup Plan',
        'Google AI Pro Sovereign Core (Gemini Ultra Deep Reasoning)',
        'Autonomous AI Negotiation Agents & Tactical Redlines',
        'Virtual Courtroom Simulation & Win Probability Forecasting',
        'Up to 50 Contract Audits & Multi-Format Ingestions / month',
        'Comprehensive 9-Jurisdiction Statutory Coverage (GCC, UK, US Delaware, EU)',
        'Two-Factor Authentication (2FA TOTP) + TLS 1.3 Security',
        'Continuous RLHF Self-Learning & Fine-Tuning Loop',
      ],
      featuresAr: [
        'كل مزايا باقة الشركات الصغرى والناشئة',
        'محرك Google AI Pro السيادي (تفكير استدلالي عميق Gemini Ultra)',
        'وكلاء التفاوض الآلي والوساطة وصياغة البنود البديلة التكتيكية',
        'المحاكاة القضائية وتوقع نسب كسب القضايا والسوابق القضائية',
        'رفع وتدقيق حتى 50 عقداً شهرياً مع تصدير Word و PDF',
        'تغطية تشريعية لـ 9 دول (الخليج، بريطانيا، أمريكا ديلاوير، والاتحاد الأوروبي)',
        'التحقق الثنائي المشفر (2FA TOTP) وحماية TLS 1.3',
        'حلقة التعلم والتدريب الذاتي المستمر (RLHF Feedback Loop)',
      ],
    },
    {
      id: 'enterprise',
      tierKey: 'enterprise',
      badge: 'Enterprise Sovereign',
      badgeAr: 'السيادية والمؤسسات الكبرى',
      nameEn: 'Enterprise Sovereign Package',
      nameAr: 'حزمة الشركات الكبرى والمؤسسات السيادية',
      targetEn: 'Multinationals, Conglomerates & Sovereign Financial Entities',
      targetAr: 'الشركات متعددة الجنسيات، المجموعات القابضة، والمؤسسات المصرفية والسيادية',
      price: billingAnnual ? 279 : 349,
      globalPrice: 500,
      billingEn: billingAnnual ? '/ year (save 20%)' : '/ month',
      billingAr: billingAnnual ? '/ سنوياً (وفر 20%)' : '/ شهرياً',
      descEn: 'Predictive M&A Intelligence, Stylometric Anti-Fraud & Cross-Border Compliance.',
      descAr: 'الاستحواذ الذكي M&A، كشف التزوير والاحتيال، والامتثال العابر للحدود.',
      color: 'amber',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/5',
      icon: <Crown className="w-7 h-7" />,
      contractLimit: 'Unlimited Contracts & Real-Time Intelligence',
      contractLimitAr: 'عقود وتحليلات غير محدودة على مدار الساعة',
      apiAccess: 'Full Custom ERP, REST & Sovereign API Connectors',
      apiAccessAr: 'تكامل كامل عبر API وأنظمة المؤسسات الضخمة',
      security: 'AES-256 E2EE + Forensic Audit Trail Logs',
      securityAr: 'تشفير طرفي شامل (E2EE) + سجلات تدقيق جنائية غير قابلة للتعديل',
      support: 'Dedicated Executive Priority Concierge (Senior Counsel Dr. Mohammad Mustafa)',
      supportAr: 'دعم تنفيذي مباشر ومخصص 24/7 مع المستشار القانوني د. محمد مصطفى',
      featuresEn: [
        'Everything in SMEs & Growth Plan',
        'Unlimited Predictive M&A Intelligence & Deal EBITDA Valuations',
        'Forensic Stylometric Fraud, Forgery & Tampering Detection',
        'Cross-Border Statutory Compliance (PDPL, GDPR, EU AI Act 2024, FATF AML)',
        'Unlimited Contract Audits & Instant Gap Identification',
        'Multi-User Departmental Access & Role-Based Control (RBAC)',
        'End-to-End Encrypted Sovereign Vault with Digital Timestamps',
        'Dedicated 24/7 Senior Legal Counsel Priority Access',
      ],
      featuresAr: [
        'كل مزايا حزمة الشركات المتوسطة والنمو',
        'الاستحواذ والاندماج التنبؤي غير المحدود وتقييم صفقات الـ M&A و EBITDA',
        'كشف التزوير والاحتيال والتحريف بالقياس النصي الحيوي (Forensic Stylometry)',
        'الامتثال التشريعي العابر للحدود (PDPL, GDPR, EU AI Act 2024, FATF AML)',
        'تدقيق وتوليد عقود غير محدود مع رصد فوري للثغرات الصامتة',
        'إدارة متعددة المستخدمين وأدوار الصلاحيات المتقدمة (RBAC)',
        'خزنة سحابية سيادية بتشفير طرفي E2EE وطوابع زمنية رقمية معتمدة',
        'قناة تواصل استشارية تنفيذية مباشرة 24/7 مع د. محمد مصطفى',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 selection:bg-cyan-500 selection:text-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />

      {/* Payment Modals */}
      {selectedWirePlan && (
        <BankWireModal
          isOpen={!!selectedWirePlan}
          onClose={() => setSelectedWirePlan(null)}
          packageName={isRtl ? selectedWirePlan.nameAr : selectedWirePlan.nameEn}
          packagePrice={selectedWirePlan.price}
        />
      )}

      {selectedBinancePlan && (
        <BinancePayModal
          isOpen={!!selectedBinancePlan}
          onClose={() => setSelectedBinancePlan(null)}
          packageName={isRtl ? selectedBinancePlan.nameAr : selectedBinancePlan.nameEn}
          packagePrice={selectedBinancePlan.price}
        />
      )}

      {selectedInstaPayPlan && (
        <InstaPayModal
          isOpen={!!selectedInstaPayPlan}
          onClose={() => setSelectedInstaPayPlan(null)}
          packageName={isRtl ? selectedInstaPayPlan.nameAr : selectedInstaPayPlan.nameEn}
          packagePrice={selectedInstaPayPlan.price}
        />
      )}

      {selectedProformaPlan && (
        <ProformaInvoiceModal
          isOpen={!!selectedProformaPlan}
          onClose={() => setSelectedProformaPlan(null)}
          defaultPlanName={isRtl ? selectedProformaPlan.nameAr : selectedProformaPlan.nameEn}
          defaultPlanPrice={selectedProformaPlan.price}
        />
      )}

      {activeInvoice && (
        <DigitalInvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          transaction={activeInvoice}
        />
      )}

      {/* Hero Header */}
      <div className="relative py-14 border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-lg">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              {isRtl ? 'حزم الاشتراكات السيادية المخصومة 30% لعام 2026' : '30% Discounted Sovereign Retainer Tiers 2026'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isRtl ? 'باقات الاشتراك وتفعيل ' : 'Sovereign Retainer Plans & '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">{isRtl ? 'الخدمات الذكية السيادية' : 'Enterprise Intelligence'}</span>
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed font-medium">
            {isRtl
              ? 'اختر الباقة المناسبة لمؤسستك واستفد من محرك Google AI Pro السيادي، الاستحواذ التنبؤي M&A، التفاوض الآلي، والمحاكاة القضائية مع تفعيل فوري عبر Binance Pay، التحويلات البنكية SWIFT، أو إنستا باي.'
              : 'Empower your enterprise with Google AI Pro Sovereign Core, predictive M&A valuations, autonomous negotiation, and virtual dispute simulation with zero-touch instant activation.'}
          </p>

          {/* Billing Switcher (Monthly / Annual) */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-bold ${!billingAnnual ? 'text-cyan-400 font-black' : 'text-slate-400'}`}>
              {isRtl ? 'فاتورة شهرية' : 'Monthly Billing'}
            </span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              className="w-14 h-7 rounded-full bg-slate-900 border border-slate-700 p-1 flex items-center transition-colors cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full bg-cyan-400 transition-transform ${billingAnnual ? (isRtl ? '-translate-x-7' : 'translate-x-7') : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingAnnual ? 'text-cyan-400 font-black' : 'text-slate-400'}`}>
              <span>{isRtl ? 'فاتورة سنوية' : 'Annual Billing'}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                {isRtl ? 'وفر 20%' : 'Save 20%'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Pricing Plans Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isHighlighted = plan.highlight;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border transition-all duration-300 relative ${
                  isHighlighted
                    ? 'bg-slate-900/95 border-indigo-500/60 shadow-2xl shadow-indigo-500/10 ring-2 ring-indigo-500/30 lg:-translate-y-2'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
                    {isRtl ? '⭐ الخيار الأكثر طلباً للشركات' : '⭐ Most Popular Enterprise Choice'}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase border ${plan.borderColor} ${plan.bgColor} text-${plan.color}-400`}>
                      {isRtl ? plan.badgeAr : plan.badge}
                    </span>
                    <div className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-${plan.color}-400`}>
                      {plan.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {isRtl ? plan.nameAr : plan.nameEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl ? plan.targetAr : plan.targetEn}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">${plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium mr-1">{isRtl ? plan.billingAr : plan.billingEn}</span>
                    </div>
                    <span className="text-xs text-slate-500 line-through font-mono">${plan.globalPrice}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      {isRtl ? 'المزايا والخدمات المتضمنة:' : 'Included Services & Sovereign Features:'}
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {(isRtl ? plan.featuresAr : plan.featuresEn).map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-200">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Payment Method Launchers */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block text-center">
                    {isRtl ? 'اختر وسيلة الدفع والتفعيل الفوري:' : 'Select Instant Payment Gateway:'}
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedBinancePlan(plan)}
                      className="py-2.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Binance Pay</span>
                    </button>

                    <button
                      onClick={() => setSelectedWirePlan(plan)}
                      className="py-2.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>SWIFT Wire</span>
                    </button>

                    <button
                      onClick={() => setSelectedInstaPayPlan(plan)}
                      className="py-2.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>InstaPay</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedProformaPlan(plan)}
                    className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {isRtl ? 'طلب فاتورة شكلية مبدئية (Proforma Invoice)' : 'Request Proforma Invoice'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Official Executive Direct Contact Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-start">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>{isRtl ? 'عقود الرعاية والاحتفاظ المؤسسي المخصص (Bespoke Retainers)' : 'Bespoke Institutional Retainers & Custom SLAs'}</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {isRtl
                ? 'للشركات الكبرى وصناديق الاستثمار التي تتطلب اتفاقيات مستوى خدمة مخصصة (Custom SLA) أو تحليلات سرية خاصة، يمكنك التنسيق المباشر مع رئيس مجلس الإدارة والمستشار الاستراتيجي د. محمد مصطفى.'
                : 'For large enterprises, sovereign entities, and custom SLAs requiring NDA-isolated deployments, contact Senior Partner Dr. Mohammad Mustafa directly.'}
            </p>
          </div>

          <a
            href="mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=Bespoke%20Enterprise%20Retainer%20Inquiry%20-%20JurisTech"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 shrink-0"
          >
            <Mail className="w-4 h-4 text-slate-950" />
            <span>{isRtl ? 'مراسلة المستشار الاستراتيجي' : 'Contact Senior Counsel'}</span>
          </a>
        </div>
      </div>

    </div>
  );
}
