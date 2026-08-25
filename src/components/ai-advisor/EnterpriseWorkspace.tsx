import React from 'react';
import {
  Building2,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Globe,
  Lock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import type {
  EnterpriseExecutionResult,
  SupportedAILang,
} from '../../ai/types';

interface EnterpriseWorkspaceProps {
  result: EnterpriseExecutionResult;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const EnterpriseWorkspace: React.FC<EnterpriseWorkspaceProps> = ({
  result,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full space-y-6">
      {/* ── Header Banner ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
              {isAr ? 'منظومة الذكاء المؤسسي المقارن' : 'Enterprise Comparative AI'}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'نوع المهمة:' : 'Task Type:'} {result.taskType}
            </span>
            <span className="text-xs text-slate-400">
              | {isAr ? 'الولاية القضائية:' : 'Jurisdiction:'} {result.jurisdiction}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isAr ? 'تقرير الإشراف والتخطيط المؤسسي متعدد المراحل' : 'Enterprise Multi-Step Execution Plan & Synthesis'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {result.executiveSummary}
          </p>
        </div>

        {/* Zero Side Effects Safety Badge */}
        <div className="bg-slate-950/90 border border-emerald-900/40 rounded-xl p-3.5 min-w-[240px] shrink-0 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'تنفيذ آمن للقراءة والتحليل' : 'Safe In-Memory AI Synthesis'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAr
              ? 'معالجة استشارية فورية بدون أي تأثيرات جانبية خارجية أو تعديل لقواعد البيانات.'
              : 'Zero external side effects: strictly read-only execution with zero database mutations.'}
          </p>
        </div>
      </div>

      {/* ── Multi-Step Execution Plan Pipeline ── */}
      {result.plan && result.plan.steps.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'مراحل التخطيط والتنفيذ المكتملة:' : 'Completed Task Execution Pipeline:'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {result.plan.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-cyan-300">
                    #{step.stepNumber} — {step.agentName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {step.status}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Verified Citations Summary ── */}
      {result.verifiedCitations && result.verifiedCitations.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'الأسانيد التشريعية المعتمدة في هذا التقرير:' : 'Verified Statutory Citations Grounded in this Report:'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.verifiedCitations.map((c, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-cyan-300 block">{c.sourceCode} — {c.articleNumber}</span>
                <p className="text-slate-300 text-[11px]">{isAr ? c.titleAr : c.titleEn}</p>
                <span className="text-[10px] text-slate-400 font-mono">Jurisdiction: {c.jurisdictionCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
