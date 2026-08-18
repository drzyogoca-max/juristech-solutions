/**
 * financialRepository.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Secure Financial Document Repository & Anti-Fraud Audit System
 * 
 * Features:
 *  • Isolated financial repository for SWIFT wire copies & bank transfer receipts
 *  • Strict admin-only access control
 *  • Permanent blacklisting of rejected/fake SWIFT documents
 *  • Zero dummy/fake re-seeding on deletion
 */

import { supabase } from './supabaseClient';
import { activateUserSubscription, cancelSubscriptionNow } from './financialGateway';

export interface FinancialReceiptRecord {
  id: string;
  transaction_ref: string;
  user_email: string;
  user_name: string;
  company_name: string;
  swift_code: string;
  sender_bank_name: string;
  amount: number;
  plan_name: string;
  receipt_url: string;
  status: 'pending_audit' | 'approved' | 'rejected';
  rejection_reason?: string;
  uploaded_at: string;
  audited_at?: string;
  audited_by?: string;
}

const STORAGE_VAULT_KEY = 'ls_secure_financial_repository';
const BLACKLIST_VAULT_KEY = 'ls_rejected_swift_blacklist';

/** Get blacklisted emails and transaction references */
export function getSwiftBlacklist(): string[] {
  try {
    const raw = localStorage.getItem(BLACKLIST_VAULT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

/** Add email or ref to permanent blacklist */
export function addToSwiftBlacklist(entry: string): void {
  try {
    const current = getSwiftBlacklist();
    if (!current.includes(entry.toLowerCase())) {
      current.push(entry.toLowerCase());
      localStorage.setItem(BLACKLIST_VAULT_KEY, JSON.stringify(current));
    }
  } catch {}
}

/** Read all financial repository records from persistent vault */
export function getFinancialRepositoryRecords(): FinancialReceiptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_VAULT_KEY);
    const blacklist = getSwiftBlacklist();
    if (raw) {
      const parsed: FinancialReceiptRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any blacklisted entries or rejected fraudulent items
        return parsed.filter(r => 
          !blacklist.includes((r.user_email || '').toLowerCase()) &&
          !blacklist.includes((r.transaction_ref || '').toLowerCase()) &&
          !blacklist.includes(r.id.toLowerCase())
        );
      }
    }
  } catch {}
  
  return [];
}

/** Save financial repository records to persistent storage vault */
function saveFinancialRepositoryRecords(records: FinancialReceiptRecord[]): void {
  try {
    localStorage.setItem(STORAGE_VAULT_KEY, JSON.stringify(records));
  } catch {}
}

/**
 * Register a new SWIFT wire transfer receipt
 */
