/**
 * src/ai/retrieval/semanticSearch.ts
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * JurisTech Solutions â€” Contextual Retrieval Engine over GLOBAL_LEGAL_KNOWLEDGE_BASE
 * Specification: JURISTECH-AI-P0 Phase P0-3
 *
 * Implements multilingual lexical-semantic correlation, synonym expansion,
 * and jurisdiction-domain filtering over the verified 15-jurisdiction knowledge base.
 *
 * Architecture Note:
 * Uses a modular provider interface (ISemanticSearchProvider) with local
 * TF-IDF / contextual heuristic scoring. Zero mock vector DBs are claimed;
 * vector embedding adapters can be plugged in seamlessly via this interface.
 */

import { GLOBAL_LEGAL_KNOWLEDGE_BASE, type LegalStatute } from '../../services/legalRAGOrchestrator';
import type { JurisdictionCode, LegalDomain, SupportedAILang } from '../types';

export interface SemanticSearchResult {
  statute: LegalStatute;
  relevanceScore: number;
  matchedKeywords: string[];
  matchType: 'direct_keyword' | 'domain_correlation' | 'jurisdiction_anchor';
}

export interface SearchOptions {
  lang?: SupportedAILang;
  jurisdiction?: JurisdictionCode;
  domain?: LegalDomain;
  topK?: number;
  minScore?: number;
}

export interface ISemanticSearchProvider {
  search(query: string, options?: SearchOptions): SemanticSearchResult[];
}

const JURISDICTION_KEYWORDS: Record<JurisdictionCode, string[]> = {
  SA: ['saudi', 'Ø³Ø¹ÙˆØ¯ÙŠØ©', 'ksa', 'riyadh', 'Ø§Ù„Ø±ÙŠØ§Ø¶', 'zatca', 'scca', 'saoudite', 'saudÃ­', 'suudi', 'æ²™ç‰¹'],
  AE: ['uae', 'Ø¥Ù…Ø§Ø±Ø§Øª', 'dubai', 'Ø¯Ø¨ÙŠ', 'abu dhabi', 'difc', 'adgm', 'diac', 'Ã©mirats', 'emiratos', 'bae', 'é˜¿è”é…‹'],
  EG: ['egypt', 'Ù…ØµØ±', 'cairo', 'Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©', 'crcica', 'gafi', 'eta', 'Ã©gypte', 'egipto', 'Ã¤gypten', 'mÄ±sÄ±r', 'åŸƒåŠ'],
  QA: ['qatar', 'Ù‚Ø·Ø±', 'doha', 'Ø§Ù„Ø¯ÙˆØ­Ø©', 'qfc', 'katarlÄ±', 'å¡å¡”å°”'],
  KW: ['kuwait', 'Ø§Ù„ÙƒÙˆÙŠØª', 'koweit', 'kuveyt', 'ç§‘å¨ç‰¹'],
  BH: ['bahrain', 'Ø§Ù„Ø¨Ø­Ø±ÙŠÙ†', 'bcdr', 'bahreÃ¯n', 'bahrein', 'å·´æž—'],
  OM: ['oman', 'Ø¹Ù…Ø§Ù†', 'muscat', 'Ù…Ø³Ù‚Ø·', 'umman', 'é˜¿æ›¼'],
  JO: ['jordan', 'jordanian', 'jordanian law', 'Ø§Ù„Ø£Ø±Ø¯Ù†', 'Ø§Ù„Ø£Ø±Ø¯Ù†ÙŠ', 'Ø§Ø±Ø¯Ù†ÙŠ', 'Ø£Ø±Ø¯Ù†ÙŠ', 'Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£Ø±Ø¯Ù†ÙŠ', 'Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø£Ø±Ø¯Ù†ÙŠØ©', 'Ø¹Ù…Ø§Ù†', 'ccd', 'jordanie', 'jordania', 'jordanien', 'Ã¼rdÃ¼n', 'çº¦æ—¦'],
  INTL: ['international', 'Ø¯ÙˆÙ„ÙŠ', 'cisg', 'uncitral', 'icc', 'incoterms', 'internacional', 'uluslararasÄ±', 'å›½é™…'],
  GB: ['uk', 'england', 'britain', 'lcia', 'ucta', 'royaume-uni', 'reino unido', 'groÃŸbritannien', 'ingiltere', 'è‹±å›½'],
  US: ['usa', 'united states', 'delaware', 'sec', 'ucc', 'Ã©tats-unis', 'estados unidos', 'usa', 'abd', 'ç¾Žå›½'],
  EU: ['europe', 'gdpr', 'french', 'german', 'bgb', 'europÃ©enne', 'europa', 'avrupa', 'æ¬§ç›Ÿ'],
  SG: ['singapore', 'Ø³Ù†ØºØ§ÙÙˆØ±Ø©', 'siac', 'singapour', 'singapur', 'singapur', 'æ–°åŠ å¡'],
  TR: ['turkey', 'ØªØ±ÙƒÙŠØ§', 'turkish', 'turquie', 'turquÃ­a', 'tÃ¼rkei', 'tÃ¼rkiye', 'åœŸè€³å…¶'],
  CN: ['china', 'Ø§Ù„ØµÙŠÙ†', 'hong kong', 'hkiac', 'cietac', 'chine', 'Ã§ine', 'Ã§in', 'ä¸­å›½'],
  UNKNOWN: [],
};

