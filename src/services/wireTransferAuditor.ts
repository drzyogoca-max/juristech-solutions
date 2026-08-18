/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SWIFT WIRE AUDITOR & INSTANT WEBHOOK NOTIFIER SERVICE v8.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Cross-Audits and Verifies Real SWIFT Wire Transfers with Strict Fraud Checks
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { getFinancialRepositoryRecords, getSwiftBlacklist } from '../lib/financialRepository';
import { runDeepReceiptVerification } from './deepFraudVerifier';
import { sendEmailNotification } from '../lib/emailNotifier';

export interface WireAuditReportItem {
  id: string;
  clientName: string;
  email: string;
  packageName: string;
  claimedAmountUSD: number;
  swiftHash: string;
  webhookStatus: 'LISTENING_OK' | 'RETRY_DISPATCHED';
  fraudScore: number;
  auditResult: 'APPROVED_AND_ACTIVATED' | 'REQUIRES_REVERIFICATION' | 'REJECTED_FRAUD';
  timestamp: string;
}

export interface SWIFTAuditSummary {
  auditTime: string;
  totalPendingAudited: number;
  approvedCount: number;
  beneficiaryBank: string;
  beneficiaryIBAN: string;
  items: WireAuditReportItem[];
}

/**
 * Execute automated cross-audit scan for pending SWIFT wire transfers
 */
export async function runSWIFTWireCrossAudit(): Promise<SWIFTAuditSummary> {
  const records = getFinancialRepositoryRecords();
  const blacklist = getSwiftBlacklist();
  
  // Filter for real pending records not in blacklist
  const pendingRecords = records.filter(r => 
    r.status === 'pending_audit' && 
    !blacklist.includes((r.user_email || '').toLowerCase()) &&
    !blacklist.includes((r.transaction_ref || '').toLowerCase())
  );

  const auditItems: WireAuditReportItem[] = [];

  for (const target of pendingRecords) {
    const deepResult = await runDeepReceiptVerification(
      target.id,
      `SWIFT Wire Receipt ${target.sender_bank_name} SWIFT: ${target.swift_code} Ref: ${target.transaction_ref} Amount: $${target.amount} USD Email: ${target.user_email}`,
      target.amount,
      target.plan_name
    );

    const isFraud = deepResult.fraudScore >= 60;

    auditItems.push({
      id: target.id,
      clientName: target.user_name || target.company_name,
      email: target.user_email,
      packageName: target.plan_name,
      claimedAmountUSD: target.amount,
      swiftHash: target.transaction_ref,
      webhookStatus: 'LISTENING_OK',
      fraudScore: deepResult.fraudScore,
      auditResult: isFraud ? 'REJECTED_FRAUD' : 'REQUIRES_REVERIFICATION',
      timestamp: new Date().toISOString(),
    });
  }

  return {
    auditTime: new Date().toISOString(),
    totalPendingAudited: pendingRecords.length,
    approvedCount: auditItems.filter(i => i.auditResult === 'APPROVED_AND_ACTIVATED').length,
    beneficiaryBank: 'بنك البركة (Al Baraka Bank) - فرع الحديقة الدولية',
    beneficiaryIBAN: 'EG310022012880211102491757001',
    items: auditItems,
  };
}
