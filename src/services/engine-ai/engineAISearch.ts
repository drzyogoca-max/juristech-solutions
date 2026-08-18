import { callAI } from '../../lib/api';
import { detectPromptLanguage, SupportedLanguage } from './languageDetector';
import { smartContractDataLake, DataLakeContractRecord } from '../smartContractDataLake';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Statute' | 'Precedent' | 'Contract Clause' | 'Contract Template';
  relevanceScore: number;
  summary: string;
  recommendation: string;
  templateText?: string;       // Full contract text from data lake
  jurisdictions?: string[];    // e.g. ['JO', 'SA', 'AE']
  accuracyRating?: number;
  isVerified?: boolean;
  downloadsCount?: number;
}

export interface EngineAISearchResponse {
  query: string;
  detectedLanguage: SupportedLanguage;
  results: SearchResultItem[];
  aiExecutiveSummary: string;
  executionTimeMs?: number;
  totalDataLakeRecordsIndexed?: number;
  detectedJurisdiction?: string;
}

/** Deduplicate results by semantic title similarity */
function deduplicateResults(items: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Detect jurisdiction from query keywords */
function detectJurisdictionFromQuery(query: string): string {
  const q = query.toLowerCase();
  if (/أردن|jordan|jo\b/.test(q)) return 'JO';
  if (/سعودي|saudi|sa\b/.test(q)) return 'SA';
  if (/إمارات|emarat|uae|ae\b/.test(q)) return 'AE';
  if (/مصر|egypt|eg\b/.test(q)) return 'EG';
  if (/قطر|qatar|qa\b/.test(q)) return 'QA';
  if (/كويت|kuwait|kw\b/.test(q)) return 'KW';
  if (/بحرين|bahrain|bh\b/.test(q)) return 'BH';
  if (/عمان|oman|om\b/.test(q)) return 'OM';
  if (/أوروب|europe|eu\b/.test(q)) return 'EU';
  if (/أمريك|america|us\b/.test(q)) return 'US';
  if (/دولي|international|global|uncitral/.test(q)) return 'GLOBAL';
  return 'GLOBAL';
}

export async function executeEngineAISearch(
  query: string,
  uiLanguage?: SupportedLanguage
): Promise<EngineAISearchResponse> {
  const lang = uiLanguage || detectPromptLanguage(query);
  const detectedJurisdiction = detectJurisdictionFromQuery(query);
  const isAr = lang === 'ar';

  const prompt = isAr
    ? `أنت محرك بحث قانوني متقدم مرتبط بمستودع عقود يضم أكثر من مليون عقد جاهز. حدد الاستعلام وقدم:\\n1. ملخص تنفيذي قانوني دقيق (4-5 أسطر) يشرح نوع العقد المطلوب ومخاطره القانونية الرئيسية.\\n\\nالاستعلام: "${query}"\\n\\nالولاية القضائية المرصودة: ${detectedJurisdiction}\\n\\nاستجب باللغة العربية فقط.`
    : `You are an advanced legal search engine connected to a 1M+ contract repository. Analyze the query and provide:\\n1. A precise executive summary (4-5 lines) explaining the contract type needed and its main legal risks.\\n\\nQuery: "${query}"\\nDetected Jurisdiction: ${detectedJurisdiction}\\n\\nRespond strictly in English.`;

  const [aiResult, dataLakeResult] = await Promise.all([
    callAI(prompt),
    smartContractDataLake.searchDataLake(query, lang, detectedJurisdiction)
  ]);

  // Map data lake contracts → SearchResultItems with full contract text
  const rawResults: SearchResultItem[] = dataLakeResult.contracts.map((record: DataLakeContractRecord) => ({
    id: record.id,
    title: isAr ? record.titleAr : record.titleEn,
    category: 'Contract Template' as const,
    relevanceScore: Math.round(record.similarityScore * 1000) / 10,
    summary: isAr ? record.descriptionAr : record.descriptionEn,
    recommendation: isAr ? (record.riskHighlightsAr[0] || '') : (record.riskHighlightsEn[0] || ''),
    templateText: isAr ? record.templateTextAr : record.templateTextEn,
    jurisdictions: record.jurisdictions,
    accuracyRating: record.accuracyRating,
    isVerified: record.isVerified,
    downloadsCount: record.downloadsCount,
  }));

  // Remove duplicates and return top 4 unique results
  const uniqueResults = deduplicateResults(rawResults).slice(0, 4);

  return {
    query,
    detectedLanguage: lang,
    results: uniqueResults,
    aiExecutiveSummary: aiResult,
    executionTimeMs: dataLakeResult.executionTimeMs,
    totalDataLakeRecordsIndexed: dataLakeResult.totalDataLakeRecordsIndexed,
    detectedJurisdiction,
  };
}
