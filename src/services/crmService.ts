/**
 * crmService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Event-Driven CRM & Full Autonomous Lead Engine v17.0
 * Marketing & Corporate Client Management with Zero-Human Auto-Dispatch & Audit Log
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { triggerAutomatedB2BOutreach } from './outreachEngine';

export interface CrmClientLead {
  id: string;
  clientName: string;
  companyName: string;
  contactEmail: string;
  jurisdiction: string;
  flag: string;
  status: 'Warm' | 'Cold' | 'Negotiating' | 'Closed' | 'Converted';
  lastContactDate: string;
  estimatedValueUSD: number;
  leadScore: number;
  notesAr: string;
  notesEn: string;
  lastActivityAr?: string;
  lastActivityEn?: string;
  dispatchedAt?: string;
  generatedProposalText?: string;
}

export interface CrmAuditLogEntry {
  id: string;
  timestamp: string;
  clientName: string;
  contactEmail: string;
  jurisdiction: string;
  actionType: 'AUTO_ANALYSIS' | 'AUTO_GENERATION' | 'AUTO_DISPATCH' | 'MANUAL_DISPATCH';
  aiModel: string;
  proposalSummary: string;
  status: 'SUCCESS' | 'QUEUED';
}

export const DAILY_CRM_DISPATCH_LIMIT = 25;

const CRM_STORAGE_KEY = 'juristech_crm_clients_v3';
const CRM_ARCHIVE_STORAGE_KEY = 'juristech_crm_archived_dispatched_v3';
const CRM_AUDIT_LOG_STORAGE_KEY = 'juristech_crm_audit_logs_v1';
const CRM_AUTO_MODE_STORAGE_KEY = 'juristech_crm_auto_mode_v1';
const CRM_DAILY_QUOTA_STORAGE_KEY = 'juristech_crm_daily_quota_v2';

export const INITIAL_CRM_LEADS: CrmClientLead[] = [
  {
    id: 'crm-lead-01',
    clientName: 'James Carter',
    companyName: 'Global Investments Ltd.',
    contactEmail: 'j.carter@globalinvestments.com',
    jurisdiction: 'USA',
    flag: '🇺🇸',
    status: 'Warm',
    lastContactDate: '2026-08-15',
    estimatedValueUSD: 45000,
    leadScore: 92,
    notesAr: 'مهتم باتفاقيات Delaware LLC وشروط SAFE والاستثمار المؤسسي',
    notesEn: 'Interested in Delaware LLC agreements, SAFE instruments & VC legal audit',
    lastActivityAr: 'جاهز للإرسال التنفيذي المباشر للرئيس التنفيذي والمدير المالي',
    lastActivityEn: 'Prepared for direct CEO & CFO executive outreach',
  },
  {
    id: 'crm-lead-02',
    clientName: 'Sarah Al-Fayed',
    companyName: 'Al-Fayed Legal Advisors',
    contactEmail: 'sarah@alfayedlaw.ae',
    jurisdiction: 'UAE',
    flag: '🇦🇪',
    status: 'Warm',
    lastContactDate: '2026-08-14',
    estimatedValueUSD: 25000,
    leadScore: 88,
    notesAr: 'مكتب استشارات قانونية في دبي يرغب في اشتراك مؤسسي لرادار المخاطر ومكتبة العقود',
    notesEn: 'Dubai legal advisory seeking enterprise subscription for AI Risk Radar & Contract Vault',
    lastActivityAr: 'استفسرت عن اشتراك محاكم دبي DIAC للباقة المؤسسية',
    lastActivityEn: 'Inquired about DIAC arbitration clauses for enterprise tier',
  },
  {
    id: 'crm-lead-03',
    clientName: 'Chen Wei',
    companyName: 'SinoTech Holdings Group',
    contactEmail: 'wei.chen@sino-tech.cn',
    jurisdiction: 'China',
    flag: '🇨🇳',
    status: 'Negotiating',
    lastContactDate: '2026-08-13',
    estimatedValueUSD: 85000,
    leadScore: 95,
    notesAr: 'مفاوضات نهائية لعقد توريد دولي وتدقيق حوكمة الشحن وفق اتفاقية CISG',
    notesEn: 'Final negotiations for international supply chain & M&A governance under CISG',
    lastActivityAr: 'تم طلب مسودة عقد الشحن الدولي وفق اتفاقية البيع الدولي',
    lastActivityEn: 'Requested CISG international shipping contract draft',
  }
];

class CrmService {
  private leads: CrmClientLead[];
  private archivedLeads: CrmClientLead[];
  private auditLogs: CrmAuditLogEntry[];
  private isAutoMode: boolean = true;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.leads = this.loadLeads();
    this.archivedLeads = this.loadArchivedLeads();
    this.auditLogs = this.loadAuditLogs();
    this.isAutoMode = this.loadAutoMode();
    this.startAutonomousLeadWorker();
  }

  private getTodayDateKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  public getDailyQuotaStats(): { limit: number; usedToday: number; remainingToday: number; date: string } {
    try {
      const stored = localStorage.getItem(CRM_DAILY_QUOTA_STORAGE_KEY);
      const today = this.getTodayDateKey();
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          const used = Math.min(parsed.count || 0, DAILY_CRM_DISPATCH_LIMIT);
          return {
            limit: DAILY_CRM_DISPATCH_LIMIT,
            usedToday: used,
            remainingToday: Math.max(0, DAILY_CRM_DISPATCH_LIMIT - used),
            date: today,
          };
        }
      }
    } catch {}

    return {
      limit: DAILY_CRM_DISPATCH_LIMIT,
      usedToday: 0,
      remainingToday: DAILY_CRM_DISPATCH_LIMIT,
      date: this.getTodayDateKey(),
    };
  }

  private incrementDailyQuota(): boolean {
    const today = this.getTodayDateKey();
    const stats = this.getDailyQuotaStats();
    if (stats.usedToday >= stats.limit) {
      return false; // Quota limit strictly enforced!
    }

    try {
      localStorage.setItem(
        CRM_DAILY_QUOTA_STORAGE_KEY,
        JSON.stringify({ date: today, count: stats.usedToday + 1 })
      );
    } catch {}
    return true;
  }

  private loadLeads(): CrmClientLead[] {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_CRM_LEADS;
  }

  private loadArchivedLeads(): CrmClientLead[] {
    try {
      const stored = localStorage.getItem(CRM_ARCHIVE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  private loadAuditLogs(): CrmAuditLogEntry[] {
    try {
      const stored = localStorage.getItem(CRM_AUDIT_LOG_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'audit-01',
        timestamp: new Date().toISOString(),
        clientName: 'Executive Outreach Dispatcher',
        contactEmail: 'ceo-cfo@enterprise.com',
        jurisdiction: 'Global',
        actionType: 'AUTO_DISPATCH',
        aiModel: 'JurisTech Executive C-Suite Model',
        proposalSummary: 'Strict Rate-Limiter Active (Max 25 Proposals/Day) with English Executive CEO/CFO Template',
        status: 'SUCCESS',
      }
    ];
  }

  private loadAutoMode(): boolean {
    try {
      const stored = localStorage.getItem(CRM_AUTO_MODE_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {}
    return true;
  }

  private saveLeads() {
    try {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(this.leads));
      localStorage.setItem(CRM_ARCHIVE_STORAGE_KEY, JSON.stringify(this.archivedLeads));
      localStorage.setItem(CRM_AUDIT_LOG_STORAGE_KEY, JSON.stringify(this.auditLogs));
      localStorage.setItem(CRM_AUTO_MODE_STORAGE_KEY, String(this.isAutoMode));
      this.notifyListeners();
    } catch {}
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public getLeads(): CrmClientLead[] {
    return this.leads;
  }

  public getArchivedLeads(): CrmClientLead[] {
    return this.archivedLeads;
  }

  public getAuditLogs(): CrmAuditLogEntry[] {
    return this.auditLogs;
  }

  public isAutonomousMode(): boolean {
    return this.isAutoMode;
  }

  public toggleAutonomousMode(enabled: boolean) {
    this.isAutoMode = enabled;
    this.saveLeads();
  }

  /**
   * STRICT RATE-LIMITED AUTONOMOUS QUEUE WORKER
   * Respects DAILY_CRM_DISPATCH_LIMIT (25/day max)
   */
  private startAutonomousLeadWorker() {
    if (typeof window === 'undefined') return;

    // Checks queue every 60 seconds
    setInterval(async () => {
      if (!this.isAutoMode) return;

      const quota = this.getDailyQuotaStats();
      if (quota.remainingToday <= 0) {
        // Daily quota exhausted — do not dispatch further today
        return;
      }

      // Pick next pending lead
      const pendingLeads = this.leads.filter((l) => l.status !== 'Converted');
      if (pendingLeads.length > 0) {
        const targetLead = pendingLeads[0];
        try {
          await this.executeAutonomousPipeline(targetLead);
        } catch (err) {
          console.warn('[CRM Autonomous Worker] Dispatch notice:', err);
        }
      }
    }, 60000);
  }

  public async executeAutonomousPipeline(lead: CrmClientLead): Promise<boolean> {
    const quota = this.getDailyQuotaStats();
    if (quota.remainingToday <= 0) {
      console.warn(`[CRM Quota Enforcer] 🛑 Daily limit reached (${quota.limit}/${quota.limit}). Queuing for tomorrow.`);
      this.auditLogs.unshift({
        id: `audit-quota-${Date.now()}`,
        timestamp: new Date().toISOString(),
        clientName: lead.clientName,
        contactEmail: lead.contactEmail,
        jurisdiction: lead.jurisdiction,
        actionType: 'AUTO_ANALYSIS',
        aiModel: 'JurisTech Rate Limiter',
        proposalSummary: `⚠️ تم إيقاف الإرسال مؤقتاً لبلوغ الحد اليومي الصارم (${quota.limit}/${quota.limit}) لحماية نطاق المنصة. سيتم الإرسال في الدورة القادمة.`,
        status: 'QUEUED',
      });
      this.saveLeads();
      return false;
    }

    // 1. Log Analysis Phase
    this.auditLogs.unshift({
      id: `audit-analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      clientName: lead.clientName,
      contactEmail: lead.contactEmail,
      jurisdiction: lead.jurisdiction,
      actionType: 'AUTO_ANALYSIS',
      aiModel: 'Google AI Pro / C-Suite Legal Analyzer',
      proposalSummary: `C-Suite Proposal synthesis for ${lead.companyName} (${lead.notesEn || lead.notesAr})`,
      status: 'SUCCESS',
    });

    const notes = lead.notesEn || `Bespoke enterprise partnership proposal & 1M+ contract vault access under ${lead.jurisdiction} jurisdiction.`;
    const success = await this.triggerAiOutreach(lead, notes, true);
    return success;
  }

  public addLead(lead: Omit<CrmClientLead, 'id'>): CrmClientLead {
    const newLead: CrmClientLead = {
      ...lead,
      id: `crm-lead-${Date.now()}`,
      leadScore: lead.leadScore || 85,
    };
    this.leads.unshift(newLead);
    this.saveLeads();

    // Event-Driven Auto-Trigger upon insertion if in Autonomous mode and quota available
    if (this.isAutoMode && this.getDailyQuotaStats().remainingToday > 0) {
      setTimeout(() => {
        this.executeAutonomousPipeline(newLead);
      }, 1000);
    }

    return newLead;
  }

  /**
   * CAPTURE REAL INBOUND LEADS FROM PLATFORM FORMS & BOOKINGS
   */
  public capturePlatformLead(leadData: {
    name: string;
    email: string;
    company?: string;
    notes?: string;
    jurisdiction?: string;
  }): CrmClientLead {
    const isAr = /[\u0600-\u06FF]/.test(leadData.name + ' ' + (leadData.notes || ''));
    return this.addLead({
      clientName: leadData.name,
      companyName: leadData.company || (isAr ? 'منشأة تجارية معتمدة' : 'Enterprise Client'),
      contactEmail: leadData.email,
      jurisdiction: leadData.jurisdiction || (isAr ? 'KSA / GCC' : 'USA / Global'),
      flag: leadData.jurisdiction === 'USA' ? '🇺🇸' : leadData.jurisdiction === 'UAE' ? '🇦🇪' : leadData.jurisdiction === 'EG' ? '🇪🇬' : '⚖️',
      status: 'Warm',
      lastContactDate: new Date().toISOString().split('T')[0],
      estimatedValueUSD: 50000,
      leadScore: 95,
      notesAr: leadData.notes || 'عميل حقيقي مسجل من حركات المنصة وحجز الاستشارات',
      notesEn: leadData.notes || 'Real inbound lead captured from live platform booking & contract auditing',
      lastActivityAr: 'عميل حقيقي تم التقاطه من منصة JurisTech وجاهز للتواصل التنفيذي',
      lastActivityEn: 'Real inbound lead captured from JurisTech portal, queued for executive outreach',
    });
  }

  public updateLeadStatus(id: string, status: CrmClientLead['status']) {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      lead.lastContactDate = new Date().toISOString().split('T')[0];
      lead.lastActivityAr = `تم تحديث حالة العقد إلى (${status}) بواسطة الأدمن`;
      lead.lastActivityEn = `Status updated to (${status}) by Admin`;
      this.saveLeads();
    }
  }

  public deleteLead(id: string) {
    this.leads = this.leads.filter((l) => l.id !== id);
    this.saveLeads();
  }

  /**
   * DISPATCH PROPOSAL, CONSUME QUOTA, AUTO-ARCHIVE & WRITE AUDIT LOG
   */
  public async triggerAiOutreach(lead: CrmClientLead, customNotes?: string, isAutoTriggered: boolean = false): Promise<boolean> {
    const quota = this.getDailyQuotaStats();
    if (quota.remainingToday <= 0) {
      console.warn(`[CRM Quota] 🛑 Daily limit reached (${DAILY_CRM_DISPATCH_LIMIT}/${DAILY_CRM_DISPATCH_LIMIT})`);
      return false;
    }

    const b2bLead = {
      id: lead.id,
      companyName: lead.companyName || lead.clientName,
      contactEmail: lead.contactEmail,
      country: lead.jurisdiction,
      sectorInterest: customNotes || lead.notesEn || 'C-Suite Strategic Legal AI Infrastructure & Financial Risk Mitigation',
      leadScore: 100,
      nativeLanguage: 'en' as const, // Pure corporate English for C-Suite
      status: 'New' as const,
    };

    const success = await triggerAutomatedB2BOutreach(b2bLead);
    if (success) {
      // Consume 1 unit of strict daily quota
      this.incrementDailyQuota();

      const nowIso = new Date().toISOString();
      const dispatchedLead: CrmClientLead = {
        ...lead,
        status: 'Converted',
        dispatchedAt: nowIso,
        lastContactDate: nowIso.split('T')[0],
        lastActivityAr: `🚀 تم إرسال العرض التنفيذي للإدارة العليا (CEO & CFO) بنجاح بتوقيع د. محمد مصطفى!`,
        lastActivityEn: `🚀 C-Suite Executive Proposal successfully dispatched with Dr. Mohammad Mustafa signature!`,
      };

      // 1. Remove from active leads list
      this.leads = this.leads.filter((l) => l.id !== lead.id);

      // 2. Add to archived/dispatched list
      this.archivedLeads.unshift(dispatchedLead);

      // 3. Add to Audit Log
      this.auditLogs.unshift({
        id: `audit-disp-${Date.now()}`,
        timestamp: nowIso,
        clientName: lead.clientName,
        contactEmail: lead.contactEmail,
        jurisdiction: lead.jurisdiction,
        actionType: isAutoTriggered ? 'AUTO_DISPATCH' : 'MANUAL_DISPATCH',
        aiModel: 'JurisTech C-Suite Legal Governance Model',
        proposalSummary: `C-Suite Proposal Dispatched to ${lead.contactEmail} (${lead.companyName}) | Quota Used Today: ${this.getDailyQuotaStats().usedToday}/${DAILY_CRM_DISPATCH_LIMIT}`,
        status: 'SUCCESS',
      });

      this.saveLeads();
    }
    return success;
  }
}

export const crmService = new CrmService();
