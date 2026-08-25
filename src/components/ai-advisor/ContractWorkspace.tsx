import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Scale,
  Sparkles,
  Layers,
  FileText,
  BookOpen,
} from 'lucide-react';
import type {
  RiskLevel,
  StructuredContractReport,
  SupportedAILang,
} from '../../ai/types';

interface ContractWorkspaceProps {
  report: StructuredContractReport;
  lang: SupportedAILang;
  isRtl: boolean;
}

type FindingTab = 'ALL' | 'CRITICAL' | 'MISSING' | 'AMBIGUOUS' | 'UNFAVORABLE' | 'JURISDICTION' | 'REDLINES';

export const ContractWorkspace: React.FC<ContractWorkspaceProps> = ({
  report,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<FindingTab>('ALL');

  const riskBadgeMap: Record<RiskLevel, { labelEn: string; labelAr: string; color: string }> = {
    HIGH: { labelEn: 'HIGH RISK EXPOSURE', labelAr: 'مخاطر تعاقدية جسيمة', color: 'bg-rose-500/20 text-rose-300 border-rose-500/50' },
    MEDIUM: { labelEn: 'MODERATE RISK', labelAr: 'مخاطر متوسطة', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
    LOW: { labelEn: 'LOW RISK', labelAr: 'مخاطر منخفضة', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
    SAFE: { labelEn: 'LEGALLY BALANCED', labelAr: 'متوازن ومحمي قانونياً', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  };

  const riskBadge = riskBadgeMap[report.overallRisk] || riskBadgeMap.HIGH;

  // Analysis Stages for Task 8 progress tracking
  const analysisStages = [
    { nameEn: '1. Doc Preparation', nameAr: '1. إعداد الوثيقة', done: true },
    { nameEn: '2. Classification', nameAr: '2. تصنيف العقد', done: true },
    { nameEn: '3. Jurisdiction Detection', nameAr: '3. رصد الولاية', done: true },
    { nameEn: '4. 8-Axis Analysis', nameAr: '4. فحص 8 محاور', done: true },
    { nameEn: '5. Risk Evaluation', nameAr: '5. تقييم المخاطر', done: true },
    { nameEn: '6. Citation Grounding', nameAr: '6. التوثيق التشريعي', done: true },
    { nameEn: '7. Final Forensic Report', nameAr: '7. التقرير النهائي', done: true },
  ];

  return (
    <div className="w-full space-y-6">
      {/* ── 7-Stage Analysis Progress Tracker ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-md">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          {isAr ? 'مراحل التحليل الجنائي التعاقدي المكتملة:' : 'Completed Forensic Analysis Pipeline:'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[10px]">
          {analysisStages.map((st, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-emerald-500/30 text-emerald-400 rounded-lg p-1.5 flex items-center justify-center gap-1 font-medium"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{isAr ? st.nameAr : st.nameEn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Executive Score Banner ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider ${riskBadge.color}`}>
              {isAr ? riskBadge.labelAr : riskBadge.labelEn}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'النتيجة الرقمية (المحرك التشريعي):' : 'Engine Statutory Score:'} {report.overallScore}/100
            </span>
            <span className="text-xs text-slate-400">
              | {isAr ? 'الولاية:' : 'Jurisdiction:'} {report.jurisdiction}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {report.documentTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* Financial Liability Cap Status */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[240px] shrink-0 text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-300">
              {isAr ? 'سقف المسؤولية المالية:' : 'Liability Cap Status:'}
            </span>
            {report.financialLiabilityCap.isCapped ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {isAr ? 'مقيد' : 'Capped'}
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3" /> {isAr ? 'غير مقيد (خطر)' : 'Uncapped (Critical)'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {report.financialLiabilityCap.detectedCap}
          </p>
        </div>
      </div>

      {/* ── 8-Axis Risk Breakdown ── */}
      {report.riskCategories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'المحاور التشريعية الثمانية للتدقيق:' : '8-Axis Statutory Forensic Matrix:'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.riskCategories.map((cat) => (
              <div
                key={cat.categoryId}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white truncate">{cat.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cat.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : cat.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {cat.severity} ({cat.score}/100)
                  </span>
                </div>

                {cat.findings.length > 0 && (
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    {cat.findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}

                {cat.redline && (
                  <div className="bg-slate-950/90 border border-cyan-900/40 rounded-lg p-2.5 text-[11px] text-cyan-300 font-mono">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-0.5">
                      {isAr ? 'الصياغة البديلة المقترحة (Redline):' : 'Recommended Redline Draft:'}
                    </span>
                    {cat.redline}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Findings Filter Tabs ── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'ALL' as FindingTab, labelEn: 'All Findings', labelAr: 'كافة الملاحظات' },
            { id: 'CRITICAL' as FindingTab, labelEn: `Critical (${report.criticalFindings.length})`, labelAr: `مخاطر حرجة (${report.criticalFindings.length})` },
            { id: 'MISSING' as FindingTab, labelEn: `Missing Clauses (${report.missingClauses.length})`, labelAr: `بنود مفقودة (${report.missingClauses.length})` },
            { id: 'AMBIGUOUS' as FindingTab, labelEn: `Ambiguous & Gaps (${report.ambiguousClauses.length})`, labelAr: `ثغرات وبنود غامضة (${report.ambiguousClauses.length})` },
            { id: 'UNFAVORABLE' as FindingTab, labelEn: `Unfavorable (${report.unfavorableClauses.length})`, labelAr: `بنود مجحفة (${report.unfavorableClauses.length})` },
            { id: 'JURISDICTION' as FindingTab, labelEn: `Jurisdiction Terms (${report.jurisdictionSensitiveClauses.length})`, labelAr: `شروط الاختصاص (${report.jurisdictionSensitiveClauses.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'ALL' || activeTab === 'CRITICAL') && report.criticalFindings.length > 0 && (
            <div className="bg-slate-900/80 border border-rose-900/40 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'المخاطر الحرجة المرصودة:' : 'Critical Forensic Findings:'}</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {report.criticalFindings.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'MISSING') && report.missingClauses.length > 0 && (
            <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'البنود الإلزامية المفقودة:' : 'Missing Mandatory Clauses:'}</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {report.missingClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'AMBIGUOUS') && report.ambiguousClauses.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'البنود الغامضة والثغرات الصامتة:' : 'Ambiguous Clauses & Silent Gaps:'}</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {report.ambiguousClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'UNFAVORABLE') && report.unfavorableClauses.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'البنود المجحفة وخلل التوازن:' : 'Unfavorable / Adhesion Terms:'}</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {report.unfavorableClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {(activeTab === 'ALL' || activeTab === 'JURISDICTION') && report.jurisdictionSensitiveClauses.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'شروط الاختصاص والقانون الحاكم:' : 'Jurisdiction & Forum Terms:'}</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {report.jurisdictionSensitiveClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
