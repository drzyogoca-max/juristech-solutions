/**
 * src/pages/PrivacyPolicyPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive Privacy Policy — Juristech.solutions
 * GDPR Art.13/14, eIDAS, ISO/IEC 27001, GCC Data Protection.
 * Updated: August 2026
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Lock, Eye, FileText, Server, UserCheck,
  Cookie, Bell, Key, Database, Globe, Mail, CheckCircle, AlertTriangle
} from 'lucide-react';
import SEO from '../components/SEO';

const DPO_EMAIL = 'juristech.solutions@outlook.com';

export default function PrivacyPolicyPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggle = (i: number) => setOpenSection(openSection === i ? null : i);

  const principles = [
    {
      icon: <Lock className="w-6 h-6" />,
      color: 'emerald',
      titleAr: 'تشفير شامل AES-256',
      titleEn: 'End-to-End AES-256 Encryption',
      descAr: 'جميع العقود والمحادثات ووثائق السويفت مشفرة أثناء النقل وأثناء التخزين.',
      descEn: 'All contracts, chats & SWIFT documents encrypted in transit and at rest.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      color: 'blue',
      titleAr: 'عزل الوصول الصارم (RLS)',
      titleEn: 'Strict Access Isolation (RLS)',
      descAr: 'السجلات المالية مقيدة حصراً للمديرين الماليين المعتمدين عبر سياسات RLS.',
      descEn: 'Financial records exclusively restricted to verified Financial Admins via RLS policies.',
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      color: 'purple',
      titleAr: 'حقوق GDPR الكاملة',
      titleEn: 'Full GDPR Rights',
      descAr: 'تصدير البيانات، التصحيح، والحق في النسيان وفق أنظمة الاتحاد الأوروبي.',
      descEn: 'Data export, rectification & right-to-be-forgotten under EU regulations.',
    },
    {
      icon: <Key className="w-6 h-6" />,
      color: 'amber',
      titleAr: 'التحقق الثنائي (2FA)',
      titleEn: 'Two-Factor Authentication',
      descAr: 'طبقة أمان إضافية إلزامية لحسابات الإدارة وبيانات التحليلات الحساسة.',
      descEn: 'Mandatory additional security layer for admin accounts and sensitive analytics.',
    },
    {
      icon: <Database className="w-6 h-6" />,
      color: 'cyan',
      titleAr: 'عدم بيع البيانات',
      titleEn: 'Zero Data Selling',
      descAr: 'لا تُباع أو تُشارك بياناتك مع أطراف ثالثة لأغراض تسويقية أبداً.',
      descEn: 'Your data is never sold or shared with third parties for marketing purposes.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      color: 'indigo',
      titleAr: 'خوادم معتمدة دولياً',
      titleEn: 'ISO/IEC 27001 Infrastructure',
      descAr: 'بنية تحتية سحابية متوافقة مع ISO/IEC 27001 وتقع في مراكز بيانات أوروبية.',
      descEn: 'Cloud infrastructure compliant with ISO/IEC 27001, hosted in European data centers.',
    },
  ];

  const sections = [
    {
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      titleAr: '١. جمع المعلومات واستخدامها',
      titleEn: '1. Information Collection & Usage',
      bodyAr: `تجمع Juristech.solutions المعلومات الضرورية لتقديم المساعدة القانونية بالذكاء الاصطناعي وإدارة العقود والاشتراكات. تشمل هذه المعلومات: بيانات تسجيل الحساب (الاسم، البريد الإلكتروني)، محتوى العقود المرفوعة للتحليل، وثائق التحقق من التحويلات البنكية (SWIFT)، بيانات الاستخدام لتحسين تجربة المستشار الذكي "جوريس". لا تُستخدم هذه البيانات إلا لأغراض تشغيل الخدمة وتحسينها.`,
      bodyEn: `Juristech.solutions collects information necessary for AI legal assistance, contract management, and subscription services. This includes: account registration data (name, email), contract content uploaded for AI analysis, SWIFT bank transfer verification documents, and usage analytics to improve the "Juris" AI advisor experience. This data is used exclusively for service operation and improvement purposes.`,
    },
    {
      icon: <Server className="w-5 h-5 text-blue-400" />,
      titleAr: '٢. خزنة إيصالات السويفت وضمانات البيانات المالية',
      titleEn: '2. SWIFT Receipt Vault & Financial Data Safeguards',
      bodyAr: `جميع إيصالات التحويلات البنكية (نسخ SWIFT) المرفوعة لتفعيل الاشتراكات تُوجَّه تلقائياً إلى الخزنة المالية المعزولة. الوصول مقيد حصراً لطاقم التدقيق المالي المعتمد. صور التحويلات البنكية لا تُفهرس أو تُكشف لأطراف ثالثة في أي ظرف من الظروف. تُحذف وثائق SWIFT تلقائياً بعد مرور 7 سنوات من تاريخ الإيداع وفق اشتراطات الاحتفاظ القانوني.`,
      bodyEn: `All bank transfer receipts (SWIFT copies) uploaded for subscription activation are automatically routed to our isolated financial vault. Access is restricted exclusively to authorized financial auditing staff. Wire transfer images are never indexed or exposed to third parties under any circumstances. SWIFT documents are automatically deleted after 7 years from deposit date per legal retention requirements.`,
    },
    {
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      titleAr: '٣. خدمات الطرف الثالث والتحويلات الدولية',
      titleEn: '3. Third-Party Services & International Transfers',
      bodyAr: `نتشارك فقط مع مزودي خدمة معتمدين يستوفون معايير ISO/IEC 27001 وeIDAS وGDPR. البيانات المُعالَجة لأغراض التحليل القانوني تُدار عبر خوادم معزولة آمنة. مزودو الخدمة المعتمدون لدينا: Supabase (قاعدة البيانات)، Vercel (الاستضافة)، Google Gemini AI (نماذج الذكاء الاصطناعي). لا تُنقل بياناتك إلى دول خارج نطاق الحماية المعتمدة إلا مع ضمانات تعاقدية مناسبة.`,
      bodyEn: `We partner exclusively with certified service providers compliant with ISO/IEC 27001, eIDAS, and GDPR standards. Data processed for legal analysis is handled through secure isolated server instances. Our certified providers include: Supabase (database), Vercel (hosting), Google Gemini AI (AI models). Data is not transferred to non-adequate jurisdictions without appropriate contractual safeguards.`,
    },
    {
      icon: <Cookie className="w-5 h-5 text-amber-400" />,
      titleAr: '٤. سياسة ملفات تعريف الارتباط (Cookies)',
      titleEn: '4. Cookie Policy',
      bodyAr: (
        <div className="space-y-3">
          <p>تستخدم المنصة ملفات تعريف الارتباط للأغراض التالية:</p>
          <div className="space-y-2 text-xs">
            {[
              { type: 'ضرورية', desc: 'جلسات المصادقة وإعدادات اللغة والأمان — لا يمكن تعطيلها', color: 'red' },
              { type: 'وظيفية', desc: 'حفظ تفضيلات المستخدم وسجل المحادثات المحلي', color: 'amber' },
              { type: 'تحليلية', desc: 'تتبع أنماط الاستخدام لتحسين الخدمة (بيانات مجهولة الهوية)', color: 'blue' },
            ].map(({ type, desc, color }) => (
              <div key={type} className={`flex items-start gap-2.5 p-2.5 rounded-xl bg-${color}-500/8 border border-${color}-500/20`}>
                <span className={`font-black text-${color}-400 shrink-0`}>{type}:</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-3">
          <p>The platform uses cookies for the following purposes:</p>
          <div className="space-y-2 text-xs">
            {[
              { type: 'Essential', desc: 'Authentication sessions, language settings & security — cannot be disabled', color: 'red' },
              { type: 'Functional', desc: 'User preference storage and local conversation history', color: 'amber' },
              { type: 'Analytical', desc: 'Usage pattern tracking to improve services (anonymized data)', color: 'blue' },
            ].map(({ type, desc, color }) => (
              <div key={type} className={`flex items-start gap-2.5 p-2.5 rounded-xl bg-${color}-500/8 border border-${color}-500/20`}>
                <span className={`font-black text-${color}-400 shrink-0`}>{type}:</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Bell className="w-5 h-5 text-sky-400" />,
      titleAr: '٥. الإشعارات الأمنية وسجلات التدقيق',
      titleEn: '5. Security Alerts & Audit Logs',
      bodyAr: `يُفعَّل نظام تسجيل الأحداث الأمنية (Security Audit Logger) تلقائياً لرصد: محاولات تسجيل الدخول المشبوهة، الوصول من عناوين IP محجوبة، محاولات تجاوز بوابة WAF. تُرسَل تنبيهات أمنية فورية بالبريد الإلكتروني للمسؤولين عند أي حدث بمستوى (WARNING) أو (CRITICAL). تُحسب بصمات SHA-256 لكل حدث لضمان عدم التلاعب بالسجلات.`,
      bodyEn: `The Security Audit Logger is automatically activated to monitor: suspicious login attempts, access from blocked IP addresses, and WAF gateway bypass attempts. Instant security email alerts are sent to administrators for any (WARNING) or (CRITICAL) severity event. SHA-256 fingerprints are computed for each log entry to ensure immutability.`,
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      titleAr: '٦. حقوقك وفق اللائحة الأوروبية GDPR',
      titleEn: '6. Your Rights Under GDPR',
      bodyAr: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            ['حق الوصول', 'الاطلاع على بياناتك المخزنة'],
            ['حق التصحيح', 'تعديل البيانات الخاطئة أو غير الدقيقة'],
            ['حق الحذف', 'طلب مسح بياناتك (الحق في النسيان)'],
            ['حق التنقل', 'الحصول على بياناتك بصيغة قابلة للنقل'],
            ['حق الاعتراض', 'الاعتراض على معالجة بياناتك'],
            ['حق تقييد المعالجة', 'تحديد استخدام بياناتك'],
          ].map(([right, desc]) => (
            <div key={right} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-white">{right}</div>
                <div className="text-slate-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
      bodyEn: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            ['Right of Access', 'View all personal data we store about you'],
            ['Right of Rectification', 'Correct inaccurate or incomplete data'],
            ['Right to Erasure', 'Request deletion of your data (right to be forgotten)'],
            ['Right to Portability', 'Receive your data in a machine-readable format'],
            ['Right to Object', 'Object to processing of your personal data'],
            ['Right to Restriction', 'Limit how your data is used'],
          ].map(([right, desc]) => (
            <div key={right} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-white">{right}</div>
                <div className="text-slate-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Mail className="w-5 h-5 text-sky-400" />,
      titleAr: '٧. التواصل مع مسؤول حماية البيانات (DPO)',
      titleEn: '7. Contact Our Data Protection Officer (DPO)',
      bodyAr: (
        <div className="space-y-3">
          <p>لطلبات تصدير GDPR أو الحذف أو سجلات التدقيق الأمنية أو أي استفسار يتعلق بالخصوصية، تواصل مع فريق DPO:</p>
          <a href={`mailto:${DPO_EMAIL}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold hover:bg-sky-500/20 transition-colors">
            <Mail className="w-4 h-4" />
            {DPO_EMAIL}
          </a>
          <p className="text-xs text-slate-400">⏱ {isRtl ? 'وقت الرد المستهدف: خلال 72 ساعة عمل' : 'Target response time: within 72 business hours'}</p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-3">
          <p>For GDPR data export/deletion requests, security audit log inquiries, or any privacy-related matter, contact our DPO team:</p>
          <a href={`mailto:${DPO_EMAIL}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold hover:bg-sky-500/20 transition-colors">
            <Mail className="w-4 h-4" />
            {DPO_EMAIL}
          </a>
          <p className="text-xs text-slate-400">⏱ Target response time: within 72 business hours</p>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'} | Juristech.solutions`}
        description={isRtl
          ? 'سياسة الخصوصية الشاملة لمنصة Juristech.solutions — GDPR, eIDAS, ISO/IEC 27001'
          : 'Comprehensive Privacy Policy for Juristech.solutions — GDPR, eIDAS & ISO/IEC 27001 compliant.'}
      />

      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isRtl ? 'سياسة الخصوصية الشاملة' : 'Comprehensive Privacy Policy'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'خصوصية مستنداتك القانونية وأمان بياناتك هي أعلى أولوياتنا. امتثال كامل مع GDPR وeIDAS وISO/IEC 27001.'
              : 'Your legal document privacy and data security are our highest priorities. Full compliance with GDPR, eIDAS & ISO/IEC 27001.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['GDPR Art.13/14', 'eIDAS EU 910/2014', 'ISO/IEC 27001', 'AES-256 E2EE', 'SHA-256 Audit'].map((b) => (
              <span key={b} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold">{b}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {isRtl ? 'آخر تحديث:' : 'Last Updated:'} August 2026 · v2.4
          </p>
        </div>

        {/* ── 6 Principle Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map(({ icon, color, titleAr, titleEn, descAr, descEn }) => (
            <div key={titleEn} className={`p-5 rounded-2xl bg-${color}-500/8 border border-${color}-500/20 space-y-3 group hover:border-${color}-400/40 transition-all`}>
              <div className={`text-${color}-400`}>{icon}</div>
              <h3 className="text-sm font-black text-white">{isRtl ? titleAr : titleEn}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{isRtl ? descAr : descEn}</p>
            </div>
          ))}
        </div>

        {/* ── Security Status Strip ─────────────────────────────── */}
        <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">{isRtl ? 'نظام الأمان نشط:' : 'Security Systems Active:'}</span>
          </div>
          {['WAF Protection', 'E2EE Active', '2FA Enabled', 'Audit Logging', 'RLS Enforced'].map((s) => (
            <span key={s} className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> {s}
            </span>
          ))}
        </div>

        {/* ── Accordion Sections ────────────────────────────────── */}
        <div className="space-y-3">
          {sections.map((sec, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {sec.icon}
                  <span className="font-bold text-white text-sm">{isRtl ? sec.titleAr : sec.titleEn}</span>
                </div>
                <span className={`text-slate-400 text-lg transition-transform duration-200 ${openSection === i ? 'rotate-180' : ''}`}>›</span>
              </button>
              {openSection === i && (
                <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4 animate-fadeIn">
                  {typeof sec.bodyAr === 'string'
                    ? <p>{isRtl ? sec.bodyAr : sec.bodyEn}</p>
                    : (isRtl ? sec.bodyAr : sec.bodyEn)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Warning Notice ────────────────────────────────────── */}
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-amber-300">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {isRtl
              ? 'تحتفظ JurisTech Solutions بحق تحديث سياسة الخصوصية هذه دورياً. في حال إجراء تعديلات جوهرية، سيتم إخطارك عبر البريد الإلكتروني المسجل قبل 30 يوماً من تطبيقها.'
              : 'JurisTech Solutions reserves the right to update this Privacy Policy periodically. For material changes, registered users will be notified by email at least 30 days before implementation.'}
          </p>
        </div>

      </div>
    </div>
  );
}
