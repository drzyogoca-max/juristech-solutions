/**
 * src/lib/security/enterpriseEngine.ts & /lib/security/enterprise-engine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-Tenant RBAC Security & High-Intent Closed-Loop Lead Pipeline Engine
 */

declare const process: any;

export const ENTERPRISE_ROLES: Record<string, string[]> = {
  CEO: ['read', 'write', 'sign_contracts', 'approve_budget'],
  CFO: ['read_financial_risks', 'approve_payments', 'view_audit_ledger'],
  LEGAL_COUNSEL: ['read', 'write', 'edit_clauses', 'cross_border_audit'],
  PROCUREMENT: ['read_contracts', 'submit_drafts']
};

export function verifyEnterprisePermission(userRole: string, requiredAction: string): boolean {
  const allowedActions = ENTERPRISE_ROLES[userRole] || [];
  return allowedActions.includes(requiredAction);
}

export interface LeadDataPayload {
  companyName?: string;
  intentScore: number;
  sector?: string;
  contactEmail?: string;
}

export async function triggerHighIntentLeadPipeline(leadData: LeadDataPayload): Promise<void> {
  const webhookUrl = (typeof process !== 'undefined' && process.env) 
    ? (process.env.CRM_WEBHOOK_URL || process.env.ADMIN_ALERT_WEBHOOK)
    : (import.meta as any).env?.VITE_CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[High-Intent Lead Router]: High intent lead logged internally ->", leadData);
    return;
  }

  const payload = {
    content: `🚨 [صيد مؤسسي فاخر - HIGH INTENT B2B LEAD]`,
    embeds: [{
      title: `شركة مستهدفة: ${leadData.companyName || 'منشأة تجارية'}`,
      description: `مؤشر الاهتمام (Intent Score): **${leadData.intentScore}/100**\nالقطاع: ${leadData.sector || 'قانوني/مالي'}\nالحالة: جاهز لإغلاق صفقة الاشتراك السيادي.`,
      color: 0xD4AF37, // Sovereign Gold Color
      timestamp: new Date().toISOString()
    }]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error("Lead pipeline dispatch error:", err));
}

export default {
  ENTERPRISE_ROLES,
  verifyEnterprisePermission,
  triggerHighIntentLeadPipeline
};
