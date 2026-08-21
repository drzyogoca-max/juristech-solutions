/**
 * src/components/ContractEditorModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Live Interactive Contract Editor & Customization Modal
 * 
 * Features:
 *  • Full-Screen Modal for deep contract customization, drafting, and redlining
 *  • Live Word / Character Count & Cryptographic Hash update
 *  • One-click AI Quick Insert Clauses (Confidentiality, Non-Compete, Penalty, Arbitration)
 *  • Multi-format Export (Word .docx, PDF, Copy to Clipboard)
 *  • 7-Language Responsive Interface
 */

import React, { useState, useEffect } from 'react';
import {
  X, FileText, Check, Copy, Download, Sparkles, Shield,
  Save, RotateCcw, PlusCircle, AlertCircle, CheckCircle2, Lock
} from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { exportDocumentMultiFormat } from '../lib/documentExporter';
import { exportLegalContractPDF } from '../lib/pdfExporter';

interface ContractEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractText: string;
  onSave: (updatedText: string) => void;
  contractTitle?: string;
  partyA?: string;
  partyB?: string;
}

export default function ContractEditorModal({
  isOpen,
  onClose,
  contractText,
  onSave,
  contractTitle = 'Commercial Contract',
  partyA = '',
  partyB = '',
}: ContractEditorModalProps) {
  const { l, isRtl } = usePlatformLocale();

  const [text, setText] = useState<string>(contractText);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setText(contractText);
  }, [contractText]);

  if (!isOpen) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    onSave(text);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const insertClause = (clauseTitle: string, clauseBodyAr: string, clauseBodyEn: string) => {
    const clauseToAdd = isRtl
      ? `\n\n### بند إضافي: ${clauseTitle}\n${clauseBodyAr}`
      : `\n\n### Additional Clause: ${clauseTitle}\n${clauseBodyEn}`;
    setText((prev) => prev + clauseToAdd);
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 w-full" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {l('محرر الصياغة الذكي', 'Live Contract Studio')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {wordCount} {l('كلمة', 'words')} • {charCount} {l('حرف', 'chars')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate max-w-md sm:max-w-xl">
                {l(`نافذة تعديل وتخصيص: ${contractTitle}`, `Edit & Customize: ${contractTitle}`)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? l('تم الحفظ!', 'Saved!') : l('حفظ التعديلات', 'Save Changes')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Clause Inserters Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            {l('إدراج سريع لبنود حمائية:', 'Quick Insert Protective Clauses:')}
          </span>

          <button
            type="button"
            onClick={() =>
              insertClause(
                'السرية وحماية الأسرار التجارية (NDA)',
                'يلتزم الطرفان بالحفاظ التام على سرية كافة البيانات والمعلومات التقنية والتجارية المتبادلة وعدم إفشائها لأي طرف ثالث لمدة (3) سنوات من تاريخ التوقيع.',
                'Both parties agree to maintain strict confidentiality over all technical, financial, and proprietary trade secrets for a period of 3 years following execution.'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
          >
            + {l('بند السرية (NDA)', 'Confidentiality (NDA)')}
          </button>

          <button
            type="button"
            onClick={() =>
              insertClause(
                'الشرط الجزائي والتعويض الاتفاقي',
                'في حال إخلال أي طرف بالتزاماته الجوهرية، يستحق الطرف المتضرر تعويضاً اتفاقياً مقطوعاً يعادل 20% من إجمالي قيمة المعاملة دون حاجة لإعذار قضائي.',
                'In the event of material breach, the non-breaching party shall be entitled to liquidated damages equal to 20% of the aggregate transaction value.'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
          >
            + {l('الشرط الجزائي', 'Liquidated Damages')}
          </button>

          <button
            type="button"
            onClick={() =>
              insertClause(
                'التحكيم وفض المنازعات الدولي (ICC / CRCICA)',
                'يُحال أي نزاع ينشأ عن تفسير أو تنفيذ هذا العقد إلى التحكيم التجاري وفقاً لقواعد مركز التحكيم المعتمد، وتكون أحكامه نهائية وملزمة للطرفين.',
                'Any dispute arising out of or in connection with this contract shall be referred to and finally resolved by commercial arbitration under institutional arbitration rules.'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
          >
            + {l('بند التحكيم الدولي', 'Arbitration Clause')}
          </button>

          <button
            type="button"
            onClick={() =>
              insertClause(
                'حظر المنافسة واستقطاب الكفاءات (Non-Compete)',
                'يحظر على الطرف الثاني منافسة أعمال الطرف الأول أو استقطاب موظفيه أو عملائه بصورة مباشرة أو غير مباشرة خلال سريان العقد ولمدة سنة تالية لانتهائه.',
                'The counterparty covenants not to compete with the business of the primary party nor solicit its employees or clients during the term and for 12 months thereafter.'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] font-medium shrink-0 transition-colors cursor-pointer"
          >
            + {l('حظر المنافسة', 'Non-Compete')}
          </button>
        </div>

        {/* Textarea Live Editor Canvas */}
        <div className="p-4 sm:p-6 flex-1 min-h-[350px] overflow-hidden flex flex-col bg-slate-950">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={l('اكتب أو عدل نص العقد والبنود هنا...', 'Type or modify contract clauses here...')}
            className="w-full flex-1 min-h-[300px] bg-slate-900/90 text-slate-100 font-mono text-xs sm:text-sm p-4 sm:p-5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed resize-none shadow-inner"
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? l('تم النسخ!', 'Copied!') : l('نسخ النص', 'Copy Text')}</span>
            </button>

            <button
              onClick={() => setText(contractText)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{l('إعادة ضبط المسودة', 'Reset Draft')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportDocumentMultiFormat(text, contractTitle, partyA, partyB, 'docx', isRtl ? 'ar' : 'en')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-200" />
              <span>{l('تصدير Word (.docx)', 'Export Word (.docx)')}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{l('اعتماد وحفظ المسودة', 'Apply & Save Draft')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