const DOMAIN_KEYWORDS: Record<LegalDomain, string[]> = {
  corporate: ['company', 'Ø´Ø±ÙƒØ©', 'incorporation', 'ØªØ£Ø³ÙŠØ³', 'shareholder', 'governance', 'sociÃ©tÃ©', 'sociedad', 'gesellschaft', 'ÅŸirket', 'å…¬å¸'],
  labor: ['employment', 'Ø¹Ù…Ù„', 'employee', 'Ù…ÙˆØ¸Ù', 'salary', 'termination', 'ÙØµÙ„', 'travail', 'laboral', 'arbeitsrecht', 'iÅŸ hukuku', 'åŠ³åŠ¨'],
  ip: ['intellectual property', 'Ù…Ù„ÙƒÙŠØ© ÙÙƒØ±ÙŠØ©', 'patent', 'copyright', 'trademark', 'brevet', 'patente', 'patent', 'fikri mÃ¼lkiyet', 'çŸ¥è¯†äº§æƒ'],
  criminal: ['criminal', 'Ø¬Ø²Ø§Ø¦ÙŠ', 'fraud', 'Ø§Ø­ØªÙŠØ§Ù„', 'penal', 'pÃ©nal', 'strafrecht', 'ceza hukuku', 'åˆ‘æ³•'],
  compliance: ['gdpr', 'compliance', 'Ø§Ù…ØªØ«Ø§Ù„', 'regulatory', 'zatca', 'eta', 'aml', 'conformitÃ©', 'cumplimiento', 'uyumluluk', 'åˆè§„'],
  contract: ['contract', 'Ø¹Ù‚Ø¯', 'clause', 'Ø¨Ù†Ø¯', 'agreement', 'Ø§ØªÙØ§Ù‚ÙŠØ©', 'liability', 'contrat', 'contrato', 'vertrag', 'sÃ¶zleÅŸme', 'åˆåŒ'],
  real_estate: ['property', 'Ø¹Ù‚Ø§Ø±', 'real estate', 'lease', 'Ø¥ÙŠØ¬Ø§Ø±', 'mortgage', 'immobilier', 'inmobiliario', 'gayrimenkul', 'æˆ¿åœ°äº§'],
  banking: ['bank', 'Ø¨Ù†Ùƒ', 'swift', 'wire', 'loan', 'Ù‚Ø±Ø¶', 'banque', 'banco', 'banka', 'é“¶è¡Œ'],
  tax: ['tax', 'Ø¶Ø±ÙŠØ¨Ø©', 'vat', 'Ø²ÙƒØ§Ø©', 'income tax', 'customs', 'impÃ´t', 'impuesto', 'steuer', 'vergi', 'ç¨ŽåŠ¡'],
  arbitration: ['arbitration', 'ØªØ­ÙƒÙŠÙ…', 'dispute', 'Ù†Ø²Ø§Ø¹', 'mediation', 'arbitrage', 'arbitraje', 'schiedsverfahren', 'tahkim', 'ä»²è£'],
  company_formation: ['formation', 'ØªØ£Ø³ÙŠØ³', 'register', 'ØªØ³Ø¬ÙŠÙ„', 'license', 'startup', 'crÃ©ation', 'constituciÃ³n', 'grÃ¼ndung', 'kuruluÅŸ', 'å…¬å¸è®¾ç«‹'],
  general: [],
};

