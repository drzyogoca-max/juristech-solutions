/**
 * src/integrations/partnerIntegrations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Partner Connectors & Integrations Hub
 * Specification: Task 13.5
 *
 * Connectors:
 *  1. Microsoft 365 & SharePoint Legal Vault
 *  2. SAP S/4HANA Procurement & Vendor Contracts
 *  3. Salesforce CLM & Deal Desk
 *  4. DocuSign & Adobe Sign Webhook Bridge
 *  5. ZATCA Fatoora API Gateway
 *
 * STRICT RULES:
 *  • ADAPTER ONLY architecture
 *  • ZERO core AI modifications
 *  • ZERO financial gateway / payment access
 *  • Mock / Sandbox ping validation
 */

export type ConnectorCategory = 'dms_cloud' | 'erp_procurement' | 'crm_clm' | 'e_signature' | 'gov_tax';

export type ConnectorStatus = 'CONNECTED' | 'DISCONNECTED' | 'PENDING_CONFIG' | 'ERROR';

export interface EnterpriseConnector {
  id: string;
  nameEn: string;
  nameAr: string;
  category: ConnectorCategory;
  descriptionEn: string;
  descriptionAr: string;
  vendor: string;
  status: ConnectorStatus;
  authType: 'OAUTH2' | 'WEBHOOK_SECRET' | 'MTLS_CERTIFICATE' | 'API_KEY';
  lastPingTime?: string;
  latencyMs?: number;
  syncEventsCount: number;
}

export interface OrganizationConnectorConfig {
  organizationId: string;
  connectorId: string;
  enabled: boolean;
  configuredAt: string;
  status: ConnectorStatus;
}

class PartnerIntegrationsManager {
  private static instance: PartnerIntegrationsManager;
  private connectors: Map<string, EnterpriseConnector> = new Map();
  private orgConfigs: Map<string, OrganizationConnectorConfig[]> = new Map();

  private constructor() {
    this.seedConnectors();
  }

  public static getInstance(): PartnerIntegrationsManager {
    if (!PartnerIntegrationsManager.instance) {
      PartnerIntegrationsManager.instance = new PartnerIntegrationsManager();
    }
    return PartnerIntegrationsManager.instance;
  }

