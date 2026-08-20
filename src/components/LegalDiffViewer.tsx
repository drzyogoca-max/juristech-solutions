import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Edit3, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { CriticValidationResult } from '../services/criticSelfLearningEngine';

export interface LegalDiffViewerProps {
  originalClause: string;
  suggestedRedline: string;
  criticResult?: CriticValidationResult | null;
  onAcceptRedline: (finalText: string) => void;
  onRejectRedline?: () => void;
  jurisdictionName?: string;
}

export default function LegalDiffViewer({
  originalClause,
  suggestedRedline,
  criticResult,
  onAcceptRedline,
  onRejectRedline,
  jurisdictionName = 'GCC / DIFC',
}: LegalDiffViewerProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(suggestedRedline);
  const [accepted, setAccepted] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(isEditing ? customText : suggestedRedline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmAccept() {
    onAcceptRedline(isEditing ? customText : suggestedRedline);
    setAccepted(true);
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Header & Critic Agent Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>{isRtl ? 'لوحة المقارنة المرئية المزدوجة (Side-by-Side Diff Viewer)' : 'Side-by-Side Legal Diff Viewer'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {jurisdictionName}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRtl ? 'مقارنة دقيقة للبند الأصلي مع الصياغة البديلة المحصنة بعد تدقيق الوكيل الناقد (Critic Agent)' : 'Comparison between the original flawed clause and the AI Critic-validated protective redline'}
            </p>
          </div>
        </div>

        {/* Critic Score Badge */}
        {criticResult && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            criticResult.score >= 80 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Critic Score: {criticResult.score}%</span>
            {criticResult.selfCorrectionApplied && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-sans">
                {isRtl ? 'تم التصحيح الذاتي' : 'Self-Corrected'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left / Original Flawed Clause */}
        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'البند الأصلي المعيب (Original Flawed Clause):' : 'Original Flawed Clause:'}</span>
            </span>
            <span className="text-[10px] font-mono text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded">
              {isRtl ? '🔴 مخاطرة عالية' : '🔴 High Risk'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-900/40 text-xs font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
            <p className="line-through decoration-red-500/60 decoration-2 opacity-80">
              {originalClause}
            </p>
          </div>
        </div>

        {/* Right / Proposed Protective Redline */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الصياغة البديلة المحصنة (Zero-Risk Redline):' : 'Zero-Risk Protective Redline:'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 border border-slate-700"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? (isRtl ? 'عرض النص' : 'View') : (isRtl ? 'تخصيص' : 'Customize')}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 border border-emerald-500/30"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-xs font-mono text-emerald-200 leading-relaxed max-h-48 overflow-y-auto">
            {isEditing ? (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                className="w-full bg-transparent text-xs text-white border-none focus:outline-none resize-none font-mono"
              />
            ) : (
              <p className="bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                {suggestedRedline}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Critic Notes Breakdown */}
      {criticResult && criticResult.critiqueNotesAr.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            {isRtl ? '🔍 تقرير الوكيل المدقق (Critic Agent Reasoning):' : '🔍 Critic Agent Reasoning:'}
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            {(isRtl ? criticResult.critiqueNotesAr : criticResult.critiqueNotesEn).map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-[11px] text-slate-500">
          {accepted
            ? (isRtl ? '✅ تم اعتماد البند وتسجيل التفضيل في حلقة التعلم الذاتي (RLHF Dataset)' : '✅ Clause accepted and recorded in RLHF Preference Dataset')
            : (isRtl ? 'سيؤدي قبول التعديل إلى استبدال البند في مسودة العقد وحفظ التفضيل لتدريب النموذج' : 'Accepting will replace clause in contract draft and update RLHF dataset')}
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onRejectRedline && (
            <button
              type="button"
              onClick={onRejectRedline}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              {isRtl ? 'رفض الصياغة' : 'Reject'}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirmAccept}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              accepted
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{accepted ? (isRtl ? 'تم الاعتماد بنجاح ✓' : 'Accepted ✓') : (isRtl ? 'اعتماد الصياغة وتحديث العقد' : 'Accept & Inject into Contract')}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
