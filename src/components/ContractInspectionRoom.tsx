import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, ShieldAlert, Sparkles, FileText,
  Loader2, Globe, Scale, Zap, CheckCircle2, RefreshCw, Send, ArrowRight, ShieldCheck, BookOpen
} from 'lucide-react';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';
import VoiceInput from './VoiceInput';
import ForensicControlBar from './ForensicControlBar';
import LegalDiffViewer from './LegalDiffViewer';
import { executeAgenticLegalRAG, AgenticRAGResponse } from '../services/legalRAGOrchestrator';
import { runCriticAgentReview, recordLawyerRLHFFeedback, CriticValidationResult } from '../services/criticSelfLearningEngine';

export interface ForensicReport {
  clauseId: string;
  selectedClause: string;
  riskSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  riskVector: 'Financial' | 'Operational' | 'IP' | 'Regulatory';
  riskScore: number;
  explanation: string;
  simulatedCourtRuling: string;
  protectiveCounterClause: string;
}

export const JURISDICTION_MATRIX = [
  { id: 'SA', name: '🇸🇦 المملكة العربية السعودية (نظام المعاملات المدنية M/191 والشركات)', code: 'SA' },
  { id: 'AE', name: '🇦🇪 الإمارات العربية المتحدة (قوانين DIFC / ADGM والمعاملات 50/2022)', code: 'AE' },
  { id: 'EG', name: '🇪🇬 جمهورية مصر العربية (القانون المدني 131/1948 والمحاكم الاقتصادية)', code: 'EG' },
  { id: 'QA', name: '🇶🇦 دولة قطر (القانون المدني 22/2004 ومركز قطر للمال QFC)', code: 'QA' },
  { id: 'KW', name: '🇰🇼 دولة الكويت (القانون المدني 67/1980 وقانون التجارة 68/1980)', code: 'KW' },
  { id: 'BH', name: '🇧🇭 مملكة البحرين (القانون المدني 19/2001 وقواعد BCDR-AAA)', code: 'BH' },
  { id: 'OM', name: '🇴🇲 سلطنة عُمان (قانون المعاملات المدنية 29/2013 والمركز العماني OAC)', code: 'OM' },
  { id: 'JO', name: '🇯🇴 المملكة الأردنية الهاشمية (القانون المدني 43/1976 وقانون التجارة)', code: 'JO' },
  { id: 'GLOBAL', name: '🌐 المعايير الدولية (UN CISG 1980 / Incoterms 2020 / UNCITRAL)', code: 'GLOBAL' },
  { id: 'UK', name: '🇬🇧 المملكة المتحدة (English Common Law / UCTA 1977 / LCIA)', code: 'UK' },
  { id: 'US', name: '🇺🇸 الولايات المتحدة الأمريكية (US UCC / New York / Delaware)', code: 'US' },
  { id: 'EU', name: '🇪🇺 الاتحاد الأوروبي (EU GDPR / French CC / German BGB § 307)', code: 'EU' },
  { id: 'SG', name: '🇸🇬 سنغافورة والتحكيم الدولي (SIAC Rules 2024 / Singapore Law)', code: 'SG' },
  { id: 'TR', name: '🇹🇷 الجمهورية التركية (Turkish Code of Obligations 6098 / ISTAC)', code: 'TR' },
  { id: 'CN', name: '🇨🇳 الصين وهونغ كونغ (PRC Civil Code 2021 / HKIAC Rules)', code: 'CN' },
];

