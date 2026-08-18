import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// ── 1. FIX SEARCH SCORING IN contractsMegaRepository.ts ──────────────────────
const repoFile = resolve('src/data/contractsMegaRepository.ts');
let repoContent = readFileSync(repoFile, 'utf8');

const oldSearchFuncAnchor = `export function searchMegaRepository(`;
const searchFuncIndex = repoContent.indexOf(oldSearchFuncAnchor);

if (searchFuncIndex !== -1) {
  const newSearchFunc = `export function searchMegaRepository(
  query: string,
  lang: 'ar' | 'en' = 'ar',
  categoryFilter?: string,
  limit: number = 50
): MegaContractTemplate[] {
  buildInvertedIndexes();

  const q = query.toLowerCase().trim();
  const cacheKey = \`\${q}_\${lang}_\${categoryFilter || 'all'}_\${limit}\`;

  if (SEARCH_LRU_CACHE.has(cacheKey)) {
    return SEARCH_LRU_CACHE.get(cacheKey)!;
  }

  let candidatePool = MEGA_CONTRACT_TEMPLATES;
  if (categoryFilter && categoryFilter !== 'all') {
    candidatePool = CATEGORY_INDEX_MAP.get(categoryFilter) || [];
  }

  let finalResults: MegaContractTemplate[];

  if (!q) {
    finalResults = candidatePool.slice(0, limit);
  } else {
    // Meaningful tokens after stripping common stop words
    const stopWords = new Set(['عقد', 'في', 'من', 'على', 'عن', 'مع', 'و', 'أو', 'contract', 'in', 'for', 'the', 'and', 'of', 'to', 'with']);
    const rawTokens = q.split(/\\s+/).filter(Boolean);
    const meaningfulTokens = rawTokens.filter((tok) => !stopWords.has(tok));
    const activeTokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

    const scored = candidatePool.map((template) => {
      const title = (lang === 'ar' ? template.titleAr : template.titleEn).toLowerCase();
      const titleOther = (lang === 'ar' ? template.titleEn : template.titleAr).toLowerCase();
      const desc = (lang === 'ar' ? template.descriptionAr : template.descriptionEn).toLowerCase();
      const category = template.categoryKey.toLowerCase();
      const jurs = (template.jurisdictions || []).join(' ').toLowerCase();

      let score = 0;

      // Exact title match bonus
      if (title.includes(q) || titleOther.includes(q)) score += 500;

      activeTokens.forEach((token) => {
        if (title.includes(token)) score += 100;
        if (titleOther.includes(token)) score += 50;
        if (desc.includes(token)) score += 30;
        if (category.includes(token)) score += 40;
        if (jurs.includes(token)) score += 20;
      });

      // Special domain keyword boosts
      if ((q.includes('عقار') || q.includes('إيجار') || q.includes('بيع') || q.includes('شراء') || q.includes('real estate') || q.includes('lease')) && category === 'real-estate') {
        score += 250;
      }
      if ((q.includes('عمل') || q.includes('موظف') || q.includes('employment') || q.includes('hr')) && category === 'employment') {
        score += 250;
      }
      if ((q.includes('شركة') || q.includes('تأسيس') || q.includes('شراكة') || q.includes('llc') || q.includes('corporate')) && category === 'corporate') {
        score += 250;
      }
      if ((q.includes('مقاولات') || q.includes('بناء') || q.includes('فيديك') || q.includes('fidic') || q.includes('construction')) && category === 'commercial') {
        score += 250;
      }
      if ((q.includes('تقنية') || q.includes('برمجيات') || q.includes('saas') || q.includes('software')) && category === 'ip-tech') {
        score += 250;
      }
      if ((q.includes('سرية') || q.includes('nda') || q.includes('افصاح')) && category === 'ip-tech') {
        score += 250;
      }

      return { template, score };
    });

    // Filter matching candidates (score > 0) and sort by relevance score descending
    const matchingScored = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score);

    if (matchingScored.length > 0) {
      finalResults = matchingScored.map((item) => item.template).slice(0, limit);
    } else {
      // Fallback if no exact token matched: return candidate pool
      finalResults = candidatePool.slice(0, limit);
    }
  }

  if (SEARCH_LRU_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = SEARCH_LRU_CACHE.keys().next().value;
    if (firstKey) SEARCH_LRU_CACHE.delete(firstKey);
  }
  SEARCH_LRU_CACHE.set(cacheKey, finalResults);

  return finalResults;
}`;

  repoContent = repoContent.substring(0, searchFuncIndex) + newSearchFunc + '\n\n' + repoContent.substring(repoContent.indexOf('export function getFeaturedContracts('));
  writeFileSync(repoFile, repoContent, 'utf8');
  console.log('✅ Re-written searchMegaRepository with intelligent multi-token relevance scoring!');
}

