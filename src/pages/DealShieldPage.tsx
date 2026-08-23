import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe2,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Scale,
  Building2,
  Lock,
  Layers,
  FileCheck2,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import SEO from '../components/SEO';
import { usePlatformLocale } from '../lib/universalTranslator';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import {
  runClientNeedDiagnostic,
  simulateCrossBorderDeal,
  JURISDICTION_CATALOG,
  NeedDiagnosticResult,
  CrossBorderDealSimulation,
} from '../services/dealShieldEngine';

export default function DealShieldPage() {
  const { l, isRtl } = usePlatformLocale();
  const [activeMode, setActiveMode] = useState<'diagnostic' | 'simulator'>('diagnostic');

  // Diagnostic State
  const [userQuery, setUserQuery] = useState('');
  const [sector, setSector] = useState('Technology & SaaS');
  const [targetJur, setTargetJur] = useState('SA');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<NeedDiagnosticResult | null>(null);

  // Simulator State
  const [dealType, setDealType] = useState('Cross-Border M&A & Technology Joint Venture');
  const [primaryJur, setPrimaryJur] = useState('SA');
  const [secondaryJur, setSecondaryJur] = useState('US_DE');
  const [tertiaryJur, setTertiaryJur] = useState('AE');
  const [dealValue, setDealValue] = useState<number>(750000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<CrossBorderDealSimulation | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setIsDiagnosing(true);
    try {
      const res = await runClientNeedDiagnostic(userQuery, sector, targetJur);
      setDiagnosticResult(res);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    try {
      const res = await simulateCrossBorderDeal(dealType, primaryJur, secondaryJur, tertiaryJur, dealValue);
      setSimulationResult(res);
    } finally {
      setIsSimulating(false);
    }
  };

  const exportDiagnosticReport = (format: 'pdf' | 'docx') => {
    if (!diagnosticResult) return;
    const content = `================================================================================
JURISTECH SOLUTIONS — 360° ENTERPRISE LEGAL NEED DIAGNOSTIC REPORT
Sector: ${diagnosticResult.sector} | Target Jurisdiction: ${diagnosticResult.targetJurisdiction}
Overall Legal Risk Score: ${diagnosticResult.overallRiskScore}/100 | Urgency: ${diagnosticResult.urgencyLevel}
================================================================================

1. EXECUTIVE SUMMARY & CLIENT INQUIRY:
"${diagnosticResult.userQuery}"

2. IDENTIFIED STATUTORY VULNERABILITIES:
${diagnosticResult.keyVulnerabilities
  .map(
    (v, i) =>
      `[${i + 1}] ${isRtl ? v.titleAr : v.titleEn} (${v.severity})\n` +
      `    Statute: ${v.statutoryRef}\n` +
      `    Analysis: ${isRtl ? v.descriptionAr : v.descriptionEn}\n`
  )
  .join('\n')}

3. MANDATORY CONTRACTS & AGREEMENTS REQUIRED:
${diagnosticResult.mandatoryContractsNeeded
  .map(
    (c, i) =>
      `[${i + 1}] ${isRtl ? c.nameAr : c.nameEn}\n` +
      `    Priority: Priority ${c.priority} | Path: ${c.contractPath}\n` +
      `    Rationale: ${isRtl ? c.reasonAr : c.reasonEn}\n`
  )
  .join('\n')}

4. BESPOKE ACTION PLAN:
${diagnosticResult.bespokeActionPlan
  .map(
    (s) =>
      `Step ${s.step}: ${isRtl ? s.titleAr : s.titleEn}\n` +
      `    Detail: ${isRtl ? s.detailAr : s.detailEn}\n`
  )
  .join('\n')}

================================================================================
JurisTech Solutions | Certified Sovereign AI Diagnostic Engine
Official Contact: juristech.solutions@outlook.com | +201126674337
================================================================================`;

    exportDocumentMultiFormat(
      content,
      `Diagnostic_Report_${diagnosticResult.id}`,
      'JurisTech Sovereign AI',
      'Corporate Client',
      format,
      isRtl ? 'ar' : 'en'
    );
  };

  const exportSimulationReport = (format: 'pdf' | 'docx') => {
    if (!simulationResult) return;
    const content = `================================================================================
JURISTECH SOLUTIONS — CROSS-BORDER STATUTORY DEAL SHIELD & CLASH SIMULATION
Deal: ${simulationResult.dealType} | Value: $${simulationResult.dealValueUSD?.toLocaleString() || 'N/A'} USD
Primary: ${simulationResult.primaryJurisdiction} | Secondary: ${simulationResult.secondaryJurisdiction} | Tertiary: ${simulationResult.tertiaryJurisdiction || 'None'}
Statutory Compatibility Score: ${simulationResult.statutoryCompatibilityScore}/100
================================================================================

1. RECOMMENDED ARBITRATION VENUE:
Center: ${isRtl ? simulationResult.recommendedArbitrationVenue.centerAr : simulationResult.recommendedArbitrationVenue.centerEn} (${simulationResult.recommendedArbitrationVenue.city})
Rules: ${simulationResult.recommendedArbitrationVenue.rules}
Rationale: ${isRtl ? simulationResult.recommendedArbitrationVenue.rationaleAr : simulationResult.recommendedArbitrationVenue.rationaleEn}

2. STATUTORY CLASHES & CONFLICT ANALYSIS:
${simulationResult.clashes
  .map(
    (c, i) =>
      `[Clash ${i + 1}] ${isRtl ? c.domainAr : c.domain} (${c.severity})\n` +
      `    Conflict: ${isRtl ? c.clashDescriptionAr : c.clashDescriptionEn}\n` +
      `    Statutes: ${c.statutoryRefA} vs ${c.statutoryRefB}\n` +
      `    Harmonized Clause: ${isRtl ? c.harmonizedBridgingClauseAr : c.harmonizedBridgingClauseEn}\n`
  )
  .join('\n\n')}

3. MASTER HARMONIZED GOVERNING LAW & DISPUTE CLAUSE:
${isRtl ? simulationResult.masterBridgingClauseAr : simulationResult.masterBridgingClauseEn}

================================================================================
JurisTech Solutions | Sovereign Cross-Border DealShield 360
Official Contact: juristech.solutions@outlook.com | +201126674337
================================================================================`;

    exportDocumentMultiFormat(
      content,
      `CrossBorder_DealShield_${simulationResult.simulationId}`,
      'JurisTech Sovereign AI',
      'Corporate Deal Room',
      format,
      isRtl ? 'ar' : 'en'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{l('جديد 2026: رادار الصفقات ومستكشف الاحتياجات السيادي', 'NEW 2026: DealShield 360 & Client Need Radar')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {l(
              'استكشاف الاحتياجات القانونية ومحاكاة الصفقات العابرة للحدود بالذكاء الاصطناعي',
              'Sovereign AI Client Need Discovery & Cross-Border Deal Simulator'
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {l(
              'أداة سيادية متطورة تستكشف بدقة احتياجات شركتك الماسة، وتكشف الثغرات والاتفاقيات الإلزامية الناقصة، مع محاكاة فورية للتعارض التشريعي بين الأنظمة الدولية (الخليج، أمريكا، بريطانيا، وأوروبا) وصياغة البنود التوافقية الموحدة.',
              'Advanced sovereign engine that diagnoses your urgent enterprise vulnerabilities, identifies missing mandatory contracts, and simulates cross-border statutory clashes across GCC, US Delaware, UK, and EU codes with instant harmonized bridging clauses.'
            )}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl mt-4">
            <button
              onClick={() => setActiveMode('diagnostic')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeMode === 'diagnostic'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{l('1. المستكشف التشخيصي لاحتياجات الشركة', '1. Enterprise Need Diagnostic')}</span>
            </button>

            <button
              onClick={() => setActiveMode('simulator')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeMode === 'simulator'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>{l('2. محاكي الصفقات والتعارض التشريعي', '2. Cross-Border Deal Simulator')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {activeMode === 'diagnostic' ? (
          /* ── MODE 1: NEED DIAGNOSTIC INTAKE ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">{l('تشخيص احتياجاتك القانونية', 'Diagnose Legal Needs')}</h2>
                    <p className="text-xs text-slate-400">{l('اكتب صفقتك أو وضعك التجاري بلغة بسيطة', 'Describe your deal or issue in plain words')}</p>
                  </div>
                </div>

                <form onSubmit={handleRunDiagnostic} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('القطاع أو مجال النشاط', 'Industry / Sector')}
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Technology & SaaS">Technology, AI & SaaS (التقنية والبرمجيات)</option>
                      <option value="E-Commerce & Supply Chain">E-Commerce & Logistics (التجارة وسلاسل الإمداد)</option>
                      <option value="Fintech & Digital Banking">Fintech & Payments (التقنية المالية والمصرفية)</option>
                      <option value="Real Estate & Construction">Real Estate & Contracting (العقارات والمقاولات)</option>
                      <option value="Investment Fund & VC">Venture Capital & M&A (الاستثمار الجريء والدمج)</option>
                      <option value="Healthcare & Pharma">Healthcare & Pharma (الرعاية الصحية والأدوية)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('الولاية القضائية المستهدفة', 'Target Jurisdiction')}
                    </label>
                    <select
                      value={targetJur}
                      onChange={(e) => setTargetJur(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {JURISDICTION_CATALOG.map((j) => (
                        <option key={j.code} value={j.code}>
                          {j.flag} {isRtl ? j.nameAr : j.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('وصف الصفقة أو التحدي القانوني', 'Deal / Situation Summary')}
                    </label>
                    <textarea
                      rows={4}
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder={
                        isRtl
                          ? 'مثال: نحن شركة ناشئة في دبي نعتزم بيع 30% من الحصص لصندوق استثماري سعودي ولدينا ملكية فكرية مسجلة في ديلاوير، ما هي العقود الإلزامية لحماية حقوقنا وكيف نتجنب فخاخ المسؤولية؟'
                          : 'e.g. We are a UAE startup selling 30% equity to a Saudi VC fund while holding Delaware IP. What mandatory agreements are required and how do we limit indemnity exposure?'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isDiagnosing || !userQuery.trim()}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isDiagnosing ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        <span>{l('جاري الفحص واستكشاف الاحتياجات...', 'Diagnosing Enterprise Needs...')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{l('تشخيص الاحتياجات والثغرات فوراً', 'Run 360° Need Diagnostic')}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Diagnostic Output Results */}
            <div className="lg:col-span-7">
              {diagnosticResult ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-6">
                  {/* Top Score Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {diagnosticResult.urgencyLevel} URGENCY
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {l('تقرير الفحص التشخيصي المعتمد', 'Certified Enterprise Diagnostic')}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white mt-1">
                        {l('مقياس المخاطر التشريعية:', 'Statutory Risk Index:')} {diagnosticResult.overallRiskScore}/100
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportDiagnosticReport('pdf')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => exportDiagnosticReport('docx')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>
                    </div>
                  </div>

                  {/* Key Vulnerabilities */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{l('الثغرات والمخاطر المكتشفة في صفقتك', 'Identified Statutory Vulnerabilities')}</span>
                    </h4>
                    <div className="space-y-2.5">
                      {diagnosticResult.keyVulnerabilities.map((vuln, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-rose-300">
                              {isRtl ? vuln.titleAr : vuln.titleEn}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {isRtl ? vuln.descriptionAr : vuln.descriptionEn}
                          </p>
                          <span className="text-[11px] font-mono text-cyan-400 block pt-1">
                            ⚖️ {vuln.statutoryRef}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mandatory Contracts Required */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4" />
                      <span>{l('العقود والاتفاقيات الإلزامية التي تنقصك', 'Mandatory Contracts Required')}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {diagnosticResult.mandatoryContractsNeeded.map((contract, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-xs font-black text-white block">
                              {isRtl ? contract.nameAr : contract.nameEn}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {isRtl ? contract.reasonAr : contract.reasonEn}
                            </p>
                          </div>
                          <Link
                            to={contract.contractPath}
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                          >
                            <span>{l('صياغة العقد الآن', 'Draft Contract Now')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Plan & Upgrade CTA */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">
                        {l('الباقة الموصى بها لحماية مشروعك:', 'Recommended Protection Tier:')}
                      </span>
                      <span className="text-sm font-black text-white">
                        {diagnosticResult.recommendedSubscriptionTier === 'dealroom'
                          ? l('غرفة الصفقات المؤسسية VIP Deal Room', 'VIP Institutional Deal Room')
                          : diagnosticResult.recommendedSubscriptionTier === 'enterprise'
                          ? l('الباقة السيادية للشركات الكبرى Enterprise', 'Enterprise Sovereign Tier')
                          : l('باقة الشركات المتوسطة والنمو SMEs', 'SMEs & Growth Package')}
                      </span>
                    </div>

                    <Link
                      to="/payment"
                      className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-400/20 shrink-0"
                    >
                      <span>{l('تفعيل الباقة وتأمين الصفقات', 'Activate Protection Plan')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Empty Placeholder State */
                <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {l('بانتظار تفاصيل صفقتك لتشخيص احتياجاتك بدقة', 'Ready to diagnose your deal requirements')}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    {l(
                      'أدخل ملخص مشروعك في النموذج الجانبي ليقوم الذكاء الاصطناعي السيادي بتحليل الثغرات التشريعية وتحديد العقود الواجب توقيعها فوراً.',
                      'Fill the form on the left to trigger instant AI vulnerability extraction and missing contract detection.'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── MODE 2: CROSS-BORDER STATUTORY CLASH SIMULATOR ── */
          <div className="space-y-8">
            {/* Multi-Jurisdiction Config Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {l('محاكي الصفقات والتعارض التشريعي العابر للحدود', 'Multi-Jurisdiction Deal & Statutory Clash Simulator')}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {l('فحص توافق 2 إلى 3 أنظمة قضائية متزامنة وكشف الثغرات وصياغة البنود التوافقية', 'Simulate statutory compatibility across 2-3 jurisdictions & auto-generate bridging clauses')}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  {primaryJur} ⇄ {secondaryJur} {tertiaryJur ? `⇄ ${tertiaryJur}` : ''}
                </div>
              </div>

              <form onSubmit={handleRunSimulation} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Primary Jurisdiction */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('الولاية القضائية الأساسية (المقر/الطرف الأول)', 'Primary Jurisdiction (Party A)')}
                    </label>
                    <select
                      value={primaryJur}
                      onChange={(e) => setPrimaryJur(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    >
                      {JURISDICTION_CATALOG.map((j) => (
                        <option key={j.code} value={j.code}>
                          {j.flag} {isRtl ? j.nameAr : j.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Jurisdiction */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('الولاية القضائية الثانية (المستثمر/الطرف الثاني)', 'Secondary Jurisdiction (Party B)')}
                    </label>
                    <select
                      value={secondaryJur}
                      onChange={(e) => setSecondaryJur(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    >
                      {JURISDICTION_CATALOG.map((j) => (
                        <option key={j.code} value={j.code}>
                          {j.flag} {isRtl ? j.nameAr : j.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tertiary Jurisdiction (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('ولاية تسجيل الملكية الفكرية/التحكيم (اختياري)', 'Tertiary / IP Venue (Optional)')}
                    </label>
                    <select
                      value={tertiaryJur}
                      onChange={(e) => setTertiaryJur(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    >
                      <option value="">{l('بدون ولاية ثالثة', 'None (Dual Jurisdiction)')}</option>
                      {JURISDICTION_CATALOG.map((j) => (
                        <option key={j.code} value={j.code}>
                          {j.flag} {isRtl ? j.nameAr : j.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('نوع الصفقة أو الاتفاقية التجارية', 'Deal Type & Scope')}
                    </label>
                    <input
                      type="text"
                      value={dealType}
                      onChange={(e) => setDealType(e.target.value)}
                      placeholder="e.g. Cross-Border Equity Investment & Technology Licensing"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {l('قيمة الصفقة التقديرية ($ USD)', 'Estimated Deal Value ($ USD)')}
                    </label>
                    <input
                      type="number"
                      value={dealValue}
                      onChange={(e) => setDealValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSimulating}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>{l('جاري محاكاة التعارض التشريعي واستخراج البنود...', 'Simulating Cross-Border Compatibility...')}</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4" />
                      <span>{l('تشغيل محاكي الصفقات والتعارض الدولي الآن', 'Simulate Deal Enforceability & Clash Detection')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Simulation Results View */}
            {simulationResult && (
              <div className="space-y-6">
                {/* Metrics Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{l('درجة التوافق التشريعي', 'Compatibility Index')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-emerald-400">{simulationResult.statutoryCompatibilityScore}%</span>
                      <span className="text-xs text-emerald-300/80 font-bold">{l('توافق عالٍ مع البنود التوافقية', 'High with Bridges')}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{l('مركز التحكيم الموصى به', 'Recommended Arbitration')}</span>
                    <span className="text-sm font-black text-cyan-400 block truncate">
                      {isRtl ? simulationResult.recommendedArbitrationVenue.centerAr : simulationResult.recommendedArbitrationVenue.centerEn}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">{simulationResult.recommendedArbitrationVenue.rules}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">{l('تصدير تقرير المحاكاة', 'Export Report')}</span>
                      <span className="text-xs font-black text-white">{l('نسخة رسمية بالختم', 'Certified Copy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportSimulationReport('pdf')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => exportSimulationReport('docx')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detected Clashes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{l('نقاط التعارض التشريعي المكتشفة والحلول التوافقية', 'Identified Statutory Clashes & Harmonization Bridges')}</span>
                  </h3>

                  <div className="space-y-4">
                    {simulationResult.clashes.map((clash, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-sm font-black text-white">
                              {isRtl ? clash.domainAr : clash.domain}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {clash.statutoryRefA} ⚡ {clash.statutoryRefB}
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {clash.severity}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                          <p>
                            <strong className="text-slate-200">{l('طبيعة التعارض:', 'Conflict Analysis:')}</strong>{' '}
                            {isRtl ? clash.clashDescriptionAr : clash.clashDescriptionEn}
                          </p>
                          <p>
                            <strong className="text-slate-200">{l('الأثر على الصفقة:', 'Impact on Deal:')}</strong>{' '}
                            {isRtl ? clash.impactAnalysisAr : clash.impactAnalysisEn}
                          </p>
                        </div>

                        {/* Harmonized Bridging Clause Box */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              {l('الصياغة التوافقية المعتمدة (Harmonized Bridging Clause):', 'Harmonized Bridging Clause:')}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(
                                  isRtl ? clash.harmonizedBridgingClauseAr : clash.harmonizedBridgingClauseEn,
                                  `clash-${idx}`
                                )
                              }
                              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === `clash-${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">{l('تم النسخ', 'Copied')}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{l('نسخ البند', 'Copy Clause')}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                            {isRtl ? clash.harmonizedBridgingClauseAr : clash.harmonizedBridgingClauseEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Master Governing Law & Arbitration Clause */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-cyan-400 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>{l('بند القانون النافذ وفض النزاعات الشامل المقترح للاتفاقية', 'Master Governing Law & Dispute Resolution Clause')}</span>
                    </h4>
                    <button
                      onClick={() =>
                        handleCopy(
                          isRtl ? simulationResult.masterBridgingClauseAr : simulationResult.masterBridgingClauseEn,
                          'master-clause'
                        )
                      }
                      className="text-xs font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'master-clause' ? (
                        <>
                          <Check className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400">{l('تم النسخ', 'Copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{l('نسخ البند الشامل', 'Copy Master Clause')}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    {isRtl ? simulationResult.masterBridgingClauseAr : simulationResult.masterBridgingClauseEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
