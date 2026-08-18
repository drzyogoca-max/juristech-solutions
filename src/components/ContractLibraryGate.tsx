import React, { useEffect, useRef } from 'react';
import { Lock, Eye, CheckCircle2, Sparkles, ArrowRight, X, FileText, Download, Star, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface TemplateContractItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  pagesCount: number;
  clausesCount: number;
  priceUSD: number;
  previewSnippetAr: string;
  previewSnippetEn: string;
  fullContentSnippetAr: string;
  fullContentSnippetEn: string;
}

interface ContractLibraryGateProps {
  contract: TemplateContractItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractLibraryGate({ contract, isOpen, onClose }: ContractLibraryGateProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = isRtl ? contract.titleAr : contract.titleEn;
  const category = isRtl ? contract.categoryAr : contract.categoryEn;
  const preview = isRtl ? contract.previewSnippetAr : contract.previewSnippetEn;
  const fullContent = isRtl ? contract.fullContentSnippetAr : contract.fullContentSnippetEn;

  const handleUnlockClick = () => {
    onClose();
    navigate('/payment');
  };

  // Click outside to close
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  // Check if User is Admin or Subscribed
  const role = localStorage.getItem('juristech_user_role');
  const userEmail = localStorage.getItem('juristech_user_email');
  const subTier = localStorage.getItem('juristech_subscription_tier');
  const isSuperAdminOrSubscriber = role === 'super-admin' || role === 'admin' || userEmail === 'drzyogo.ca@gmail.com' || (subTier && subTier !== 'free');

  const handleDownloadFormat = async (format: 'pdf' | 'docx') => {
    const textToExport = isRtl ? (contract.fullContentSnippetAr || contract.previewSnippetAr) : (contract.fullContentSnippetEn || contract.previewSnippetEn);
    const { exportDocumentMultiFormat } = await import('../lib/documentExporter');
    await exportDocumentMultiFormat(textToExport, contract.id, 'Party A', 'Party B', format, isRtl ? 'ar' : 'en', 'JO');
  };

  return (
    // ── Overlay: fixed full-screen, flex center ──────────────────────────────
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
    >
      {/* ── Modal Box ──────────────────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          maxHeight: '90vh',
          animation: 'modalFadeIn 0.25s ease-out forwards',
        }}
      >

        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-12px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
        `}</style>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 p-5 sm:p-6 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {category}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {contract.clausesCount} {isRtl ? 'بند قانوني' : 'Clauses'}
                </span>
                {isSuperAdminOrSubscriber && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {isRtl ? 'صلاحيات الإدارة متوفرة (تحميل مجاني)' : 'Admin Full Access (Free Download)'}
                  </span>
                )}
              </div>
              <h3 id="contract-modal-title" className="font-black text-white text-base sm:text-lg mt-1.5 leading-tight">
                {title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {contract.pagesCount} {isRtl ? 'صفحة' : 'Pages'}</span>
                <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {isRtl ? 'Word & PDF' : 'Word & PDF'}</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            id="contract-modal-close"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all duration-200"
            aria-label={isRtl ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Content ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Preview Notice Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
            <Eye className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              {isSuperAdminOrSubscriber
                ? (isRtl ? '👑 تم التعرّف على صلاحيات الإدارة/الاشتراك المباشر — يمكنك تحميل العقد كاملاً الآن بدون أي حجب!' : '👑 Admin/Subscriber clearance detected — Download full contract now with zero lock!')
                : (isRtl ? 'معاينة جزئية مجانية (30% من العقد) — يتم حجب بقية البنود وتفعيل التحميل الكامل فور سداد الاشتراك.' : 'Free partial preview (30% visible) — Remaining clauses locked until subscription checkout.')}
            </span>
          </div>

          {/* Contract Content Viewer */}
          <div className={`relative bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-hidden select-text ${isSuperAdminOrSubscriber ? 'max-h-96' : 'max-h-56'}`}>
            {/* Visible Partial Content */}
            <div className="space-y-3">
              <p className="font-bold text-white text-sm border-b border-slate-800 pb-2">{title}</p>
              <p className="whitespace-pre-wrap">{preview}</p>
            </div>

            {/* Unlocked or Blurred Hidden Content */}
            <div className={`relative mt-4 whitespace-pre-wrap ${isSuperAdminOrSubscriber ? 'text-slate-200 opacity-100 font-mono' : 'blur-sm opacity-40 select-none pointer-events-none'}`}>
              <p>{fullContent}</p>
            </div>

            {/* Locked Payment CTA Overlay (Hidden for Admin & Subscribers) */}
            {!isSuperAdminOrSubscriber && (
              <div className="absolute inset-x-0 bottom-0 top-20 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col items-center justify-end pb-5 px-4 text-center">
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl mb-2 animate-pulse">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white text-base">
                  {isRtl ? 'فتح العقد الكامل والتنزيل (Word / PDF)' : 'Unlock Full Contract (Word / PDF)'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {isRtl
                    ? 'احصل على البنود الكاملة المعالجة بالذكاء الاصطناعي مع القابلية للتعديل الفوري.'
                    : 'Get full AI-verified contract text with instant editability and export capability.'}
                </p>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(isRtl ? [
              'بنود قانونية معتمدة ومحدثة',
              'قابل للتعديل بالكامل (Word)',
              'ختم رقمي + SHA-256',
              'توليد PDF فوري باللغتين',
            ] : [
              'Court-ready legal clauses',
              'Fully editable (Word .docx)',
              'Digital stamp + SHA-256',
              'Instant bilingual PDF',
            ]).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer Actions ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 p-5 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isSuperAdminOrSubscriber ? (
            <div className="flex-1 flex gap-2">
              <button
                onClick={() => handleDownloadFormat('pdf')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-xl cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isRtl ? 'تحميل كـ PDF' : 'Download PDF'}</span>
              </button>

              <button
                onClick={() => handleDownloadFormat('docx')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs transition-all shadow-xl cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isRtl ? 'تحميل كـ Word (.docx)' : 'Download Word (.docx)'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleUnlockClick}
              id="contract-modal-unlock-btn"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950 flex-shrink-0" />
              <span>
                {isRtl
                  ? 'ترقية الاشتراك وفتح تحميل جميع العقود المليونية (من $29/شهرياً)'
                  : 'Upgrade Subscription & Unlock 1M+ Contracts (From $29/mo)'}
              </span>
              <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}

          <button
            onClick={onClose}
            id="contract-modal-cancel-btn"
            className="sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-colors cursor-pointer border border-slate-700"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