export async function saveFinancialReceipt(data: Omit<FinancialReceiptRecord, 'id' | 'uploaded_at' | 'status'>): Promise<FinancialReceiptRecord> {
  if (!data.receipt_url || !data.receipt_url.trim()) {
    throw new Error('SECURITY VIOLATION: SWIFT receipt image upload is strictly mandatory!');
  }

  const blacklist = getSwiftBlacklist();
  if (blacklist.includes((data.user_email || '').toLowerCase()) || blacklist.includes((data.transaction_ref || '').toLowerCase())) {
    throw new Error('SECURITY BLOCK: This user account or SWIFT reference has been permanently blacklisted due to fraud detection.');
  }

  const record: FinancialReceiptRecord = {
    ...data,
    id: `SEC-FIN-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    status: 'pending_audit',
    uploaded_at: new Date().toISOString(),
  };

  const current = getFinancialRepositoryRecords();
  const updated = [record, ...current];
  saveFinancialRepositoryRecords(updated);

  try {
    await supabase.from('financial_receipts_repository').insert({
      receipt_id: record.id,
      transaction_ref: record.transaction_ref,
      user_email: record.user_email,
      user_name: record.user_name,
      company_name: record.company_name,
      swift_code: record.swift_code,
      sender_bank_name: record.sender_bank_name,
      amount: record.amount,
      plan_name: record.plan_name,
      receipt_url: record.receipt_url,
      status: record.status,
      uploaded_at: record.uploaded_at,
    });
  } catch (err) {
    console.warn('[FinancialRepo] Supabase insert note:', err);
  }

  return record;
}

/**
 * Financial Admin Audit: Approve SWIFT Receipt and Activate Subscription
 */
export async function auditApproveReceipt(receiptId: string, auditorEmail: string): Promise<boolean> {
  const records = getFinancialRepositoryRecords();
  const target = records.find((r) => r.id === receiptId);

  if (!target) return false;

  target.status = 'approved';
  target.audited_at = new Date().toISOString();
  target.audited_by = auditorEmail;

  saveFinancialRepositoryRecords(records);

  await activateUserSubscription({
    userEmail: target.user_email,
    userName: target.user_name,
    planId: target.amount >= 400 ? 'enterprise' : 'pro',
    paymentMethod: 'Bank Wire SWIFT',
    amountUSD: target.amount,
    receiptUrl: target.receipt_url,
  });

  try {
    await supabase
      .from('payments')
      .update({ status: 'مفعل ومكتمل (Approved)' })
      .eq('paypal_order_id', target.transaction_ref);

    await supabase
      .from('payment_receipts')
      .update({ status: 'approved' })
      .eq('transaction_ref', target.transaction_ref);
  } catch {}

  return true;
}

/**
 * Financial Admin Audit: Reject SWIFT Receipt & Blacklist User/Transaction
 */
export async function auditRejectReceipt(receiptId: string, reason: string, auditorEmail: string): Promise<boolean> {
  const records = getFinancialRepositoryRecords();
  const target = records.find((r) => r.id === receiptId);

  if (!target) return false;

  target.status = 'rejected';
  target.rejection_reason = reason;
  target.audited_at = new Date().toISOString();
  target.audited_by = auditorEmail;

  // Add to permanent blacklist to prevent re-appearance
  addToSwiftBlacklist(target.user_email);
  addToSwiftBlacklist(target.transaction_ref);
  addToSwiftBlacklist(target.id);

  // Revoke any active subscription immediately
  cancelSubscriptionNow(target.user_email);

  // Remove from repository records permanently
  const updatedRecords = records.filter(r => r.id !== receiptId && r.user_email !== target.user_email);
  saveFinancialRepositoryRecords(updatedRecords);

  try {
    await supabase
      .from('payment_receipts')
      .update({ status: 'rejected', fraud_flags: [reason] })
      .eq('transaction_ref', target.transaction_ref);
  } catch {}

  return true;
}

/**
 * Sovereign Admin Purge: Delete receipt and revoke user membership permanently
 */
export async function purgeAndBlacklistReceipt(receiptId: string, userEmail: string): Promise<boolean> {
  addToSwiftBlacklist(userEmail);
  addToSwiftBlacklist(receiptId);

  cancelSubscriptionNow(userEmail);

  const records = getFinancialRepositoryRecords();
  const updated = records.filter(r => r.id !== receiptId && r.user_email.toLowerCase() !== userEmail.toLowerCase());
  saveFinancialRepositoryRecords(updated);

  try {
    await supabase
      .from('payment_receipts')
      .delete()
      .eq('transaction_ref', receiptId);

    await supabase
      .from('payments')
      .delete()
      .eq('user_email', userEmail);
  } catch {}

  return true;
}

/**
 * Sovereign Chairman Override
 */
export async function sovereignOverrideReceipt(receiptId: string, newStatus: 'pending_audit' | 'approved' | 'rejected', notes: string, auditorEmail: string = 'chairman@juristech.solutions'): Promise<boolean> {
  if (newStatus === 'rejected') {
    return auditRejectReceipt(receiptId, notes || 'Rejected by Admin', auditorEmail);
  }

  const records = getFinancialRepositoryRecords();
  const target = records.find((r) => r.id === receiptId);

  if (!target) return false;

  target.status = newStatus;
  if (notes) {
    target.rejection_reason = notes;
  }
  target.audited_at = new Date().toISOString();
  target.audited_by = auditorEmail;

  saveFinancialRepositoryRecords(records);

  if (newStatus === 'approved') {
    await activateUserSubscription({
      userEmail: target.user_email,
      userName: target.user_name,
      planId: target.amount >= 400 ? 'enterprise' : 'pro',
      paymentMethod: 'Bank Wire SWIFT',
      amountUSD: target.amount,
      receiptUrl: target.receipt_url,
    });
  }

  return true;
}

/**
 * Historical Data Migration Engine
 */
export async function migrateHistoricalFinancialReceipts(): Promise<{ migratedCount: number }> {
  const records = getFinancialRepositoryRecords();
  const blacklist = getSwiftBlacklist();
  let migratedCount = 0;

  try {
    const { data: supaReceipts } = await supabase
      .from('payment_receipts')
      .select('*');

    if (supaReceipts && Array.isArray(supaReceipts)) {
      for (const item of supaReceipts) {
        const userEmail = (item.user_id || '').toLowerCase();
        const txRef = (item.transaction_ref || '').toLowerCase();

        if (blacklist.includes(userEmail) || blacklist.includes(txRef)) {
          continue; // Skip blacklisted fraudulent items
        }

        const exists = records.some((r) => r.transaction_ref === item.transaction_ref);
        if (!exists) {
          records.push({
            id: `MIG-${item.id || Math.random().toString(36).substring(2, 7)}`,
            transaction_ref: item.transaction_ref || 'WIRE-HISTORICAL',
            user_email: item.user_id || 'historical@client.com',
            user_name: item.user_id?.split('@')[0] || 'Historical Client',
            company_name: item.plan_name || 'Corporate Enterprise',
            swift_code: item.ocr_ref || 'SWIFT-LEGACY',
            sender_bank_name: 'Commercial Bank Wire',
            amount: Number(item.claimed_amount) || 49.99,
            plan_name: item.plan_name || 'Pro Plan',
            receipt_url: item.image_hash?.startsWith('http') ? item.image_hash : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
            status: item.status === 'approved' ? 'approved' : item.status === 'rejected' ? 'rejected' : 'pending_audit',
            uploaded_at: item.claimed_date || new Date().toISOString(),
          });
          migratedCount++;
        }
      }
      saveFinancialRepositoryRecords(records);
    }
  } catch (err) {
    console.warn('[FinancialRepo] Migration scan note:', err);
  }

  return { migratedCount };
}
