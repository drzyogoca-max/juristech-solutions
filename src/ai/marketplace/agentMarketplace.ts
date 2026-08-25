/**
 * src/ai/marketplace/agentMarketplace.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Specialized AI Agent Marketplace & Ecosystem Catalog
 * Specification: Task 13.3
 *
 * Provides a catalog of specialized institutional legal AI agents:
 *  1. M&A Deal Room Forensics Agent
 *  2. ZATCA Phase 2 Tax Compliance Agent
 *  3. Sharia Compliance & Islamic Finance Screener
 *  4. Cross-Border Data Transfer (PDPL/GDPR) Auditor
 *  5. Maritime & Logistics Admiralty Law Specialist
 *  6. Employment & Labor Tribunal Dispute Forecaster
 */

import type { JurisdictionCode } from '../types';

export type AgentCategory =
  | 'corporate_ma'
  | 'tax_regulatory'
  | 'islamic_finance'
  | 'data_privacy'
  | 'maritime_logistics'
  | 'employment_tribunal';

export type AgentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AgentInstallStatus = 'AVAILABLE' | 'INSTALLED' | 'REQUESTED';

export interface SpecializedAgent {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: AgentCategory;
  jurisdictions: JurisdictionCode[];
  capabilities: string[];
  riskLevel: AgentRiskLevel;
  humanReviewPolicy: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  version: string;
  author: string;
  verifiedByJurisTech: boolean;
  pricingTier: 'standard' | 'enterprise_exclusive';
}

export interface InstalledAgentRecord {
  organizationId: string;
  agentId: string;
  installedAt: string;
  status: AgentInstallStatus;
}

class AgentMarketplace {
  private static instance: AgentMarketplace;
  private agents: Map<string, SpecializedAgent> = new Map();
  private installedAgents: Map<string, InstalledAgentRecord[]> = new Map(); // Keyed by orgId

  private constructor() {
    this.seedAgents();
  }

  public static getInstance(): AgentMarketplace {
    if (!AgentMarketplace.instance) {
      AgentMarketplace.instance = new AgentMarketplace();
    }
    return AgentMarketplace.instance;
  }

