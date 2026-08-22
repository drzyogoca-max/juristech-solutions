import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, ArrowRight, ArrowLeft, Download, Sparkles, Scale, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { AuditAxisResult } from '../services/contractAnalysisEngine';
import { usePlatformLocale } from '../lib/universalTranslator';
import { exportDocumentMultiFormat } from '../lib/documentExporter';

interface VisualRedlineDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  axis: AuditAxisResult | null;
  documentTitle?: string;
}

export default function VisualRedlineDiffModal({
  isOpen,
  onClose,
  axis,
  documentTitle = 'Contract Audit',
}: VisualRedlineDiffModalProps) {
  const { l, isRtl } = usePlatformLocale();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !axis) return null;

  const handleCopyRedline = () => {
    const textToCopy = isRtl ? axis.executiveRedlineAr : axis.executiveRedlineEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportRedline = () => {
    const title = `${documentTitle} — Protective Redline (${axis.axisNameEn})`;
    const content = `================================================================================
       JURISTECH SOLUTIONS — EXECUTIVE STATUTORY CONTRACT REDLINE
================================================================================
DOCUMENT: ${documentTitle}
AXIS:     ${isRtl ? axis.axisNameAr : axis.axisNameEn}
SECURITY SCORE: ${axis.score}/100 [${axis.severity.toUpperCase()}]
STATUTORY CITATION: ${isRtl ? axis.statutoryBasisAr : axis.statutoryBasisEn}

--------------------------------------------------------------------------------
IDENTIFIED RISKS & DEFICIENCIES:
${(isRtl ? axis.identifiedRisksAr : axis.identifiedRisksEn).map((r, i) => `${i + 1}. ${r}`).join('\n')}

--------------------------------------------------------------------------------
RECOMMENDED PROTECTIVE CLAUSE (EXECUTIVE REDLINE):
${isRtl ? axis.executiveRedlineAr : axis.executiveRedlineEn}
================================================================================`;

    exportDocumentMultiFormat(content, `Redline_${axis.axisId}`, 'Party A', 'Party B', 'pdf', isRtl ? 'ar' : 'en');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {isRtl ? axis.axisNameAr : axis.axisNameEn}
              </h2>
              <span className="text-xs text-slate-400">
                {isRtl ? 'مقارنة الفروقات والصياغة الحمائية البديلة' : 'Visual Redline Diff & Protective Formulation'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              axis.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              axis.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              axis.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {axis.severity} Risk ({axis.score}/100)
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Statutory Citation Badge */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
            <Scale className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-indigo-300 block mb-1">
                {l('السند والأساس التشريعي الإلزامي:', 'Mandatory Statutory Foundation:')}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {isRtl ? axis.statutoryBasisAr : axis.statutoryBasisEn}
              </p>
            </div>
          </div>

          {/* Identified Risks */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {l('الثغرات والمخاطر المرصودة في هذا المحور:', 'Identified Risks & Contract Traps:')}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {(isRtl ? axis.identifiedRisksAr : axis.identifiedRisksEn).map((risk, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200">
                  • {risk}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Redline Diff (Side by Side or Stacked) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {l('الصياغة البديلة المحصنة المقترحة (Executive AI Redline):', 'Recommended Protective Redline Clause:')}
            </h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-inner">
              <div className="text-xs sm:text-sm font-serif leading-relaxed text-emerald-300 whitespace-pre-wrap select-all">
                {isRtl ? axis.executiveRedlineAr : axis.executiveRedlineEn}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-500 text-[11px]">
                  {l('جاهز للنسخ والدمج المباشر في الملحق التعديلي', 'Ready to copy into your Special Conditions Addendum')}
                </span>
                <button
                  onClick={handleCopyRedline}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? l('تم النسخ!', 'Copied!') : l('نسخ البند المعدل', 'Copy Redline')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
          >
            {l('إغلاق', 'Close')}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportRedline}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {l('تصدير البند في ملف رسمي', 'Export Redline Document')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
