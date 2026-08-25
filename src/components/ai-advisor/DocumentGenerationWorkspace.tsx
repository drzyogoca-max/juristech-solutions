import React, { useState } from 'react';
import {
  PenTool,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Info,
  BookOpen,
  Edit3,
  Eye,
  RefreshCw,
} from 'lucide-react';
import type {
  GeneratedDocumentTemplateType,
  GeneratedLegalDocument,
  JurisdictionCode,
  SupportedAILang,
} from '../../ai/types';

interface DocumentGenerationWorkspaceProps {
  document: GeneratedLegalDocument;
  onRegenerateSection?: (sectionIndex: number) => void;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const DocumentGenerationWorkspace: React.FC<DocumentGenerationWorkspaceProps> = ({
  document: initialDoc,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';
  const [editableContent, setEditableContent] = useState(initialDoc.content);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Document Top Controls ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
              {initialDoc.documentStatus}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'القالب:' : 'Template:'} {initialDoc.templateType}
            </span>
            <span className="text-xs text-slate-400">
              | {isAr ? 'الولاية:' : 'Jurisdiction:'} {initialDoc.jurisdiction}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {initialDoc.documentTitle}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? (isAr ? 'معاينة' : 'Preview') : (isAr ? 'تعديل الصياغة' : 'Edit Text')}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ المسودة' : 'Copy Draft')}</span>
          </button>
        </div>
      </div>

      {/* ── Human Review Safety Banner ── */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-300 mb-0.5">
            {isAr ? 'مسودة قانونية تتطلب مراجعة بشرية (REQUIRES_HUMAN_REVIEW)' : 'Advisory Draft Requires Human Review (REQUIRES_HUMAN_REVIEW)'}
          </p>
          <p className="text-amber-200/90 leading-relaxed">
            {isAr
              ? 'هذا المستند تم توليده لأغراض التحرير والصياغة الاستشارية. يلزم مراجعة النصوص عبر محامٍ معتمد قبل التوقيع أو الاعتماد الرسمي.'
              : 'This document is generated for drafting and advisory review. Professional attorney review is required prior to execution or formal filing.'}
          </p>
        </div>
      </div>

      {/* ── Placeholders Notice (If any remain) ── */}
      {initialDoc.placeholders.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            {isAr ? 'الحقول والمتغيرات المطلوب استكمالها (Placeholders):' : 'Placeholders Requiring Final Client Information:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {initialDoc.placeholders.map((p, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-800/40 font-mono text-[11px]">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Document Workspace (Editor or Formatted View) ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        {isEditing ? (
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            rows={18}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        ) : (
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
            {editableContent}
          </div>
        )}
      </div>

      {/* ── Grounded Citations in Document ── */}
      {initialDoc.citations.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
          <h3 className="font-bold text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'الأسانيد التشريعية الموثقة المضمنة في هذه المسودة:' : 'Verified Statutory Citations Grounded in this Draft:'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {initialDoc.citations.map((c, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg">
                <span className="font-bold text-cyan-300 block">{c.sourceCode} — {c.articleNumber}</span>
                <span className="text-slate-300 text-[11px]">{isAr ? c.titleAr : c.titleEn}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
