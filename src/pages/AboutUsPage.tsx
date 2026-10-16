import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  Globe2, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Award, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Users,
  Mail
} from 'lucide-react';
import SEO from '../components/SEO';

import { usePlatformLocale } from '../lib/universalTranslator';

export default function AboutUsPage() {
  const { l, isRtl } = usePlatformLocale();

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-cyan-500 selection:text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={l('من نحن | JurisTech Solutions — الكيان التقني المستقل', 'About Us | JurisTech Solutions — Independent AI Tech Entity')}
        description={l('تعرف على الكيان التقني المستقل JurisTech Solutions، هندسة الذكاء الاصطناعي القانوني، ونظام حوكمة العقود.', 'Learn about JurisTech Solutions, the sovereign independent AI Legal SaaS engineering platform.')}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Badge & Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Building2 className="w-4 h-4" />
            <span>{l('الكيان التقني المستقل للمنظومة', 'Sovereign Technical Entity')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {l('عن المنصة:', 'About')} <span className="text-cyan-600 dark:text-cyan-400">JurisTech Solutions</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {l(
              'المنصة العالمية المستقلة للذكاء الاصطناعي العقدي والتدقيق التشريعي المصممة للأنظمة العربية والدولية.',
              'The global sovereign AI Legal Intelligence platform providing autonomous contract generation and legislative risk auditing.'
            )}
          </p>
        </div>

        {/* Global HQ & Legal Status Banner */}
        <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-cyan-950/40 dark:to-slate-900 border border-slate-200 dark:border-cyan-500/30 shadow-xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {l('الكيان التقني والهندسة السحابية الدولية', 'Global Cloud Engineering & SaaS Architecture')}
                </h2>
                <span className="text-xs text-cyan-400 font-mono block">
                  {l('منصة برمجيات قانونية سحابية مستقلة (Legal Tech SaaS)', 'Independent Cloud Legal Technology SaaS Platform')}
                </span>
                <span className="text-xs text-emerald-400 font-mono block mt-1">
                  ● {l('منصة رقمية عالمية — تعمل عن بعد', 'Global Digital Platform — Operated remotely')}
                </span>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
              ● SOVEREIGN AI LEGAL TECH SAAS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-slate-300">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>{isRtl ? 'الاستقلالية القانونية المطلقة' : 'Complete Legal Independence'}</span>
              </h3>
              <p>
                {isRtl
                  ? 'منصة JurisTech Solutions هي كيان تقني برمجي مستقل بذاته 100%، وتعتبر النطاق الموحد الرئيسي للحلول القانونية الذكية. المنصة ليست فرعاً أو وكيلاً أو مرتبطة بأي شكل من الأشكال بشركة LegalShield الأمريكية أو أي علامات تجارية عالمية أخرى تحمل أسماء مشابهة.'
                  : 'JurisTech Solutions is a 100% independent software entity and acts as the primary global master platform. It is not affiliated, associated, authorized, endorsed by, or in any way officially connected with LegalShield USA or any of its subsidiaries.'}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-cyan-400" />
                <span>{isRtl ? 'توحيد البيئة التكاملية (Integrative Ecosystem)' : 'Unified Integrative Ecosystem'}</span>
              </h3>
              <p>
                {isRtl
                  ? 'يتم تشغيل المنصتين (juristech.solutions و legalshieldsolution.online) ضمن بيئة تقنية متكاملة موحدة. المشتركين المفعلين في المنصة الإقليمية يتصلون مباشرة بنفس قاعدة البيانات الموحدة SSOT دون الحاجة إلى دفع أي رسوم إضافية أو إعادة تفعيل.'
                  : 'Both platforms (juristech.solutions & legalshieldsolution.online) run under a unified integrative ecosystem. Verified active subscribers automatically sync via a Single Source of Truth (SSOT) engine.'}
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Leadership Card */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {isRtl ? 'القيادة الاستراتيجية والعمادة الفنية' : 'Strategic Leadership & Advisory Board'}
              </h2>
              <p className="text-xs text-purple-400 font-mono font-bold">
                {isRtl ? 'د. محمد مصطفى — المؤسس ورئيس مجلس الإدارة (دكتوراه في إدارة المخاطر)' : 'Dr. Mohammad Mustafa — Founder & Chairman (PhD in Risk Management)'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isRtl
              ? 'تخضع منصة JurisTech Solutions للإشراف الاستراتيجي والعمادة الفنية برئاسة د. محمد مصطفى (المؤسس ورئيس مجلس الإدارة)، لضمان تطبيق أعلى معايير الحوكمة والتحليل التقني وإدارة المخاطر التشريعية كمنصة برمجيات قانونية (LegalTech SaaS).'
              : 'JurisTech Solutions is strategically led by Dr. Mohammad Mustafa (Founder & Chairman, PhD in Risk Management), ensuring high standards of technical governance, automated risk analysis, and SaaS compliance.'}
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 font-mono">
            <div className="text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'الاعتمادات والسير المهنية للفريق التنفيذي:' : 'Executive Credentials & Advisory Board:'}</div>
            <div className="text-cyan-400">{'{{TODO_OWNER: executive team credentials}}'}</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pt-1">
            <Mail className="w-4 h-4" />
            <span>founder@juristech.solutions</span>
          </div>
        </div>

        {/* Legal Entity & Licensing Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isRtl ? 'بيانات الكيان القانوني المشغّل' : 'Operating Legal Entity'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{isRtl ? 'التسجيل النظامي والمقر' : 'Registered Office & Status'}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'اسم الكيان القانوني:' : 'Legal Entity Name:'}</span>
                <span className="font-mono text-cyan-400">{'{{TODO_OWNER: legal entity name}}'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'رقم السجل التجاري / القيد:' : 'Registration Number:'}</span>
                <span className="font-mono text-cyan-400">{'{{TODO_OWNER: registration number}}'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'المقر النظامي المسجل:' : 'Registered Address:'}</span>
                <span className="font-mono text-cyan-400">{'{{TODO_OWNER: registered business address}}'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">{isRtl ? 'طبيعة النشاط:' : 'Activity Type:'}</span>
                <span className="text-slate-300">{isRtl ? 'برمجيات تقنية قانونية سحابية (SaaS)' : 'LegalTech Cloud SaaS'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isRtl ? 'التراخيص والشهادات والامتثال' : 'Licensing & Certifications'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{isRtl ? 'ضوابط التحقق المؤسسي' : 'Verification Baseline'}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'التراخيص التجارية / التشغيلية:' : 'Trade Licenses / Permits:'}</span>
                <span className="font-mono text-cyan-400">{'{{TODO_OWNER: trade licenses}}'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'الشهادات المعتمدة:' : 'Accredited Certifications:'}</span>
                <span className="font-mono text-cyan-400">{'{{TODO_OWNER: certifications}}'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{isRtl ? 'مزود نماذج الذكاء الاصطناعي:' : 'AI Model Provider:'}</span>
                <span className="text-slate-300">Google Cloud (Gemini 2.0 Flash)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">{isRtl ? 'معالجة البيانات:' : 'Data Processing:'}</span>
                <span className="text-emerald-400">{isRtl ? 'معالجة مؤقتة مشفرة بدون تدريب للنماذج' : 'Transient encrypted processing, zero retention for model training'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Legal Disclaimer Callout */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          <p className="font-bold text-amber-300 mb-1">
            {isRtl ? 'تنبيه قانوني هام للمستخدمين:' : 'Important Legal Notice to Users:'}
          </p>
          <p>
            {isRtl
              ? 'JurisTech أداة ذكاء اصطناعي مساعدة، ومخرجاتها ليست استشارة قانونية ولا تغني عن مراجعة محامٍ مرخّص في الدولة المعنية. جميع التحليلات والنماذج المنشأة هي لأغراض الفحص والمساعدة والتدقيق المكتبي الداخلي فقط.'
              : 'JurisTech is an AI assistance tool; its outputs do not constitute legal advice and cannot substitute for consultation with a licensed attorney in the applicable jurisdiction. All analyses and templates are for informational risk audit and internal drafting assistance only.'}
          </p>
        </div>

        {/* Core Architectural Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'الذكاء الاصطناعي التشريعي' : 'Legislative AI Intelligence'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'محرك فحص دقيق يغطي التشريعات التجارية والعمالية والشركات لدول الخليج العربي ومصر والأردن والدول الأوروبية والآسيوية.'
                : 'Advanced engine inspecting statutory frameworks across GCC, Egypt, Jordan, Europe, and Asia.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'التشفير والتوقيع الرقمي' : '256-bit Digital Sealing'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'تشفير المستندات بنظام AES-256 وتوفير وسادات التوقيع الرقمي المعترف بها رسمياً لحفظ الملكية الفكرية.'
                : 'AES-256 encrypted contract sealing and certified digital signature pads complying with e-commerce laws.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'التوسع السحابي و Anycast CDN' : 'High Availability Cloud Routing'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'توزيع الأحمال سحابياً عبر شبكات متعددة المناطق واستجابة سريعة لضمان استمرارية عمل المنصة.'
                : 'Multi-region cloud edge network providing rapid response times and high availability infrastructure.'}
            </p>
          </div>
        </div>

        {/* Portfolio of Registered Domains */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>{isRtl ? 'محفظة النطاقات الرسمية والمسجلة' : 'Official Registered Domain Portfolio'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-between">
              <span>https://juristech.solutions</span>
              <span className="text-[9px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 font-bold">PRIMARY</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>https://legalshieldsolution.online</span>
              <span className="text-[9px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold">NODE</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-between">
              <span>juristech.ai</span>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">RESERVED</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-between">
              <span>juristech.law</span>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">RESERVED</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/legal-compliance"
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <span>{isRtl ? 'مركز الامتثال والشروط الرسمية' : 'Legal Compliance & Terms'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contracts"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <span>{isRtl ? 'منشئ العقود الذكية' : 'Smart Contract Builder'}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
