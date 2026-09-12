import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Search, Sparkles, Download, Eye, CheckCircle2,
  Building2, Briefcase, Code2, Users, Landmark, Layers,
  ExternalLink, Copy, Check, ArrowRight, ShieldCheck, Scale, Compass
} from 'lucide-react';
import SEO from '../components/SEO';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  MEGA_CATEGORIES,
  MEGA_CONTRACT_TEMPLATES,
  MegaContractTemplate,
} from '../data/contractsMegaRepository';
import { generateAndDownloadWordDocument } from '../utils/export-utils';

export default function TemplatesPage() {
  const { l, isRtl, formatNum } = usePlatformLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MegaContractTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return MEGA_CONTRACT_TEMPLATES.filter((tpl) => {
      const matchesCat =
        selectedCategory === 'all' || tpl.categoryKey === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tpl.titleAr.toLowerCase().includes(query) ||
        tpl.titleEn.toLowerCase().includes(query) ||
        tpl.descriptionAr.toLowerCase().includes(query) ||
        tpl.descriptionEn.toLowerCase().includes(query) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyText = (tpl: MegaContractTemplate) => {
    const text = isRtl ? tpl.templateAr : tpl.templateEn;
    navigator.clipboard.writeText(text);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadWord = (tpl: MegaContractTemplate) => {
    const title = isRtl ? tpl.titleAr : tpl.titleEn;
    const body = isRtl ? tpl.templateAr : tpl.templateEn;
    generateAndDownloadWordDocument(
      title,
      body,
      isRtl ? 'ar' : 'en'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={l(
          'استوديو النماذج القانونية الذكية | JurisTech Solutions',
          'Verified Legal Templates Studio | JurisTech Solutions'
        )}
        description={l(
          'استعرض وحمّل نماذج العقود والاتفاقيات القانونية المعتمدة مهنياً مع إمكانية التخصيص بالذكاء الاصطناعي والتصدير الفوري.',
          'Browse, preview, and download verified statutory legal contracts and templates with instant AI customization.'
        )}
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{l('مكتبة النماذج المعتمدة 2026', 'Verified Template Studio 2026')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {l('استوديو النماذج والعقود القانونية', 'Interactive Legal Templates Studio')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {l(
              'مكتبة متكاملة من النماذج الاحترافية المصاغة بأعلى المعايير القضائية، جاهزة للاستخدام الفوري، التدقيق، والتعديل بالذكاء الاصطناعي.',
              'A curated library of professional, statutory contract templates engineered for international and regional jurisdictions, ready for AI drafting.'
            )}
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 w-5 h-5 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={l(
                'ابحث عن عقد (تأسيس، توظيف، توريد، سرية، استحواذ...)...',
                'Search templates (NDA, employment, corporate bylaws, M&A, supply)...'
              )}
              className={`w-full ${
                isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'
              } py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-xl`}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{l('جميع النماذج', 'All Templates')}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                {formatNum(MEGA_CONTRACT_TEMPLATES.length)}
              </span>
            </button>

            {MEGA_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{isRtl ? cat.nameAr : cat.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-500/5 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {tpl.pagesCount} {l('صفحات', 'Pages')}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {tpl.clausesCount} {l('بنود', 'Clauses')}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {isRtl ? tpl.titleAr : tpl.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {isRtl ? tpl.descriptionAr : tpl.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {tpl.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    title={l('معاينة النموذج', 'Preview Template')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyText(tpl)}
                    title={l('نسخ نص العقد', 'Copy Template Text')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId === tpl.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadWord(tpl)}
                    title={l('تحميل كملف Word', 'Download Word')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to={`/contracts?template=${encodeURIComponent(tpl.id)}&title=${encodeURIComponent(
                    isRtl ? tpl.titleAr : tpl.titleEn
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer"
                >
                  <span>{l('تخصيص بالذكاء الاصطناعي', 'AI Customize')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              {l('لا توجد نماذج مطابقة لبحثك.', 'No templates found matching your query.')}
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isRtl ? previewTemplate.titleAr : previewTemplate.titleEn}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? previewTemplate.descriptionAr : previewTemplate.descriptionEn}
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                {l('إغلاق', 'Close')}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all bg-slate-950/60">
              {isRtl ? previewTemplate.templateAr : previewTemplate.templateEn}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(previewTemplate)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 cursor-pointer"
                >
                  {copiedId === previewTemplate.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{l('تم النسخ', 'Copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{l('نسخ النص', 'Copy Text')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadWord(previewTemplate)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{l('تحميل Word', 'Download Word')}</span>
                </button>
              </div>

              <Link
                to={`/contracts?template=${encodeURIComponent(previewTemplate.id)}&title=${encodeURIComponent(
                  isRtl ? previewTemplate.titleAr : previewTemplate.titleEn
                )}`}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>{l('فتح في استوديو التحرير الذكي', 'Open in AI Contract Studio')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
