import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Scale,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import type {
  Citation,
  JurisdictionCode,
  SourceVerificationStatus,
  SupportedAILang,
} from '../../ai/types';

interface AIResponseCardProps {
  content: string;
  confidenceScore?: number;
  confidenceCalculation?: 'heuristic';
  sourceVerificationStatus?: SourceVerificationStatus;
  jurisdiction?: JurisdictionCode;
  citations?: Citation[];
  clarificationRequired?: boolean;
  clarificationPrompt?: string;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  content,
  confidenceScore = 0.9,
  sourceVerificationStatus = 'VERIFIED',
  jurisdiction = 'UNKNOWN',
  citations = [],
  clarificationRequired = false,
  clarificationPrompt,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  const verificationBadgeMap: Record<
    SourceVerificationStatus,
    { labelEn: string; labelAr: string; color: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    VERIFIED: {
      labelEn: 'Verified Sources Grounded',
      labelAr: 'موثق بأسانيد نظامية معتمدة',
      color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      icon: ShieldCheck,
    },
    PARTIAL: {
      labelEn: 'Partially Verified',
      labelAr: 'توثيق جزئي يتطلب مراجعة',
      color: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      icon: AlertTriangle,
    },
    INSUFFICIENT: {
      labelEn: 'Insufficient Sources',
      labelAr: 'أسانيد غير كافية',
      color: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      icon: AlertCircle,
    },
    SOURCE_NOT_VERIFIED: {
      labelEn: 'Source Not Verified',
      labelAr: 'المصدر غير موثق نظامياً',
      color: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      icon: AlertTriangle,
    },
  };

  const statusBadge = verificationBadgeMap[sourceVerificationStatus] || verificationBadgeMap.VERIFIED;
  const StatusIcon = statusBadge.icon;

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
      {/* ── Top Metadata Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Verification Badge */}
          <span className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${statusBadge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{isAr ? statusBadge.labelAr : statusBadge.labelEn}</span>
          </span>

          {/* Jurisdiction Tag */}
          {jurisdiction !== 'UNKNOWN' && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>{jurisdiction}</span>
            </span>
          )}

          {/* Heuristic Confidence */}
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-medium">
            {isAr ? 'درجة الملاءمة التقديرية:' : 'Heuristic Confidence:'} {Math.round(confidenceScore * 100)}%
          </span>
        </div>

        {/* Human Review Reminder */}
        <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>{isAr ? 'مسودة استشارية تخضع للمراجعة القانونية' : 'Advisory Draft — Lawyer Review Recommended'}</span>
        </span>
      </div>

      {/* ── Clarification Banner (If Jurisdiction Unknown) ── */}
      {clarificationRequired && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300 mb-1">
              {isAr ? 'يلزم تحديد الولاية القضائية (JURISDICTION_REQUIRED)' : 'Jurisdiction Specification Required (JURISDICTION_REQUIRED)'}
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              {clarificationPrompt || (isAr
                ? 'يرجى تحديد الدولة المعنية لضمان دقة الاستناد التشريعي وعدم تطبيق نصوص غير منطبقة.'
                : 'Please specify governing jurisdiction to ensure accurate statutory citations.')}
            </p>
          </div>
        </div>
      )}

      {/* ── Main Response Text ── */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
        {content}
      </div>

      {/* ── Source Not Verified Warning ── */}
      {sourceVerificationStatus === 'SOURCE_NOT_VERIFIED' && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300 mb-1">
              {isAr ? 'تنبيه التحقق من المصادر (SOURCE_NOT_VERIFIED)' : 'Source Verification Notice (SOURCE_NOT_VERIFIED)'}
            </p>
            <p className="text-rose-200/90 leading-relaxed">
              {isAr
                ? 'لم يتم العثور على مصدر قانوني موثق كافٍ في قاعدة المعرفة لهذه النقطة المحددة. يلزم التحقق البشري عبر محامٍ معتمد.'
                : 'Insufficient verified statutory sources were identified in the knowledge base for this claim. Professional legal verification is required.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Verified Citations List ── */}
      {citations.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'المصادر والمراجع النظامية الموثقة:' : 'Verified Statutory Citations:'}</span>
            <span className="text-[11px] font-normal text-slate-400">({citations.length} {isAr ? 'نصوص موثقة' : 'sources'})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {citations.map((c, idx) => (
              <div
                key={c.id || idx}
                className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3 text-xs space-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-cyan-300 truncate">
                    {c.sourceCode} — {c.articleNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {c.jurisdictionCode}
                  </span>
                </div>
                <p className="text-slate-300 font-medium line-clamp-2 leading-relaxed">
                  {isAr ? c.titleAr : c.titleEn}
                </p>
                {c.authorityLevel && (
                  <p className="text-[10px] text-slate-400">
                    {isAr ? 'المرتبة التشريعية:' : 'Authority:'} {c.authorityLevel.replace('_', ' ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
