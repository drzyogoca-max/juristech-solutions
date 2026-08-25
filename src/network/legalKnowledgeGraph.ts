/**
 * src/network/legalKnowledgeGraph.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Legal Knowledge Graph Engine
 * Specification: Task 14.1
 *
 * Models and traverses multi-jurisdictional statutory, precedent, and regulatory relationships.
 * Node types: STATUTE, ARTICLE, COURT_PRECEDENT, REGULATORY_STANDARD, CLAUSE_PATTERN
 * Edge types: AMENDS, CROSS_REFERENCES, SUPERSEDES, DERIVES_FROM, APPLIES_IN, CONFLICTS_WITH
 */

import type { JurisdictionCode } from '../ai/types';

export type KnowledgeNodeType =
  | 'STATUTE'
  | 'ARTICLE'
  | 'COURT_PRECEDENT'
  | 'REGULATORY_STANDARD'
  | 'CLAUSE_PATTERN';

export type KnowledgeEdgeType =
  | 'AMENDS'
  | 'CROSS_REFERENCES'
  | 'SUPERSEDES'
  | 'DERIVES_FROM'
  | 'APPLIES_IN'
  | 'CONFLICTS_WITH';

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  titleEn: string;
  titleAr: string;
  jurisdiction: JurisdictionCode;
  authorityLevel: 'PRIMARY_STATUTE' | 'EXECUTIVE_REGULATION' | 'JUDICIAL_PRECEDENT' | 'INTERNATIONAL_TREATY';
  summaryEn: string;
  summaryAr: string;
  tags: string[];
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeEdgeType;
  weight: number; // 0.0 - 1.0
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface GraphTraversalResult {
  rootNode: KnowledgeNode;
  connectedNodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  depth: number;
}

class LegalKnowledgeGraph {
  private static instance: LegalKnowledgeGraph;
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: Map<string, KnowledgeEdge> = new Map();

  private constructor() {
    this.seedKnowledgeGraph();
  }

  public static getInstance(): LegalKnowledgeGraph {
    if (!LegalKnowledgeGraph.instance) {
      LegalKnowledgeGraph.instance = new LegalKnowledgeGraph();
    }
    return LegalKnowledgeGraph.instance;
  }

  private seedKnowledgeGraph(): void {
    // 1. Nodes
    const defaultNodes: KnowledgeNode[] = [
      {
        id: 'node_sa_civil_tx_law',
        type: 'STATUTE',
        titleEn: 'Saudi Civil Transactions Law (M/191)',
        titleAr: 'نظام المعاملات المدنية السعودي (م/191)',
        jurisdiction: 'SA',
        authorityLevel: 'PRIMARY_STATUTE',
        summaryEn: 'Comprehensive codified statute governing civil and commercial contracts, torts, and obligations in Saudi Arabia.',
        summaryAr: 'النظام الشامل المقنن الحاكم للعقود المدنية والتجارية والمسؤولية التقصيرية والالتزامات في المملكة.',
        tags: ['civil_law', 'contract_formation', 'good_faith', 'liability_caps'],
      },
      {
        id: 'node_sa_art178_liquidated_damages',
        type: 'ARTICLE',
        titleEn: 'Article 178 - Liquidated Damages & Judicial Adjustment',
        titleAr: 'المادة 178 - الشرط الجزائي وسلطة التعديل القضائي',
        jurisdiction: 'SA',
        authorityLevel: 'PRIMARY_STATUTE',
        summaryEn: 'Authorizes contracting parties to pre-determine compensation, granting courts power to reduce exaggerated compensation.',
        summaryAr: 'تجيز للمتعاقدين تحديد التعويض مسبقاً، وتمنح المحكمة سلطة إنقاص التعويض إذا كان مبالغاً فيه أو إثبات عدم وقوع ضرر.',
        tags: ['liquidated_damages', 'judicial_discretion', 'contract_penalties'],
      },
      {
        id: 'node_sa_commercial_court_prec_01',
        type: 'COURT_PRECEDENT',
        titleEn: 'Riyadh Commercial Court of Appeal Decision 443/2024',
        titleAr: 'قرار محكمة الاستئناف التجارية بالرياض 443/2024',
        jurisdiction: 'SA',
        authorityLevel: 'JUDICIAL_PRECEDENT',
        summaryEn: 'Enforced limitation of liability clause capped at 100% of contract value in enterprise technology supply agreement.',
        summaryAr: 'تأييد سقف المسؤولية التعاقدية المحدد بـ 100% من قيمة العقد في اتفاقية توريد تقنية مؤسسية.',
        tags: ['liability_cap_enforcement', 'tech_contracts', 'commercial_precedent'],
      },
      {
        id: 'node_sa_pdpl_law',
        type: 'STATUTE',
        titleEn: 'Saudi Personal Data Protection Law (PDPL - M/148)',
        titleAr: 'نظام حماية البيانات الشخصية السعودي (م/148)',
        jurisdiction: 'SA',
        authorityLevel: 'PRIMARY_STATUTE',
        summaryEn: 'Governs processing of personal data, cross-border data transfers, and data subject rights under SDAIA oversight.',
        summaryAr: 'النظام الحاكم لمعالجة البيانات الشخصية ونقلها عبر الحدود وحقوق أصحاب البيانات بإشراف سدايا.',
        tags: ['privacy', 'cross_border_data', 'dpa', 'sdaia'],
      },
      {
        id: 'node_eu_gdpr_art46',
        type: 'STATUTE',
        titleEn: 'EU GDPR Article 46 - Standard Contractual Clauses',
        titleAr: 'المادة 46 من اللائحة الأوروبية العامة لحماية البيانات (GDPR)',
        jurisdiction: 'EU',
        authorityLevel: 'INTERNATIONAL_TREATY',
        summaryEn: 'Transfers of personal data to a third country subject to appropriate safeguards and enforceable data subject rights.',
        summaryAr: 'نقل البيانات الشخصية إلى دولة ثالثة شريطة توافر ضمانات مناسبة وحقوق قابلة للتنفيذ لأصحاب البيانات.',
        tags: ['gdpr', 'cross_border', 'scc', 'data_transfer'],
      },
    ];

    for (const node of defaultNodes) {
      this.nodes.set(node.id, node);
    }

    // 2. Edges
    const defaultEdges: KnowledgeEdge[] = [
      {
        id: 'edge_01',
        sourceId: 'node_sa_civil_tx_law',
        targetId: 'node_sa_art178_liquidated_damages',
        type: 'DERIVES_FROM',
        weight: 1.0,
        descriptionEn: 'Article 178 is a statutory sub-component of Civil Transactions Law.',
        descriptionAr: 'المادة 178 مكون نظامي تنفيذي ضمن نظام المعاملات المدنية.',
      },
      {
        id: 'edge_02',
        sourceId: 'node_sa_art178_liquidated_damages',
        targetId: 'node_sa_commercial_court_prec_01',
        type: 'CROSS_REFERENCES',
        weight: 0.9,
        descriptionEn: 'Judicial precedent applying Article 178 principles to commercial liability clauses.',
        descriptionAr: 'سابقة قضائية تطبق مبادئ المادة 178 على بنود المسؤولية التجارية.',
      },
      {
        id: 'edge_03',
        sourceId: 'node_sa_pdpl_law',
        targetId: 'node_eu_gdpr_art46',
        type: 'CROSS_REFERENCES',
        weight: 0.8,
        descriptionEn: 'Comparative cross-border adequacy harmonization between Saudi PDPL and EU GDPR.',
        descriptionAr: 'توافق مقارن لمعايير نقل البيانات بين نظام حماية البيانات السعودي ولائحة GDPR الأوروبية.',
      },
    ];

    for (const edge of defaultEdges) {
      this.edges.set(edge.id, edge);
    }
  }