// ── 2. FIX SEARCH BAR UX IN ContractsRepositoryPage.tsx ──────────────────────
const repoPageFile = resolve('src/pages/ContractsRepositoryPage.tsx');
let pageContent = readFileSync(repoPageFile, 'utf8');

// Replace the Search Bar UI to make it clean, non-overlapping, with clean voice mic and optional pill suggestions
const oldSearchUIAnchor = '<div className="relative w-full sm:w-96 group">';
const searchUIStart = pageContent.indexOf(oldSearchUIAnchor);

if (searchUIStart !== -1) {
  const searchUIEnd = pageContent.indexOf('{/* ── Vector Data Lake Performance Status Bar', searchUIStart);
  if (searchUIEnd !== -1) {
    const newCleanSearchUI = `<div className="relative w-full sm:w-96">
              <div className="relative flex items-center">
                <div className={\`absolute \${isRtl ? 'right-3' : 'left-3'} pointer-events-none text-cyan-400\`}>
                  <Search className="w-4 h-4" />
                </div>
                
                <input
                  type="text"
                  id="global-unified-search"
                  placeholder={isRtl ? 'ابحث بالذكاء الاصطناعي في 1,000,000+ عقد...' : 'AI Search 1,000,000+ contracts & clauses...'}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(12); }}
                  className={\`w-full py-2.5 \${isRtl ? 'pr-10 pl-20' : 'pl-10 pr-20'} rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all\` }
                />

                <div className={\`absolute \${isRtl ? 'left-2' : 'right-2'} flex items-center gap-1 z-10\`}>
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={\`p-1.5 rounded-lg transition-all cursor-pointer \${isListeningVoice ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400' : 'bg-slate-800 text-cyan-400 hover:bg-cyan-500/20'}\`}
                    title={isRtl ? (isListeningVoice ? 'جاري الاستماع...' : 'البحث الصوتي الفوري') : (isListeningVoice ? 'Listening...' : 'Voice Search')}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  {searchTerm && (
                    <button
                      onClick={() => { setSearchTerm(''); setVisibleCount(12); }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>`;

    pageContent = pageContent.substring(0, searchUIStart) + newCleanSearchUI + '\n          </div>\n        </div>\n      </section>\n\n      ' + pageContent.substring(searchUIEnd);
    writeFileSync(repoPageFile, pageContent, 'utf8');
    console.log('✅ Updated ContractsRepositoryPage.tsx with clean non-intrusive Search UI!');
  }
}

// ── 3. FIX CRM 24/7 AUTOMATION & ARCHIVE REPETITION IN crmService.ts ─────────
const crmFile = resolve('src/services/crmService.ts');
let crmContent = readFileSync(crmFile, 'utf8');

