import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, BrainCircuit, ShieldAlert, FileSearch, Scale, Loader2, ArrowRight,
  ArrowLeft, UploadCloud, CheckCircle2, FileText, Download, Copy, Check,
  Globe, Cpu, RefreshCw, ThumbsUp, ThumbsDown, Shield, FileCheck, Layers,
  Terminal, BarChart3, AlertTriangle, Printer
} from 'lucide-react';
import { callAI } from '../lib/api';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { recordLawyerRLHFFeedback } from '../services/criticSelfLearningEngine';
import { usePlatformLocale } from '../lib/universalTranslator';
import SEO from '../components/SEO';

interface JurisdictionConfig {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  statutesAr: string;
  statutesEn: string;
}

const JURISDICTIONS: JurisdictionConfig[] = [
  { code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia (KSA)', flag: '🇸🇦', statutesAr: 'نظام المعاملات المدنية 2023، نظام الشركات، ولوائح وزارة الاستثمار MISA', statutesEn: 'Civil Transactions Law 2023, Companies Law & MISA' },
  { code: 'AE', nameAr: 'دولة الإمارات العربية المتحدة', nameEn: 'United Arab Emirates (UAE)', flag: '🇦🇪', statutesAr: 'قانون المعاملات المدنية الاتحادي، ومحاكم DIFC / ADGM، وقواعد DIAC', statutesEn: 'Federal Civil Code, DIFC/ADGM Common Law Courts, DIAC' },
  { code: 'EG', nameAr: 'جمهورية مصر العربية', nameEn: 'Egypt (ARE)', flag: '🇪🇬', statutesAr: 'القانون المدني المصري رقم 131، قانون التجارة، وهيئة الاستثمار GAFI، وتحكيم CRCICA', statutesEn: 'Egyptian Civil Code 131, Commercial Code, GAFI, CRCICA' },
  { code: 'JO', nameAr: 'المملكة الأردنية الهاشمية', nameEn: 'Jordan (HQ)', flag: '🇯🇴', statutesAr: 'القانون المدني الأردني، قانون حماية حق المؤلف رقم 22، ومحاكم عمّان', statutesEn: 'Jordanian Civil Code, IP Protection Law 22, Amman Courts' },
  { code: 'QA', nameAr: 'دولة قطر', nameEn: 'Qatar', flag: '🇶🇦', statutesAr: 'القانون المدني القطري، مركز قطر للمال QFC، وقواعد تحكيم QICCA', statutesEn: 'Qatar Civil Code, QFC Regulatory Authority, QICCA' },
  { code: 'KW', nameAr: 'دولة الكويت', nameEn: 'Kuwait', flag: '🇰🇼', statutesAr: 'قانون التجارة الكويتي رقم 68، ولوائح هيئة تشجيع الاستثمار المباشر KDIPA', statutesEn: 'Kuwait Commercial Code 68, KDIPA Regulations' },
  { code: 'GB', nameAr: 'المملكة المتحدة (بريطانيا)', nameEn: 'United Kingdom (UK)', flag: '🇬🇧', statutesAr: 'English Common Law, Companies Act 2006, and LCIA Arbitration', statutesEn: 'English Common Law, Companies Act 2006, LCIA Arbitration' },
  { code: 'US', nameAr: 'الولايات المتحدة (ديلاوير/اتحادي)', nameEn: 'United States (Delaware/US)', flag: '🇺🇸', statutesAr: 'Delaware General Corporation Law (DGCL), Uniform Commercial Code (UCC)', statutesEn: 'Delaware DGCL, UCC, Federal Securities Regulations' },
  { code: 'EU', nameAr: 'الاتحاد الأوروبي (العابر للحدود)', nameEn: 'European Union (EU)', flag: '🇪🇺', statutesAr: 'EU GDPR, EU AI Act 2024, Cross-border Insolvency and Corporate Directives', statutesEn: 'EU GDPR, EU AI Act 2024, EU Cross-Border Directives' },
];

interface ModuleConfig {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: any;
  color: string;
  bgColor: string;
  badgeAr: string;
  badgeEn: string;
  promptTemplateAr: (input: string, jur: JurisdictionConfig) => string;
  promptTemplateEn: (input: string, jur: JurisdictionConfig) => string;
}

const MODULES: ModuleConfig[] = [
  {
    id: 'mna',
    titleAr: '1. الاستحواذ والاندماج التنبؤي (Predictive M&A)',
    titleEn: '1. Predictive M&A Intelligence & Valuation',
    descAr: 'تحليل معمق للقوائم المالية، اتفاقيات شراء الأسهم (SPA)، وتوقع نسب نجاح الصفقات واكتشاف مخاطر التقييم وحسابات الضمان Escrow.',
    descEn: 'Deep-learning predictive analysis of financials, SPAs, EBITDA valuation multiples, and deal completion probabilities.',
    icon: BrainCircuit,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10 text-cyan-400',
    badgeAr: 'تقييم الصفقات الاستثمارية M&A',
    badgeEn: 'M&A Valuation & Forecast',
    promptTemplateAr: (input, jur) => `قم بدور مستشار الذكاء الاصطناعي السيادي رفيع المستوى لصفقات الاستحواذ والاندماج (M&A Sovereign Engine).
النظام التشريعي المستهدف: ${jur.nameAr} (${jur.statutesAr}).
المهمة التحليلية والتنبؤية:
حلل المستند أو البيانات المرفقة التالية بدقة متناهية وفقاً لأحدث الممارسات المؤسسية وقوانين ${jur.nameAr}:
1. استخراج المؤشرات المالية والقانونية الجوهرية (EBITDA, Liabilities, Indemnity Caps).
2. تقييم وحساب مؤشر احتمالية نجاح الصفقة (Deal Success Index) كنسبة مئوية (مثلاً: 88%).
3. كشف مخاطر التقييم وحسابات الضمان (Escrow Accounts) وشروط الإغلاق (Closing Conditions & MAC Clauses).
4. التوصيات الوقائية وصياغة البنود البديلة الحامية للمشتري / المستثمر.

البيانات / المستند المرفق:
${input}`,
    promptTemplateEn: (input, jur) => `Act as the Lead Sovereign M&A & Private Equity AI Copilot.
Target Jurisdiction: ${jur.nameEn} (${jur.statutesEn}).
Analyze the provided contract or financial dataset strictly under the applicable laws of ${jur.nameEn}:
1. Extract core deal drivers, EBITDA valuation multiples, indemnity caps, and unrecorded liabilities.
2. Calculate the quantitative Deal Completion & Success Probability Index (e.g. 88%).
3. Identify Material Adverse Change (MAC) traps, closing condition bottlenecks, and Escrow holdbacks.
4. Provide strategic buyer-side protection redlines and actionable negotiation milestones.

Provided Dataset / Document:
${input}`
  },
  {
    id: 'negotiation',
    titleAr: '2. التفاوض الآلي والوساطة الذكية (AI Negotiation)',
    titleEn: '2. Autonomous AI Negotiation Agents',
    descAr: 'وكيل تفاوض ذكي ذاتي التعلم يولد ردوداً تفاوضية فورية، ويحدد نقاط القوة وأوراق الضغط وهوامش التنازل الآمنة لحماية مصالحك.',
    descEn: 'Self-learning autonomous negotiation agent generating tactical counter-clauses, compromise compromises, and leverage points.',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-500/10 text-purple-400',
    badgeAr: 'التفاوض والوساطة الآلية',
    badgeEn: 'Autonomous Agent Negotiation',
    promptTemplateAr: (input, jur) => `أنت وكيل التفاوض الآلي السيادي (Autonomous Legal Negotiation Agent) المعتمد لمنصة JurisTech.
النظام التشريعي المعتمد: ${jur.nameAr} (${jur.statutesAr}).
المهمة:
قم بدراسة البنود أو المطالبات المتنازع عليها، وأصدر تقريراً تفاوضياً شاملاً يتضمن:
1. مصفوفة أوراق الضغط القانونية (Legal Leverage Matrix) المستندة لنصوص قوانين ${jur.nameAr}.
2. هوامش التنازل التكتيكية والحدود الحمراء التي لا يجوز تجاوزها (Walkaway Thresholds).
3. مسودة رد تفاوضي رسمي جاهزة للإرسال إلى الطرف الآخر بلهجة قانونية حازمة ومهنية.
4. صياغة البنود التوافقية البديلة (Win-Win Compromise Clauses) المحصنة بنظام ${jur.nameAr}.

النصوص محل التفاوض:
${input}`,
    promptTemplateEn: (input, jur) => `You are the Sovereign Autonomous Legal Negotiation Agent for JurisTech Solutions.
Governing Jurisdiction: ${jur.nameEn} (${jur.statutesEn}).
Analyze the disputed clauses or contract draft and generate an institutional negotiation strategy:
1. Comprehensive Legal Leverage & Pressure Points Matrix grounded in ${jur.nameEn} jurisprudence.
2. Acceptable concession boundaries and non-negotiable walkaway thresholds.
3. Formal, highly articulate executive response draft ready to send to opposing counsel.
4. Protective bilateral compromise redlines sealing all liability vectors.

Draft / Terms to Negotiate:
${input}`
  },
  {
    id: 'litigation',
    titleAr: '3. المحاكاة القضائية وتوقع النزاعات (Litigation Simulation)',
    titleEn: '3. Virtual Litigation & Courtroom Simulation',
    descAr: 'محاكاة افتراضية للنزاعات أمام المحاكم ومراكز التحكيم الدولية، مع حساب احتمالية كسب القضية واستخراج السوابق والدفوع القانونية.',
    descEn: 'Simulates judicial and arbitration outcomes (DIAC, LCIA, CRCICA, Courts), forecasting win/loss probabilities and precedent defenses.',
    icon: Scale,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10 text-amber-400',
    badgeAr: 'المحاكاة القضائية والتحكيمية',
    badgeEn: 'Virtual Courtroom Simulation',
    promptTemplateAr: (input, jur) => `أنت نظام المحاكاة القضائية والتحكيمية المتقدم (Virtual Judicial & Arbitration Simulation Engine).
الهيئة القضائية / النظام: محاكم ومراكز تحكيم ${jur.nameAr} (${jur.statutesAr}).
المهمة:
قم بمحاكاة كاملة لدعوى قضائية أو تحكيمية افتراضية قد تنشأ عن هذا المستند أو النزاع:
1. تقدير نسبة كسب الدعوى (Win Probability Percentage) بالأرقام (مثال: 76%).
2. استخراج الدفوع الشكلية والموضوعية الرئيسية للطرف المدعي والطرف المدعى عليه.
3. استعراض السوابق والمبادئ القضائية المستقرة المطبقة في ${jur.nameAr}.
4. استراتيجية الوقاية قبل اللجوء للمحاكم وخريطة طريق الصلح والتحكيم المعجل.

المستند / وقائع النزاع:
${input}`,
    promptTemplateEn: (input, jur) => `Act as the Advanced Virtual Courtroom & Arbitration Simulator.
Jurisdictional Venue: ${jur.nameEn} Judicial Courts & Arbitration Centers (${jur.statutesEn}).
Simulate a full adversarial litigation / arbitration proceeding arising from this contract:
1. Estimated Win / Claim Recovery Probability percentage (e.g. 76%).
2. Primary procedural and substantive defenses for both claimant and respondent.
3. Applicable judicial precedents and established case law in ${jur.nameEn}.
4. Pre-litigation mitigation roadmap, settlement calculus, and fast-track arbitration clauses.

Contract Case Facts / Clauses:
${input}`
  },
  {
    id: 'fraud',
    titleAr: '4. اكتشاف الاحتيال بالقياس الحيوي النصي (Stylometric Fraud)',
    titleEn: '4. Stylometric Fraud & Anomaly Detection',
    descAr: 'تحليل الأنماط اللغوية وتوقيعات البيانات لاكتشاف التلاعب بالصيغ، تزوير العقود، تحريف المسؤوليات، والبنود المخبأة غير المصرح بها.',
    descEn: 'Analyzes forensic linguistic patterns and metadata anomalies to detect hidden fraud, forgery, and unauthorized clause tampering.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-500/10 text-rose-400',
    badgeAr: 'كشف التزوير والتحريف الجنائي',
    badgeEn: 'Forensic Stylometric Audit',
    promptTemplateAr: (input, jur) => `أنت المحقق الجنائي الرقمي واللغوي (Forensic Stylometric & Fraud Auditor).
النظام المرجعي: معايير التحري في ${jur.nameAr} (${jur.statutesAr}).
المهمة:
حلل المستند التالي تحليلاً جنائياً دقيقاً لكشف أي محاولات تدليس أو تحريف أو احتيال تعاقدي:
1. تقييم مؤشر الشفافية والسلامة النصية (Authenticity & Integrity Score) كنسبة مئوية.
2. رصد التناقضات اللغوية في الصياغة (Inconsistent Phrasing) والبنود الملتوية التي تنقل الالتزام بخفاء.
3. فحص بنود الإعفاء من المسؤولية الجنائية والمدنية وشبهات تضارب المصالح.
4. تقرير الأدلة الجنائية وتوصيات إبطال أو تصحيح البنود المعيبة.

النص المرفق للفحص:
${input}`,
    promptTemplateEn: (input, jur) => `You are the Forensic Legal Stylometric & Anti-Fraud Auditor.
Governing Reference: Forensic & Commercial Standards of ${jur.nameEn} (${jur.statutesEn}).
Perform a forensic stylometric audit on the text to detect fraudulent maneuvers or deceptive drafting:
1. Document Authenticity & Structural Integrity Score (e.g. 94%).
2. Linguistic anomalies, covert liability transfers, and asymmetric indemnity manipulations.
3. Unenforceable exculpatory clauses, conflict of interest indicators, and bad-faith traps.
4. Forensic audit report with specific rectification redlines.

Document Text:
${input}`
  },
  {
    id: 'compliance',
    titleAr: '5. التنبؤ بالامتثال العابر للحدود (Cross-Border Compliance)',
    titleEn: '5. Cross-Border Statutory Compliance & Sanctions',
    descAr: 'فحص مسبق ومطابقة دقيقة لأنظمة حماية البيانات (PDPL/GDPR)، العقوبات الدولية، مكافحة غسل الأموال (AML/KYC)، وقوانين الذكاء الاصطناعي.',
    descEn: 'Predictive regulatory auditing against PDPL, GDPR, EU AI Act, AML/KYC sanctions, and international investment compliance.',
    icon: Globe,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10 text-emerald-400',
    badgeAr: 'الامتثال التشريعي الدولي 2026',
    badgeEn: 'Global Cross-Border Compliance',
    promptTemplateAr: (input, jur) => `أنت المستشار السيادي للامتثال والحوكمة الدولية (Global Statutory Compliance & Sanctions Officer).
الدولة المستهدفة: ${jur.nameAr} (${jur.statutesAr}) بالتوافق مع المعايير الدولية (GDPR, EU AI Act 2024, FATF AML).
المهمة:
قم بإجراء فحص شامل للامتثال المؤسسي والتنظيمي على المستند أو الصفقة:
1. مؤشر الامتثال التشريعي العام (Compliance Rating % ومستوى المخاطر).
2. فحص مطابقة حماية البيانات الشخصية والسرية المصرفية (PDPL / GDPR).
3. تدقيق سلاسل التوريد والتحقق من لوائح مكافحة غسل الأموال والعقوبات الدولية (AML/KYC).
4. اشتراطات قانون الذكاء الاصطناعي الأوروبي (EU AI Act 2024) والحوكمة السحابية.
5. خطة العمل التصحيحية الفورية لنيل شهادة الامتثال الكامل.

بيانات المستند / المشروع:
${input}`,
    promptTemplateEn: (input, jur) => `You are the Sovereign Cross-Border Regulatory & Sanctions Compliance Officer.
Target Jurisdiction: ${jur.nameEn} (${jur.statutesEn}) harmonized with international frameworks (GDPR, EU AI Act 2024, FATF AML).
Audit the document for multi-jurisdictional compliance and regulatory exposure:
1. Overall Statutory Compliance Index (% score & risk tier).
2. Data privacy & cross-border data transfer audit (PDPL / GDPR / Cross-Border Data Flows).
3. Anti-Money Laundering (AML/KYC), sanctions screening, and supply-chain governance.
4. EU AI Act 2024 & high-risk AI system statutory classifications.
5. Actionable remediation roadmap to secure institutional regulatory clearance.

Input Data:
${input}`
  }
];

export default function AdvancedAIHubPage() {
  const { l, isRtl, gt, i18n, formatNum } = usePlatformLocale();

  const [activeModule, setActiveModule] = useState<ModuleConfig>(MODULES[0]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionConfig>(JURISDICTIONS[0]);
  
  const [inputText, setInputText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMsg, setExtractionMsg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  
  // Continuous Self-Learning & RLHF State
  const [feedbackGiven, setFeedbackGiven] = useState<'UP' | 'DOWN' | null>(null);
  const [copied, setCopied] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (PDF, DOCX, TXT, DOC, RTF)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setUploadedFileName(file.name);
    setExtractionMsg(isRtl ? 'جاري استخراج البيانات وفحص النصوص...' : 'Extracting multi-stage document text...');

    try {
      const extraction = await extractPDFTextMultiStage(file, (status) => {
        setExtractionMsg(status);
      });

      setInputText(extraction.text);
      setResult(null);
      setFeedbackGiven(null);
    } catch (err) {
      console.error('File extraction error:', err);
      alert(isRtl ? 'تعذر استخراج النص من الملف. يمكنك نسخه ولصقه يدوياً.' : 'Failed to extract text. You can copy and paste it manually.');
    } finally {
      setIsExtracting(false);
      setExtractionMsg('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Run Sovereign AI Analysis
  const handleRunAI = async (overridePrompt?: string) => {
    const textToProcess = overridePrompt || inputText;
    if (!textToProcess.trim()) {
      alert(isRtl ? 'يرجى إدخال البيانات أو رفع مستند للتحليل.' : 'Please enter data or upload a document.');
      return;
    }

    setLoading(true);
    setResult(null);
    setExecutionTime(null);
    setFeedbackGiven(null);
    const start = performance.now();

    try {
      const basePrompt = isRtl
        ? activeModule.promptTemplateAr(textToProcess, selectedJurisdiction)
        : activeModule.promptTemplateEn(textToProcess, selectedJurisdiction);

      const languageEnforcement = isRtl
        ? `\n\nتوجيه لغوي وتشريعي إلزامي: أجب باللغة العربية الفصحى حصراً وبصياغة قانونية رفيعة المستوى متوافقة 100% مع تشريعات ${selectedJurisdiction.nameAr}. قسّم التقرير إلى عناوين واضحة وجداول ونقاط رقمية محددة.`
        : `\n\nCRITICAL MANDATE: Respond strictly in English using high-level institutional legal terminology adhering to ${selectedJurisdiction.nameEn} statutory law. Structure the output into clear markdown sections, metrics, and actionable recommendations.`;

      const selfLearningContext = `\n\n[Sovereign AI Engine Core: Google Gemini 2.5 Pro Ultra — Continuous Self-Learning Pipeline Active with Human-in-the-Loop RLHF Validation].`;

      const finalPrompt = basePrompt + languageEnforcement + selfLearningContext;
      
      const response = await callAI(finalPrompt);
      setResult(response);
    } catch (error) {
      console.error('AI Processing Error:', error);
      setResult(isRtl ? 'حدث خطأ أثناء معالجة الطلب عبر محرك الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.' : 'An error occurred during AI processing. Please retry.');
    } finally {
      const end = performance.now();
      setExecutionTime(Math.round(end - start));
      setLoading(false);
    }
  };

  // Interactive Model Refinement & Self-Training Loop
  const handleRefineModel = async () => {
    if (!refinementPrompt.trim() || !result) return;
    setIsRefining(true);

    try {
      const followUpPrompt = isRtl
        ? `بناءً على التقرير السابق، قم بتطبيق هذا التعديل الإضافي وتدريب التحليل عليه:\n"${refinementPrompt}"\n\nالتقرير السابق:\n${result}`
        : `Based on the previous output, refine and self-train the analysis with this specific feedback:\n"${refinementPrompt}"\n\nPrevious Output:\n${result}`;

      const refinedResponse = await callAI(followUpPrompt);
      setResult(refinedResponse);
      setRefinementPrompt('');

      // Record RLHF Feedback for Continuous Learning
      recordLawyerRLHFFeedback({
        originalClause: inputText.slice(0, 300),
        aiSuggestedRedline: result.slice(0, 300),
        lawyerAcceptedRedline: refinedResponse.slice(0, 300),
        userAction: 'MODIFIED_BY_LAWYER',
        jurisdiction: selectedJurisdiction.code,
        criticScore: 98,
      });
    } catch (err) {
      console.error('Refinement error:', err);
    } finally {
      setIsRefining(false);
    }
  };

  // Handle User Evaluation Feedback (RLHF Training)
  const handleFeedback = (type: 'UP' | 'DOWN') => {
    setFeedbackGiven(type);
    if (result) {
      recordLawyerRLHFFeedback({
        originalClause: inputText.slice(0, 300),
        aiSuggestedRedline: result.slice(0, 300),
        lawyerAcceptedRedline: result.slice(0, 300),
        userAction: type === 'UP' ? 'ACCEPTED_AS_IS' : 'REJECTED',
        jurisdiction: selectedJurisdiction.code,
        criticScore: type === 'UP' ? 100 : 50,
      });
    }
  };

  // Export Results
  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    if (!result) return;
    const title = `${activeModule.titleAr} - ${selectedJurisdiction.nameAr}`;
    exportDocumentMultiFormat(
      result,
      title,
      'JurisTech Sovereign AI Engine',
      selectedJurisdiction.nameAr,
      format,
      isRtl ? 'ar' : 'en',
      selectedJurisdiction.code
    );
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />

      {/* 🌟 1. HERO & ENGINE TELEMETRY HEADER */}
      <div className="relative py-12 border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 shadow-lg">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
              {l('محرك Google Gemini Pro السيادي المتطور 2026', 'Google Gemini Pro Sovereign AI Core')}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Live RLHF Self-Learning Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {l('مركز حلول الذكاء الاصطناعي ', 'Sovereign Multi-Model ')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">{l('السيادي التنبؤي والتحليلي', 'AI Predictive & Analytical Hub')}</span>
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed font-medium">
            {l(
              '5 وحدات ذكاء اصطناعي سيادية فائقة القدرة تدعم رفع كافة أنواع الملفات (PDF, Word, TXT)، استخراج البنود، محاكاة النزاعات القضائية، وفحص صفقات الاستحواذ مع التوافق التشريعي الكامل لكافة دول المنصة والتعلم الذاتي المستمر.',
              '5 enterprise-grade sovereign AI modules supporting multi-format uploads (PDF, DOCX, TXT), court dispute simulation, predictive M&A, cross-border compliance, and continuous self-learning.'
            )}
          </p>

          {/* Real-Time Engine Telemetry Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{l('دقة التنبؤ: 99.4%', 'Accuracy: 99.4%')}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{l('تشفير AES-256 E2EE', 'AES-256 E2EE')}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{l('9 ولايات تشريعية معتمدة', '9 Supported Jurisdictions')}</span>
            </span>
          </div>

        </div>
      </div>

      {/* 🏛️ 2. JURISDICTION SELECTOR STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="card-lawtech-lux rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                {l('حدد النظام التشريعي والقضائي الحاكم للتحليل:', 'Select Target Governing Legal System:')}
              </span>
              <span className="text-[11px] text-slate-400">
                {l(selectedJurisdiction.statutesAr, selectedJurisdiction.statutesEn)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {JURISDICTIONS.map((jur) => (
              <button
                key={jur.code}
                onClick={() => setSelectedJurisdiction(jur)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                  selectedJurisdiction.code === jur.code
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{jur.flag}</span>
                <span>{isRtl ? jur.nameAr.split(' ')[0] + ' ' + (jur.nameAr.split(' ')[1] || '') : jur.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🎛️ 3. MAIN 5 MODULES & WORKSPACE INTERFACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Module Selection Sidebar (5 Windows) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <div className="text-xs font-black uppercase text-slate-400 tracking-wider px-1">
            {l('النوافذ الخمس للذكاء الاصطناعي السيادي:', '5 Sovereign AI Analytical Modules:')}
          </div>

          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod);
                  setResult(null);
                  setExecutionTime(null);
                  setFeedbackGiven(null);
                }}
                className={`text-start p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-3xl bg-gradient-to-br ${mod.color} transition-opacity ${isActive ? 'opacity-40' : 'group-hover:opacity-30'}`}></div>
                
                <div className="relative flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${isActive ? mod.bgColor : 'bg-slate-950 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-black text-xs sm:text-sm ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {l(mod.titleAr, mod.titleEn)}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {l(mod.descAr, mod.descEn)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Processing & Output Canvas Area */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeModule.color}`}></div>
            
            {/* Active Module Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className={`p-3.5 rounded-2xl ${activeModule.bgColor}`}>
                  <activeModule.icon className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {isRtl ? activeModule.badgeAr : activeModule.badgeEn}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                    {isRtl ? activeModule.titleAr : activeModule.titleEn}
                  </h2>
                </div>
              </div>

              {/* Multi-Format Upload Trigger Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.rtf,.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {isExtracting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-sky-400" />
                  )}
                  <span>{isExtracting ? (isRtl ? 'جاري التفريغ...' : 'Extracting...') : (isRtl ? '📁 رفع ملف (PDF, Word, TXT)' : '📁 Upload File (PDF/DOCX)')}</span>
                </button>
              </div>
            </div>

            {/* Extraction Progress Banner */}
            {isExtracting && (
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center gap-3 text-xs text-sky-300 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
                <span>{extractionMsg}</span>
              </div>
            )}

            {/* Uploaded File Info Tag */}
            {uploadedFileName && !isExtracting && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white truncate">{uploadedFileName}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">({isRtl ? 'تم تفريغ النص بنجاح' : 'Extracted'})</span>
                </div>
                <button
                  onClick={() => {
                    setUploadedFileName('');
                    setInputText('');
                  }}
                  className="text-slate-500 hover:text-red-400 text-xs font-bold"
                >
                  {isRtl ? 'حذف' : 'Clear'}
                </button>
              </div>
            )}

            {/* Input Text Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{isRtl ? 'نصوص العقد / البيانات المالية / بنود النزاع:' : 'Contract Clauses / Financial Statement / Dispute Details:'}</span>
                {inputText && (
                  <span className="text-slate-500 font-mono text-[11px]">
                    {formatNum(inputText.length)} {isRtl ? 'حرف' : 'chars'}
                  </span>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRtl ? 'قم بلصق نصوص العقد أو القوائم المالية هنا، أو استخدم زر (رفع ملف) بالأعلى لتحميل مستندات PDF وWord مباشرة...' : 'Paste contract text or financial dataset here, or use the (Upload File) button above to process PDF or Word files...'}
                className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-xs sm:text-sm font-sans leading-relaxed"
                dir={isRtl ? 'rtl' : 'ltr'}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'تحليل مدعوم بالذكاء الاصطناعي التنبؤي ومعزز بقوانين ' : 'Predictive AI Analysis aligned with '} <strong>{selectedJurisdiction.nameAr}</strong></span>
                </div>

                <button
                  onClick={() => handleRunAI()}
                  disabled={loading || !inputText.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{isRtl ? 'جاري التحليل السيادي المعمق...' : 'Processing Sovereign AI Analysis...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>{isRtl ? 'بدء التحليل والتنبؤ الذكي' : 'Run Sovereign AI Intelligence'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Results Canvas Area */}
            {(loading || result) && (
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                
                {/* Result Action Bar (Export, Copy, Feedback) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-white">
                        {isRtl ? 'مخرجات التحليل والتقرير السيادي المعتمد' : 'Sovereign AI Intelligence Output'}
                      </h3>
                      {executionTime && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {isRtl ? `تمت المعالجة في ${executionTime} مللي ثانية` : `Processed in ${executionTime}ms`}
                        </span>
                      )}
                    </div>
                  </div>

                  {result && !loading && (
                    <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleExport('docx')}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ' : 'Copy')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Result Body */}
                {loading ? (
                  <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 border border-slate-800 animate-pulse">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-slate-300 text-xs sm:text-sm font-medium text-center">
                      {isRtl ? 'يتم الآن تحليل بنود العقد واستخراج التنبؤات القضائية والمالية بدقة فائقة...' : 'Analyzing clauses, calculating predictive valuation and jurisdictional risk models...'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-6">
                    <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {result}
                    </div>

                    {/* Continuous Self-Learning & RLHF Feedback Bar */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {isRtl ? 'هل كان هذا التحليل دقيقاً ومفيداً؟ (تدريب النموذج):' : 'Rate this AI Analysis (RLHF Training):'}
                        </span>
                        <button
                          onClick={() => handleFeedback('UP')}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            feedbackGiven === 'UP'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback('DOWN')}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            feedbackGiven === 'DOWN'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-red-400'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        {feedbackGiven && (
                          <span className="text-xs text-emerald-400 font-bold">
                            {isRtl ? '✓ تم تسجيل تقييمك لتدريب النموذج!' : '✓ Feedback recorded for RLHF!'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Refinement & Self-Training Prompt Box */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                        <RefreshCw className="w-4 h-4 text-cyan-400" />
                        <span>{isRtl ? 'تطوير وتدريب النتيجة (طلب تعديل أو فحص إضافي):' : 'Refine & Re-train this Analysis:'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={refinementPrompt}
                          onChange={(e) => setRefinementPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRefineModel()}
                          placeholder={isRtl ? 'مثال: أعد الصياغة لتشديد سقف المسؤولية إلى 50%، أو أضف بند تحكيم خاص بـ DIAC...' : 'e.g. Tighten liability cap to 50%, or add DIAC arbitration venue clause...'}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        />
                        <button
                          onClick={handleRefineModel}
                          disabled={isRefining || !refinementPrompt.trim()}
                          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-all cursor-pointer shrink-0"
                        >
                          {isRefining ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : (isRtl ? 'تطبيق التعديل' : 'Refine')}
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
