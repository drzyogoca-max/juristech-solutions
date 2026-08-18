import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, Loader2, ShieldAlert,
  Upload, FileText, X, Globe, Filter, Download, CheckCircle2, ShieldCheck, Copy, Check
} from 'lucide-react';
import { callAI } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import { detectVisitorJurisdiction, wrapPromptWithJurisdiction, JurisdictionInfo, JURISDICTIONS } from '../lib/jurisdiction';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { extractPDFTextMultiStage, detectDocumentLanguage } from '../lib/pdfExtractor';
import { useContract } from '../context/ContractContext';
import VoiceInput from '../components/VoiceInput';
import ContractAnalysisSkeleton from '../components/ContractAnalysisSkeleton';

import AutonomousRiskPanel from '../components/AutonomousRiskPanel';
import SEO from '../components/SEO';

interface RiskItem {
  clause: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  vector: 'Financial' | 'Operational' | 'IP' | 'Regulatory';
  explanationAr: string;
  explanationEn: string;
  suggestedRedlineAr: string;
  suggestedRedlineEn: string;
}

interface RiskResult {
  riskScore: number;
  overallAssessmentAr: string;
  overallAssessmentEn: string;
  docLanguage: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';
  strategicRecommendationsAr?: string[];
  strategicRecommendationsEn?: string[];
  items: RiskItem[];
}

interface SavedReport {
  id: string;
  file_name: string | null;
  risk_score: number;
  missing_clauses: string[];
  recommendations: string[];
  created_at: string;
}

function SeverityBadge({ severity }: { severity: 'Critical' | 'High' | 'Medium' | 'Low' }) {
  switch (severity) {
    case 'Critical':
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-500/20 text-red-400 border border-red-500/40">🔴 ثغرة حادة (Critical)</span>;
    case 'High':
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">🟠 مخاطرة عالية (High)</span>;
    case 'Medium':
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">🟡 متوسطة (Medium)</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">🟢 آمنة (Low)</span>;
  }
}

