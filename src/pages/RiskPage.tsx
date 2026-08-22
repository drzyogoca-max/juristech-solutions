import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, Loader2, ShieldAlert,
  Upload, FileText, X, Globe, Filter, Download, CheckCircle2, ShieldCheck, Copy, Check,
  Sparkles, Scale, Layers, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { detectVisitorJurisdiction, JurisdictionInfo, JURISDICTIONS } from '../lib/jurisdiction';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { extractPDFTextMultiStage, detectDocumentLanguage } from '../lib/pdfExtractor';
import { useContract } from '../context/ContractContext';
import VoiceInput from '../components/VoiceInput';
import ContractAnalysisSkeleton from '../components/ContractAnalysisSkeleton';
import AutonomousRiskPanel from '../components/AutonomousRiskPanel';
import SEO from '../components/SEO';
import { ContractAnalysisEngine, Deep8AxisAuditReport, AuditAxisResult } from '../services/contractAnalysisEngine';
import VisualRedlineDiffModal from '../components/VisualRedlineDiffModal';
import { usePlatformLocale } from '../lib/universalTranslator';

export default function RiskPage() {
  const { l, isRtl } = usePlatformLocale();
  const { contractState, setContractData, updateAuditResults, clearContractData } = useContract();

  const [contractText, setContractText] = useState(contractState.extractedText || '');
  const [fileName, setFileName] = useState(contractState.fileName || '');
  const [auditReport, setAuditReport] = useState<Deep8AxisAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [error, setError] = useState('');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);
  const [selectedAxisForDiff, setSelectedAxisForDiff] = useState<AuditAxisResult | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contractState.extractedText && !contractText) {
      setContractText(contractState.extractedText);
    }
    if (contractState.fileName && !fileName) {
      setFileName(contractState.fileName);
    }
  }, [contractState]);

  useEffect(() => {
    detectVisitorJurisdiction().then(setJurisdiction);
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    setError('');
    setFileName(file.name);

    try {
      const extraction = await extractPDFTextMultiStage(file, (msg) => {
        setExtractionStatus(msg);
      });

      setContractText(extraction.text);

      setContractData({
        fileName: file.name,
        extractedText: extraction.text,
      });

      if (extraction.text && extraction.text.length > 20) {
        await executeDeepAudit(extraction.text, file.name);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setError(l('فشل استخراج نص المستند. يرجى لصق البنود يدوياً.', 'Failed to extract document text. Please paste clauses manually.'));
    } finally {
      setExtracting(false);
      setExtractionStatus('');
    }
    e.target.value = '';
  }

  function clearFile() {
    setFileName('');
    setContractText('');
    setAuditReport(null);
    clearContractData();
  }

  async function executeDeepAudit(textToAnalyze: string, currentFileName?: string) {
    if (!textToAnalyze.trim()) {
      alert(l('يرجى إدخال أو رفع نصوص العقد أولاً', 'Please upload or paste contract clauses first'));
      return;
    }
    setLoading(true);
    setError('');

    try {
      const targetJur = jurisdiction?.countryNameAr || 'Egypt / GCC / International';
      const report = await ContractAnalysisEngine.executeDeep8AxisAudit(
        textToAnalyze,
        currentFileName || fileName || 'Commercial Legal Agreement',
        targetJur
      );
      setAuditReport(report);

      // Save to Supabase telemetry if available
      try {
        supabase.from('risk_assessments').insert({
          file_name: currentFileName || fileName || null,
          risk_score: report.overallScore,
          missing_clauses: report.axes.map(a => a.axisNameEn),
          recommendations: report.strategicDealRecommendationsEn,
        });
      } catch {}
    } catch (err) {
      setError(l('حدث خطأ أثناء إجراء الفحص التشريعي.', 'An error occurred during statutory risk analysis.'));
    } finally {
      setLoading(false);
    }
  }

  const handleExportFullAudit = (format: 'pdf' | 'docx') => {
    if (!auditReport) return;
    const docTitle = auditReport.documentTitle || 'Legal_Contract_Audit_Report';

    const content = `================================================================================
       JURISTECH SOLUTIONS — DEEP 8-AXIS STATUTORY CONTRACT AUDIT REPORT
================================================================================
DOCUMENT: ${docTitle}
TIMESTAMP: ${auditReport.auditTimestamp}
OVERALL STATUTORY SCORE: ${auditReport.overallScore}/100 [${auditReport.overallRiskLevel}]

--------------------------------------------------------------------------------
EXECUTIVE SUMMARY:
${isRtl ? auditReport.executiveSummaryAr : auditReport.executiveSummaryEn}

--------------------------------------------------------------------------------
FINANCIAL LIABILITY CAPPING STATUS:
• Status: ${auditReport.financialLiabilityCapStatus.isCapped ? 'CAPPED' : 'UNCAPPED LIABILITY TRAP'}
• Current Finding: ${isRtl ? auditReport.financialLiabilityCapStatus.detectedCapAr : auditReport.financialLiabilityCapStatus.detectedCapEn}
• Mandatory Fix: ${isRtl ? auditReport.financialLiabilityCapStatus.recommendedCapAr : auditReport.financialLiabilityCapStatus.recommendedCapEn}

--------------------------------------------------------------------------------
8-AXIS ITEMIZATION & EXECUTIVE REDLINES:
${auditReport.axes.map((axis, i) => `
AXIS ${i + 1}: ${isRtl ? axis.axisNameAr : axis.axisNameEn}
Score: ${axis.score}/100 | Severity: ${axis.severity.toUpperCase()}
Statutory Basis: ${isRtl ? axis.statutoryBasisAr : axis.statutoryBasisEn}
Identified Traps:
${(isRtl ? axis.identifiedRisksAr : axis.identifiedRisksEn).map(r => `  - ${r}`).join('\n')}
Protective Redline Clause:
${isRtl ? axis.executiveRedlineAr : axis.executiveRedlineEn}
`).join('\n--------------------------------------------------------------------------------\n')}

--------------------------------------------------------------------------------
STRATEGIC DEAL RECOMMENDATIONS:
${(isRtl ? auditReport.strategicDealRecommendationsAr : auditReport.strategicDealRecommendationsEn).map((r, i) => `${i + 1}. ${r}`).join('\n')}

Authorized by JurisTech Supreme Legal Architecture Engine.
================================================================================`;

    exportDocumentMultiFormat(content, docTitle, 'JurisTech Legal', 'Client Corp', format, isRtl ? 'ar' : 'en');
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{l('محرك الفحص التشريعي المعمق عبر المحاور الـ 8', 'Sovereign 8-Axis Statutory Contract Audit Engine')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {l('رادار المخاطر والتحصين العقدي المؤسسي', 'Contract Risk Radar & Statutory Fortification Suite')}
            </h1>
          </div>

          {jurisdiction && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? `النظام النافذ: ${jurisdiction.countryNameAr}` : `Active Framework: ${jurisdiction.countryName}`}</span>
            </div>
          )}
        </div>

        {/* Autonomous Proactive Compliance & Risk Engine Banner */}
        <AutonomousRiskPanel />

        {/* 30+ Country Jurisdiction Selector */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
          <label className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{l('اختر الدولة والنظام التشريعي النافذ لإجراء فحص المخاطر طبقاً للوائحها:', 'Select Governing Jurisdiction for Risk Audit:')}</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 max-h-40 overflow-y-auto pr-1">
            {Object.values(JURISDICTIONS)
              .filter((j) => !j.isBlocked)
              .map((j) => (
                <button
                  key={j.countryCode}
                  onClick={() => setJurisdiction(j)}
                  className={`p-2 rounded-xl text-xs font-bold text-center transition-all border truncate flex items-center justify-center gap-1.5 cursor-pointer ${
                    jurisdiction?.countryCode === j.countryCode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-105'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                  title={isRtl ? j.countryNameAr : j.countryName}
                >
                  <span>{j.flagEmoji || '🌐'}</span>
                  <span className="truncate">{isRtl ? j.countryNameAr.split(' ')[0] : j.countryCode}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Input & Upload Staging Box */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-5 shadow-2xl">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-amber-500/40">
                <div className="flex items-center gap-3 truncate">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-slate-200 truncate">{fileName}</span>
                </div>
                <button onClick={clearFile} className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-xl hover:bg-slate-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={extracting}
                className="w-full border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-3xl p-8 flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-all bg-slate-950/40 group cursor-pointer"
              >
                {extracting ? (
                  <Loader2 className="w-9 h-9 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-9 h-9 text-amber-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-black">
                  {extracting
                    ? (extractionStatus || l('جاري قراءة واستخراج مستند العقد...', 'Extracting document text...'))
                    : l('اضغط هنا لرفع عقد (PDF / DOCX / TXT) للفحص التشريعي المعمق', 'Drop or upload contract file (PDF / DOCX / TXT)')}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Deep 8-Axis Multi-Jurisdiction Statutory Scanner v2026
                </span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              placeholder={l('أو الصق بنود العقد هنا لإجراء الفحص الفوري عبر المحاور الثمانية...', 'Or paste agreement clauses here for instant 8-axis statutory risk auditing...')}
              value={contractText}
              onChange={e => { setContractText(e.target.value); if (e.target.value === '') setFileName(''); }}
              rows={6}
              className={`w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 font-sans text-xs text-slate-200 leading-relaxed ${isRtl ? 'pl-14' : 'pr-14'}`}
            />
            <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-10`}>
              <VoiceInput onTranscript={(text) => setContractText((prev) => prev + ' ' + text)} />
            </div>
          </div>

          {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}

          <button
            onClick={() => executeDeepAudit(contractText, fileName)}
            disabled={loading || extracting || !contractText.trim()}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 p-4 rounded-2xl font-black text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-950/30 text-sm sm:text-base cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-950" /> : <AlertTriangle className="w-5 h-5 text-slate-950" />}
            <span>
              {loading
                ? l('جاري تشغيل الفحص التشريعي المعمق وتوليد البدائل عبر المحاور الـ 8...', 'Executing Deep 8-Axis Statutory Audit & Redlining...')
                : l('بدء الفحص التشريعي المعمق وتوليد الصياغات البديلة', 'Execute Deep 8-Axis Audit & Generate Redlines')}
            </span>
          </button>
        </div>

        {/* Dynamic Skeleton Loading State */}
        {loading && (
          <ContractAnalysisSkeleton stage={l('جاري فحص المسؤوليات المالية، الثغرات الصامتة، ومطابقة معايير ICC والأنظمة الوطنية...', 'Auditing liabilities, silent gaps, and ICC/Statutory compliance...')} />
        )}

        {/* DELIVERABLE 8-AXIS AUDIT REPORT OUTPUT */}
        {!loading && auditReport && (
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8 shadow-2xl animate-fade-in">
            
            {/* 1. Comprehensive Score & Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${auditReport.overallScore < 60 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                    {l('درجة الأمان التشريعي للعقد (Statutory Health Score)', 'Overall Statutory Safety Score')}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white">{auditReport.overallScore}/100</div>
                  <span className={`text-[11px] font-mono font-bold uppercase block mt-1 ${auditReport.overallScore < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    Level: {auditReport.overallRiskLevel.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExportFullAudit('pdf')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> {l('تصدير تقرير PDF رسمي', 'Official PDF Report')}
                </button>
                <button
                  onClick={() => handleExportFullAudit('docx')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> {l('تصدير Word (.docx)', 'Word Document (.docx)')}
                </button>
              </div>
            </div>

            {/* 2. Executive Summary */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {l('الملخص التنفيذي والتقييم الاستراتيجي:', 'Executive Assessment & Legal Diagnosis:')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {isRtl ? auditReport.executiveSummaryAr : auditReport.executiveSummaryEn}
              </p>
            </div>

            {/* 3. Financial Liability Capping Status Warning Box */}
            <div className={`p-5 rounded-2xl border ${auditReport.financialLiabilityCapStatus.isCapped ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/40'} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black uppercase flex items-center gap-2 ${auditReport.financialLiabilityCapStatus.isCapped ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <AlertTriangle className="w-4 h-4" />
                  {l('موقف سقف المسؤولية المالية والتعويضات (Liability Cap Audit):', 'Financial Liability Cap Audit:')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${auditReport.financialLiabilityCapStatus.isCapped ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {auditReport.financialLiabilityCapStatus.isCapped ? l('محصن', 'Capped') : l('فخ مالي حاد (Uncapped)', 'Uncapped Trap')}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">{l('الوضع الحالي:', 'Current Status:')} </strong>
                {isRtl ? auditReport.financialLiabilityCapStatus.detectedCapAr : auditReport.financialLiabilityCapStatus.detectedCapEn}
              </p>
              <p className="text-xs text-amber-300">
                <strong className="text-amber-400">{l('التعديل الإلزامي:', 'Mandatory Clause Fix:')} </strong>
                {isRtl ? auditReport.financialLiabilityCapStatus.recommendedCapAr : auditReport.financialLiabilityCapStatus.recommendedCapEn}
              </p>
            </div>

            {/* 4. The 8-Axis Itemized Breakdown Grid */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{l('فحص المحاور التشريعية الثمانية (8-Axis Statutory Breakdown):', '8-Axis Statutory Deep Breakdown:')}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditReport.axes.map((axis) => (
                  <div
                    key={axis.axisId}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {isRtl ? axis.axisNameAr : axis.axisNameEn}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                          axis.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          axis.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          axis.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {axis.score}/100
                        </span>
                      </div>

                      <p className="text-[11px] text-indigo-300 font-mono line-clamp-2">
                        {isRtl ? axis.statutoryBasisAr : axis.statutoryBasisEn}
                      </p>

                      <div className="space-y-1">
                        {(isRtl ? axis.identifiedRisksAr : axis.identifiedRisksEn).slice(0, 1).map((risk, i) => (
                          <span key={i} className="text-[11px] text-slate-400 block truncate">
                            • {risk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAxisForDiff(axis);
                        setShowDiffModal(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{l('عرض الصياغة البديلة والمقارنة', 'View Redline & Diff')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Strategic Recommendations List */}
            <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
              <h3 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{l('التوصيات الاستراتيجية لإغلاق الصفقة بأمان تام:', 'Strategic Deal Closing Recommendations:')}</span>
              </h3>
              <ul className="space-y-2 text-xs font-sans text-slate-200">
                {(isRtl ? auditReport.strategicDealRecommendationsAr : auditReport.strategicDealRecommendationsEn).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 🔍 Visual Redline Diff Modal */}
      <VisualRedlineDiffModal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        axis={selectedAxisForDiff}
        documentTitle={auditReport?.documentTitle || fileName || 'Contract'}
      />
    </main>
  );
}
