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

export default function AboutUsPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={isRtl ? 'من نحن | JurisTech Solutions — الكيان التقني المستقل' : 'About Us | JurisTech Solutions — Independent AI Tech Entity'}
        description={isRtl ? 'تعرف على الكيان التقني المستقل JurisTech Solutions، المقر القانوني في عمّان، ونظام حوكمة الذكاء الاصطناعي العقدي.' : 'Learn about JurisTech Solutions, the sovereign independent AI Legal platform headquartered in Amman, Jordan.'}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Badge & Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Building2 className="w-4 h-4" />
            <span>{isRtl ? 'الكيان التقني المستقل للمنظومة' : 'Sovereign Technical Entity'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {isRtl ? (
              <>عن المنصة: <span className="text-cyan-400">JurisTech Solutions</span></>
            ) : (
              <>About <span className="text-cyan-400">JurisTech Solutions</span></>
            )}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {isRtl
              ? 'المنصة العالمية المستقلة للذكاء الاصطناعي العقدي والتدقيق التشريعي المحمي بالكامل تحت القوانين الأردنية والدولية.'
              : 'The global sovereign AI Legal Intelligence platform providing autonomous contract generation and legislative risk auditing.'}
          </p>
        </div>

        {/* Global HQ & Legal Status Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {isRtl ? 'المقر الرئيسي والعلامة التجارية المسجلة' : 'Global Headquarters & Registered Trademark'}
                </h2>
                <span className="text-xs text-cyan-400 font-mono">
                  {isRtl ? 'المملكة الأردنية الهاشمية — عمّان' : 'Amman, Hashemite Kingdom of Jordan'}
                </span>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              ● FULLY REGISTERED & PROTECTED
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
                {isRtl ? 'د. محمد مصطفى — مستشار استراتيجي وحاصل على دكتوراه في إدارة المخاطر' : 'Dr. Mohammad Mustafa — Strategic Advisor & PhD in Risk Management'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isRtl
              ? 'تخضع منصة JurisTech Solutions للإشراف الاستراتيجي والعمادة الفنية برئاسة د. محمد مصطفى، لضمان تطبيق أعلى معايير الحوكمة وإدارة المخاطر التشريعية والامتثال للمتطلبات الإقليمية والدولية.'
              : 'JurisTech Solutions is strategically advised by Dr. Mohammad Mustafa (PhD in Risk Management), ensuring top-tier governance, statutory compliance, and enterprise risk mitigation.'}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pt-1">
            <Mail className="w-4 h-4" />
            <span>Drzyogo.ca@gmail.com</span>
          </div>
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
              {isRtl ? 'التوسع السحابي و Anycast CDN' : 'Sub-10ms Anycast Routing'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? 'توزيع الأحمال عالمياً واستجابة سريعة للغاية أقل من 10 ملي ثانية لضمان عمل المنصة 24/7 بدون انقطاع.'
                : 'Multi-region edge network providing sub-10ms response times and 100% high availability uptime.'}
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
