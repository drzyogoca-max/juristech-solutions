import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, Star, Globe, Shield, Eye, Copy, ChevronDown, ChevronUp, X } from 'lucide-react';
import { POA_LIBRARY, searchPOALibrary, getPOAsByJurisdiction, POATemplate } from '../data/powerOfAttorneyLibrary';

// ── HELPER ───────────────────────────────────────────────────────────────────

const ratingColor = (r: number) =>
  r >= 9.0 ? 'text-emerald-400' : r >= 8.5 ? 'text-sky-400' : 'text-amber-400';

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

const POALibraryPage: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [query, setQuery] = useState('');
  const [jurFilter, setJurFilter] = useState('ALL');
  const [selected, setSelected] = useState<POATemplate | null>(null);
  const [templateTab, setTemplateTab] = useState<'ar' | 'en'>('ar');
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isRTL = lang === 'ar';

  // Filtered list
  const items = useMemo(() => {
    let result = query ? searchPOALibrary(query) : POA_LIBRARY;
    if (jurFilter !== 'ALL') result = result.filter(p => p.jurisdictions.includes(jurFilter) || p.jurisdictions.includes('GLOBAL'));
    return result;
  }, [query, jurFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (poa: POATemplate) => {
    const content = templateTab === 'ar' ? poa.templateAr : poa.templateEn;
    const filename = `${poa.id}-${templateTab}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jurisdictions = ['ALL', 'JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'BH', 'SG', 'AU', 'CA', 'US', 'GB', 'EU'];

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ── HEADER ────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isRTL ? 'مكتبة التوكيلات الرسمية' : 'Power of Attorney Library'}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {isRTL
                    ? `${POA_LIBRARY.length} نماذج استرشادية للتوكيلات الرسمية — مسودات صياغة ثنائية اللغة`
                    : `${POA_LIBRARY.length} advisory POA drafting templates — bilingual AR/EN drafts`}
                </p>
              </div>
            </div>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex gap-6 mt-4 flex-wrap">
            {[
              { label: isRTL ? 'إجمالي الوكالات' : 'Total POAs', value: POA_LIBRARY.length },
              { label: isRTL ? 'اختصاصات قضائية' : 'Jurisdictions', value: '14+' },
              { label: isRTL ? 'ثنائية اللغة' : 'Bilingual', value: '100%' },
              { label: isRTL ? 'متوسط التقييم' : 'Avg Rating', value: (POA_LIBRARY.reduce((a, p) => a + p.rating, 0) / POA_LIBRARY.length).toFixed(1) },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-amber-400">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REGULATORY & JURISDICTION LEGAL DISCLAIMER BANNER ──────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed text-amber-200/90">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              {isRTL ? 'تنبيه قانوني وإخلاء مسؤولية تنظيمي:' : 'Legal Notice & Jurisdiction Disclaimer:'}
            </p>
            <p className="text-slate-300">
              {isRTL
                ? 'جميع نماذج التوكيلات المعروضة في هذه المكتبة هي مسودات صياغة استرشادية للبدء في الصياغة والتحليل القانوني، ولا تُعد استشارة قانونية مخصصة أو بديلاً عن التوثيق الرسمي. تختلف متطلبات التوقيع، والتوثيق، والتصديق القنصلي/الأبوستيل، والتسجيل، وقابلية الإنفاذ اختلافاً جوهرياً حسب الولاية القضائية والقوانين المحلية المعمول بها لدى دوائر الكاتب العدل والمحاكم. يُلزم مراجعة محامٍ مرخص واستيفاء التوثيق العدلي الرسمي قبل استخدام أي نموذج.'
                : 'Execution, notarization, legalization, registration, and enforceability requirements vary by jurisdiction. All Power of Attorney templates provided herein are informational drafting starting points only and do not constitute legal advice, representation, or formal notarization. Always consult licensed local legal counsel and execute documents before authorized Notary Public officials in your competent jurisdiction.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث عن نوع الوكالة...' : 'Search POA type...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg ps-10 pe-4 py-2.5 text-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition"
            />
          </div>

          {/* Jurisdiction filter */}
          <div className="flex gap-2 flex-wrap">
            {jurisdictions.slice(0, 8).map(j => (
              <button
                key={j}
                onClick={() => setJurFilter(j)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  jurFilter === j
                    ? 'bg-amber-500 border-amber-400 text-slate-900'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-500 mt-3">
          {isRTL ? `عرض ${items.length} من ${POA_LIBRARY.length} نوع وكالة` : `Showing ${items.length} of ${POA_LIBRARY.length} POA types`}
        </p>
      </div>

      {/* ── GRID ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(poa => (
            <POACard
              key={poa.id}
              poa={poa}
              lang={lang}
              isExpanded={expandedId === poa.id}
              onToggleExpand={() => setExpandedId(expandedId === poa.id ? null : poa.id)}
              onOpen={() => { setSelected(poa); setTemplateTab('ar'); }}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{isRTL ? 'لا توجد نتائج مطابقة' : 'No matching POA types found'}</p>
          </div>
        )}
      </div>

      {/* ── DOCUMENT VIEWER MODAL ─────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
            dir={templateTab === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {lang === 'ar' ? selected.titleAr : selected.titleEn}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {lang === 'ar' ? selected.descriptionAr : selected.descriptionEn}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition ml-4 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template tabs */}
            <div className="flex gap-1 px-5 pt-4" dir="ltr">
              {(['ar', 'en'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTemplateTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    templateTab === t
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>

            {/* In-modal jurisdiction disclaimer */}
            <div className="mx-5 mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300/90 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                {templateTab === 'ar'
                  ? 'مسودة استرشادية: تختلف متطلبات التوقيع والتوثيق والتصديق والتسجيل وقابلية الإنفاذ حسب الولاية القضائية. يلزم التوثيق لدى الكاتب العدل المختص.'
                  : 'Drafting template: Execution, notarization, legalization, registration, and enforceability requirements vary by jurisdiction. Official notarization required.'}
              </span>
            </div>

            {/* Template content */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <pre className={`text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 rounded-xl p-4 border border-slate-800 ${templateTab === 'ar' ? 'text-right' : 'text-left'}`}>
                {templateTab === 'ar' ? selected.templateAr : selected.templateEn}
              </pre>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between p-5 border-t border-slate-800 gap-3 flex-wrap" dir="ltr">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  {selected.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-sky-400" />
                  {selected.jurisdictions.length} {lang === 'ar' ? 'اختصاص' : 'jurisdictions'}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4 text-slate-500" />
                  {selected.downloads.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(templateTab === 'ar' ? selected.templateAr : selected.templateEn)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}
                </button>
                <button
                  onClick={() => handleDownload(selected)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'ar' ? 'تحميل .txt' : 'Download .txt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── POA CARD ──────────────────────────────────────────────────────────────────

interface POACardProps {
  poa: POATemplate;
  lang: 'ar' | 'en';
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpen: () => void;
}

const POACard: React.FC<POACardProps> = ({ poa, lang, isExpanded, onToggleExpand, onOpen }) => {
  const isRTL = lang === 'ar';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-200 flex flex-col">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs text-slate-500 font-mono">{poa.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className={`w-3.5 h-3.5 ${ratingColor(poa.rating)}`} />
            <span className={`text-sm font-bold ${ratingColor(poa.rating)}`}>{poa.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-white text-sm leading-snug mb-1">
          {isRTL ? poa.titleAr : poa.titleEn}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {isRTL ? poa.descriptionAr : poa.descriptionEn}
        </p>
      </div>

      {/* Jurisdictions */}
      <div className="px-5 pb-3 flex flex-wrap gap-1">
        {poa.jurisdictions.slice(0, 5).map(j => (
          <span key={j} className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
            {j}
          </span>
        ))}
        {poa.jurisdictions.length > 5 && (
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500">
            +{poa.jurisdictions.length - 5}
          </span>
        )}
      </div>

      {/* Expandable details */}
      {isExpanded && (
        <div className="px-5 pb-3 border-t border-slate-800 pt-3 space-y-2">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{isRTL ? 'سياق الاستخدام' : 'Usage Context'}</p>
            <p className="text-xs text-slate-300">{isRTL ? poa.usageContextAr : poa.usageContextEn}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{isRTL ? 'الأساس القانوني' : 'Legal Basis'}</p>
            <p className="text-xs text-slate-400">{isRTL ? poa.legalBasisAr : poa.legalBasisEn}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Download className="w-3 h-3" />
            <span>{poa.downloads.toLocaleString()} {isRTL ? 'تنزيل' : 'downloads'}</span>
          </div>
        </div>
      )}

      {/* Card actions */}
      <div className="mt-auto px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isExpanded
            ? <><ChevronUp className="w-3.5 h-3.5" />{isRTL ? 'إخفاء' : 'Less'}</>
            : <><ChevronDown className="w-3.5 h-3.5" />{isRTL ? 'تفاصيل' : 'Details'}</>
          }
        </button>
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-medium transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {isRTL ? 'عرض النموذج' : 'View Template'}
        </button>
      </div>
    </div>
  );
};

export default POALibraryPage;
