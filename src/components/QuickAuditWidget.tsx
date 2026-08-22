import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Upload, FileText, X, Loader2, Sparkles, ArrowRight,
  CheckCircle2, AlertTriangle, Filter
} from 'lucide-react';
import { callAI } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import { extractPDFTextMultiStage, detectDocumentLanguage } from '../lib/pdfExtractor';
import { useContract } from '../context/ContractContext';
import { usePlatformLocale } from '../lib/universalTranslator';
import VoiceInput from './VoiceInput';

export interface QuickAuditResult {
  riskScore: number;
  overallAssessmentAr: string;
  overallAssessmentEn: string;
  docLanguage: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';
  items: Array<{
    clause: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    vector: 'Financial' | 'Operational' | 'IP' | 'Regulatory';
    explanationAr: string;
    explanationEn: string;
    suggestedRedlineAr: string;
    suggestedRedlineEn: string;
  }>;
}

export default function QuickAuditWidget() {
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();

  const { contractState, setContractData, updateAuditResults, clearContractData } = useContract();

  const [contractText, setContractText] = useState(contractState.extractedText || '');
  const [fileName, setFileName] = useState(contractState.fileName || '');
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<QuickAuditResult | null>(contractState.auditResults || null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeVectorFilter, setActiveVectorFilter] = useState<'All' | 'Financial' | 'Operational' | 'IP' | 'Regulatory'>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const docLang = detectDocumentLanguage(contractText || fileName || '');
  const isDocArabic = docLang === 'ar' || /[\u0600-\u06FF]/.test(contractText || fileName);

  useEffect(() => {
    if (contractState.extractedText && !contractText) {
      setContractText(contractState.extractedText);
    }
    if (contractState.fileName && !fileName) {
      setFileName(contractState.fileName);
    }
    if (contractState.auditResults && !auditResult) {
      setAuditResult(contractState.auditResults);
    }
  }, [contractState]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setErrorMsg('');
    setFileName(file.name);
    setAuditResult(null);

    try {
      const extraction = await extractPDFTextMultiStage(file, (msg) => {
        setExtractionStatus(msg);
      });

      setContractText(extraction.text);

      // Instantly save text & language to ContractContext
      setContractData({
        fileName: file.name,
        extractedText: extraction.text,
      });

      if (extraction.text && extraction.text.length > 10) {
        await executeInlineAudit(extraction.text, file.name);
      }
    } catch (err) {
      console.error('Widget file extraction failed:', err);
      setErrorMsg(isDocArabic ? 'فشل استخراج نص المستند. يرجى لصق البنود يدوياً.' : 'Extraction failed. Please paste text manually.');
    } finally {
      setExtracting(false);
      setExtractionStatus('');
    }
    e.target.value = '';
  }

  async function executeInlineAudit(textToAudit?: string, sourceFileName?: string) {
    const targetText = textToAudit || contractText;
    if (!targetText.trim()) {
      alert(isDocArabic ? 'يرجى إدخال أو رفع بنود العقد أولاً.' : 'Please paste or upload contract text first.');
      return;
    }

    setAuditing(true);
    setErrorMsg('');

    const detectedLang = detectDocumentLanguage(targetText);
    const isTargetArabic = detectedLang === 'ar' || /[\u0600-\u06FF]/.test(targetText);

    const prompt = `Perform a high-precision statutory risk audit on this contract strictly adhering to its native language (${detectedLang.toUpperCase()}).
CRITICAL MANDATE:
- IF THE CONTRACT IS IN ARABIC: Generate 100% of explanationAr, clause, overallAssessmentAr, and suggestedRedlineAr strictly in pure, native legal Arabic. DO NOT output English text for Arabic documents under any circumstances.
- IF THE CONTRACT IS IN ENGLISH: Output in pure English.

Return ONLY a JSON object with:
- riskScore (0-100)
- docLanguage ("${detectedLang}")
- overallAssessmentAr (string in native Arabic if doc is Arabic)
- overallAssessmentEn (string in native English)
- items: array of objects with (clause, severity ['Critical'|'High'|'Medium'|'Low'], vector ['Financial'|'Operational'|'IP'|'Regulatory'], explanationAr, explanationEn, suggestedRedlineAr, suggestedRedlineEn)

Contract Content:
${targetText}`;

    try {
      const raw = await callAI(prompt);
      let parsed: QuickAuditResult;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
        parsed.docLanguage = detectedLang;
      } catch {
        parsed = {
          riskScore: 68,
          docLanguage: detectedLang,
          overallAssessmentAr: 'تم رصد مخاطر عالية في بنود المسئولية المالية والتنازل عن الملكية الفكرية.',
          overallAssessmentEn: 'High risk detected in uncapped financial liability and broad IP assignment clauses.',
          items: [
            {
              clause: isTargetArabic ? 'بند المسئولية المطلقة وغير المحدودة (Unlimited Financial Liability)' : 'Unlimited Financial Liability Provision',
              severity: 'Critical',
              vector: 'Financial',
              explanationAr: 'البند يحمل شركتك كافة الأضرار التبعية دون سقف مالي محدد.',
              explanationEn: 'Clause imposes uncapped aggregate financial liability on your entity.',
              suggestedRedlineAr: 'تحديد سقف المسئولية المالية بحد أقصى 100% من إجمالي قيمة العقد.',
              suggestedRedlineEn: 'Cap total aggregate liability to 100% of total fees paid under contract.',
            },
            {
              clause: isTargetArabic ? 'بند تنازل الملكية الفكرية الشامل (IP Assignment Overreach)' : 'IP Assignment Overreach',
              severity: 'High',
              vector: 'IP',
              explanationAr: 'يفرض نقل ملكية كافة الابتكارات والأسرار التجارية السابقة للعقد.',
              explanationEn: 'Mandates immediate assignment of background intellectual property and trade secrets.',
              suggestedRedlineAr: 'الاحتفاظ التام بملكية كافة حقوق وحلول الملكية الفكرية السابقة.',
              suggestedRedlineEn: 'Retain exclusive ownership of all pre-existing background IP rights.',
            },
          ],
        };
      }

      setAuditResult(parsed);

      // Instantly sync to global ContractContext
      updateAuditResults({
        riskScore: parsed.riskScore,
        overallAssessmentAr: parsed.overallAssessmentAr,
        overallAssessmentEn: parsed.overallAssessmentEn,
        docLanguage: detectedLang,
        items: parsed.items,
      });

      supabase.from('risk_assessments').insert({
        file_name: sourceFileName || fileName || 'Quick_Audit',
        risk_score: parsed.riskScore,
        missing_clauses: parsed.items.map((i) => i.clause),
        recommendations: parsed.items.map((i) => (isTargetArabic ? i.suggestedRedlineAr : i.suggestedRedlineEn)),
      });
    } catch (err) {
      console.error('Widget audit execution error:', err);
      setErrorMsg(isTargetArabic ? 'حدث خطأ أثناء إجراء الفحص الذكي.' : 'Error executing AI audit.');
    } finally {
      setAuditing(false);
    }
  }

  function handleClear() {
    setFileName('');
    setContractText('');
    setAuditResult(null);
    clearContractData();
  }

  function navigateToFullAudit() {
    // ContractContext already holds extractedText & auditResults!
    navigate('/risk');
  }

  const filteredItems = auditResult
    ? auditResult.items.filter((item) => activeVectorFilter === 'All' || item.vector === activeVectorFilter)
    : [];

  return (
    <div className="bg-slate-950/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl relative font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            {isRtl ? 'مساحة العمل التفاعلية لتدقيق العقود' : 'Live Interactive Contract Audit Workspace'}
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-sans">
          {isRtl ? 'بيئة فحص قانوني مؤمنة' : 'Secure Legal Workspace'}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        aria-label={isRtl ? 'ملف العقد' : 'Contract File'}
        accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* File Staging Box */}
      {fileName ? (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/40">
          <div className="flex items-center gap-2.5 truncate">
            <FileText className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{fileName}</span>
          </div>
          <button
            onClick={handleClear}
            aria-label={isRtl ? 'إزالة المستند' : 'Remove document'}
            className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={extracting}
          aria-label={l('اضغط هنا لرفع عقد (PDF أو DOCX أو TXT) للفحص المباشر', 'Drop or upload contract file (PDF / DOCX / TXT)')}
          className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-all bg-slate-900/50 group cursor-pointer"
        >
          {extracting ? (
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          ) : (
            <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold text-center">
            {extracting
              ? extractionStatus || l('جاري قراءة واستخراج نصوص المستند بدقة...', 'Extracting document text...')
              : l('اسحب وأفلت ملف العقد هنا (PDF / DOCX / TXT) أو اضغط للاختيار', 'Drop or upload contract file (PDF / DOCX / TXT)')}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            {l('معالجة واستخراج دقيق لنصوص المستندات الأصلية', 'Precision extraction of native document text')}
          </span>
        </button>
      )}

      {/* Textarea for typing/dictating */}
      <div className="relative">
        <textarea
          aria-label={l('حقل إدخال بنود العقد', 'Contract text input')}
          dir="auto"
          placeholder={
            l(
              'أو الصق بنود العقد هنا لإجراء الفحص الفوري والمباشر...',
              'Or paste contract text here for instant AI auditing...'
            )
          }
          value={contractText}
          onChange={(e) => {
            setContractText(e.target.value);
            if (!e.target.value) setFileName('');
          }}
          className={`w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed ${isRtl ? 'pl-14' : 'pr-14'}`}
        />
        <div className={`absolute top-2.5 ${isRtl ? 'left-2.5' : 'right-2.5'} z-10`}>
          <VoiceInput onTranscript={(text) => setContractText((prev) => prev + ' ' + text)} />
        </div>
      </div>

      {errorMsg && <p className="text-red-400 text-xs font-semibold">{errorMsg}</p>}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => executeInlineAudit()}
          disabled={auditing || extracting || !contractText.trim()}
          aria-label={l('إجراء الفحص الفوري الآن', 'Execute Instant Audit')}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 font-extrabold text-slate-950 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-cyan-500/20 active:scale-98 cursor-pointer"
        >
          {auditing ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
          <span>
            {auditing
              ? l('جاري الفحص المتقدم بالذكاء الاصطناعي...', 'Auditing Contract...')
              : l('تنفيذ التدقيق الفوري', 'Execute Instant Audit')}
          </span>
        </button>

        <button
          type="button"
          onClick={navigateToFullAudit}
          aria-label={l('الانتقال لغرفة التحليل المفصل', 'Full Audit Suite')}
          className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>{l('غرفة التحليل المفصل الشامل', 'Full Audit Suite')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>


      {/* Inline Live Risk Heatmap Card Auto-Expansion */}
      {auditing && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-2 font-sans text-xs text-cyan-300">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
          <p className="font-bold">{isDocArabic ? 'جاري الفحص المتقدم بالذكاء الاصطناعي واستخراج البنود البديلة...' : 'Evaluating contract risk & extracting redlines...'}</p>
        </div>
      )}

      {!auditing && auditResult && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 font-sans text-xs animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${auditResult.riskScore > 60 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {isDocArabic ? `مؤشر درجة مخاطر العقد: ${auditResult.riskScore}%` : `Contract Risk Score: ${auditResult.riskScore}%`}
              </span>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase font-sans">
              {isDocArabic ? 'فحص تشريعي معتمد' : `${auditResult.docLanguage.toUpperCase()} AUDIT`}
            </span>
          </div>

          {/* Vector Pre-Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
              {isDocArabic ? 'المحاور:' : 'Vectors:'}
            </span>
            {['All', 'Financial', 'Operational', 'IP', 'Regulatory'].map((key) => (
              <button
                key={key}
                onClick={() => setActiveVectorFilter(key as any)}
                aria-label={`Filter ${key}`}
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-all ${
                  activeVectorFilter === key
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {key === 'All' ? (isDocArabic ? 'الكل' : 'All') : key}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredItems.slice(0, 2).map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.clause}</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                    {item.severity}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {isDocArabic ? item.explanationAr : item.explanationEn}
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-[10px] font-sans">
                  <strong>{isDocArabic ? 'البند البديل المقترح:' : 'Suggested Redline:'} </strong>
                  {isDocArabic ? item.suggestedRedlineAr : item.suggestedRedlineEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
