import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trash2, Upload, Download, FileText, CheckCircle2,
  AlertTriangle, RefreshCw, X, Shield, Sparkles, FileDown, Check
} from 'lucide-react';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { exportDocumentMultiFormat } from '../lib/documentExporter';

export interface ForensicControlBarProps {
  contractText: string;
  onClearAll: () => void;
  onImportText: (extractedText: string, fileName: string) => void;
  onRunInvestigation?: () => void;
  jurisdictionCode?: string;
  isInvestigating?: boolean;
}

export default function ForensicControlBar({
  contractText,
  onClearAll,
  onImportText,
  onRunInvestigation,
  jurisdictionCode = 'GCC',
  isInvestigating = false,
}: ForensicControlBarProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [showClearModal, setShowClearModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      if (file.name.endsWith('.pdf')) {
        const extraction = await extractPDFTextMultiStage(file);
        onImportText(extraction.text, file.name);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onImportText(content || '', file.name);
          setImporting(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.warn('[Forensic Control Bar] Import error:', err);
      setImporting(false);
    } finally {
      if (file.name.endsWith('.pdf')) setImporting(false);
    }
  }

  async function handleExportTrackChanges() {
    if (!contractText.trim()) return;

    setExporting(true);
    try {
      exportDocumentMultiFormat(
        contractText,
        isRtl ? 'مسودة العقد المحصن مع التغييرات المتبعة' : 'Fortified Contract Draft with Track Changes',
        'الطرف الأول (المزود)',
        'الطرف الثاني (العميل)',
        'docx',
        isRtl ? 'ar' : 'en',
        jurisdictionCode
      );
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.warn('[Export Error]', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Left / Title & Active State */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-white block">
              {isRtl ? 'شريط التحكم والأدوات الجنائية (Forensic Control Bar)' : 'Forensic Control Bar'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isRtl ? `النظام التشريعي: ${jurisdictionCode} | الذاكرة المتجهية نشطة` : `Jurisdiction: ${jurisdictionCode} | Vector Store Active`}
            </span>
          </div>
        </div>

        {/* Right / Buttons */}
        <div className="flex items-center gap-2">
          
          {/* File Import Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,text/plain,application/pdf"
            onChange={handleFileSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>{importing ? (isRtl ? 'جاري الاستيراد...' : 'Importing...') : (isRtl ? 'رفع مستند (PDF / DOCX)' : 'File Import')}</span>
          </button>

          {/* Export Track Changes DOCX Button */}
          <button
            type="button"
            onClick={handleExportTrackChanges}
            disabled={exporting || !contractText.trim()}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-indigo-500/30 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileDown className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{exportSuccess ? (isRtl ? 'تم التصدير!' : 'Exported!') : (isRtl ? 'تصدير DOCX (Track Changes)' : 'Export Track Changes')}</span>
          </button>

          {/* Clear All with Confirmation Button */}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-all border border-red-500/30 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مسح الكل' : 'Clear All'}</span>
          </button>

        </div>

      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-white">
              {isRtl ? 'تأكيد مسح مسودة العقد بالكامل؟' : 'Confirm Clear Entire Contract Draft?'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl ? 'سيتم تفريغ نصوص العقد وبنود الفحص الحالية للبدء بمستند جديد.' : 'This will reset all current contract clauses and active forensic probe data.'}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-colors shadow-lg shadow-red-500/20"
              >
                {isRtl ? 'تأكيد المسح' : 'Clear Now'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