  private seedConnectors(): void {
    const defaultConnectors: EnterpriseConnector[] = [
      {
        id: 'conn_m365_sharepoint',
        nameEn: 'Microsoft 365 & SharePoint Legal Vault',
        nameAr: 'خزينة مايكروسوفت 365 وشيربوينت القانونية',
        category: 'dms_cloud',
        descriptionEn: 'Direct integration with SharePoint Online and OneDrive for Business legal document repositories.',
        descriptionAr: 'ربط مباشر مع مستودعات الوثائق القانونية في SharePoint و OneDrive للشركات.',
        vendor: 'Microsoft Corporation',
        status: 'CONNECTED',
        authType: 'OAUTH2',
        lastPingTime: '2026-02-25T15:00:00.000Z',
        latencyMs: 142,
        syncEventsCount: 1240,
      },
      {
        id: 'conn_sap_s4hana',
        nameEn: 'SAP S/4HANA Procurement & Vendor Contracts',
        nameAr: 'منظومة مشتريات وعقود الموردين SAP S/4HANA',
        category: 'erp_procurement',
        descriptionEn: 'Bidirectional sync of vendor Master Service Agreements, Purchase Orders, and risk assessments.',
        descriptionAr: 'مزامنة ثنائية الاتجاه لاتفاقيات الخدمات الرئيسية للموردين وأوامر الشراء وتقييم المخاطر.',
        vendor: 'SAP SE',
        status: 'CONNECTED',
        authType: 'OAUTH2',
        lastPingTime: '2026-02-25T15:05:00.000Z',
        latencyMs: 198,
        syncEventsCount: 840,
      },
      {
        id: 'conn_salesforce_clm',
        nameEn: 'Salesforce CLM & Deal Desk',
        nameAr: 'إدارة دورة حياة العقود والمبيعات Salesforce CLM',
        category: 'crm_clm',
        descriptionEn: 'Automated deal term verification and liability clause extraction for enterprise sales opportunities.',
        descriptionAr: 'التحقق الآلي من شروط الصفقات واستخراج بنود المسؤولية لفرص المبيعات المؤسسية.',
        vendor: 'Salesforce Inc.',
        status: 'CONNECTED',
        authType: 'OAUTH2',
        lastPingTime: '2026-02-25T15:10:00.000Z',
        latencyMs: 165,
        syncEventsCount: 620,
      },
      {
        id: 'conn_docusign_bridge',
        nameEn: 'DocuSign & Adobe Sign Webhook Bridge',
        nameAr: 'جسر التوقيع الإلكتروني DocuSign و Adobe Sign',
        category: 'e_signature',
        descriptionEn: 'Cryptographic envelope status listeners and post-signature audit log synchronization.',
        descriptionAr: 'مستمعات إشعارات التوقيع الإلكتروني ومزامنة سجلات التدقيق بعد اكتمال التواقيع.',
        vendor: 'DocuSign Inc.',
        status: 'CONNECTED',
        authType: 'WEBHOOK_SECRET',
        lastPingTime: '2026-02-25T15:15:00.000Z',
        latencyMs: 88,
        syncEventsCount: 2310,
      },
      {
        id: 'conn_zatca_fatoora',
        nameEn: 'ZATCA Fatoora API Gateway',
        nameAr: 'بوابة الربط مع منصة فاتورة (هيئة الزكاة والضريبة)',
        category: 'gov_tax',
        descriptionEn: 'Official integration bridge for cryptographic clearance and reporting of Phase 2 tax invoices.',
        descriptionAr: 'جسر الربط الرسمي للاعتماد والتدقيق المشفر لفواتير المرحلة الثانية مع هيئة الزكاة والضريبة.',
        vendor: 'ZATCA Government of Saudi Arabia',
        status: 'CONNECTED',
        authType: 'MTLS_CERTIFICATE',
        lastPingTime: '2026-02-25T15:20:00.000Z',
        latencyMs: 110,
        syncEventsCount: 5400,
      },
    ];

    for (const c of defaultConnectors) {
      this.connectors.set(c.id, c);
    }
  }

  /**
   * List all enterprise connectors
   */
  public listConnectors(): EnterpriseConnector[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Get connector by ID
   */
  public getConnector(id: string): EnterpriseConnector | null {
    return this.connectors.get(id) || null;
  }

  /**
   * Ping / Test Connector health
   */
  public testConnection(id: string): {
    success: boolean;
    latencyMs: number;
    timestamp: string;
    message: string;
  } {
    const conn = this.connectors.get(id);
    if (!conn) {
      return { success: false, latencyMs: 0, timestamp: new Date().toISOString(), message: 'Connector not found' };
    }

    const latencyMs = Math.floor(Math.random() * 80) + 70; // 70-150ms
    conn.lastPingTime = new Date().toISOString();
    conn.latencyMs = latencyMs;
    conn.status = 'CONNECTED';
    this.connectors.set(id, conn);

    return {
      success: true,
      latencyMs,
      timestamp: conn.lastPingTime,
      message: `Connector '${conn.nameEn}' responded successfully (HTTP 200 OK).`,
    };
  }

  /**
   * Toggle connector status for an organization
   */
  public toggleConnector(organizationId: string, connectorId: string, enabled: boolean): boolean {
    const list = this.orgConfigs.get(organizationId) || [];
    let record = list.find(r => r.connectorId === connectorId);

    if (!record) {
      record = {
        organizationId,
        connectorId,
        enabled,
        configuredAt: new Date().toISOString(),
        status: enabled ? 'CONNECTED' : 'DISCONNECTED',
      };
      list.push(record);
    } else {
      record.enabled = enabled;
      record.status = enabled ? 'CONNECTED' : 'DISCONNECTED';
    }

    this.orgConfigs.set(organizationId, list);
    return true;
  }

  public clear(): void {
    this.connectors.clear();
    this.orgConfigs.clear();
  }
}

export const partnerIntegrationsManager = PartnerIntegrationsManager.getInstance();
