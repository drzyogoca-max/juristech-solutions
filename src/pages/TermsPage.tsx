/**
 * src/pages/TermsPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Official Terms of Use — Juristech.solutions
 * Fully compliant with GDPR, eIDAS EU Regulation 910/2014, ICC Arbitration Rules.
 * Updated: August 2026 — 10 comprehensive legal sections.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileCheck, ShieldAlert, Scale, CheckCircle, Lock, Globe,
  Landmark, AlertTriangle, Cpu, Mail, ShieldCheck, FileText
} from 'lucide-react';
import SEO from '../components/SEO';

const SUPPORT_EMAIL = 'juristech.solutions@outlook.com';

interface Section {
  icon: React.ReactNode;
  accent: string;
  numAr: string;
  numEn: string;
  titleAr: string;
  titleEn: string;
  bodyAr: React.ReactNode;
  bodyEn: React.ReactNode;
}

export default function TermsPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const sections: Section[] = [
    {
      icon: <FileCheck className="w-5 h-5 text-blue-400" />,
      accent: 'blue',
      numAr: '١', numEn: '1',
      titleAr: 'القبول والموافقة على الشروط',
      titleEn: 'Acceptance of Terms',
      bodyAr: (
        <p>
          بالوصول إلى منصة Juristech.solutions أو إنشاء حساب أو رفع مستندات للتحليل أو التوقيع الرقمي، فإنك توافق صراحةً على الالتزام بهذه الشروط والأحكام بالكامل، بما يشمل سياسة الخصوصية ومعايير التوافق القانوني الدولي. إذا كنت تمثل مؤسسة قانونية، فإن قبولك يُلزم المؤسسة كاملةً.
        </p>
      ),
      bodyEn: (
        <p>
          By accessing Juristech.solutions, creating an account, or uploading documents for AI analysis or digital signature, you expressly agree to be bound by these Terms in full, including our Privacy Policy and international compliance standards. If you represent a legal entity, your acceptance binds the organization in its entirety.
        </p>
      ),
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      accent: 'amber',
      numAr: '٢', numEn: '2',
      titleAr: 'التوقيع الرقمي eIDAS وحجيته القانونية',
      titleEn: 'eIDAS Digital Signature Legal Validity',
      bodyAr: (
        <div className="space-y-3">
          <p>
            التوقيعات الإلكترونية المنشأة عبر المنصة تمتثل لـ<strong> اللائحة الأوروبية رقم 910/2014 (eIDAS)</strong>. تُعدّ سجلات المراجعة المشفرة الناتجة عن عملية التوقيع دليلاً قانونياً ملزماً أمام المحاكم في الدول المشاركة في الاتحاد الأوروبي ودول GCC المتوافقة.
          </p>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            {['الختم الإلكتروني المؤهل (QES) معترف به في 27 دولة أوروبية', 'تُخزَّن سجلات التوقيع مشفرةً بـ SHA-256 لمدة 10 سنوات', 'طوابع زمنية موثقة وغير قابلة للتعديل'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
      bodyEn: (
        <div className="space-y-3">
          <p>
            Electronic signatures generated through our platform comply with <strong>EU Regulation No 910/2014 (eIDAS)</strong>. Cryptographic audit records generated during signing constitute binding legal proof across EU member state courts and compatible GCC jurisdictions.
          </p>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            {['Qualified Electronic Seal (QES) recognized in 27 EU member states', 'Signature records stored SHA-256 encrypted for 10 years', 'Immutable timestamped audit trail — tamper-proof'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      accent: 'emerald',
      numAr: '٣', numEn: '3',
      titleAr: 'الاشتراكات والمدفوعات عبر البوابات المعتمدة',
      titleEn: 'Subscription Activation & Direct Merchant Payments',
      bodyAr: (
        <div className="space-y-3">
          <p>
            تُفعَّل الاشتراكات عبر Binance Pay (USDT) أو التحويل البنكي SWIFT وتخضع لتحقق آلي من الاحتيال قبل تفعيل الخدمة. جميع المدفوعات نهائية وغير قابلة للاسترداد بعد التفعيل إلا في حالات العيوب التقنية الموثقة.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <div className="font-black">Binance Pay</div>
              <div className="text-slate-400">Drzyogo.ca@gmail.com</div>
              <div className="text-slate-400">User-444da · Zero Fees</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <div className="font-black">SWIFT Wire</div>
              <div className="text-slate-400">IBAN: EG310022012880211102491757001</div>
              <div className="text-slate-400">BIC: ABRKEGCAXXX</div>
            </div>
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-3">
          <p>
            Subscriptions activated via Binance Pay (USDT) or SWIFT bank wire are subject to automated fraud verification before service activation. All payments are final and non-refundable after activation, except in cases of documented technical platform defects.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <div className="font-black">Binance Pay</div>
              <div className="text-slate-400">Drzyogo.ca@gmail.com</div>
              <div className="text-slate-400">User-444da · Zero Fees</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <div className="font-black">SWIFT Wire</div>
              <div className="text-slate-400">IBAN: EG310022012880211102491757001</div>
              <div className="text-slate-400">BIC: ABRKEGCAXXX</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      accent: 'purple',
      numAr: '٤', numEn: '4',
      titleAr: 'الملكية الفكرية وحقوق المحتوى',
      titleEn: 'Intellectual Property & Content Rights',
      bodyAr: (
        <p>
          جميع محتويات المنصة — بما يشمل المساعد الذكي "جوريس"، محركات توليد العقود، خوارزميات تحليل المخاطر، قواعد البيانات القانونية، والتصميم البصري — هي ملكية فكرية حصرية لـ JurisTech Solutions. يُحظر نسخها أو تعديلها أو توزيعها أو هندستها عكسياً دون إذن كتابي مسبق. المستندات والعقود التي يرفعها المستخدم تبقى ملكاً له.
        </p>
      ),
      bodyEn: (
        <p>
          All platform content — including the "Juris" AI legal advisor, contract generation engines, risk analysis algorithms, legal databases, and visual design — constitutes the exclusive intellectual property of JurisTech Solutions. Reproduction, modification, distribution, or reverse-engineering is strictly prohibited without prior written authorization. Documents uploaded by users remain their exclusive property.
        </p>
      ),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      accent: 'red',
      numAr: '٥', numEn: '5',
      titleAr: 'حدود المسؤولية وإخلاء الضمانات',
      titleEn: 'Limitation of Liability & Warranty Disclaimer',
      bodyAr: (
        <div className="space-y-2">
          <p>
            المنصة توفر خدمات استشارة ذكاء اصطناعي قانوني وليست بديلاً عن المحامي المرخص. لا تُعدّ JurisTech Solutions مسؤولةً عن أي قرارات قانونية تتخذها بناءً على مخرجات الذكاء الاصطناعي، وذلك في حدود ما يسمح به القانون المعمول به.
          </p>
          <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-bold">
            ⚠️ {isRtl ? 'الحد الأقصى للمسؤولية لا يتجاوز قيمة الاشتراك المدفوع في الأشهر الثلاثة الأخيرة.' : 'Maximum liability is capped at the value of subscription fees paid in the prior 3 months.'}
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-2">
          <p>
            The platform provides AI-powered legal advisory services and does not substitute for a licensed attorney. JurisTech Solutions bears no liability for legal decisions made based on AI outputs, to the maximum extent permitted by applicable law.
          </p>
          <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-bold">
            ⚠️ Maximum liability is capped at the value of subscription fees paid in the prior 3 months.
          </div>
        </div>
      ),
    },
    {
      icon: <Landmark className="w-5 h-5 text-cyan-400" />,
      accent: 'cyan',
      numAr: '٦', numEn: '6',
      titleAr: 'اتفاقية مستوى الخدمة (SLA) وضمان التوفر',
      titleEn: 'Service Level Agreement (SLA) & Uptime Guarantee',
      bodyAr: (
        <div className="space-y-2">
          <p>
            تلتزم المنصة بتوفر <strong>99.5%</strong> سنوياً وفق اتفاقية مستوى الخدمة (SLA). في حال انخفاض التوفر عن هذه النسبة لأسباب تقنية خارجة عن نطاق القوة القاهرة، يحق للمشترك المطالبة بامتداد مدة الاشتراك بما يتناسب مع فترة الانقطاع.
          </p>
          <div className="flex gap-3 text-xs">
            {[['99.5%', 'ضمان التوفر', 'emerald'], ['< 4h', 'وقت الاستجابة', 'cyan'], ['24/7', 'مراقبة الخوادم', 'purple']].map(([val, label, color]) => (
              <div key={label} className={`flex-1 p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-center`}>
                <div className={`text-lg font-black text-${color}-400 font-mono`}>{val}</div>
                <div className="text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-2">
          <p>
            The platform guarantees <strong>99.5% annual uptime</strong> under this SLA. Should availability fall below this threshold due to non-force-majeure technical causes, subscribers are entitled to proportional subscription extensions matching the outage duration.
          </p>
          <div className="flex gap-3 text-xs">
            {[['99.5%', 'Uptime Guarantee', 'emerald'], ['< 4h', 'Response SLA', 'cyan'], ['24/7', 'Server Monitoring', 'purple']].map(([val, label, color]) => (
              <div key={label} className={`flex-1 p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-center`}>
                <div className={`text-lg font-black text-${color}-400 font-mono`}>{val}</div>
                <div className="text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      accent: 'emerald',
      numAr: '٧', numEn: '7',
      titleAr: 'التشفير الشامل وأمان البيانات',
      titleEn: 'End-to-End Encryption & Data Security',
      bodyAr: (
        <div className="space-y-2">
          <p>
            جميع البيانات المتبادلة — العقود، الملفات القانونية، سجلات المدفوعات — مشفرة بمعيار <strong>AES-256</strong> أثناء النقل (TLS 1.3) وأثناء التخزين. سجلات المراجعة الأمنية مختومة بـ SHA-256 ومحمية بسياسات RLS على قاعدة بيانات Supabase.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {['AES-256 Encryption', 'TLS 1.3 Transit', 'SHA-256 Audit Hash', 'Supabase RLS', 'GDPR Article 32'].map((t) => (
              <span key={t} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">{t}</span>
            ))}
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-2">
          <p>
            All exchanged data — contracts, legal files, and payment records — is encrypted with <strong>AES-256</strong> in transit (TLS 1.3) and at rest. Security audit logs are SHA-256 sealed and protected by Row-Level Security (RLS) policies on our Supabase infrastructure.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {['AES-256 Encryption', 'TLS 1.3 Transit', 'SHA-256 Audit Hash', 'Supabase RLS', 'GDPR Article 32'].map((t) => (
              <span key={t} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">{t}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      accent: 'orange',
      numAr: '٨', numEn: '8',
      titleAr: 'إنهاء الخدمة وتعليق الحساب',
      titleEn: 'Service Termination & Account Suspension',
      bodyAr: (
        <p>
          تحتفظ JurisTech Solutions بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط، أو تحاول التلاعب بمنظومة المدفوعات، أو تمارس نشاطاً احتيالياً — وذلك دون إشعار مسبق في الحالات الحرجة. في حالات الإنهاء العادي، يُرسَل إشعار لا يقل عن 14 يوماً مسبقاً. يمكن للمستخدم طلب تصدير بياناته خلال 30 يوماً من تاريخ الإنهاء.
        </p>
      ),
      bodyEn: (
        <p>
          JurisTech Solutions reserves the right to suspend or terminate accounts that violate these Terms, attempt to manipulate the payment system, or engage in fraudulent activity — without prior notice in critical cases. For standard terminations, a minimum 14-day advance notice is provided. Users may request data export within 30 days of account termination.
        </p>
      ),
    },
    {
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
      accent: 'indigo',
      numAr: '٩', numEn: '9',
      titleAr: 'القانون الحاكم والتحكيم الدولي',
      titleEn: 'Governing Law & International Arbitration',
      bodyAr: (
        <div className="space-y-2">
          <p>
            تخضع هذه الشروط لأحكام القانون الدولي التجاري، مع مراعاة القوانين الوطنية المعمول بها في دولة المستخدم. في حال نشوء أي نزاع، يُفضَّل حله أولاً بالتفاوض الودي خلال 30 يوماً، ثم بالتحكيم الدولي وفق قواعد:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['ICC Paris', 'DIAC Dubai', 'CRCICA Cairo', 'LCIA London'].map((arb) => (
              <span key={arb} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">{arb}</span>
            ))}
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-2">
          <p>
            These Terms are governed by international commercial law principles, subject to applicable national laws in the user's jurisdiction. Disputes shall first be resolved through good-faith negotiation within 30 days, then through binding international arbitration under:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['ICC Paris', 'DIAC Dubai', 'CRCICA Cairo', 'LCIA London'].map((arb) => (
              <span key={arb} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">{arb}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Mail className="w-5 h-5 text-sky-400" />,
      accent: 'sky',
      numAr: '١٠', numEn: '10',
      titleAr: 'التواصل الرسمي والاستفسارات القانونية',
      titleEn: 'Official Contact & Legal Counsel Inquiries',
      bodyAr: (
        <div className="space-y-2">
          <p>
            للاستفسارات المؤسسية، دعم التحكيم التعاقدي، أو توضيح الشروط، تواصل مع فريقنا التنفيذي:
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-sm hover:bg-sky-500/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      ),
      bodyEn: (
        <div className="space-y-2">
          <p>
            For enterprise inquiries, contract arbitration support, or terms clarification, contact our executive legal team:
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-sm hover:bg-sky-500/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      ),
    },
  ];

  const accentMap: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    red: 'border-red-500/30 bg-red-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
    orange: 'border-orange-500/30 bg-orange-500/5',
    indigo: 'border-indigo-500/30 bg-indigo-500/5',
    sky: 'border-sky-500/30 bg-sky-500/5',
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${isRtl ? 'شروط الاستخدام' : 'Terms of Use'} | Juristech.solutions`}
        description={isRtl
          ? 'الشروط والأحكام الرسمية لمنصة Juristech.solutions — متوافقة مع GDPR وeIDAS وقواعد ICC للتحكيم الدولي'
          : 'Official Terms of Use — Juristech.solutions, fully compliant with GDPR, eIDAS EU Regulation 910/2014, and ICC International Arbitration Rules.'}
      />

      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-400 mb-1">
            <Scale className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isRtl ? 'شروط الاستخدام والأحكام القانونية' : 'Terms of Use & Legal Standards'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'إطار الحوكمة القانونية الشاملة لمنصة Juristech.solutions — متوافق مع eIDAS وGDPR وقواعد ICC للتحكيم الدولي.'
              : 'Comprehensive legal governance framework for Juristech.solutions — compliant with eIDAS, GDPR & ICC International Arbitration Rules.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['GDPR Compliant', 'eIDAS EU 910/2014', 'ICC Arbitration', 'AES-256 Encrypted', 'ISO/IEC 27001'].map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold font-mono">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {isRtl ? 'آخر تحديث:' : 'Last Updated:'} August 2026 · v3.1
          </p>
        </div>

        {/* ── Compliance Strip ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <ShieldCheck className="w-5 h-5" />, label: isRtl ? 'توافق GDPR' : 'GDPR Compliant', color: 'emerald' },
            { icon: <FileText className="w-5 h-5" />, label: isRtl ? 'eIDAS معتمد' : 'eIDAS Certified', color: 'blue' },
            { icon: <Lock className="w-5 h-5" />, label: isRtl ? 'تشفير AES-256' : 'AES-256 Encrypted', color: 'purple' },
            { icon: <Globe className="w-5 h-5" />, label: isRtl ? 'تحكيم ICC دولي' : 'ICC Arbitration', color: 'cyan' },
          ].map(({ icon, label, color }) => (
            <div key={label} className={`p-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 flex flex-col items-center gap-2 text-center`}>
              {icon}
              <span className="text-xs font-bold text-slate-200">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Sections ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 sm:p-8 space-y-4 transition-all ${accentMap[sec.accent] || 'border-slate-800 bg-slate-900/40'}`}
            >
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0">
                  {sec.icon}
                </span>
                <span>
                  {isRtl ? sec.numAr : sec.numEn}.{' '}
                  {isRtl ? sec.titleAr : sec.titleEn}
                </span>
              </h2>
              <div className="text-sm leading-relaxed text-slate-300">
                {isRtl ? sec.bodyAr : sec.bodyEn}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer Notice ─────────────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl
              ? 'تحتفظ JurisTech Solutions بحق تعديل هذه الشروط في أي وقت، مع إشعار المستخدمين عبر البريد الإلكتروني المسجل قبل 14 يوماً من سريان التعديلات.'
              : 'JurisTech Solutions reserves the right to modify these Terms at any time. Users will be notified via registered email at least 14 days before amendments take effect.'}
          </p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xs text-sky-400 hover:text-sky-300 font-bold transition-colors">
            {SUPPORT_EMAIL}
          </a>
        </div>

      </div>
    </div>
  );
}
