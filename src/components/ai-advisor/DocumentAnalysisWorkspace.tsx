import React from 'react';
import {
  FileText,
  Calendar,
  Users,
  DollarSign,
  Scale,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import type {
  StructuredDocumentAnalysis,
  SupportedAILang,
} from '../../ai/types';

interface DocumentAnalysisWorkspaceProps {
  analysis: StructuredDocumentAnalysis;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const DocumentAnalysisWorkspace: React.FC<DocumentAnalysisWorkspaceProps> = ({
  analysis,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full space-y-6">
      {/* ── Overview & Typology ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {analysis.documentType}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'دقة التصنيف التقديرية:' : 'Classification Confidence:'} {Math.round(analysis.classificationConfidence * 100)}%
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {isAr ? 'الولاية القضائية:' : 'Jurisdiction:'} {analysis.jurisdiction}
          </span>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight">
          {analysis.documentTitle}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.executiveSummary}
        </p>

        {/* ── Metadata Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {analysis.extractedMetadata.parties.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                {isAr ? 'الأطراف المتعاقدة' : 'Parties'}
              </span>
              <p className="text-slate-200 font-medium truncate">
                {analysis.extractedMetadata.parties.join(' & ')}
              </p>
            </div>
          )}

          {analysis.extractedMetadata.effectiveDate && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                {isAr ? 'تاريخ السريان' : 'Effective Date'}
              </span>
              <p className="text-slate-200 font-medium">
                {analysis.extractedMetadata.effectiveDate}
              </p>
            </div>
          )}

          {analysis.extractedMetadata.monetaryValues && analysis.extractedMetadata.monetaryValues.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-cyan-400" />
                {isAr ? 'القيم المالية المرصودة' : 'Monetary Values'}
              </span>
              <p className="text-slate-200 font-medium truncate">
                {analysis.extractedMetadata.monetaryValues.join(', ')}
              </p>
            </div>
          )}

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Scale className="w-3 h-3 text-cyan-400" />
              {isAr ? 'القانون واجب التطبيق' : 'Governing Law'}
            </span>
            <p className="text-slate-200 font-medium">
              {analysis.jurisdiction !== 'UNKNOWN' ? analysis.jurisdiction : (isAr ? 'غير محدد' : 'Unspecified')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Points & Identified Issues ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.keyPoints.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'الالتزامات والثوابت الرئيسية المستخرجة:' : 'Extracted Key Covenants & Obligations:'}</span>
            </h3>
            <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
              {analysis.keyPoints.map((kp, i) => (
                <li key={i}>{kp}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.identifiedIssues.length > 0 && (
          <div className="bg-slate-900/80 border border-rose-900/40 rounded-xl p-5 text-xs space-y-3">
            <h3 className="font-bold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'المخاطر والثغرات المرصودة:' : 'Identified Risks & Vulnerabilities:'}</span>
            </h3>
            <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
              {analysis.identifiedIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
