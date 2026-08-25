import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileText,
  Building,
} from 'lucide-react';
import type {
  ComplianceAssessmentResult,
  SupportedAILang,
} from '../../ai/types';

interface ComplianceWorkspaceProps {
  assessment: ComplianceAssessmentResult;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const ComplianceWorkspace: React.FC<ComplianceWorkspaceProps> = ({
  assessment,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full space-y-6">
      {/* ── Header Overview ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                assessment.riskLevel === 'SAFE'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : assessment.riskLevel === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {isAr ? `مستوى المخاطر: ${assessment.riskLevel}` : `Risk Level: ${assessment.riskLevel}`}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'الولاية:' : 'Jurisdiction:'} {assessment.jurisdiction}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isAr ? 'تقرير الامتثال والحوكمة التنظيمية' : 'Regulatory Compliance Assessment'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isAr
              ? `تم فحص ${assessment.applicableRequirements.length} متطلبات تنظيمية ورصد ${assessment.complianceGaps.length} فجوات محتملة.`
              : `Audited ${assessment.applicableRequirements.length} regulatory framework items with ${assessment.complianceGaps.length} gaps identified.`}
          </p>
        </div>
      </div>

      {/* ── Requirements & Gaps Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessment.applicableRequirements.map((req) => (
          <div
            key={req.id}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-white truncate">{req.title}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  req.status === 'COMPLIANT'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : req.status === 'REVIEW_REQUIRED'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {req.status}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{req.requirementText}</p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
              <span>{req.authority}</span>
              {req.citationId && <span className="font-mono text-cyan-400">Ref: {req.citationId}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Gaps & Remediation Actions ── */}
      {assessment.complianceGaps.length > 0 && (
        <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-5 text-xs space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'فجوات الامتثال وإجراءات المعالجة المطلوبة:' : 'Compliance Gaps & Remediation Plan:'}</span>
          </h3>
          <div className="space-y-2.5">
            {assessment.complianceGaps.map((gap, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1 text-xs">
                <p className="font-semibold text-slate-200">{gap.description}</p>
                <p className="text-cyan-400 font-mono text-[11px]">
                  {isAr ? 'الإجراء المقترح:' : 'Remediation:'} {gap.remediation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