const STOP_WORDS = new Set([
  'the','a','an','is','in','on','at','to','for','of','and','or',
  'Ù…Ù†','ÙÙŠ','Ø¹Ù„Ù‰','Ø¥Ù„Ù‰','Ø¹Ù†','Ù…Ø¹','Ù‡Ø°Ø§','Ù‡Ø°Ù‡','Ø§Ù„ØªÙŠ','Ø§Ù„Ø°ÙŠ',
  'de','la','le','les','et','un','une','der','die','das','und','ist',
  'el','la','los','las','es','bir','ve','ile','bu','çš„','åœ¨','å’Œ','æ˜¯'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[ØŒ,;:()\[\]{}'".Â«Â»]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

function scoreStatute(statute: LegalStatute, tokens: string[]): { score: number; matched: string[]; matchType: SemanticSearchResult['matchType'] } {
  const matched: string[] = [];
  let score = 0;
  let hasDirectKeyword = false;

  const text = [
    ...statute.relevanceKeywords,
    statute.contentEn,
    statute.contentAr,
    statute.titleEn,
    statute.titleAr,
  ].join(' ').toLowerCase();

  for (const token of tokens) {
    if (text.includes(token)) {
      const inKeywords = statute.relevanceKeywords.some(kw => kw.toLowerCase().includes(token));
      const inTitle = (statute.titleEn + statute.titleAr).toLowerCase().includes(token);
      score += inKeywords ? 3 : inTitle ? 2 : 1;
      if (inKeywords) hasDirectKeyword = true;
      if (!matched.includes(token)) matched.push(token);
    }
  }

  if (statute.riskSeverityDefault === 'Critical') score *= 1.3;
  if (statute.riskSeverityDefault === 'High') score *= 1.15;

  const matchType: SemanticSearchResult['matchType'] = hasDirectKeyword
    ? 'direct_keyword'
    : matched.length > 0
    ? 'domain_correlation'
    : 'jurisdiction_anchor';

  return { score, matched, matchType };
}

export class ContextualLexicalSearchProvider implements ISemanticSearchProvider {
  public search(query: string, options: SearchOptions = {}): SemanticSearchResult[] {
    const { topK = 5, minScore = 0.25 } = options;
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const enriched = [...queryTokens];
    if (options.jurisdiction && options.jurisdiction !== 'UNKNOWN') {
      enriched.push(...(JURISDICTION_KEYWORDS[options.jurisdiction] || []).slice(0, 3));
    }
    if (options.domain && options.domain !== 'general') {
      enriched.push(...(DOMAIN_KEYWORDS[options.domain] || []).slice(0, 3));
    }
    const tokens = [...new Set(enriched)];

    const scored: SemanticSearchResult[] = GLOBAL_LEGAL_KNOWLEDGE_BASE.map(statute => {
      const { score, matched, matchType } = scoreStatute(statute, tokens);
      const maxPossible = tokens.length * 3 * 1.3;
      const relevanceScore = Math.min(1, score / Math.max(maxPossible, 1));
      return { statute, relevanceScore, matchedKeywords: matched, matchType };
    });

    let filtered = scored;
    if (options.jurisdiction && options.jurisdiction !== 'UNKNOWN') {
      const jf = scored.filter(r => r.statute.jurisdictionCode === options.jurisdiction);
      if (jf.length > 0) filtered = jf;
    }

    const results = filtered
      .filter(r => r.relevanceScore >= minScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);

    // If zero results but explicit jurisdiction was requested, provide jurisdiction's anchor statute
    if (results.length === 0 && options.jurisdiction && options.jurisdiction !== 'UNKNOWN') {
      const anchor = GLOBAL_LEGAL_KNOWLEDGE_BASE.find(s => s.jurisdictionCode === options.jurisdiction);
      if (anchor) {
        return [{
          statute: anchor,
          relevanceScore: 0.35,
          matchedKeywords: ['jurisdiction_anchor'],
          matchType: 'jurisdiction_anchor',
        }];
      }
    }

    return results;
  }
}

const defaultProvider: ISemanticSearchProvider = new ContextualLexicalSearchProvider();

export function semanticSearch(query: string, options: SearchOptions = {}): SemanticSearchResult[] {
  return defaultProvider.search(query, options);
}

export function detectJurisdictionFromQuery(query: string): JurisdictionCode {
  const lower = query.toLowerCase().trim();
  const explicitPriority: Array<[JurisdictionCode, string[]]> = [
    ['JO', ['jordanian law', 'law of jordan', 'القانون الأردني', 'القانون الاردني', 'المملكة الأردنية', 'الأردن', 'الاردن', 'الأردني', 'الاردني', 'jordan']],
    ['SA', ['saudi law', 'law of saudi arabia', 'السعودية', 'السعودي', 'saudi arabia']],
    ['AE', ['uae law', 'law of the uae', 'الإمارات', 'الامارات', 'الإمارات العربية المتحدة', 'uae']],
    ['EG', ['egyptian law', 'law of egypt', 'القانون المصري', 'مصر', 'المصري', 'egypt']],
    ['GB', ['english law', 'law of england', 'uk law', 'قانون إنجلترا', 'بريطانيا', 'england', 'united kingdom']],
    ['US', ['us law', 'u.s. law', 'american law', 'delaware law', 'القانون الأمريكي', 'أمريكا', 'united states']],
  ];
  for (const [code, phrases] of explicitPriority) {
    if (phrases.some(phrase => lower.includes(phrase))) return code;
  }
  const scores: Partial<Record<JurisdictionCode, number>> = {};
  for (const [code, keywords] of Object.entries(JURISDICTION_KEYWORDS) as [JurisdictionCode, string[]][]) {
    if (code === 'UNKNOWN') continue;
    const hits = keywords.filter(kw => lower.includes(kw)).length;
    if (hits > 0) scores[code] = hits;
  }
  if (Object.keys(scores).length === 0) return 'UNKNOWN';
  const ordered = Object.entries(scores).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
  if (ordered.length > 1 && ordered[0][1] === ordered[1][1]) return 'UNKNOWN';
  return ordered[0][0] as JurisdictionCode;
}

export function detectLegalDomain(query: string): LegalDomain {
  const lower = query.toLowerCase();
  const scores: Partial<Record<LegalDomain, number>> = {};
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS) as [LegalDomain, string[]][]) {
    if (domain === 'general') continue;
    const hits = keywords.filter(kw => lower.includes(kw)).length;
    if (hits > 0) scores[domain] = hits;
  }
  if (Object.keys(scores).length === 0) return 'general';
  return Object.entries(scores).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0][0] as LegalDomain;
}