  private seedAgents(): void {
    const catalog: SpecializedAgent[] = [
      {
        id: 'agent_ma_forensics',
        nameEn: 'M&A Deal Room Forensics Agent',
        nameAr: 'وكيل التدقيق الجنائي لصفقات الاندماج والاستحواذ',
        descriptionEn: 'Deep statutory audit of Representations & Warranties, MAC clauses, and indemnification caps for cross-border transactions.',
        descriptionAr: 'فحص جنائي عميق لبنود الإقرارات والضمانات، والتغير الجوهري السلبي (MAC)، وسقوف التعويضات في الصفقات الدولية.',
        category: 'corporate_ma',
        jurisdictions: ['SA', 'AE', 'GB', 'US'],
        capabilities: ['rep_warranties_audit', 'mac_clause_detector', 'indemnity_cap_validator'],
        riskLevel: 'HIGH',
        humanReviewPolicy: 'MANDATORY',
        version: '2.1.0',
        author: 'JurisTech M&A Practice Group',
        verifiedByJurisTech: true,
        pricingTier: 'enterprise_exclusive',
      },
      {
        id: 'agent_zatca_tax',
        nameEn: 'ZATCA Phase 2 Tax Compliance Agent',
        nameAr: 'وكيل الامتثال الضريبي والفوترة الإلكترونية (زكاة وضريبة)',
        descriptionEn: 'Statutory validation against Saudi ZATCA e-invoicing Phase 2 regulations, VAT withholding rules, and transfer pricing mandates.',
        descriptionAr: 'مطابقة نظامية للوائح هيئة الزكاة والضريبة والجمارك (المرحلة الثانية للفوترة الإلكترونية) وضريبة الاستقطاع والتسعير التحويلي.',
        category: 'tax_regulatory',
        jurisdictions: ['SA'],
        capabilities: ['fatoora_phase2_validator', 'withholding_tax_audit', 'zatca_penalty_forecaster'],
        riskLevel: 'MEDIUM',
        humanReviewPolicy: 'RECOMMENDED',
        version: '1.8.4',
        author: 'JurisTech Tax & Customs Desk',
        verifiedByJurisTech: true,
        pricingTier: 'standard',
      },
      {
        id: 'agent_islamic_finance',
        nameEn: 'Sharia Compliance & Islamic Finance Screener',
        nameAr: 'وكيل فحص التوافق الشرعي والمالية الإسلامية',
        descriptionEn: 'Automated screening of Murabaha, Ijara, Mudaraba, and Sukuk financing agreements against AAOIFI and Saudi Central Bank (SAMA) standards.',
        descriptionAr: 'فحص آلي لعقود المرابحة والإجارة والمضاربة والصكوك ومطابقتها مع معايير الأيوفي (AAOIFI) ولائحة الحوكمة الشرعية للبنك المركزي السعودي.',
        category: 'islamic_finance',
        jurisdictions: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO'],
        capabilities: ['aaoifi_standard_matcher', 'sukuk_covenant_checker', 'riba_gharar_detector'],
        riskLevel: 'HIGH',
        humanReviewPolicy: 'MANDATORY',
        version: '3.0.1',
        author: 'Sovereign Islamic Finance Academy',
        verifiedByJurisTech: true,
        pricingTier: 'enterprise_exclusive',
      },
      {
        id: 'agent_crossborder_data',
        nameEn: 'Cross-Border Data Transfer (PDPL/GDPR) Auditor',
        nameAr: 'وكيل التدقيق على نقل البيانات عبر الحدود (سدايا / GDPR)',
        descriptionEn: 'Assesses standard contractual clauses (SCCs) and adequacy decisions under Saudi PDPL Executive Regulations and EU GDPR Chapter V.',
        descriptionAr: 'تقييم الشروط التعاقدية القياسية (SCCs) وملاءمة نقل البيانات وفق اللائحة التنفيذية لنظام حماية البيانات الشخصية ولوائح GDPR.',
        category: 'data_privacy',
        jurisdictions: ['SA', 'EU', 'GB', 'AE'],
        capabilities: ['pdpl_art29_screener', 'scc_clause_validator', 'dpa_consent_auditor'],
        riskLevel: 'MEDIUM',
        humanReviewPolicy: 'RECOMMENDED',
        version: '2.0.0',
        author: 'JurisTech Privacy & Cyber Desk',
        verifiedByJurisTech: true,
        pricingTier: 'standard',
      },
    ];

    for (const a of catalog) {
      this.agents.set(a.id, a);
    }

    // Default install for demo organization
    this.installedAgents.set('org_enterprise_demo_01', [
      {
        organizationId: 'org_enterprise_demo_01',
        agentId: 'agent_ma_forensics',
        installedAt: '2026-01-20T10:00:00.000Z',
        status: 'INSTALLED',
      },
      {
        organizationId: 'org_enterprise_demo_01',
        agentId: 'agent_zatca_tax',
        installedAt: '2026-01-22T12:00:00.000Z',
        status: 'INSTALLED',
      },
    ]);
  }

  /**
   * List all available agents in marketplace
   */
  public listAgents(): SpecializedAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  public getAgent(id: string): SpecializedAgent | null {
    return this.agents.get(id) || null;
  }

  /**
   * Install agent for an organization
   */
  public installAgent(organizationId: string, agentId: string): boolean {
    if (!this.agents.has(agentId)) return false;

    const list = this.installedAgents.get(organizationId) || [];
    if (list.some(item => item.agentId === agentId && item.status === 'INSTALLED')) {
      return true; // Already installed
    }

    list.push({
      organizationId,
      agentId,
      installedAt: new Date().toISOString(),
      status: 'INSTALLED',
    });

    this.installedAgents.set(organizationId, list);
    return true;
  }

  /**
   * Uninstall agent for an organization
   */
  public uninstallAgent(organizationId: string, agentId: string): boolean {
    const list = this.installedAgents.get(organizationId) || [];
    const filtered = list.filter(item => item.agentId !== agentId);
    this.installedAgents.set(organizationId, filtered);
    return true;
  }

  /**
   * List installed agents for an organization
   */
  public listInstalledAgents(organizationId: string): SpecializedAgent[] {
    const records = this.installedAgents.get(organizationId) || [];
    const installedIds = new Set(records.filter(r => r.status === 'INSTALLED').map(r => r.agentId));
    return this.listAgents().filter(a => installedIds.has(a.id));
  }

  public isAgentInstalled(organizationId: string, agentId: string): boolean {
    const records = this.installedAgents.get(organizationId) || [];
    return records.some(r => r.agentId === agentId && r.status === 'INSTALLED');
  }

  public clear(): void {
    this.agents.clear();
    this.installedAgents.clear();
  }
}

export const agentMarketplace = AgentMarketplace.getInstance();
