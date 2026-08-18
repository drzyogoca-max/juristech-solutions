import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Sparkles, Loader2, X, Shield, Copy, Check,
  FileText, Globe, BadgeCheck, Download, ChevronDown, ChevronUp
} from 'lucide-react';
import { executeEngineAISearch, EngineAISearchResponse, SearchResultItem } from '../services/engine-ai';

import VoiceInput from './VoiceInput';

export default function EngineAISearchBar() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [query, setQuery]                     = useState('');
  const [isOpen, setIsOpen]                   = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [searchResponse, setSearchResponse]   = useState<EngineAISearchResponse | null>(null);
  const [expandedId, setExpandedId]           = useState<string | null>(null);
  const [copiedId, setCopiedId]               = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setExpandedId(null);
    try {
      const resp = await executeEngineAISearch(query, i18n.language as any);
      setSearchResponse(resp);
      setIsOpen(true);
    } catch (err) {
      console.warn('Engine AI Search error:', err);
    } finally {
      setLoading(false);
    }
  }

  function copyTemplate(item: SearchResultItem) {
    const text = item.templateText || item.summary;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  }

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
              ? 'ابحث عن عقد... (مثال: عقد تسويق عقاري أردني)'
              : 'Search contracts... (e.g. Real estate marketing Jordan)'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (query.trim() && !loading) handleSearch(e);
              }
            }}
            className={`w-full py-2.5 px-4 ${isRtl ? 'pr-10 pl-12' : 'pl-10 pr-12'} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner`}
          />
          <button
            type="submit"
            aria-label={isRtl ? 'تنفيذ البحث' : 'Execute search'}
            disabled={loading || !query.trim()}
            className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 transition-colors`}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          </button>
        </div>

        <VoiceInput
          language={i18n.language}
          onTranscript={(text) => setQuery((prev) => (prev ? `${prev} ${text}` : text))}
        />
      </form>


      {/* Results Modal */}
      {isOpen && searchResponse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  {isRtl ? 'نتائج محرك العقود الذكي (Engine AI)' : 'Engine AI Contract Results'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={isRtl ? 'إغلاق نافذة البحث' : 'Close search modal'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans font-bold">
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20">
                  ⚡ {isRtl ? 'فحص فوري' : 'Instant AI'}
                </span>
                <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md border border-cyan-500/20">
                  📚 {isRtl ? '1,000+ عقد مُفهرس ومعتمد' : '1,000+ Certified Templates'}
                </span>
                {searchResponse.detectedJurisdiction && (
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/20">
                    {jurisdictionFlag[searchResponse.detectedJurisdiction] || '🌐'} {isRtl ? 'الولاية:' : 'Jurisdiction:'} {searchResponse.detectedJurisdiction}
                  </span>
                )}
                <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-500/20">
                  🔒 {isRtl ? 'منقح من التكرار' : 'Deduplicated'}
                </span>
              </div>

              {/* AI Summary */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">
                  {isRtl ? '🤖 الملخص التنفيذي بالذكاء الاصطناعي' : '🤖 AI Executive Summary'}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {searchResponse.aiExecutiveSummary}
                </p>
              </div>

              {/* Contract Results */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isRtl ? `📄 نماذج العقود المستردة (${searchResponse.results.length} نماذج فريدة):` : `📄 Retrieved Contract Templates (${searchResponse.results.length} unique):`}
                </h4>

                {searchResponse.results.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const isCopied   = copiedId === item.id;
                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                      {/* Card header */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.isVerified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap shrink-0">
                            {item.relevanceScore}%
                          </span>
                        </div>

                        {/* Jurisdiction badges */}
                        {item.jurisdictions && item.jurisdictions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.jurisdictions.map((j) => (
                              <span key={j} className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                                {jurisdictionFlag[j] || '🌐'} {j}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.summary}</p>
                        <p className="text-xs text-amber-400 font-semibold">⚠️ {item.recommendation}</p>

                        {/* Accuracy & downloads */}
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 font-mono pt-1">
                          {item.accuracyRating && (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-400" />
                              {isRtl ? 'الدقة:' : 'Accuracy:'} {item.accuracyRating}%
                            </span>
                          )}
                          {item.downloadsCount && (
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3 text-cyan-400" />
                              {item.downloadsCount.toLocaleString()} {isRtl ? 'تحميل' : 'downloads'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => copyTemplate(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition"
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {isCopied
                              ? (isRtl ? 'تم النسخ!' : 'Copied!')
                              : (isRtl ? 'نسخ نص العقد' : 'Copy Contract')}
                          </button>
                          {item.templateText && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                            >
                              <FileText className="w-3 h-3" />
                              {isRtl ? (isExpanded ? 'إخفاء العقد' : 'معاينة العقد كاملاً') : (isExpanded ? 'Collapse' : 'Preview Full Contract')}
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Full contract text preview */}
                      {isExpanded && item.templateText && (
                        <div className="border-t border-slate-200 dark:border-slate-800 px-4 pb-4 pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {isRtl ? 'نص العقد القانوني الكامل من المستودع المليوني:' : 'Full Contract Text from 1M+ Repository:'}
                            </span>
                          </div>
                          <pre className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 max-h-64 overflow-y-auto">
                            {item.templateText}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {searchResponse.results.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
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
