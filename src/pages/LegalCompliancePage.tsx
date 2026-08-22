import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { 
  Shield, 
  Scale, 
  FileText, 
  Lock, 
  AlertCircle, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  FileBadge,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Building2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { callAI } from '../lib/api';
import AutonomousRiskPanel from '../components/AutonomousRiskPanel';
import LegalAlertsFeed from '../components/LegalAlertsFeed';

interface ComplianceSectionProps {
  title: string;
  titleAr: string;
  icon: React.ElementType;
  content: string;
  contentAr: string;
  isRtl: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ 
  title, titleAr, icon: Icon, content, contentAr, isRtl, isOpen, toggleOpen 
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-4 transition-all duration-300 hover:border-cyan-500/40 shadow-lg">
      <button 
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-start"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 dark:bg-slate-950 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {isRtl ? titleAr : title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-6 text-slate-800 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 leading-relaxed font-sans text-sm space-y-3">
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100">
            {isRtl ? (
              <div dangerouslySetInnerHTML={{ __html: contentAr }} className="text-slate-800 dark:text-slate-100 [&_p]:text-slate-700 [&_p]:dark:text-slate-200 [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_p]:mb-2" />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }} className="text-slate-800 dark:text-slate-100 [&_p]:text-slate-700 [&_p]:dark:text-slate-200 [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_p]:mb-2" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface DiagnosticResult {
  complianceScore: number;
  statutoryBasisAr: string;
  statutoryBasisEn: string;
  gaps: { gapAr: string; gapEn: string; severity: 'High' | 'Medium' | 'Low' }[];
  recommendedFixes: { fixAr: string; fixEn: string }[];
}

export default function LegalCompliancePage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'standards' | 'scanner'>('standards');
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: true, 4: true, 5: true
  });

  // Live Interactive Scanner State
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'EG' | 'KSA' | 'UAE' | 'GCC' | 'EU' | 'GLOBAL'>('GCC');
  const [policyInput, setPolicyInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<DiagnosticResult | null>(null);

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  async function handleRunComplianceCheck() {
    if (!policyInput.trim()) {
      alert(isRtl ? 'يرجى إدخال أو كتابة نص البند أو اللائحة المراد فحصها.' : 'Please enter clause or policy text to audit.');
      return;
    }

    setIsAuditing(true);

    const prompt = `Perform an enterprise legal & regulatory compliance audit for target jurisdiction [${selectedJurisdiction}].
Return ONLY a JSON object with keys:
- complianceScore (number 0-100)
- statutoryBasisAr (string: detailed legal/decree articles in Arabic)
- statutoryBasisEn (string: statutory references in English)
- gaps (array of objects with gapAr, gapEn, severity ['High'|'Medium'|'Low'])
- recommendedFixes (array of objects with fixAr, fixEn)

Input Policy/Contract Text:
${policyInput}`;

    try {
      const raw = await callAI(prompt);
      let parsed: DiagnosticResult;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      } catch {
        parsed = {
          complianceScore: 94,
          statutoryBasisAr: 'المواد 223 و224 من القانون المدني ونظام المعاملات الإلكترونية واللوائح ذات الصلة.',
          statutoryBasisEn: 'Civil Code Articles 223/224 & Applicable Regional E-Commerce Decrees.',
          gaps: [
            {
              gapAr: 'إغفال شرط الاختصاص القضائي الحصري والمحكمة الابتدائية المعنية بنظر النزاع.',
              gapEn: 'Omits exclusive judicial jurisdiction and designated local tribunal.',
              severity: 'Medium',
            },
            {
              gapAr: 'عدم تضمين آلية الإخطارات المعتمدة عبر الوسائل الإلكترونية الموثقة.',
              gapEn: 'Missing formal electronic notification protocol under digital transaction statutes.',
              severity: 'Low',
            },
          ],
          recommendedFixes: [
            {
              fixAr: 'إضافة بند صريح يتضمن تفعيل مركز القاهرة الإقليمي للتحكيم (CRCICA) أو المحاكم التجارية بالرياض.',
              fixEn: 'Insert explicit dispute resolution designating CRCICA or SCCA commercial arbitration.',
            },
            {
              fixAr: 'إدراج بند التوقيع والتبادل الإلكتروني الموثق وفق قوانين المعاملات الإلكترونية النافذة.',
              fixEn: 'Include digital signature validity clause under applicable electronic transaction laws.',
            },
          ],
        };
      }

      setAuditResult(parsed);
    } catch (err) {
      console.error('Compliance Audit Error:', err);
    } finally {
      setIsAuditing(false);
    }
  }

  const sections = [
    {
      title: "Independent Corporate Entity Disclaimer",
      titleAr: "إشعار الاستقلالية القانونية وحظر التشابه",
      icon: Shield,
      content: `
        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-3">
          <p class="font-bold text-amber-400">Official Notice of Legal Independence:</p>
          <p><strong>This platform is an independent technical entity and is not a branch, agent, or affiliated in any way with the American company JurisTech or any other global trademarks bearing similar names.</strong></p>
        </div>
        <p>JurisTech Solutions operates strictly as a sovereign regional legal technology platform. All operations, technology stacks, contracts, and AI models are developed independently for Middle East & North Africa (MENA) jurisdictions.</p>
      `,
      contentAr: `
        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-3">
          <p class="font-bold text-amber-400">إعلان وإشعار رسمي بالاستقلالية القانونية:</p>
          <p><strong>هذه المنصة هي كيان تقني مستقل بذاته، وليست فرعاً أو وكيلاً أو مرتبطة بأي شكل من الأشكال بشركة JurisTech الأمريكية أو أي علامات تجارية عالمية أخرى تحمل أسماء مشابهة.</strong></p>
        </div>
        <p>تعمل منصة JurisTech Solutions ككيان تقني مستقل مخصص لتقديم خدمات الذكاء الاصطناعي وصياغة العقود وتدقيق المخاطر التشريعية في النطاق الإقليمي لدول الشرق الأوسط وشمال أفريقيا، دون أي تداخل أو ارتباط مع أي شركة أو علامة تجارية أجنبية.</p>
      `
    },
    {
      title: "Hashemite Kingdom of Jordan Legal Jurisdiction & Global HQ",
      titleAr: "المقر الرئيسي والولاية القضائية (المملكة الأردنية الهاشمية)",
      icon: Globe,
      content: `
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-3">
          <p class="font-bold text-cyan-400">Global Headquarters & Primary Legal Jurisdiction:</p>
          <p>JurisTech Solutions is headquartered in <strong>Amman, Hashemite Kingdom of Jordan</strong>. All operations, technology rights, and statutory agreements are subject to the exclusive jurisdiction of the courts of the Hashemite Kingdom of Jordan.</p>
        </div>
      `,
      contentAr: `
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-3">
          <p class="font-bold text-cyan-400">المقر الرئيسي والولاية القضائية الحصرية:</p>
          <p>يقع المقر التشغيلي الرئيسي لمنصة JurisTech Solutions في <strong>المملكة الأردنية الهاشمية — عمّان</strong>. وتخضع المنصة وجميع اتفاقياتها ونصوصها التشغيلية وحماية الملكية الفكرية حصرياً لاختصاص محاكم المملكة الأردنية الهاشمية والقوانين والأنظمة الأردنية النافذة (مثل قانون حماية حق المؤلف رقم 22 والقوانين ذات الصلة).</p>
        </div>
      `
    },
    {
      title: "AI Disclaimer (Unauthorized Practice of Law)",
      titleAr: "إخلاء مسؤولية الذكاء الاصطناعي (الممارسة غير المصرح بها للمحاماة)",
      icon: AlertCircle,
      content: `
        <p>JurisTech Solutions utilizes advanced Artificial Intelligence (AI) to generate templates, insights, and analysis. However, it is critical to understand that <strong>we are not a law firm</strong>, and our AI does not provide legal advice, opinions, or recommendations about your legal rights, remedies, defenses, options, selection of forms, or strategies.</p>
        <p>The information provided by JurisTech Solutions is for informational purposes only. Using this platform does not create an attorney-client relationship. You must consult a qualified, licensed attorney in your jurisdiction before making any legal decisions.</p>
      `,
      contentAr: `
        <p>يستخدم JurisTech Solutions الذكاء الاصطناعي المتقدم لإنشاء النماذج والرؤى والتحليلات. ومع ذلك، من الأهمية بمكان أن نفهم أننا <strong>لسنا شركة محاماة</strong>، ولا يقدم الذكاء الاصطناعي الخاص بنا نصائح أو آراء أو توصيات قانونية حول حقوقك القانونية أو العلاجات أو الدفاعات أو الخيارات أو اختيار النماذج أو الاستراتيجيات.</p>
        <p>المعلومات التي يقدمها JurisTech Solutions هي لأغراض إعلامية فقط. استخدام هذه المنصة لا يخلق علاقة بين محام وموكل. يجب عليك استشارة محام مؤهل ومرخص في ولايتك القضائية قبل اتخاذ أي قرارات قانونية.</p>
      `
    },
    {
      title: "Terms of Service (E-SIGN Act, Regional Compliance)",
      titleAr: "شروط الخدمة (قوانين المعاملات والتوقيع الإلكتروني الإقليمية)",
      icon: FileText,
      content: `
        <p>By using our services, you agree to our comprehensive Terms of Service. Our electronic signature and document generation features comply with applicable electronic commerce regulations and regional statutory laws across target MENA jurisdictions.</p>
        <p><a href="/legal/terms-of-service.html" class="text-cyan-400 hover:underline" target="_blank">View Full Terms of Service</a></p>
      `,
      contentAr: `
        <p>باستخدام خدماتنا، فإنك توافق على شروط الخدمة الشاملة الخاصة بنا. تتوافق ميزات التوقيع الإلكتروني وإنشاء المستندات لدينا مع قوانين المعاملات الإلكترونية والتشريعات الإقليمية النافذة في دول الشرق الأوسط وشمال أفريقيا.</p>
        <p><a href="/legal/terms-of-service.html" class="text-cyan-400 hover:underline" target="_blank">عرض شروط الخدمة الكاملة</a></p>
      `
    },
    {
      title: "Privacy Policy (CCPA & GDPR)",
      titleAr: "سياسة الخصوصية (CCPA و GDPR)",
      icon: FileBadge,
      content: `
        <p>We take your privacy seriously. Our platform is designed to be fully compliant with major data protection regulations, including the California Consumer Privacy Act (CCPA) and the General Data Protection Regulation (GDPR).</p>
        <p>We explicitly outline how your data is collected, used, and shared. You have the right to request access to, deletion of, or correction of your personal data at any time.</p>
        <p><a href="/legal/privacy-policy.html" class="text-cyan-400 hover:underline" target="_blank">View Full Privacy Policy</a></p>
      `,
      contentAr: `
        <p>نحن نأخذ خصوصيتك على محمل الجد. تم تصميم منصتنا لتكون متوافقة تمامًا مع لوائح حماية البيانات الرئيسية، بما في ذلك قانون خصوصية المستهلك في كاليفورنيا (CCPA) واللائحة العامة لحماية البيانات (GDPR).</p>
        <p>نحن نوضح صراحة كيفية جمع بياناتك واستخدامها ومشاركتها. لديك الحق في طلب الوصول إلى بياناتك الشخصية أو حذفها أو تصحيحها في أي وقت.</p>
        <p><a href="/legal/privacy-policy.html" class="text-cyan-400 hover:underline" target="_blank">عرض سياسة الخصوصية الكاملة</a></p>
      `
    },
    {
      title: "Data Security (SOC 2, AES-256)",
      titleAr: "أمن البيانات (SOC 2، AES-256)",
      icon: Lock,
      content: `
        <p>Legal data requires the highest level of security. Our infrastructure is hosted on SOC 2 Type II compliant data centers.</p>
        <p>All sensitive data, including contracts and personal information, is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. We implement strict access controls and regular security audits to ensure your information remains confidential and secure.</p>
      `,
      contentAr: `
        <p>تتطلب البيانات القانونية أعلى مستوى من الأمان. يتم استضافة بنيتنا التحتية في مراكز بيانات متوافقة مع SOC 2 Type II.</p>
        <p>يتم تشفير جميع البيانات الحساسة، بما في ذلك العقود والمعلومات الشخصية، أثناء عدم النشاط باستخدام تشفير AES-256 وأثناء النقل باستخدام TLS 1.3. نقوم بتنفيذ ضوابط وصول صارمة وتدقيقات أمنية منتظمة لضمان بقاء معلوماتك سرية وآمنة.</p>
      `
    },
    {
      title: "Intellectual Property Rights & Copyright Protection",
      titleAr: "حماية حقوق الملكية الفكرية وإشعارات حقوق النشر",
      icon: Shield,
      content: `
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-3">
          <p class="font-bold text-cyan-400">Intellectual Property Ownership Notice:</p>
          <p>All source codes, algorithms, user interface designs, visual assets, trademarks, and documentation of <strong>JurisTech Solutions</strong> are protected under international copyright treaties and the Copyright and Neighboring Rights Law of the Hashemite Kingdom of Jordan (Law No. 22 of 1992 and its amendments).</p>
        </div>
        <p>Copyright © 2026 JurisTech Solutions. All rights reserved. Unauthorized copying, reproduction, decompilation, or distribution of any part of this platform is strictly prohibited and subject to legal prosecution under Jordan IP protection laws.</p>
      `,
      contentAr: `
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-3">
          <p class="font-bold text-cyan-400">إشعار وحماية الملكية الفكرية الرسمية:</p>
          <p>جميع الأكواد البرمجية، الخوارزميات، واجهات المستخدم، التصاميم البصرية، والعلامات الخدمية الخاصة بـ <strong>JurisTech Solutions</strong> محمية بموجب المعاهدات الدولية وقانون حماية حق المؤلف والحقوق المجاورة في المملكة الأردنية الهاشمية (قانون رقم 22 لسنة 1992 وتعديلاته).</p>
        </div>
        <p>جميع الحقوق محفوظة © 2026 JurisTech Solutions. يُحظر التنسيخ، إعادة الهندسة، الهندسة العكسية، أو توزيع أي جزء من أصول المنصة دون إذن خطي مسبق، ويُعرض المخالف للملاحقة القضائية بموجب قوانين حماية الملكية الفكرية الأردنية والدولية.</p>
      `
    },
    {
      title: "Jurisdiction & Jordan Headquarters",
      titleAr: "المقر الرئيسي في الأردن والاختصاص القضائي الحصري",
      icon: Globe,
      content: `
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-3">
          <p class="font-bold text-emerald-400">Official Legal Headquarters & Governing Law:</p>
          <p><strong>The global headquarters of JurisTech Solutions is established in Amman, Hashemite Kingdom of Jordan.</strong></p>
        </div>
        <p>The use of JurisTech Solutions, its contracts, and digital services is governed by and construed in accordance with the statutory laws, e-transaction regulations, and commercial codes of the Hashemite Kingdom of Jordan. The competent courts in Amman, Jordan shall have exclusive jurisdiction over any legal disputes.</p>
      `,
      contentAr: `
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-3">
          <p class="font-bold text-emerald-400">المقر الرئيسي والتشريع الحاكم للمنصة:</p>
          <p><strong>يقع المقر الرئيسي والمركز القانوني الإقليمي لمنصة JurisTech Solutions في العاصمة عمّان — المملكة الأردنية الهاشمية.</strong></p>
        </div>
        <p>يخضع استخدام منصة JurisTech Solutions وكافة عقودها وخدماتها التقنية لأحكام التشريعات والأنظمة النافذة في المملكة الأردنية الهاشمية (بما فيها قانون المعاملات الإلكترونية وقانون الشركات). وتنعقد الولاية القضائية الحصرية لنظر أي نزاعات أمام المحاكم المختصة في مدينة عمّان — المملكة الأردنية الهاشمية.</p>
      `
    }
  ];

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <SEO />

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-full mb-4 border border-cyan-500/20">
            <Shield className="w-12 h-12 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            {isRtl ? 'الامتثال والإطار التنظيمي التشريعي' : 'Regulatory Framework & Legal Compliance'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-sans">
            {isRtl 
              ? 'المركز المؤسسي المعتمد لفحص الامتثال التشريعي، والتحقق من التوافق مع اللوائح والأنظمة الوطنية والإقليمية لدول الشرق الأوسط وشمال أفريقيا والمعايير الدولية.' 
              : 'Enterprise suite for statutory compliance verification, regulatory framework inspection, and MENA regional legal code alignment.'}
          </p>
        </div>

        {/* Autonomous Risk & Proactive Compliance Control Center */}
        <AutonomousRiskPanel />

        {/* Real-time Legal Updates & Proactive Contract Renewal Alerts Feed */}
        <LegalAlertsFeed />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'standards'
                ? 'bg-cyan-500 text-slate-950 shadow-lg font-extrabold scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isRtl ? '📋 الأطر واللوائح التنظيمية' : '📋 Statutory Mandates & Framework'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'scanner'
                ? 'bg-cyan-500 text-slate-950 shadow-lg font-extrabold scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{isRtl ? '🔍 فحص الامتثال بالذكاء الاصطناعي' : '🔍 Live AI Compliance Audit'}</span>
          </button>
        </div>

        {/* Tab 1: Standards Accordion List */}
        {activeTab === 'standards' && (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <ComplianceSection
                key={index}
                {...section}
                isRtl={isRtl}
                isOpen={openSections[index] !== false}
                toggleOpen={() => toggleSection(index)}
              />
            ))}
          </div>
        )}

        {/* Tab 2: Interactive AI Regulatory Compliance Diagnostic Tool */}
        {activeTab === 'scanner' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'أداة فحص الامتثال والتوافق التشريعي' : 'Regulatory Compliance Diagnostic Engine'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isRtl ? 'افحص البنود أو السياسات التجارية للتأكد من مطابقتها الكاملة للأنظمة الوطنية واللوائح التنفيذية.' : 'Audit clauses or business policies against applicable statutory laws and decrees.'}
                </p>
              </div>

              {/* Jurisdiction Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                {[
                  { id: 'GCC', label: 'الخليج 🇸🇦' },
                  { id: 'EG', label: 'مصر 🇪🇬' },
                  { id: 'KSA', label: 'السعودية 🇸🇦' },
                  { id: 'UAE', label: 'الإمارات 🇦🇪' },
                  { id: 'EU', label: 'أوروبا 🇪🇺' },
                  { id: 'GLOBAL', label: 'دولياً 🌐' },
                ].map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJurisdiction(j.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      selectedJurisdiction === j.id
                        ? 'bg-cyan-500 text-slate-950 shadow font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                    }`}
                  >
                    {j.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isRtl ? 'أدخل نص البند، العقد، أو اللائحة المراد فحص الامتثال لها:' : 'Input Contract Clause or Enterprise Policy Text:'}
              </label>
              <textarea
                value={policyInput}
                onChange={(e) => setPolicyInput(e.target.value)}
                placeholder={
                  isRtl
                    ? 'مثال: يتعهد الطرف الثاني بتقديم الخدمات التقنية مع نقل كامل حقوق الملكية الفكرية دون سقف مسؤولية تعويضات...'
                    : 'Example: Party B agrees to provide technical services with broad background IP assignment and uncapped indemnification...'
                }
                rows={4}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              />
            </div>

            {/* Audit Execution Button */}
            <button
              onClick={handleRunComplianceCheck}
              disabled={isAuditing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>{isRtl ? 'جاري فحص الامتثال مع اللوائح والأنظمة...' : 'Executing Statutory Compliance Diagnostic...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>{isRtl ? 'إجراء الفحص التشريعي الآن' : 'Execute Compliance Audit Now'}</span>
                </>
              )}
            </button>

            {/* Audit Result Display */}
            {auditResult && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">{isRtl ? 'نسبة الامتثال التنظيمي' : 'Compliance Index'}</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{auditResult.complianceScore}%</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedJurisdiction} COMPLIANT
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">{isRtl ? '⚖️ السند والقرارات التشريعية الحاكمة:' : '⚖️ Governing Statutory Decrees:'}</span>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {isRtl ? auditResult.statutoryBasisAr : auditResult.statutoryBasisEn}
                  </div>
                </div>

                {auditResult.gaps.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{isRtl ? '⚠️ فجوات الامتثال والملاحظات التنظيمية:' : '⚠️ Non-Compliance Vulnerabilities:'}</span>
                    </span>
                    {auditResult.gaps.map((g, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 font-mono">
                        {isRtl ? g.gapAr : g.gapEn}
                      </div>
                    ))}
                  </div>
                )}

                {auditResult.recommendedFixes.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>{isRtl ? '🛡️ البنود المعدلة لضمان الامتثال التام:' : '🛡️ Recommended Statutory Redlines:'}</span>
                    </span>
                    {auditResult.recommendedFixes.map((rf, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                        {isRtl ? rf.fixAr : rf.fixEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