  /**
   * Traverse graph from a starting root node
   */
  public traverseNode(nodeId: string, maxDepth = 2): GraphTraversalResult | null {
    const rootNode = this.nodes.get(nodeId);
    if (!rootNode) return null;

    const visitedNodeIds = new Set<string>([nodeId]);
    const connectedEdges: KnowledgeEdge[] = [];
    const connectedNodes: KnowledgeNode[] = [];

    const queue: Array<{ id: string; currentDepth: number }> = [{ id: nodeId, currentDepth: 0 }];

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!;
      if (currentDepth >= maxDepth) continue;

      for (const edge of this.edges.values()) {
        let neighborId: string | null = null;
        if (edge.sourceId === id) neighborId = edge.targetId;
        else if (edge.targetId === id) neighborId = edge.sourceId;

        if (neighborId && !visitedNodeIds.has(neighborId)) {
          visitedNodeIds.add(neighborId);
          connectedEdges.push(edge);
          const neighborNode = this.nodes.get(neighborId);
          if (neighborNode) {
            connectedNodes.push(neighborNode);
            queue.push({ id: neighborId, currentDepth: currentDepth + 1 });
          }
        }
      }
    }

    return {
      rootNode,
      connectedNodes,
      edges: connectedEdges,
      depth: maxDepth,
    };
  }

  /**
   * Search nodes by query, jurisdiction, or tag
   */
  public searchNodes(params: {
    query?: string;
    jurisdiction?: JurisdictionCode;
    type?: KnowledgeNodeType;
  }): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter(node => {
      if (params.jurisdiction && node.jurisdiction !== params.jurisdiction && params.jurisdiction !== 'INTL') {
        return false;
      }
      if (params.type && node.type !== params.type) {
        return false;
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchTitle = node.titleEn.toLowerCase().includes(q) || node.titleAr.includes(q);
        const matchSummary = node.summaryEn.toLowerCase().includes(q) || node.summaryAr.includes(q);
        const matchTags = node.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchSummary || matchTags;
      }
      return true;
    });
  }

  public listAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  public listAllEdges(): KnowledgeEdge[] {
    return Array.from(this.edges.values());
  }

  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }
}

export const legalKnowledgeGraph = LegalKnowledgeGraph.getInstance();
