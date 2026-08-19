import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Search, Sparkles, Loader2, X, Shield, Copy, Check,
  FileText, Globe, BadgeCheck, Download, ChevronDown, ChevronUp,
  Printer, FileDown
} from 'lucide-react';
import { executeEngineAISearch, EngineAISearchResponse, SearchResultItem } from '../services/engine-ai';
import VoiceInput from './VoiceInput';
import { exportDocumentMultiFormat } from '../lib/documentExporter';

export default function EngineAISearchBar() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<EngineAISearchResponse | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [contractLangMap, setContractLangMap] = useState<Record<string, 'ar' | 'en'>>({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const modalScrollRef = useRef<HTMLDivElement>(null);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setExpandedId(null);
    try {
      const resp = await executeEngineAISearch(query, i18n.language as any);
      setSearchResponse(resp);
      if (resp.results && resp.results.length > 0) {
        setExpandedId(resp.results[0].id); // Auto-expand #1 top match immediately!
      }
      setIsOpen(true);
      setTimeout(() => {
        modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.warn('Engine AI Search error:', err);
    } finally {
      setLoading(false);
    }
  }


  function getContractText(item: SearchResultItem, targetLang?: 'ar' | 'en') {
    const selectedLang = targetLang || contractLangMap[item.id] || (isRtl ? 'ar' : 'en');
    if (selectedLang === 'en' && item.templateTextEn) return item.templateTextEn;
    if (selectedLang === 'ar' && item.templateTextAr) return item.templateTextAr;
    return item.templateText || item.summary;
  }

  function getContractTitle(item: SearchResultItem, targetLang?: 'ar' | 'en') {
    const selectedLang = targetLang || contractLangMap[item.id] || (isRtl ? 'ar' : 'en');
    if (selectedLang === 'en' && item.titleEn) return item.titleEn;
    if (selectedLang === 'ar' && item.titleAr) return item.titleAr;
    return item.title;
  }

  function copyTemplate(item: SearchResultItem) {
    const text = getContractText(item);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  }

  const handleExport = async (item: SearchResultItem, format: 'docx' | 'pdf') => {
    const curLang = contractLangMap[item.id] || (isRtl ? 'ar' : 'en');
    const text = getContractText(item, curLang);
    const title = getContractTitle(item, curLang);
    const targetJur = item.jurisdictions?.[0] || searchResponse?.detectedJurisdiction || (curLang === 'ar' ? 'EG' : 'US');
    const partyA = curLang === 'ar' ? 'الطرف الأول (البائع / المنفذ)' : 'Party A (First Party)';
    const partyB = curLang === 'ar' ? 'الطرف الثاني (المشتري / العميل)' : 'Party B (Second Party)';

    setDownloadingId(`${item.id}-${format}`);
    try {
      await exportDocumentMultiFormat(
        text,
        title,
        partyA,
        partyB,
        format,
        curLang,
        targetJur
      );
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handlePrint = (item: SearchResultItem) => {
    const curLang = contractLangMap[item.id] || (isRtl ? 'ar' : 'en');
    const text = getContractText(item, curLang);
    const title = getContractTitle(item, curLang);
    const jur = item.jurisdictions?.[0] || searchResponse?.detectedJurisdiction || (curLang === 'ar' ? 'EG' : 'GLOBAL');
    
    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (!printWindow) {
      alert(isRtl ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${curLang}" dir="${curLang === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; line-height: 1.7; padding: 20px; }
          .header { border-bottom: 2px solid #0891b2; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 18px; font-weight: 900; color: #0891b2; }
          .badge { font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          h1 { font-size: 18px; color: #0f172a; margin: 15px 0 10px; }
          pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 10px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">⚖️ JurisTech Solutions</div>
          <div class="badge">${curLang === 'ar' ? 'وثيقة قانونية معتمدة' : 'Certified Legal Document'} - ${jur}</div>
        </div>
        <h1>${title}</h1>
        <pre>${text}</pre>
        <div class="footer">
          ${curLang === 'ar' ? 'تم إصدار هذه الوثيقة عبر منصة جوريس تك للذكاء الاصطناعي القانوني — https://www.juristech.solutions' : 'Issued via JurisTech AI Legal Platform — https://www.juristech.solutions'}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };


  const jurisdictionFlag: Record<string, string> = {
    JO: '🇯🇴', SA: '🇸🇦', AE: '🇦🇪', EG: '🇪🇬', QA: '🇶🇦',
    KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲', US: '🇺🇸', EU: '🇪🇺',
    GLOBAL: '🌐', UNCITRAL: '🌐', GCC: '🌍', MENA: '🌍',
  };

  return (
    <div className="relative w-full max-w-xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSearch} className="relative flex items-center gap-1.5">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            aria-label={isRtl ? 'البحث عن العقود والوثائق الذكية' : 'Search smart contracts and documents'}
            placeholder={isRtl
              ? 'ابحث عن عقد... (مثال: عقد بيع شقة سكنية في مصر)'
              : 'Search contracts... (e.g. Apartment sale agreement)'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (query.trim() && !loading) handleSearch(e);
              }
            }}
            className={`w-full py-2.5 px-4 ${isRtl ? 'pr-10 pl-12' : 'pl-10 pr-12'} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner`}
          />
          <button
            type="submit"
            aria-label={isRtl ? 'تنفيذ البحث' : 'Execute search'}
            disabled={loading || !query.trim()}
            className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer`}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          </button>
        </div>

        <VoiceInput
          language={i18n.language}
          onTranscript={(text) => {
            setQuery((prev) => (prev ? `${prev} ${text}` : text));
          }}
        />
      </form>

      {/* Results Modal */}
      {isOpen && searchResponse && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="engine-ai-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Pinned Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-slate-50 dark:bg-slate-900 z-20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="engine-ai-modal-title" className="font-black text-sm text-slate-900 dark:text-white">
                    {isRtl ? 'نتائج محرك العقود الذكي (Engine AI)' : 'Engine AI Contract Results'}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isRtl ? 'جاهز للتحميل والطباعة فوراً' : 'Instant Multi-Format Download & Print Ready'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={isRtl ? 'إغلاق نافذة البحث' : 'Close search modal'}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div ref={modalScrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans font-bold">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  ⚡ {isRtl ? 'فحص ومطابقة قانونية فورية' : 'Instant AI Match'}
                </span>
                <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  📚 {isRtl ? '1,000,000+ عقد مُفهرس ومعتمد' : '1M+ Certified Templates'}
                </span>
                {searchResponse.detectedJurisdiction && (
                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {jurisdictionFlag[searchResponse.detectedJurisdiction] || '🌐'} {isRtl ? 'الولاية القضائية:' : 'Jurisdiction:'} {searchResponse.detectedJurisdiction}
                  </span>
                )}
              </div>

              {/* 1. CONTRACT RESULTS LIST — PRIORITIZED AT THE VERY TOP */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    {isRtl ? `📄 نماذج العقود المطابقة لبحثك (${searchResponse.results.length} خيارات متكاملة):` : `📄 Matched Contract Templates (${searchResponse.results.length} unique options):`}
                  </h4>
                  <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {isRtl ? 'الخيار الأولي الموصى به في الأعلى' : 'Top Match #1 First'}
                  </span>
                </div>

                {searchResponse.results.map((item, idx) => {
                  const isTopMatch = idx === 0;
                  const isExpanded = expandedId === item.id;
                  const isCopied = copiedId === item.id;
                  const isDownloadingDocx = downloadingId === `${item.id}-docx`;
                  const isDownloadingPdf = downloadingId === `${item.id}-pdf`;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all ${
                        isTopMatch
                          ? 'border-amber-500/60 dark:border-amber-500/80 shadow-md shadow-amber-500/10 bg-slate-50 dark:bg-slate-950'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm'
                      } overflow-hidden`}
                    >
                      {/* Top Match Banner on Index 0 */}
                      {isTopMatch && (
                        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 px-4 py-2 flex items-center justify-between border-b border-amber-500/30 text-amber-900 dark:text-amber-200 font-black text-xs">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            {isRtl ? '🏆 الخيار الأولي والأنسب لبحثك (النتيجة الأولى المطابقة 100%):' : '🏆 Primary Best Match For Your Search (Option #1):'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-black uppercase">TOP OPTION #1</span>
                        </div>
                      )}

                      {/* Card Header & Metadata */}
                      <div className="p-4 space-y-2.5">

                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {item.isVerified && (
                              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                              {getContractTitle(item)}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap shrink-0">
                            {item.relevanceScore}%
                          </span>
                        </div>

                        {/* Jurisdiction badges */}
                        {item.jurisdictions && item.jurisdictions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.jurisdictions.map((j) => (
                              <span key={j} className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
                                {jurisdictionFlag[j] || '🌐'} {j}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.summary}</p>
                        {item.recommendation && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">⚠️ {item.recommendation}</p>
                        )}

                        {/* Accuracy & Downloads Stats */}
                        <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                          {item.accuracyRating && (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 text-emerald-500" />
                              {isRtl ? 'الدقة:' : 'Accuracy:'} {item.accuracyRating}%
                            </span>
                          )}
                          {item.downloadsCount && (
                            <span className="flex items-center gap-1">
                              <Download className="w-3.5 h-3.5 text-cyan-500" />
                              {item.downloadsCount.toLocaleString()} {isRtl ? 'تحميل' : 'downloads'}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons Toolbar: Word, PDF, Print, Copy, Expand */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-850">
                          {/* Download Word (.docx) */}
                          <button
                            type="button"
                            onClick={() => handleExport(item, 'docx')}
                            disabled={isDownloadingDocx}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 transition cursor-pointer"
                          >
                            {isDownloadingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                            <span>{isRtl ? 'تحميل Word' : 'Download Word'}</span>
                          </button>

                          {/* Download PDF (.pdf) */}
                          <button
                            type="button"
                            onClick={() => handleExport(item, 'pdf')}
                            disabled={isDownloadingPdf}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 transition cursor-pointer"
                          >
                            {isDownloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            <span>{isRtl ? 'تحميل PDF' : 'Download PDF'}</span>
                          </button>

                          {/* Print Contract */}
                          <button
                            type="button"
                            onClick={() => handlePrint(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'طباعة' : 'Print'}</span>
                          </button>

                          {/* Copy Text */}
                          <button
                            type="button"
                            onClick={() => copyTemplate(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 transition cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ النص' : 'Copy Text')}</span>
                          </button>

                          {/* Expand / Collapse Preview */}
                          {item.templateText && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition ms-auto cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isRtl ? (isExpanded ? 'إخفاء العقد' : 'معاينة العقد كاملاً') : (isExpanded ? 'Collapse' : 'Preview Full Contract')}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Full Contract Text Expansion & Bilingual Switcher */}
                      {isExpanded && item.templateText && (
                        <div className="border-t border-slate-200 dark:border-slate-800 px-5 pb-5 pt-4 bg-white/50 dark:bg-slate-900/50 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5" />
                                {isRtl ? 'نص العقد القانوني المعتمد:' : 'Certified Legal Contract Text:'}
                              </span>

                              {/* Bilingual Tabs: AR / EN */}
                              {(item.templateTextAr && item.templateTextEn) && (
                                <div className="inline-flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => setContractLangMap((prev) => ({ ...prev, [item.id]: 'ar' }))}
                                    className={`px-2 py-0.5 rounded-md transition ${
                                      (contractLangMap[item.id] || (isRtl ? 'ar' : 'en')) === 'ar'
                                        ? 'bg-cyan-500 text-slate-950 shadow'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    🇸🇦 عربي
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setContractLangMap((prev) => ({ ...prev, [item.id]: 'en' }))}
                                    className={`px-2 py-0.5 rounded-md transition ${
                                      (contractLangMap[item.id] || (isRtl ? 'ar' : 'en')) === 'en'
                                        ? 'bg-cyan-500 text-slate-950 shadow'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    🇺🇸 English
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleExport(item, 'docx')}
                                className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
                              >
                                Word (.docx)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleExport(item, 'pdf')}
                                className="text-[10px] font-bold px-2 py-1 rounded bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
                              >
                                PDF (.pdf)
                              </button>
                            </div>
                          </div>

                          <pre
                            dir={(contractLangMap[item.id] || (isRtl ? 'ar' : 'en')) === 'ar' ? 'rtl' : 'ltr'}
                            className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-mono bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto select-all"
                          >
                            {getContractText(item)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 2. AI EXECUTIVE SUMMARY (Placed below contract results) */}

              {searchResponse.aiExecutiveSummary && (
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 mt-4">
                  <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                    {isRtl ? '🤖 الملخص الاستشاري والتنفيذي بالذكاء الاصطناعي:' : '🤖 AI Executive Legal Summary:'}
                  </span>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {searchResponse.aiExecutiveSummary}
                  </div>
                </div>
              )}

              {searchResponse.results.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  {isRtl ? '🔍 لم يتم العثور على نتائج. حاول صياغة البحث بشكل مختلف.' : '🔍 No results found. Try refining your query.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

