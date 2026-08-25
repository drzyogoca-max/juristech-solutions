/**
 * src/ai/seo/metadataEngine.ts
 * JurisTech Solutions — Multilingual Legal SEO Metadata Engine
 * Specification: JURISTECH-AI-P0 Phase P0-9
 * Generates structured localized metadata for legal topics across all 7 supported locales.
 */

import type { JurisdictionCode, LegalDomain, SupportedAILang } from '../types';

export interface LocalizedMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  lang: SupportedAILang;
  isDraft: boolean;
}

export class MetadataEngine {
  public static generateTopicMetadata(
    topicKey: string,
    jurisdiction: JurisdictionCode = 'SA',
    lang: SupportedAILang = 'en'
  ): LocalizedMetadata {
    const isAr = lang === 'ar';
    const topicFormatted = topicKey.replace(/-/g, ' ');

    const title = isAr
      ? `الدليل التشريعي والقانوني لـ ${topicFormatted} (${jurisdiction}) | JurisTech Solutions`
      : `Legal & Statutory Guide to ${topicFormatted} (${jurisdiction}) | JurisTech Solutions`;

    const description = isAr
      ? `استعرض النصوص والمواد النظامية والتحليل القانوني الشامل لـ ${topicFormatted} في ${jurisdiction} عبر منصة JurisTech Solutions للذكاء الاصطناعي التشريعي.`
      : `Explore verified statutory statutes, risk frameworks, and regulatory compliance for ${topicFormatted} in ${jurisdiction} with JurisTech Solutions Legal AI.`;

    const keywords = [
      topicKey,
      jurisdiction.toLowerCase(),
      'legal compliance',
      'statutory law',
      'juristech',
      isAr ? 'استشارة قانونية' : 'legal advisory',
      isAr ? 'عقود تجارية' : 'commercial contracts',
    ];

    return {
      title,
      description,
      keywords,
      canonical: `https://www.juristech.solutions/topics/${topicKey}?jurisdiction=${jurisdiction}&lang=${lang}`,
      lang,
      isDraft: true, // Remains draft for safety
    };
  }
}
