/**
 * src/governance/regulatoryRadarEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Continuous Regulatory Radar & Legislative Drift Detector
 * Specification: Task 16.1
 *
 * Monitors real-time statutory amendments, circulars, and executive regulations across
 * global jurisdictions, calculating legislative drift metrics and contract impact scores.
 *
 * STRICT PRIVACY RULES: Public statutory metadata and regulatory change analysis only. Zero customer contracts.
 */

import type { JurisdictionCode } from '../ai/types';

export type RegulatoryEnactmentStatus =
  | 'ENACTED_IN_FORCE'
  | 'PENDING_EXECUTIVE_REGULATION'
  | 'UNDER_PUBLIC_CONSULTATION'
  | 'SUPERSEDED';

export interface RegulatoryDriftRecord {
  id: string;
  statuteCode: string;
  statuteTitleEn: string;
  statuteTitleAr: string;
  jurisdiction: JurisdictionCode;
  enactingAuthority: string;
  enactmentStatus: RegulatoryEnactmentStatus;
  effectiveDate: string;
  driftImpactScore: number; // 0 - 100
  keyChangesEn: string[];
  keyChangesAr: string[];
  affectedContractDomains: string[];
  recommendedActionEn: string;
  recommendedActionAr: string;
}

class RegulatoryRadarEngine {
  private static instance: RegulatoryRadarEngine;
  private records: Map<string, RegulatoryDriftRecord> = new Map();

  private constructor() {
    this.seedRadarRecords();
  }

  public static getInstance(): RegulatoryRadarEngine {
    if (!RegulatoryRadarEngine.instance) {
      RegulatoryRadarEngine.instance = new RegulatoryRadarEngine();
    }
    return RegulatoryRadarEngine.instance;
  }

  private seedRadarRecords(): void {
    const list: RegulatoryDriftRecord[] = [
      {
        id: 'drift_sa_cptl_2026',
        statuteCode: 'SA_M191_UPDATE',
        statuteTitleEn: 'Saudi Civil Transactions Law (Executive Implementation Directive)',
        statuteTitleAr: 'نظام المعاملات المدنية السعودي (التوجيهات التطبيقية المحدثة)',
        jurisdiction: 'SA',
        enactingAuthority: 'Ministry of Justice & Judicial Council',
        enactmentStatus: 'ENACTED_IN_FORCE',
        effectiveDate: '2024-06-15',
        driftImpactScore: 88,
        keyChangesEn: [
          'Codification of contractual good faith (Article 95)',
          'Strict statutory limits on punitive or speculative liquidated damages (Article 178)',
          'Unification of contract formation rules across commercial sectors',
        ],
        keyChangesAr: [
          'تقنين مبدأ حسن النية في تنفيذ العقود (المادة 95)',
          'وضع ضوابط نظامية مشددة للشرط الجزائي والتعويض عن الأضرار المستقبلية (المادة 178)',
          'توحيد قواعد تكوين العقود والأهلية التجارية',
        ],
        affectedContractDomains: ['Commercial Contracts', 'M&A', 'Construction FIDIC', 'Vendor SLA'],
        recommendedActionEn: 'Audit all active commercial templates to ensure limitation of liability conforms with Art. 178.',
        recommendedActionAr: 'مراجعة كافة نماذج العقود التجارية لضمان توافق بنود المسؤولية والشرط الجزائي مع المادة 178.',
      },
      {
        id: 'drift_sa_pdpl_2026',
        statuteCode: 'SA_PDPL_M148',
        statuteTitleEn: 'Saudi Personal Data Protection Law (SDAIA Executive Regulations)',
        statuteTitleAr: 'نظام حماية البيانات الشخصية السعودي (اللائحة التنفيذية - سدايا)',
        jurisdiction: 'SA',
        enactingAuthority: 'Saudi Data & AI Authority (SDAIA)',
        enactmentStatus: 'ENACTED_IN_FORCE',
        effectiveDate: '2024-09-14',
        driftImpactScore: 92,
        keyChangesEn: [
          'Mandatory Data Protection Officer (DPO) appointment for processing high-risk sensitive data',
          'Cross-border data transfer adequacy frameworks and Standard Contractual Clauses (SCC)',
          '72-hour breach notification mandate to SDAIA',
        ],
        keyChangesAr: [
          'إلزامية تعيين مسؤول حماية البيانات (DPO) عند معالجة البيانات الحساسة',
          'اعتماد الشروط التعاقدية القياسية (SCC) لنقل البيانات خارج المملكة',
          'إلزامية الإبلاغ عن التسريبات الأمنية خلال 72 ساعة لسدايا',
        ],
        affectedContractDomains: ['Cloud SaaS Agreements', 'Data Processing Addendums (DPA)', 'Fintech & Healthcare'],
        recommendedActionEn: 'Deploy SDAIA-compliant DPA addendums for all cross-border infrastructure providers.',
        recommendedActionAr: 'تطبيق ملاحق معالجة البيانات (DPA) المعتمدة من سدايا لجميع مزودي البنية السحابية.',
      },
      {
        id: 'drift_eu_ai_act_2026',
        statuteCode: 'EU_AI_ACT_2024',
        statuteTitleEn: 'European Union Artificial Intelligence Act (Regulation 2024/1689)',
        statuteTitleAr: 'قانون الذكاء الاصطناعي الأوروبي (اللائحة 2024/1689)',
        jurisdiction: 'EU',
        enactingAuthority: 'European Parliament & Council of the EU',
        enactmentStatus: 'ENACTED_IN_FORCE',
        effectiveDate: '2026-08-02',
        driftImpactScore: 95,
        keyChangesEn: [
          'High-risk AI compliance requirements: conformity assessments and human oversight',
          'Transparency obligations for general-purpose AI (GPAI) and synthetic content watermarking',
          'Prohibition of social scoring and unconstrained biometric categorization',
        ],
        keyChangesAr: [
          'متطلبات إلزامية لأنظمة الذكاء الاصطناعي عالية المخاطر تشمل تقييم المطابقة والرقابة البشرية',
          'التزامات الشفافية لنماذج الذكاء الاصطناعي العامة والعلامات المائية للمحتوى التوليدي',
          'حظر أنظمة التقييم الاجتماعي والتصنيف البيومتري غير المقيد',
        ],
        affectedContractDomains: ['Enterprise AI Licensing', 'Software Vendor Agreements', 'Corporate Risk Governance'],
        recommendedActionEn: 'Implement mandatory Human-in-the-Loop review gates and audit logging for all automated legal workflows.',
        recommendedActionAr: 'تطبيق بوابات المراجعة البشرية الإلزامية وتوثيق سجلات التدقيق لكافة مسارات الذكاء الاصطناعي القانونية.',
      },
    ];

    for (const r of list) {
      this.records.set(r.id, r);
    }
  }

  public listDriftRecords(jurisdiction?: JurisdictionCode): RegulatoryDriftRecord[] {
    const all = Array.from(this.records.values());
    if (!jurisdiction || jurisdiction === 'INTL') return all;
    return all.filter(r => r.jurisdiction === jurisdiction);
  }

  public getDriftRecord(id: string): RegulatoryDriftRecord | undefined {
    return this.records.get(id);
  }

  public calculateAverageDriftIndex(): number {
    const list = Array.from(this.records.values());
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, r) => acc + r.driftImpactScore, 0);
    return Math.round(sum / list.length);
  }

  public clear(): void {
    this.records.clear();
  }
}

export const regulatoryRadarEngine = RegulatoryRadarEngine.getInstance();
