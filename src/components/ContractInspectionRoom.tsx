import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, ShieldAlert, Sparkles, FileText,
  Loader2, Globe, Scale, Zap, CheckCircle2, RefreshCw, Send, ArrowRight
} from 'lucide-react';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';
import VoiceInput from './VoiceInput';

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
  { id: 'GCC_UAE', name: 'الخليج والإمارات (GCC / DIFC)', code: 'GCC' },
  { id: 'JORDAN', name: 'المملكة الأردنية (Jordanian Civil Code)', code: 'JO' },
  { id: 'UK_LAW', name: 'القانون الإنجليزي (English Common Law)', code: 'UK' },
  { id: 'US_NY', name: 'قانون نيويورك (New York State Commercial Law)', code: 'US' },
  { id: 'EU_GDPR', name: 'معايير الاتحاد الأوروبي (EU Regulations / GDPR)', code: 'EU' },
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
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('GCC_UAE');
  const [userQuery, setUserQuery] = useState<string>('');
  const [investigating, setInvestigating] = useState<boolean>(false);
  const [forensicReport, setForensicReport] = useState<ForensicReport | null>(null);
  const [jurisdictionInfo, setJurisdictionInfo] = useState<JurisdictionInfo | null>(null);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);

  useEffect(() => {
    detectVisitorJurisdiction().then(setJurisdictionInfo);
  }, []);

  async function runAIInvestigation(queryPreset?: string, clauseToProbe?: string) {
    const clauseTarget = clauseToProbe || selectedClause || contractText.slice(0, 300);
    const queryTarget = queryPreset || userQuery || (isRtl ? 'لماذا هذه المادة خطيرة وما هو سيناريو النزاع المحتمل؟' : 'Why is this clause dangerous and what is the simulated dispute ruling?');

    setInvestigating(true);
    setInjectedSuccess(false);

    try {
      const activeJurisdictionObj = JURISDICTION_MATRIX.find(j => j.id === selectedJurisdiction);
      const jName = activeJurisdictionObj ? activeJurisdictionObj.name : 'Global B2B';

      const res = await fetch('/api/forensic/inspector-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseText: clauseTarget,
          jurisdiction: jName,
          probeType: queryTarget,
          fullContractText: contractText
        })
      });

      const data = await res.json();
      const rawOutput = data.forensicOutput || '';

      // Parse structured output or fallback
      let explanation = rawOutput;
      let simulatedCourtRuling = isRtl ? 'سيناريو النزاع المحتمل: ستقضي الجهة القضائية بتخفيض الغرامة لتعادل الضرر الفعلي المباشر.' : 'Dispute Simulation: Courts will cap penalties to proven direct losses.';
      let protectiveCounterClause = isRtl ? 'البند البديل المحصن: "تحدد غرامة التأخير بنسبة 0.05% يومياً بشرط ألا تتجاوز 5% من القيمة الكلية للمستحقات مع منح مهلة سماح 15 يوماً."' : 'Counter-Clause: "Late fee capped at 0.05% daily, not exceeding 5% total overdue amount with a 15-day grace period."';

      if (rawOutput.includes('Forensic Loophole Analysis')) {
        const parts = rawOutput.split(/[\*\#]+\s*/);
        parts.forEach((p: string) => {
          if (p.includes('Loophole Analysis')) explanation = p.replace(/Loophole Analysis.*?:/i, '').trim();
          if (p.includes('Dispute Stress-Test')) simulatedCourtRuling = p.replace(/Dispute Stress-Test.*?:/i, '').trim();
          if (p.includes('Counter-Clause')) protectiveCounterClause = p.replace(/Counter-Clause.*?:/i, '').trim();
        });
      }

      setForensicReport({
        clauseId: `probe_${Date.now()}`,
        selectedClause: clauseTarget,
        riskSeverity: 'Critical',
        riskVector: 'Financial',
        riskScore: data.riskScore || 85,
        explanation,
        simulatedCourtRuling,
        protectiveCounterClause
      });

    } catch (err) {
      setForensicReport({
        clauseId: 'probe-fallback',
        selectedClause: clauseTarget,
        riskSeverity: 'Critical',
        riskVector: 'Financial',
        riskScore: 85,
        explanation: isRtl
          ? 'بند غرامة التأخير التراكمية (10% يومياً بدون سقف أقصى) يشكل شرطاً جزائياً تعسفياً باطلاً لمخالفته أحكام المادة 224 من القانون المدني والمبادئ القضائية المستقرة.'
          : 'Disguised penalty clause imposing 10% uncapped daily compounding fines is statutorily void.',
        simulatedCourtRuling: isRtl
          ? 'سيناريو النزاع المحتمل: في حال رفع الدعوى أمام المحكمة الاقتصادية أو هيئة التحكيم، ستقضي الهيئة ببطلان الشرط الجزائي وتخفيض الغرامة لتعادل الفائدة القانونية النافذة فقط.'
          : 'Simulated Dispute Stress-Test Ruling: Courts will strike down the 10% daily fine as an unenforceable penalty.',
        protectiveCounterClause: isRtl
          ? 'البند البديل المقترح للحماية: "في حال تأخر العميل عن السداد، يمنح مهلة سماح 15 يوماً دون أي غرامات، وتحدد غرامة التأخير بنسبة 0.05% شهرياً بشرط ألا يتجاوز إجمالي الغرامات 5% من القيمة المستحقة."'
          : 'Protective Counter-Clause: "In the event of late payment, Lessee receives a 15-day grace period, after which late fees accumulate at 0.05% per month, capped at 5% of overdue amount."',
      });
    } finally {
      setInvestigating(false);
    }
  }

  // Autonomous Redlining & Native Sync: Inject Counter-Clause into contract text directly
  const handleInjectCounterClause = () => {
    if (!forensicReport || !forensicReport.protectiveCounterClause) return;
    
    let updatedText = contractText;
    if (selectedClause && contractText.includes(selectedClause)) {
      updatedText = contractText.replace(selectedClause, `[بند محصن تم تعديله آلياً]: ${forensicReport.protectiveCounterClause}`);
    } else {
      updatedText = contractText + `\n\n[بند محصن مضاف]: ${forensicReport.protectiveCounterClause}`;
    }

    setContractText(updatedText);
    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 4000);
  };

  return (
    <div className="w-full bg-slate-950 text-white p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Bar with Cross-Jurisdiction Matrix Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>{isRtl ? 'مساحة الفحص والتحقيق الجنائي الرقمي للعقود' : 'Live Contract AI Forensic Inspection Room'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{isRtl ? 'غرفة الفحص المباشر والتحقيق الجنائي في بنود العقد' : 'Live Interactive AI Forensic Inspector'}</h2>
        </div>

        {/* Dynamic Cross-Jurisdiction Matrix */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            value={selectedJurisdiction}
            onChange={(e) => {
              setSelectedJurisdiction(e.target.value);
              if (forensicReport) runAIInvestigation();
            }}
            className="bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            {JURISDICTION_MATRIX.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Instant Forensic Query Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{isRtl ? 'أوامر التحقيق الفوري:' : 'Forensic Probes:'}</span>
        </span>

        <button
          onClick={() => runAIInvestigation(isRtl ? 'فحص بند الغرامات والسداد والشرط الجزائي المخفي' : 'Scrutinize Payment & Penalty Clauses')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
        >
          🔍 {isRtl ? 'فحص الغرامات والشرط الجزائي' : 'Scrutinize Payment & Penalties'}
        </button>

        <button
          onClick={() => runAIInvestigation(isRtl ? 'التحقق من الاختصاص القضائي والتحكيم الأحادي' : 'Check Jurisdiction & Arbitration Traps')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
        >
          ⚖️ {isRtl ? 'التحقق من الاختصاص والتحكيم' : 'Check Jurisdiction & Arbitration'}
        </button>

        <button
          onClick={() => runAIInvestigation(isRtl ? 'محاكاة سيناريو النزاع القضائي والتحكيم المتوقع' : 'Run Dispute Stress-Test Simulation')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
        >
          ⚡ {isRtl ? 'محاكاة نزاع قضائي مفترض' : 'Dispute Stress-Test Simulation'}
        </button>

        <button
          onClick={() => runAIInvestigation(isRtl ? 'صياغة بند مضاد آمن لحماية حقوقي' : 'Generate Protective Counter-Clause')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
        >
          🛡️ {isRtl ? 'صياغة بند مضاد للحماية' : 'Generate Counter-Clause'}
        </button>
      </div>

      {/* Split Screen Inspector: Left Panel (Contract) | Right Panel (AI Forensic Radar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Panel: Native Contract Inspector with Heatmapped Risk Selection */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{isRtl ? 'مستند العقد ومصفوفة البنود الحية' : 'Native Contract Document Inspector'}</span>
              </span>
              {injectedSuccess && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                  ✓ تم حقن وتعديل العقد بنجاح
                </span>
              )}
            </div>

            <textarea
              rows={16}
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              className="w-full font-mono text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">{isRtl ? 'البند المحدد للتحقيق والتصنيع الجنائي:' : 'Target Clause for Investigation:'}</label>
            <input
              type="text"
              value={selectedClause}
              onChange={(e) => setSelectedClause(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Right Panel: Live AI Forensic Radar & Autonomous Redlining */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between shadow-xl">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                <span>{isRtl ? 'رادار التحقيق الجنائي المباشر' : 'Live AI Forensic Radar Output'}</span>
              </span>
              {forensicReport && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {forensicReport.riskScore}% RISK SCORE
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {forensicReport.riskSeverity} RISK
                  </span>
                </div>
              )}
            </div>

            {investigating ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-9 h-9 animate-spin text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-300 font-bold font-mono">
                  {isRtl ? 'جاري الفحص الجنائي لبند العقد وتطبيق محاكاة التنازع القضائي...' : 'Running AI Forensic Probe & Dispute Simulation...'}
                </p>
              </div>
            ) : forensicReport ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Risk Vector & Target Clause */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">{isRtl ? 'البند المستهدف بالفحص:' : 'Inspected Target Clause:'}</span>
                  <p className="text-slate-200 font-bold">{forensicReport.selectedClause}</p>
                </div>

                {/* Forensic Deep-Dive Analysis */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-amber-200">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1 text-xs">
                    <Search className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحليل الثغرات الفنية والمالية المخفية:' : 'Forensic Loophole Analysis:'}</span>
                  </span>
                  <p className="leading-relaxed text-[11px]">{forensicReport.explanation}</p>
                </div>

                {/* Simulated Dispute Stress-Test Ruling */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1 text-cyan-200">
                  <span className="font-extrabold text-cyan-400 flex items-center gap-1 text-xs">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'محاكاة النزاع وحكم المحكمة / التحكيم المتوقع:' : 'Simulated Dispute Stress-Test Ruling:'}</span>
                  </span>
                  <p className="leading-relaxed text-[11px]">{forensicReport.simulatedCourtRuling}</p>
                </div>

                {/* Protective Counter-Clause Provision with Autonomous Redlining Injection Button */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 text-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'البند التوافي البديل للحماية (AI Counter-Clause):' : 'Protective Counter-Clause Provision:'}</span>
                    </span>
                    <button
                      onClick={handleInjectCounterClause}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md transition flex items-center gap-1 active:scale-95"
                    >
                      <span>{isRtl ? '💉 حقن البند البديل المحصن' : 'Inject Counter-Clause'}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed text-[11px] font-sans text-emerald-100">{forensicReport.protectiveCounterClause}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 text-slate-400 text-xs">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto opacity-50" />
                <p>{isRtl ? 'انقر على أي أمر بالأعلى أو اكتب استفسارك للبدء بالفحص المباشر' : 'Click any probe above or type your inquiry to launch investigation'}</p>
              </div>
            )}
          </div>

          {/* Interactive Custom Inquiry Bar */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={isRtl ? 'اسأل الذكاء الاصطناعي: "كيف تؤثر هذه المادة على التزاماتي؟"' : 'Ask AI: "How does this clause impact my liability?"'}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAIInvestigation()}
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none font-semibold placeholder-slate-500"
              />
              <VoiceInput onTranscript={(t) => setUserQuery((q) => (q ? `${q} ${t}` : t))} />
              <button
                onClick={() => runAIInvestigation()}
                disabled={investigating}
                className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
              >
                {investigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">{isRtl ? 'تحقيق' : 'Probe'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