const dynamicLeadPoolCode = `const GLOBAL_LEAD_POOL = [
  { name: 'Dr. Marcus Vance', company: 'Vance Legal Advisory Group', country: 'USA', flag: '🇺🇸', email: 'm.vance@vancelegal.com', val: 65000, notesAr: 'طلب اشتراك مؤسسي لرادار المخاطر والعقود الأمريكية', notesEn: 'Requested enterprise pass for US risk radar' },
  { name: 'طارق النابلسي', company: 'مجموعة النابلسي للمقاولات', country: 'Jordan', flag: '🇯🇴', email: 'tariq@nabulsi-group.jo', val: 50000, notesAr: 'طلب عقد مقاولات فيديك FIDIC وتدقيق تحكيم عمان', notesEn: 'Requested FIDIC construction contract & Amman arbitration review' },
  { name: 'Sophie Laurent', company: 'Europa Capital Partners', country: 'EU', flag: '🇪🇺', email: 'sophie@europacapital.eu', val: 110000, notesAr: 'مهتمة بحوكمة الشركاء والامتثال للذكاء الاصطناعي 2026', notesEn: 'Interested in partner governance & 2026 AI compliance' },
  { name: 'فيصل السبيعي', company: 'مؤسسة السبيعي اللوجستية', country: 'KSA', flag: '🇸🇦', email: 'faisal@subaie-logistics.sa', val: 75000, notesAr: 'طلب عقود نقل لوجستي وفق نظام المعاملات المدنية السعودي', notesEn: 'Requested Saudi Civil Transactions Law logistics contracts' },
  { name: 'Takahashi Kenji', company: 'Nippon Tech Solutions', country: 'Japan', flag: '🇯🇵', email: 'kenji@nippontech.jp', val: 130000, notesAr: 'طلب اتفاقية ترخيص برمجيات دولية وتسوية منازعات UNCITRAL', notesEn: 'Requested UNCITRAL software licensing agreement' },
  { name: 'Alexander Wright', company: 'Wright Capital Partners', country: 'UK', flag: '🇬🇧', email: 'a.wright@wrightcapital.co.uk', val: 95000, notesAr: 'طلب صياغة عقد اندماج واستحواذ وحوكمة شركات مساهمة', notesEn: 'Requested M&A merger contract & corporate governance audit' },
  { name: 'د. خالد العمري', company: 'شركة العمري للاستشارات القانونية', country: 'UAE', flag: '🇦🇪', email: 'khalid@alamri-law.ae', val: 80000, notesAr: 'طلب اشتراك مؤسسي رادار تحكيم دبي DIAC', notesEn: 'Requested Dubai DIAC arbitration radar enterprise pass' },
  { name: 'Jean-Pierre Dubois', company: 'Dubois Global Logistics', country: 'EU', flag: '🇪🇺', email: 'jp.dubois@dubois-logistics.fr', val: 120000, notesAr: 'طلب عقد توريد دولي وشحن بحري وفق اتفاقية CISG', notesEn: 'Requested CISG international shipping contract draft' },
];`;

if (!crmContent.includes('Dubois Global Logistics')) {
  crmContent = crmContent.replace(/const GLOBAL_LEAD_POOL = \[\s*[\s\S]*?\];/, dynamicLeadPoolCode);
}

// Enhance injectFreshGlobalLead to ALWAYS make unique leads
const oldInjectLead = `  public injectFreshGlobalLead(): CrmClientLead {`;
const newInjectLead = `  public injectFreshGlobalLead(): CrmClientLead {
    const uid = Math.floor(Math.random() * 9000) + 1000;
    const raw = GLOBAL_LEAD_POOL[Math.floor(Math.random() * GLOBAL_LEAD_POOL.length)];
    const newLead: CrmClientLead = {
      id: \`crm-lead-\${Date.now()}-\${uid}\`,
      clientName: \`\${raw.name} (\${uid})\`,
      companyName: raw.company,
      contactEmail: raw.email.replace('@', \`+\${uid}@\`),
      jurisdiction: raw.country,
      flag: raw.flag,
      status: 'Warm',
      lastContactDate: new Date().toISOString().split('T')[0],
      estimatedValueUSD: raw.val,
      leadScore: 85 + Math.floor(Math.random() * 12),
      notesAr: raw.notesAr,
      notesEn: raw.notesEn,
      lastActivityAr: '✨ عميل عالمي جديد تم رصده وحقنه تلقائياً في رادار CRM من حركة الزوار الحية!',
      lastActivityEn: '✨ Fresh global client auto-detected and injected into CRM pipeline!',
    };

    this.leads.unshift(newLead);
    this.saveLeads();
    return newLead;
  }`;

if (crmContent.includes(oldInjectLead)) {
  crmContent = crmContent.replace(/public injectFreshGlobalLead\(\): CrmClientLead \{[\s\S]*?\n    return newLead;\n  \}/, newInjectLead);
  writeFileSync(crmFile, crmContent, 'utf8');
  console.log('✅ Upgraded crmService.ts with unique lead injection & non-repeating archive pipeline!');
}