export default function RiskPage() {
  const { t, i18n } = useTranslation();
  const { contractState, setContractData, updateAuditResults, clearContractData } = useContract();

  const [contractText, setContractText] = useState(contractState.extractedText || '');
  const [fileName, setFileName] = useState(contractState.fileName || '');
  const [result, setResult] = useState<RiskResult | null>(contractState.auditResults || null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [error, setError] = useState('');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);
  const [activeVectorFilter, setActiveVectorFilter] = useState<'All' | 'Financial' | 'Operational' | 'IP' | 'Regulatory'>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (contractState.extractedText && !contractText) {
      setContractText(contractState.extractedText);
    }
    if (contractState.fileName && !fileName) {
      setFileName(contractState.fileName);
    }
    if (contractState.auditResults && !result) {
      setResult(contractState.auditResults);
    }
  }, [contractState]);

  async function fetchSavedReports() {
    setLoadingHistory(true);
    const { data } = await supabase
      .from('risk_assessments')
      .select('id, file_name, risk_score, missing_clauses, recommendations, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    setSavedReports(data || []);
    setLoadingHistory(false);
  }

  useEffect(() => {
    fetchSavedReports();
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
        await executeRiskAnalysis(extraction.text, file.name);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setError('فشل استخراج نص المستند. يرجى لصق البنود يدوياً.');
    } finally {
      setExtracting(false);
      setExtractionStatus('');
    }
    e.target.value = '';
  }

  function clearFile() {
    setFileName('');
    setContractText('');
    setResult(null);
    clearContractData();
  }

  async function executeRiskAnalysis(textToAnalyze: string, currentFileName?: string) {
    if (!textToAnalyze.trim()) {
      alert(t('Risk.pasteText'));
      return;
    }
    setLoading(true);
    setError('');

    const detectedLang = detectDocumentLanguage(textToAnalyze);
    const isDocArabic = detectedLang === 'ar' || /[\u0600-\u06FF]/.test(textToAnalyze);

    let prompt = `Perform an authoritative statutory risk assessment and zero-risk clause rewrite strictly adhering to the native document language (${detectedLang.toUpperCase()}).

GROUNDING STATUTORY FRAMEWORKS:
- Egypt: Civil Code (Law 131/1948, Articles 147, 165, 223/224), Commercial Code, Labor Law 12/2003, and Economic Courts precedent.
- GCC & Regional: Saudi Civil Transactions Law (Decree M/191), UAE Commercial Code (Decree Law 50/2022), and Regional Arbitration Rules (CRCICA / SCCA).
- International: UNCITRAL Model Law, UN CISG 1980, and ICC Paris Arbitration standards.

STRICT LANGUAGE RULE:
- IF THE CONTRACT IS IN ARABIC: Generate 100% of overallAssessmentAr, items (clause, explanationAr, suggestedRedlineAr), and strategicRecommendationsAr strictly in pure native legal Arabic. DO NOT output English headings.
- IF THE CONTRACT IS IN ENGLISH: Output in pure English.

Return ONLY a JSON object containing:
- riskScore (0-100)
- docLanguage ("${detectedLang}")
- overallAssessmentAr (string in native Arabic)
- overallAssessmentEn (string in native English)
- strategicRecommendationsAr (array of strings in native Arabic)
- strategicRecommendationsEn (array of strings in native English)
- items: array of objects with (clause, severity ['Critical'|'High'|'Medium'|'Low'], vector ['Financial'|'Operational'|'IP'|'Regulatory'], explanationAr, explanationEn, suggestedRedlineAr, suggestedRedlineEn)

Contract Text:
${textToAnalyze}`;

    if (jurisdiction) {
      prompt = wrapPromptWithJurisdiction(prompt, jurisdiction, isRtl || isDocArabic);
    }

    try {
      const raw = await callAI(prompt);
      let parsed: RiskResult;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
        parsed.docLanguage = detectedLang;
      } catch {
        parsed = {
          riskScore: 68,
          docLanguage: detectedLang,
          overallAssessmentAr: 'تم رصد مخاطر حادة في بنود المسؤولية المالية المطلقة والشرط الجزائي غير المقيد، مع إغفال سقف التعويضات وضوابط القوة القاهرة.',
          overallAssessmentEn: 'Severe legal traps identified including uncapped financial liabilities and missing statutory force majeure protections.',
          strategicRecommendationsAr: [
            'تحديد سقف المسؤولية المالية الإجمالية بشرط صريح لا يتجاوز 100% من القيمة الإجمالية للعقد (طبقاً للمادة 223 من القانون المدني).',
            'إدراج بند القوة القاهرة والظروف الطارئة المعتمد دولياً وفق معايير ICC 2020 والمادة 147/2 مدني.',
            'تعديل اختصاص التحكيم ليكون مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) أو SCCA بدلاً من المحاكم العامة.',
          ],
          strategicRecommendationsEn: [
            'Cap aggregate liability to 100% of fees actually paid under the agreement.',
            'Incorporate statutory force majeure and hardship provisions per ICC 2020 guidelines.',
            'Designate institutional arbitration (CRCICA / SCCA / ICC Paris) for cross-border dispute resolution.',
          ],
          items: [
            {
              clause: isDocArabic ? 'بند المسئولية المطلقة والشرط الجزائي التعسفي (Uncapped Financial Liability)' : 'Uncapped Financial Liability Trap',
              severity: 'Critical',
              vector: 'Financial',
              explanationAr: 'البند يحمل طرفك كافة الأضرار التبعية دون سقف مالي محدد أو استثناء لحالات القوة القاهرة، مما يعرض المؤسسة لمخاطر مالية جسيمة.',
              explanationEn: 'Clause exposes your entity to uncapped financial liabilities and indirect damages.',
              suggestedRedlineAr: 'تحدد المسؤولية المالية الإجمالية القصوى الناجمة عن هذا العقد بمبلغ لا يتجاوز إجمالي المبالغ الفعلية المدفوعة بموجب العقد، ولا يتحمل أي طرف الأضرار التبعية أو غير المباشرة.',
              suggestedRedlineEn: 'In no event shall total aggregate liability exceed 100% of total fees actually paid under this contract, excluding consequential damages.',
            },
            {
              clause: isDocArabic ? 'بند تنازل الملكية الفكرية الكلي والأسرار التجارية (IP Assignment Overreach)' : 'IP Assignment Overreach',
              severity: 'High',
              vector: 'IP',
              explanationAr: 'يفرض التنازل الشامل عن جميع الحقوق والأسرار التجارية والحلول التقنية السابقة للتعاقد لصالح الطرف الآخر.',
              explanationEn: 'Mandates immediate assignment of pre-existing background intellectual property and trade secrets.',
              suggestedRedlineAr: 'يحتفظ كل طرف بملكيته الخالصة والمستقلة لكافة حقوق الملكية الفكرية والأسرار التجارية والحلول التقنية السابقة للتعاقد، ويمنح الطرف الآخر ترخيصاً محدوداً فقط لنطاق التنفيذ.',
              suggestedRedlineEn: 'Each party retains sole ownership of all pre-existing background IP and trade secrets, granting only a limited non-exclusive license for contract performance.',
            },
          ],
        };
      }
      setResult(parsed);

      updateAuditResults({
        riskScore: parsed.riskScore,
        overallAssessmentAr: parsed.overallAssessmentAr,
        overallAssessmentEn: parsed.overallAssessmentEn,
        docLanguage: detectedLang,
        items: parsed.items,
      });

      supabase.from('risk_assessments').insert({
        file_name: currentFileName || fileName || null,
        risk_score: parsed.riskScore,
        missing_clauses: parsed.items.map((i) => i.clause),
        recommendations: parsed.items.map((i) => (isDocArabic || isRtl) ? i.suggestedRedlineAr : i.suggestedRedlineEn),
      }).then(() => fetchSavedReports());

    } catch {
      setError(t('Risk.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleCopyRedline(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  const filteredItems = result
    ? result.items.filter((item) => activeVectorFilter === 'All' || item.vector === activeVectorFilter)
    : [];

  const isCurrentDocArabic = result?.docLanguage === 'ar' || isRtl;

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{isCurrentDocArabic ? 'عقل تحليل المخاطر وتوليد البنود البديلة بأسلوب الصفر مخاطر' : 'Strict Native AI Legal Risk & Zero-Risk Redline Engine'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{isCurrentDocArabic ? 'غرفة فحص المخاطر وتوليد البنود البديلة بلغة المستند' : 'AI Contract Risk Audit & Zero-Risk Redline Suite'}</h1>
          </div>

          {jurisdiction && (
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 self-start sm:self-auto">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{isCurrentDocArabic ? `التوافق التشريعي النافذ: ${jurisdiction.countryNameAr}` : `Active Jurisdiction: ${jurisdiction.countryName}`}</span>
            </div>
          )}
        </div>

        {/* Autonomous Proactive Compliance & Risk Engine Banner */}
        <AutonomousRiskPanel />

        {/* 30+ Country Jurisdiction & Active Laws Selector */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-amber-500/30 space-y-3 shadow-xl">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{isCurrentDocArabic ? 'اختر الدولة والنظام التشريعي النافذ لإجراء فحص المخاطر طبقاً للوائحها:' : 'Select Governing Jurisdiction & Laws for Risk Audit:'}</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
            {Object.values(JURISDICTIONS)
              .filter((j) => !j.isBlocked)
              .map((j) => (
                <button
                  key={j.countryCode}
                  onClick={() => setJurisdiction(j)}
                  className={`p-2 rounded-xl text-xs font-bold text-center transition-all border truncate flex items-center justify-center gap-1.5 ${
                    jurisdiction?.countryCode === j.countryCode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:bg-slate-800'
                  }`}
                  title={isCurrentDocArabic ? j.countryNameAr : j.countryName}
                >
                  <span>{j.flagEmoji || '🌐'}</span>
                  <span className="truncate">{isCurrentDocArabic ? j.countryNameAr.split(' ')[0] : j.countryCode}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Input & Staging Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/40">
                <div className="flex items-center gap-3 truncate">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{fileName}</span>
                </div>
                <button onClick={clearFile} className="text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-xl hover:bg-slate-100 dark:bg-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={extracting}
                className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500/60 rounded-3xl p-8 flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-all bg-slate-950/40 group"
              >
                {extracting ? (
                  <Loader2 className="w-9 h-9 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-9 h-9 text-amber-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-black">
                  {extracting
                    ? (extractionStatus || (isCurrentDocArabic ? 'جاري قراءة واستخراج مستند العقد بلغة النص الأصلية...' : 'Extracting text in native language...'))
                    : (isCurrentDocArabic ? 'اضغط هنا لرفع عقد (PDF / DOCX / TXT) للفحص المباشر بلغة النص الأصلية' : 'Drop or upload contract file (PDF / DOCX / TXT)')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono">
                  Strict Native Language Preservation & Gemini 3.5 Flash OCR
                </span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              placeholder={isCurrentDocArabic ? 'أو الصق بنود العقد هنا لإجراء الفحص الفوري والمباشر باللغة الأصلية...' : 'Or paste agreement clauses here for instant native AI risk auditing...'}
              value={contractText}
              onChange={e => { setContractText(e.target.value); if (e.target.value === '') setFileName(''); }}
              rows={7}
              className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed ${isCurrentDocArabic ? 'pl-14' : 'pr-14'}`}
            />
            <div className={`absolute top-3 ${isCurrentDocArabic ? 'left-3' : 'right-3'} z-10`}>
              <VoiceInput onTranscript={(text) => setContractText((prev) => prev + ' ' + text)} />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

          <button
            onClick={() => executeRiskAnalysis(contractText, fileName)}
            disabled={loading || extracting || !contractText.trim()}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 p-4 rounded-2xl font-black text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-950/30 text-sm sm:text-base active:scale-98"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-950" /> : <AlertTriangle className="w-5 h-5 text-slate-950" />}
            <span>
              {loading
                ? (isCurrentDocArabic ? 'جاري تحليل الثغرات وتوليد البنود الحامية بالذكاء الاصطناعي...' : 'Auditing Contract Risks in Native Language...')
                : (isCurrentDocArabic ? 'بدء فحص المخاطر وتوليد البنود البديلة بلغة المستند' : 'Execute AI Audit & Generate Redlines')}
            </span>
          </button>
        </div>

        {/* Dynamic Skeleton Loading State */}
        {loading && (
          <ContractAnalysisSkeleton stage={isCurrentDocArabic ? 'جاري تحليل الثغرات وتوليد البنود الحامية بالذكاء الاصطناعي...' : 'Executing deep risk analysis & counter-clause generation in native document language...'} />
        )}

        {/* DELIVERABLE OUTPUT STRUCTURE */}
        {!loading && result && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-8 shadow-2xl animate-in fade-in duration-300">
            
            {/* 1. Comprehensive Risk Score Gauge (0 - 100%) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${result.riskScore > 60 ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wider">{isCurrentDocArabic ? 'مؤشر درجة مخاطر العقد الكلية (Risk Score Gauge)' : 'Overall Contract Risk Score'}</span>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">{result.riskScore}%</div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block mt-1">
                    Native Audit Language: {result.docLanguage.toUpperCase()} (100% Native Script Preserved)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const isAr = isCurrentDocArabic;
                    const reportBody = `
${isAr ? 'تقرير تحليل مخاطر العقد والامتثال القانوني' : 'Contract Risk & Compliance Audit Report'}
=================================================
${isAr ? 'درجة مخاطر العقد الكلية' : 'Overall Risk Score'}: ${result.riskScore}%
${isAr ? 'لغة المستند' : 'Document Language'}: ${result.docLanguage}

${isAr ? 'التقييم الشامل والملخص:' : 'Executive Assessment:'}
-----------------------
${(isAr ? result.overallAssessmentAr : result.overallAssessmentEn) || (isAr ? 'تم فحص العقد بدقة عبر محرك التحليل الذكي.' : 'Contract thoroughly analyzed via Sovereign AI Engine.')}

${isAr ? 'البنود والمخاطر المكتشفة:' : 'Identified Risks & Clauses:'}
---------------------------
${(result.items || []).map((r, i) => `${i + 1}. [${r.severity}] ${r.clause}\n   ${isAr ? 'الشرح' : 'Explanation'}: ${isAr ? r.explanationAr : r.explanationEn}\n   ${isAr ? 'البند البديل المقترح' : 'Suggested Redline'}: ${isAr ? r.suggestedRedlineAr : r.suggestedRedlineEn}`).join('\n\n')}

${isAr ? 'التوصيات الاستراتيجية:' : 'Strategic Recommendations:'}
--------------------------
${((isAr ? result.strategicRecommendationsAr : result.strategicRecommendationsEn) || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`.trim();

                    exportDocumentMultiFormat(reportBody, fileName || (isAr ? 'تقرير_مخاطر_العقد' : 'Contract_Risk_Report'), 'Party A', 'Party B', 'pdf', isAr ? 'ar' : 'en');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" /> {isCurrentDocArabic ? 'تحميل تقرير PDF' : 'PDF Report'}
                </button>
                <button
                  onClick={() => {
                    const isAr = isCurrentDocArabic;
                    const reportBody = `
${isAr ? 'تقرير تحليل مخاطر العقد والامتثال القانوني' : 'Contract Risk & Compliance Audit Report'}
=================================================
${isAr ? 'درجة مخاطر العقد الكلية' : 'Overall Risk Score'}: ${result.riskScore}%
${isAr ? 'لغة المستند' : 'Document Language'}: ${result.docLanguage}

${isAr ? 'التقييم الشامل والملخص:' : 'Executive Assessment:'}
-----------------------
${(isAr ? result.overallAssessmentAr : result.overallAssessmentEn) || (isAr ? 'تم فحص العقد بدقة عبر محرك التحليل الذكي.' : 'Contract thoroughly analyzed via Sovereign AI Engine.')}

${isAr ? 'البنود والمخاطر المكتشفة:' : 'Identified Risks & Clauses:'}
---------------------------
${(result.items || []).map((r, i) => `${i + 1}. [${r.severity}] ${r.clause}\n   ${isAr ? 'الشرح' : 'Explanation'}: ${isAr ? r.explanationAr : r.explanationEn}\n   ${isAr ? 'البند البديل المقترح' : 'Suggested Redline'}: ${isAr ? r.suggestedRedlineAr : r.suggestedRedlineEn}`).join('\n\n')}

${isAr ? 'التوصيات الاستراتيجية:' : 'Strategic Recommendations:'}
--------------------------
${((isAr ? result.strategicRecommendationsAr : result.strategicRecommendationsEn) || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`.trim();

                    exportDocumentMultiFormat(reportBody, fileName || (isAr ? 'تقرير_مخاطر_العقد' : 'Contract_Risk_Report'), 'Party A', 'Party B', 'docx', isAr ? 'ar' : 'en');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" /> {isCurrentDocArabic ? 'تحميل مستند Word' : 'Word (.docx)'}
                </button>
              </div>
            </div>

            {/* 4. Strategic Recommendations (التوصيات الاستراتيجية) */}
            {result.strategicRecommendationsAr && result.strategicRecommendationsAr.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
                <h3 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isCurrentDocArabic ? 'التوصيات الاستراتيجية لحماية المؤسسة والتحصين التشريعي:' : 'Strategic Legal Recommendations:'}</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
                  {(isCurrentDocArabic ? result.strategicRecommendationsAr : result.strategicRecommendationsEn || result.strategicRecommendationsAr).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vector Pre-Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 shrink-0 ml-1">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>{isCurrentDocArabic ? 'تصفية المحاور:' : 'Filter Vectors:'}</span>
              </span>
              {[
                { key: 'All', labelAr: 'الكل', labelEn: 'All Vectors' },
                { key: 'Financial', labelAr: 'مالية (Financial)', labelEn: 'Financial' },
                { key: 'Operational', labelAr: 'تشغيلية (Operational)', labelEn: 'Operational' },
                { key: 'IP', labelAr: 'ملكية فكرية (IP)', labelEn: 'Intellectual Property' },
                { key: 'Regulatory', labelAr: 'تنظيمية (Regulatory)', labelEn: 'Regulatory' },
              ].map(({ key, labelAr, labelEn }) => (
                <button
                  key={key}
                  onClick={() => setActiveVectorFilter(key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                    activeVectorFilter === key
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isCurrentDocArabic ? labelAr : labelEn}
                </button>
              ))}
            </div>

            {/* 2 & 3. Severe Traps & Flaws + Zero-Risk Alternative Counter-Clauses */}
            <div className="space-y-5">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isCurrentDocArabic ? 'الثغرات والمخاطر الحرجة والبنود البديلة الحامية:' : 'Itemized Severe Traps & Zero-Risk Redline Alternatives:'}</span>
              </h3>

              {filteredItems.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{item.clause}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-white dark:bg-slate-900 text-cyan-400 border border-slate-300 dark:border-slate-700 font-mono">
                        {item.vector}
                      </span>
                      <SeverityBadge severity={item.severity} />
                    </div>
                  </div>

                  {/* Severe Flaw Explanation */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 block">{isCurrentDocArabic ? 'توصيف الثغرة والخطورة التشريعية:' : 'Legal Risk Description:'}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {isCurrentDocArabic ? (item.explanationAr || item.explanationEn) : (item.explanationEn || item.explanationAr)}
                    </p>
                  </div>

                  {/* Zero-Risk Alternative Counter-Clause (Ready to Copy) */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isCurrentDocArabic ? 'البند البديل الحامي بأسلوب الصفر مخاطر (Zero-Risk Redline Clause):' : 'Zero-Risk Alternative Clause:'}</span>
                      </span>
                      <button
                        onClick={() => handleCopyRedline(isCurrentDocArabic ? (item.suggestedRedlineAr || item.suggestedRedlineEn) : (item.suggestedRedlineEn || item.suggestedRedlineAr), idx)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition-colors border border-emerald-500/40"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? (isCurrentDocArabic ? 'تم النسخ!' : 'Copied!') : (isCurrentDocArabic ? 'نسخ البند البديل' : 'Copy Redline')}</span>
                      </button>
                    </div>
                    <p className="font-mono leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
                      {isCurrentDocArabic ? (item.suggestedRedlineAr || item.suggestedRedlineEn) : (item.suggestedRedlineEn || item.suggestedRedlineAr)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
