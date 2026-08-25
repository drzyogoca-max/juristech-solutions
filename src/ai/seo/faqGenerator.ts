/**
 * src/ai/seo/faqGenerator.ts
 * JurisTech Solutions — Legal SEO FAQ Generator Engine
 * Specification: JURISTECH-AI-P0 Phase P0-9 & Rule 12
 *
 * GENERATES DRAFT-ONLY STRUCTURED FAQS (Schema.org JSON-LD).
 * SAFETY RULE: ALWAYS status: 'DRAFT', NEVER AUTO-PUBLISHED.
 */

import type { JurisdictionCode, LegalDomain, LegalFAQItem, SupportedAILang } from '../types';
import { LegalResearchAgent } from '../agents/legalResearchAgent';

export class FAQGenerator {
  public static async generateDraftFAQ(
    topic: string,
    jurisdiction: JurisdictionCode = 'SA',
    domain: LegalDomain = 'corporate'
  ): Promise<LegalFAQItem> {
    const research = await LegalResearchAgent.executeResearch(topic, {
      forceJurisdiction: jurisdiction,
      forceDomain: domain,
      topK: 2,
    });

    const primaryStatute = research.statutes[0];
    const question = `What are the legal compliance requirements for ${topic} in ${jurisdiction}?`;

    const answerEn = primaryStatute
      ? `Under ${primaryStatute.sourceCode} (${primaryStatute.articleNumber}), entities must comply with ${primaryStatute.titleEn}. Key obligation: ${primaryStatute.contentEn}`
      : `Compliance for ${topic} is subject to local statutory frameworks and regulatory oversight.`;

    const answerAr = primaryStatute
      ? `وفقاً لأحكام ${primaryStatute.sourceCode} (${primaryStatute.articleNumber})، تلتزم المنشآت بـ ${primaryStatute.titleAr}. المضمون: ${primaryStatute.contentAr}`
      : `تخضع متطلبات ${topic} للأطر التشريعية واللوائح التنظيمية المعتمدة محلياً.`;

    const schemaJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerEn,
          },
        },
      ],
    }, null, 2);

    return {
      id: `faq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      question,
      answerEn,
      answerAr,
      jurisdiction,
      domain,
      schemaJsonLd,
      status: 'DRAFT', // Mandatory DRAFT state
      generatedAt: new Date().toISOString(),
    };
  }
}
