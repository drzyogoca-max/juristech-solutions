/**
 * src/pages/PaymentPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strategic Pricing & Sovereign Payment Gateway
 * Enhanced with 2026 Sovereign AI Services (Google AI Pro, M&A Intelligence,
 * Virtual Litigation, Stylometric Fraud Detection, Cross-Border Compliance).
 * 3-Tier Pricing: Startup $49 / SMEs $139 / Enterprise $349/mo (30% Discounted).
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign, Shield, Zap, Lock, Building2, CheckCircle2, CreditCard,
  Globe, Mail, Sparkles, Star, ArrowRight, Users, TrendingUp, Cpu,
  ShieldCheck, BarChart3, FileText, Wifi, Crown, Building, Smartphone,
  BrainCircuit, Scale, ShieldAlert, Award, MessageSquare, Clock, X,
  HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import BankWireModal from '../components/BankWireModal';
import BinancePayModal from '../components/BinancePayModal';
import InstaPayModal from '../components/InstaPayModal';
import ProformaInvoiceModal from '../components/ProformaInvoiceModal';
import DigitalInvoiceModal from '../components/DigitalInvoiceModal';
import GumroadPayModal from '../components/GumroadPayModal';
import GlobalLegalDisclaimer from '../components/GlobalLegalDisclaimer';
import { activateUserSubscription, BillingTransaction } from '../lib/financialGateway';
import { usePlatformLocale } from '../lib/universalTranslator';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export function buildWhatsAppConciergeUrl(
  plan?: { nameAr?: string; nameEn?: string; price?: number } | null,
  isAr: boolean = false
): string {
  const planName = plan ? (isAr ? (plan.nameAr || 'باقة الاشتراك') : (plan.nameEn || 'Subscription Plan')) : (isAr ? 'باقة الاشتراك' : 'Subscription Plan');
  const priceSuffix = plan?.price ? ` ($${plan.price}${isAr ? '/شهرياً' : '/month'})` : '';
  const message = isAr
    ? `مرحباً د. محمد مصطفى، أرغب في المساعدة في إتمام الدفع وتفعيل الاشتراك للباقة: ${planName}${priceSuffix}. يرجى تزويدي بإجراءات السداد والتفعيل.`
    : `Hello Dr. Mohammad Mustafa, I would like assisted checkout & payment assistance to activate the ${planName}${priceSuffix}. Please provide payment and activation steps.`;
  return `https://wa.me/201126674337?text=${encodeURIComponent(message)}`;
}

interface Plan {
  id: 'startup' | 'sme' | 'enterprise' | 'dealroom';
  tierKey: 'pro' | 'enterprise';
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

const SUPPORT_EMAIL = 'founder@juristech.solutions';

export default function PaymentPage() {
  const { l, isRtl, gt, i18n } = usePlatformLocale();

  const [selectedWirePlan, setSelectedWirePlan] = useState<Plan | null>(null);
  const [selectedBinancePlan, setSelectedBinancePlan] = useState<Plan | null>(null);
  const [selectedInstaPayPlan, setSelectedInstaPayPlan] = useState<Plan | null>(null);
  const [selectedProformaPlan, setSelectedProformaPlan] = useState<Plan | null>(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCardPlan, setSelectedCardPlan] = useState<Plan | null>(null);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const PAYMENT_FAQS = [
    {
      qAr: 'كيف يتم تفعيل الحساب والوصول للخدمات بعد السداد؟',
      qEn: 'How is account access activated after payment?',
      aAr: 'يتم تفعيل الحساب فورياً وبشكل تلقائي بمجرد نجاح العملية عبر البطاقة أو بوابات الدفع الإلكترونية. في حالة التحويل البنكي SWIFT، يتم الاعتماد والتفعيل فور مراجعة الإشعار البنكي.',
      aEn: 'Access is activated instantly and automatically upon successful card/online transaction. For SWIFT bank wire, activation occurs immediately upon receipt verification.',
    },
    {
      qAr: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
      qEn: 'Can I cancel my subscription at any time?',
      aAr: 'نعم، يمكنك إلغاء التجديد التلقائي في أي وقت من خلال لوحة إدارة الفوترة (/billing) بنقرة زر واحدة دون أي رسوم خفية أو شروط جزائية.',
      aEn: 'Yes, you can cancel auto-renewal at any time from your Billing Portal (/billing) with one click and zero cancellation fees.',
    },
    {
      qAr: 'ما هي سياسة الاسترداد والضمانات التجارية المعتمدة؟',
      qEn: 'What is your refund policy and commercial guarantee?',
      aAr: 'نحن نلتزم بالشفافية الكاملة وسياسة استرداد واضحة ومعلنة رسمياً عبر صفحة (/refund). يحق للمشترك طلب استرداد خلال 14 يوماً وفق شروط الاستخدام المحددة.',
      aEn: 'We adhere to complete commercial transparency and a published Refund Policy (/refund), permitting refund requests within 14 days under defined service terms.',
    },
    {
      qAr: 'هل تقدمون فواتير ضريبية رسمية للشركات والمؤسسات؟',
      qEn: 'Do you issue corporate tax and pro-forma invoices?',
      aAr: 'نعم، تصدر المنصة فواتير إلكترونية متوافقة مع المتطلبات المحاسبية، كما نوفر طلب فواتير شكلية (Proforma Invoice) مباشرة للمشتريات المؤسسية.',
      aEn: 'Yes, our engine generates compliant digital tax receipts, and enterprise clients can request official Pro-Forma Invoices directly from this page.',
    },
  ];

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
      price: 49,
      globalPrice: 70,
      billingEn: '/ month',
      billingAr: '/ شهرياً',
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
        'DealShield 360™: 3 Enterprise Need Diagnostics / month',
        'Regional Coverage (Saudi Arabia, UAE, Egypt, Jordan)',
        'Standard AES-256 Cryptographic Cloud Vault',
      ],
      featuresAr: [
        'المستشار القانوني السيادي مدعوم بـ Google Gemini Pro (7 لغات)',
        'رفع وتفريغ حتى 10 عقود شهرياً (PDF, Word, TXT)',
        'كشف المخاطر التشريعية والشروط الجزائية الأساسية',
        'تصدير معتمد بصيغ PDF و Word (.docx) بالختم الرسمي',
        'DealShield 360™: 3 فحوصات تشخيصية لاحتياجات الشركة شهرياً',
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
      price: 139,
      globalPrice: 200,
      billingEn: '/ month',
      billingAr: '/ شهرياً',
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
        'Cross-Border Deal Simulator (15 Dual-Jurisdiction Simulations / mo)',
        'Harmonized Bridging Clauses for Multi-Jurisdiction Contracts',
        'Autonomous AI Negotiation Agents & Tactical Redlines',
        'Virtual Courtroom Simulation & Win Probability Forecasting',
        'Up to 50 Contract Audits & Multi-Format Ingestions / month',
        'Comprehensive 9-Jurisdiction Statutory Coverage (GCC, UK, US Delaware, EU)',
        'Two-Factor Authentication (2FA TOTP) + TLS 1.3 Security',
      ],
      featuresAr: [
        'كل مزايا باقة الشركات الصغرى والناشئة',
        'محرك Google AI Pro السيادي (تفكير فائق وتحليل عميق بالذكاء الاصطناعي)',
        'محاكي الصفقات العابرة للحدود (15 محاكاة نزاع وازدواج قضائي شهرياً)',
        'توليد بنود التجسير المنسجمة (Harmonized Bridging Clauses)',
        'وكلاء التفاوض الآلي وخطوط التعديل التكتيكية (Tactical Redlines)',
        'محاكاة جلسات المرافعة وتوقع نسب كسب القضايا والتحكيم التجاري',
        'تدقيق وتفريغ حتى 50 عقداً شهرياً بجميع الصيغ',
        'تغطية تشريعية كاملة لـ 9 ولايات قضائية (الخليج، بريطانيا، ديلاوير، أوروبا)',
        'مصادقة ثنائية مشفرة (2FA TOTP) وأمان TLS 1.3 فائق الأمان',
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
      price: 349,
      globalPrice: 500,
      billingEn: '/ month',
      billingAr: '/ شهرياً',
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
      support: 'Dedicated Technical Priority Concierge (Enterprise AI Systems)',
      supportAr: 'دعم فني وتنفيذي مباشر ومخصص 24/7 لأنظمة الذكاء الاصطناعي',
      featuresEn: [
        'Everything in SMEs & Growth Plan',
        'Unlimited DealShield 360™ Simulations (Up to 5 Jurisdictions Concurrently)',
        'Unlimited Predictive M&A Intelligence & Deal EBITDA Valuations',
        'Forensic Stylometric Fraud, Forgery & Tampering Detection',
        'Cross-Border Statutory Compliance (PDPL, GDPR, EU AI Act 2024, FATF AML)',
        'Unlimited Contract Audits & Instant Gap Identification',
        'Multi-User Departmental Access & Role-Based Control (RBAC)',
        'End-to-End Encrypted Sovereign Vault with Digital Timestamps',
        'Dedicated 24/7 Enterprise Technical Support Priority Access',
      ],
      featuresAr: [
        'كل مزايا حزمة الشركات المتوسطة والنمو',
        'محاكاة صفقات دولية غير محدودة عبر DealShield (حتى 5 ولايات قضائية معاً)',
        'الاستحواذ والاندماج التنبؤي غير المحدود وتقييم صفقات الـ M&A و EBITDA',
        'كشف التزوير والاحتيال والتحريف بالقياس النصي الحيوي (Forensic Stylometry)',
        'الامتثال التشريعي العابر للحدود (PDPL, GDPR, EU AI Act 2024, FATF AML)',
        'تدقيق وتوليد عقود غير محدود مع رصد فوري للثغرات الصامتة',
        'إدارة متعددة المستخدمين وأدوار الصلاحيات المتقدمة (RBAC)',
        'خزنة سحابية سيادية بتشفير طرفي E2EE وطوابع زمنية رقمية معتمدة',
        'دعم فني مخصص 24/7 لتشغيل المنظومة وأتمتة العقود',
      ],
    },
    {
      id: 'dealroom',
      tierKey: 'enterprise',
      badge: 'VIP Deal Room',
      badgeAr: 'غرفة الصفقات المؤسسية VIP',
      nameEn: 'VIP Institutional Deal Room Pass',
      nameAr: 'باقة غرفة الصفقات المؤسسية الكبرى والاستحواذ',
      targetEn: 'High-Stakes M&A, Sovereign Funds & Cross-Border Joint Ventures',
      targetAr: 'صفقات الاستحواذ المليونية، الصناديق السيادية، والتحالفات الدولية',
      price: 999,
      globalPrice: 1500,
      billingEn: ' / one-time deal pass',
      billingAr: ' / دفعة واحدة للصفقة',
      descEn: 'Dedicated Deal Room, W&I Audit, SPA Custom Drafting & SWIFT Concierge.',
      descAr: 'غرفة صفقات مخصصة، فحص W&I، صياغة اتفاقيات SPA، وتنسيق مصرفي SWIFT.',
      color: 'rose',
      borderColor: 'border-rose-500/50',
      bgColor: 'bg-rose-500/5',
      icon: <Award className="w-7 h-7" />,
      contractLimit: 'Full Dedicated Deal Room Vault',
      contractLimitAr: 'غرفة صفقات كاملة ومستقلة لكل أطراف الصفقة',
      apiAccess: 'Custom Enterprise Banking & SWIFT APIs',
      apiAccessAr: 'ربط مباشر مع البنوك وأنظمة الفواتير المعتمدة',
      security: 'Institutional-Grade AES-256 + Multi-Sign Escrow',
      securityAr: 'تشفير قياسي متقدم AES-256 + توقيع متعدد الأطراف مشفر',
      support: 'Advanced Technical Risk Analysis & DealShield 360 Support',
      supportAr: 'إشراف تقني وتحليلي متقدم لمخاطر الصفقات عبر DealShield 360',
      featuresEn: [
        'Dedicated Multi-Party Virtual Deal Room & Redlining Portal',
        'Complete M&A Due Diligence & Warranties & Indemnities (W&I) Audit',
        'Bespoke Share Purchase Agreement (SPA) & Term Sheet Drafting',
        'Full DealShield 360™ Multi-Jurisdiction Clash Harmonization',
        'Pro-Forma Tax Invoicing & Direct SWIFT Wire Remittance',
        'Certified Cryptographic SHA-256 E-Signatures for All Parties',
        'Direct Priority Concierge & Technical Deal Flow Support',
      ],
      featuresAr: [
        'غرفة صفقات افتراضية مخصصة متعددة الأطراف مع مفاوضة مباشرة',
        'فحص نافي للجهالة شامل (W&I Audit) لكشف الالتزامات والضمانات الخفية',
        'صياغة مخصصة لاتفاقيات شراء الأسهم (SPA) ومذكرات الشروط Term Sheets',
        'محاكاة وتوافق تشريعي شامل عبر DealShield 360 لجميع أطراف الصفقة',
        'فاتورة ضريبية رسمية معتمدة ومتابعة مصرفية للتحويل البنكي SWIFT',
        'توقيعات رقمية مشفرة SHA-256 معتمدة لجميع ممثلي الشركات',
        'إشراف تقني وتحليلي متقدم لمخاطر الصفقات عبر DealShield 360',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 selection:bg-cyan-500 selection:text-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
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

      {/* Direct Card & Apple Pay Checkout Modal (Gumroad MoR Gateway) */}
      {cardModalOpen && selectedCardPlan && (
        <GumroadPayModal
          isOpen={cardModalOpen}
          plan={{
            id: selectedCardPlan.id,
            name: isRtl ? selectedCardPlan.nameAr : selectedCardPlan.nameEn,
            nameAr: selectedCardPlan.nameAr,
            nameEn: selectedCardPlan.nameEn,
            price: selectedCardPlan.price,
            description: isRtl ? selectedCardPlan.descAr : selectedCardPlan.descEn
          }}
          onClose={() => {
            setCardModalOpen(false);
            setSelectedCardPlan(null);
          }}
          onSelectAlternative={(method, passedPlan) => {
            const planId = passedPlan?.id || selectedCardPlan?.id;
            const fullPlan = plans.find(p => p.id === planId) || selectedCardPlan || plans[0];
            setCardModalOpen(false);
            setSelectedCardPlan(null);
            if (method === 'wire') setSelectedWirePlan(fullPlan);
            else if (method === 'binance') setSelectedBinancePlan(fullPlan);
            else if (method === 'instapay') setSelectedInstaPayPlan(fullPlan);
            else if (method === 'proforma') setSelectedProformaPlan(fullPlan);
          }}
        />
      )}

      {/* Hero Header */}
      <div className="relative py-14 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#0D1F3C]/90 via-[#071629]/95 to-[#020B1A]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/40 shadow-sm backdrop-blur-xl">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              {l('باقات الاشتراكات والخدمات السيادية لعام 2026', 'Sovereign Retainer Tiers 2026')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {l('باقات الاشتراك وتفعيل ', 'Sovereign Retainer Plans & ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              {l('الخدمات الذكية السيادية', 'Enterprise Intelligence')}
            </span>
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed font-normal">
            {l(
              'اختر الباقة المناسبة لمؤسستك واستفد من محرك Google AI Pro السيادي، الاستحواذ التنبؤي M&A، التفاوض الآلي، والمحاكاة القضائية مع تسوية فورية عبر البطاقات الائتمانية و Apple Pay، بوابة Binance Pay، التحويلات البنكية SWIFT، أو إنستا باي.',
              'Empower your enterprise with Google AI Pro Sovereign Core, predictive M&A valuations, autonomous negotiation, and virtual dispute simulation with verified institutional settlement.'
            )}
          </p>
        </div>
      </div>

      {/* 4 Sovereign Pricing Plans Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isHighlighted = plan.highlight;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 border transition-all duration-300 relative backdrop-blur-xl ${
                  isHighlighted
                    ? 'bg-[#0D1F3C]/95 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/20 lg:-translate-y-2'
                    : 'bg-slate-900/80 dark:bg-[#0B1528]/85 border-white/10 hover:border-amber-400/30 shadow-xl'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
                    {l('⭐ الأكثر طلباً للشركات', '⭐ Most Popular Enterprise Choice')}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase border ${plan.borderColor} ${plan.bgColor} text-${plan.color}-400`}>
                      {l(plan.badgeAr, plan.badge)}
                    </span>
                    <div className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-${plan.color}-400`}>
                      {plan.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {l(plan.nameAr, plan.nameEn)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {l(plan.targetAr, plan.targetEn)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">${plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium mr-1">{l(plan.billingAr, plan.billingEn)}</span>
                    </div>
                    <span className="text-xs text-slate-500 line-through font-mono">${plan.globalPrice}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      {l('المزايا والخدمات المتضمنة:', 'Included Services & Sovereign Features:')}
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {(isRtl ? plan.featuresAr : plan.featuresEn).map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-200">{l(plan.featuresAr[fIdx] || f, f)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Payment Method Launchers */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 text-center font-medium">
                    <Lock className="w-3 h-3 text-cyan-400 inline-block mr-1.5" />
                    <span>{l('طرق دفع إلكترونية آمنة ومعتمدة متاحة عند إتمام الطلب.', 'Secure payment methods available at checkout.')}</span>
                  </div>
                  {/* Direct Credit Card & Apple Pay Option via Gumroad */}
                  <button
                    onClick={() => {
                      setSelectedCardPlan(plan);
                      setCardModalOpen(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>{l('الدفع المباشر بالبطاقة الائتمانية و Apple Pay', 'Direct Card & Apple Pay Checkout')}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  </button>

                  {/* High-Touch Assisted Checkout: WhatsApp Executive Concierge */}
                  <a
                    href={buildWhatsAppConciergeUrl(plan, isRtl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`whatsapp-concierge-${plan.id}`}
                    className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{l('مساعدة فورية عبر واتساب الإدارة التنفيذية', 'WhatsApp Executive Concierge')}</span>
                  </a>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
                    <span>{l('أو سدد عبر القنوات المباشرة المعتمدة:', 'Or pay via direct verified channels:')}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedBinancePlan(plan)}
                      className="py-2 px-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3 h-3 text-amber-400" />
                      <span>Binance Pay</span>
                    </button>

                    <button
                      onClick={() => setSelectedWirePlan(plan)}
                      className="py-2 px-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Building2 className="w-3 h-3 text-sky-400" />
                      <span>SWIFT Wire</span>
                    </button>

                    <button
                      onClick={() => setSelectedInstaPayPlan(plan)}
                      className="py-2 px-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>InstaPay</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedProformaPlan(plan)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{l('طلب فاتورة ضريبية رسمية / تحويل بنكي (B2B VAT)', 'Request Corporate VAT Invoice / SWIFT')}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional & Corporate Procurement Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0D1F3C] via-[#142847] to-[#0D1F3C] border border-amber-400/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{l('التعاقد المؤسسي المباشر للشركات والجهات الحكومية', 'Enterprise & Government Direct Procurement')}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VAT Compliant 2026
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {l(
                  'هل تحتاج مؤسستك إلى فاتورة ضريبية رسمية معتمدة (VAT)، أو اتفاقية سرية NDA موقعة مسبقاً، أو عرض أسعار مخصص لمجموعة مستخدمين؟ فريقنا المالي يوفر كافة مستندات الشراء الرسمية مع السداد عبر التحويل البنكي المباشر (SWIFT).',
                  'Does your organization require an official VAT invoice, mutual NDA, custom user-seat retainer, or flexible enterprise vendor onboarding? Our procurement desk provides full billing documentation and direct SWIFT settlement.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setSelectedProformaPlan(plans[2] || plans[0])}
              className="flex-1 md:flex-initial py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{l('طلب فاتورة ضريبية معتمدة', 'Request Official VAT Invoice')}</span>
            </button>
            <a
              href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%86%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A8%20%D8%B9%D8%B1%D8%B6%20%D8%B3%D8%B9%D8%B1%20%D9%85%D8%A4%D8%B3%D8%B3%D9%8A%20%D9%88%D9%81%D8%A7%D8%AA%D9%88%D8%B1%D8%A9%20%D8%B6%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D9%84%D8%B4%D8%B1%D9%83%D8%AA%D9%86%D8%A7"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{l('استشارة المشتريات', 'Procurement Desk')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Transparent Refund Policy & Consumer Protection Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                {l('سياسة الاسترداد والضمان التجاري', 'Refund Policy & Commercial Guarantee')}
              </h3>
            </div>
            <Link
              to="/refund"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>{l('قراءة السياسة الرسمية الكاملة للاسترداد', 'Read Official Refund Terms')}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {l(
              'تلتزم JurisTech Solutions بأعلى معايير الشفافية والامتثال التجاري. نوفر ضمان استرداد وفق الحالات المنصوص عليها نظاماً خلال 14 يوماً من تاريخ التفعيل للخدمات الرقمية غير المستهلكة. لمزيد من التفاصيل، راجع شروط الخدمة وسياسة الاسترداد.',
              'JurisTech Solutions complies with international consumer protection standards. Digital subscription services are eligible for refund review under defined conditions within 14 days of activation for unconsumed quota.'
            )}
          </p>
        </div>
      </div>

      {/* Payment & Subscription FAQs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>{l('الأسئلة الشائعة حول الاشتراكات وطرق الدفع', 'Payment & Subscription FAQs')}</span>
          </h3>

          <div className="space-y-2.5">
            {PAYMENT_FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-4 text-start flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <span>{isRtl ? faq.qAr : faq.qEn}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-900 pt-3">
                    {isRtl ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Legal Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <GlobalLegalDisclaimer variant="card" />
      </div>

      {/* Official Executive Direct Contact Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0D1F3C]/90 via-[#071629]/95 to-[#020B1A] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
          <div className="space-y-1 text-center md:text-start">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>{l('عقود الرعاية والاحتفاظ المؤسسي المخصص (Bespoke Retainers)', 'Bespoke Institutional Retainers & Custom SLAs')}</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {l(
                'للشركات الكبرى وصناديق الاستثمار التي تتطلب اتفاقيات مستوى خدمة مخصصة (Custom SLA) أو تكامل برمجي مخصص، يمكنك التنسيق المباشر مع الإدارة التنفيذية والتقنية برئاسة د. محمد مصطفى (المؤسس ورئيس مجلس الإدارة وخبير إدارة المخاطر).',
                'For large enterprises, sovereign entities, and custom SLAs requiring dedicated software deployments, contact Executive Leadership headed by Dr. Mohammad Mustafa (Founder & Chairman, Risk Management Specialist).'
              )}
            </p>
            <p className="text-[11px] text-amber-400 font-mono pt-1">
              {l('منصة رقمية عالمية — تعمل عن بعد وفق أعلى معايير الحوكمة', 'Global Digital Platform — Remotely operated with Tier-1 governance')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AF.%20%D9%85%D8%AD%D9%85%D8%AF%20%D9%85%D8%B5%D8%B7%D9%81%D9%89%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D9%86%D8%B3%D9%8A%D9%82%20%D8%A7%D9%84%D9%85%D8%A8%D8%A7%D8%B4%D8%B1%20%D9%84%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D8%A7%D9%84%D9%85%D9%86%D8%B5%D8%A9%20(Assisted%20Checkout)"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-executive-contact-strip"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>{l('مساعدة فورية عبر واتساب الإدارة التنفيذية', 'WhatsApp Executive Concierge')}</span>
            </a>

            <a
              href="mailto:founder@juristech.solutions?subject=Bespoke%20Enterprise%20Retainer%20Inquiry%20-%20JurisTech"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{l('مراسلة الإدارة التنفيذية والتقنية', 'Contact Executive Leadership')}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