export default function ContractInspectionRoom() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [contractText, setContractText] = useState<string>(`عقد اتفاقية توريد وخدمات برمجية سحابية (SaaS Agreement)
الطرف الأول (المزود): شركة التقنية البرمجية المحدودة
الطرف الثاني (العميل): شركة الاستثمارات العامة

البند الأول: موضوع العقد
يلتزم المزود بتقديم منصة البرمجيات السحابية للعميل وفق اشتراك سنوي قدره 150,000 دولار أمريكي.

البند الثاني: سدد غرامات التأخير غير المحدودة (Unlimited Penalty Trap)
في حال تأخر العميل عن سداد أي دفعة لمقدار 3 أيام، يحق للمزود فرض غرامة تأخير قدرها 10% يومياً تراكمية بدون حد أقصى، مع حق المزود في إيقاف الخدمات فوراً ودون حاجة لتنبيه أو إنذار رسمي.

البند الثالث: الملكية الفكرية الكلية
تؤول كافة أسرار العمل والتطوير والبرمجيات الخاصة والبيانات المعالجة مملوكة بالكامل وحصرياً للمزود، وتتنازل المؤسسة العميل عن أي حقوق سابقة أو لاحقة.

البند الرابع: الاختصاص القضائي الأحادي
تخضع هذه الاتفاقية وتفسر وفق أحكام القوانين الخارجية وتختص محاكم ولاية ديلاوير حصرياً بنظر أي نزاع، وتتنازل المؤسسة العميل عن حق التقاضي أمام المحاكم الوطنية.`);

  const [selectedClause, setSelectedClause] = useState<string>('البند الثاني: سدد غرامات التأخير غير المحدودة (Unlimited Penalty Trap)');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('SA');
  const [userQuery, setUserQuery] = useState<string>('');
  const [investigating, setInvestigating] = useState<boolean>(false);
  const [forensicReport, setForensicReport] = useState<ForensicReport | null>(null);
  const [ragResponse, setRagResponse] = useState<AgenticRAGResponse | null>(null);
  const [criticResult, setCriticResult] = useState<CriticValidationResult | null>(null);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Run initial probe on default clause
    runForensicInvestigation();
  }, [selectedJurisdiction]);

  async function runForensicInvestigation(queryPreset?: string, clauseToProbe?: string) {
    const clauseTarget = clauseToProbe || selectedClause || contractText.slice(0, 300);
    const queryTarget = queryPreset || userQuery || (isRtl ? 'لماذا هذه المادة خطيرة وما هو سيناريو النزاع المحتمل؟' : 'Why is this clause dangerous and what is the simulated dispute ruling?');

    setInvestigating(true);
    setInjectedSuccess(false);

    try {
      // 1. Execute Agentic Legal RAG (Research Agent -> Vector Corpus -> Drafting Agent)
      const rag = await executeAgenticLegalRAG(clauseTarget, selectedJurisdiction, isRtl);
      setRagResponse(rag);

      const candidateRedline = isRtl ? rag.draftingAgentRedlineAr : rag.draftingAgentRedlineEn;

      // 2. Execute Critic Agent Self-Correction Review Loop
      const critic = runCriticAgentReview(clauseTarget, candidateRedline, selectedJurisdiction, isRtl);
      setCriticResult(critic);

      const finalizedRedline = critic.refinedRedline || candidateRedline;

      // 3. Update Forensic Report State
      setForensicReport({
        clauseId: `probe_${Date.now()}`,
        selectedClause: clauseTarget,
        riskSeverity: 'Critical',
        riskVector: 'Financial',
        riskScore: critic.passed ? 88 : 95,
        explanation: isRtl ? rag.researchAgentAnalysisAr : rag.researchAgentAnalysisEn,
        simulatedCourtRuling: isRtl
          ? `سيناريو النزاع القضائي المحتمل: طبقاً للسابقة القضائية في ${rag.retrievedStatutes[0]?.titleAr || 'القضاء التجاري'}، ستقضي المحكمة ببطلان الشرط الفاحش وتقليص المطالبة إلى الضرر الفعلي المباشر.`
          : `Dispute Simulation: Under ${rag.retrievedStatutes[0]?.titleEn || 'Commercial Code precedent'}, courts will strike down unreasonable penalty terms.`,
        protectiveCounterClause: finalizedRedline,
      });

    } catch (err) {
      console.warn('[Forensic Inspection Error]', err);
    } finally {
      setInvestigating(false);
    }
  }

  // Handle Accepting and Injecting Redline with Anonymized RLHF Preference Recording
  function handleAcceptRedline(finalText: string) {
    if (!forensicReport) return;

    let updatedText = contractText;
    if (selectedClause && contractText.includes(selectedClause)) {
      updatedText = contractText.replace(selectedClause, finalText);
    } else {
      updatedText = contractText + `\n\n[بند محصن تم اعتماده]: ${finalText}`;
    }

    setContractText(updatedText);
    setInjectedSuccess(true);

    // Record RLHF Feedback for Model Fine-Tuning
    recordLawyerRLHFFeedback({
      originalClause: selectedClause,
      aiSuggestedRedline: forensicReport.protectiveCounterClause,
      lawyerAcceptedRedline: finalText,
      userAction: finalText === forensicReport.protectiveCounterClause ? 'ACCEPTED_AS_IS' : 'MODIFIED_BY_LAWYER',
      jurisdiction: selectedJurisdiction,
      criticScore: criticResult?.score || 100,
    });

    setTimeout(() => setInjectedSuccess(false), 4000);
  }

  return (
    <div className="w-full space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* ── Control Bar (Import, Export Track Changes, Clear All) ── */}
      <ForensicControlBar
        contractText={contractText}
        jurisdictionCode={selectedJurisdiction}
        onClearAll={() => {
          setContractText('');
          setSelectedClause('');
          setForensicReport(null);
          setRagResponse(null);
          setCriticResult(null);
        }}
        onImportText={(text, fileName) => {
          setContractText(text);
          setSelectedClause(text.slice(0, 250));
          runForensicInvestigation(undefined, text.slice(0, 250));
        }}
      />

      {/* ── Main Forensic Inspection Box ── */}
      <div className="w-full bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header Bar with Cross-Jurisdiction Matrix Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-1">
              <Search className="w-4 h-4" />
              <span>{isRtl ? 'محرك الامتثال والتحقيق الجنائي الذكي (Legal-AI Forensic Engine)' : 'Legal-AI Forensic Compliance Engine'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'غرفة الفحص المباشر والتحقيق الجنائي في بنود العقد' : 'Live Interactive AI Forensic Inspector'}
            </h2>
          </div>

          {/* Dynamic Cross-Jurisdiction Matrix */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 font-mono"
            >
              {JURISDICTION_MATRIX.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Clause Picker Badges */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRtl ? 'اختر بنداً للفحص الجنائي الفوري:' : 'Select a Clause for Forensic Probing:'}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'clause2', label: 'البند الثاني: غرامات التأخير غير المحدودة (10% Daily Trap)', text: 'البند الثاني: سدد غرامات التأخير غير المحدودة (Unlimited Penalty Trap)\nفي حال تأخر العميل عن سداد أي دفعة لمقدار 3 أيام، يحق للمزود فرض غرامة تأخير قدرها 10% يومياً تراكمية بدون حد أقصى، مع حق المزود في إيقاف الخدمات فوراً ودون حاجة لتنبيه أو إنذار رسمي.' },
              { id: 'clause3', label: 'البند الثالث: الملكية الفكرية الكلية وأسرار العمل (IP Seizure)', text: 'البند الثالث: الملكية الفكرية الكلية\nتؤول كافة أسرار العمل والتطوير والبرمجيات الخاصة والبيانات المعالجة مملوكة بالكامل وحصرياً للمزود، وتتنازل المؤسسة العميل عن أي حقوق سابقة أو لاحقة.' },
              { id: 'clause4', label: 'البند الرابع: الاختصاص القضائي لديلاوير (Foreign Forum Trap)', text: 'البند الرابع: الاختصاص القضائي الأحادي\nتخضع هذه الاتفاقية وتفسر وفق أحكام القوانين الخارجية وتختص محاكم ولاية ديلاوير حصرياً بنظر أي نزاع، وتتنازل المؤسسة العميل عن حق التقاضي أمام المحاكم الوطنية.' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedClause(item.text);
                  runForensicInvestigation(undefined, item.text);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedClause === item.text
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contract Raw Editor Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 block">
              {isRtl ? 'مسودة العقد الشاملة (انقر على أي فقرة أو عدلها مباشرة):' : 'Full Contract Draft (Edit or Select Clauses):'}
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {isRtl ? 'إملاء صوتي فائق الحساسية مع عزل الضوضاء:' : 'Voice Dictation + Noise Filter:'}
              </span>
              <VoiceInput onTranscript={(t) => setContractText((prev) => (prev ? `${prev}\n${t}` : t))} />
            </div>
          </div>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            rows={7}
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 leading-relaxed shadow-inner"
          />
        </div>

        {/* Instant Forensic Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => runForensicInvestigation()}
            disabled={investigating || !contractText.trim()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {investigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-slate-950" />}
            <span>{investigating ? (isRtl ? 'جاري تشغيل الوكلاء واسترجاع السوابق (RAG)...' : 'Orchestrating Agents...') : (isRtl ? 'بدء التحقيق الجنائي القانوني في البند' : 'Run Legal-AI Forensic Investigation')}</span>
          </button>

          {injectedSuccess && (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'تم تحديث مسودة العقد بالبند المحصن وتسجيل التفضيل في قاعدة RLHF!' : 'Contract draft updated & RLHF preference logged!'}</span>
            </div>
          )}
        </div>

        {/* ── Pillar 1: Retrieved Statutory Vector Knowledge Breakdown ── */}
        {ragResponse && ragResponse.retrievedStatutes.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{isRtl ? 'المحور الأول: السند القانوني والنصوص المسترجعة من الذاكرة المتجهية (Vector Corpus):' : 'Retrieved Statutory Corpus & Precedents:'}</span>
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {ragResponse.legislativeVersion}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {ragResponse.retrievedStatutes.map((st) => (
                <div key={st.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
                    <span>{isRtl ? st.titleAr : st.titleEn}</span>
                    <span className="text-[10px] font-mono text-slate-400">{st.articleNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    {isRtl ? st.contentAr : st.contentEn}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ⚖️ {isRtl ? st.precedentSummaryAr : st.precedentSummaryEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Pillar 3: Side-by-Side Visual Diff Viewer ── */}
        {forensicReport && (
          <LegalDiffViewer
            originalClause={selectedClause}
            suggestedRedline={forensicReport.protectiveCounterClause}
            criticResult={criticResult}
            jurisdictionName={selectedJurisdiction}
            onAcceptRedline={handleAcceptRedline}
          />
        )}

      </div>
    </div>
  );
}
