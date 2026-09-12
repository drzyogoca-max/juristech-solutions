/**
 * src/services/customerIdentityService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Customer Identity & Lifecycle Engine
 * Unifies: visitor_id → user_id → crm_contact_id → customer_id → subscription_id
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { supabase } from '../lib/supabaseClient';
import { isAuthorizedAdminEmail, OFFICIAL_ADMIN_EMAILS } from '../lib/adminGuard';

export type CanonicalCustomerStatus =
  | 'ANONYMOUS'
  | 'LEAD'
  | 'REGISTERED_USER'
  | 'TRIAL_USER'
  | 'ACTIVE_CUSTOMER'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'ADMIN';

export interface UnifiedCustomerIdentity {
  visitorId: string;
  userId: string | null;
  crmContactId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  customerStatus: CanonicalCustomerStatus;
  email: string | null;
  fullName: string | null;
  planTier: string | null;
  isReturning: boolean;
}

const VISITOR_ID_STORAGE_KEY = 'ls_unique_visitor_id';
const RETURNING_FLAG_KEY = 'ls_is_returning_visitor';
const CANONICAL_IDENTITY_CACHE = 'juristech_canonical_identity';

export class CustomerIdentityService {
  private static instance: CustomerIdentityService;

  private constructor() {}

  public static getInstance(): CustomerIdentityService {
    if (!CustomerIdentityService.instance) {
      CustomerIdentityService.instance = new CustomerIdentityService();
    }
    return CustomerIdentityService.instance;
  }

  /**
   * Retrieves or generates persistent visitor ID across browser restarts (Cookie + LocalStorage)
   */
  public getOrCreateVisitorId(): { visitorId: string; isReturning: boolean } {
    if (typeof window === 'undefined') {
      return { visitorId: 'vis_server', isReturning: false };
    }

    try {
      let visitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
      const wasReturning = localStorage.getItem(RETURNING_FLAG_KEY) === 'true';

      if (visitorId) {
        localStorage.setItem(RETURNING_FLAG_KEY, 'true');
        return { visitorId, isReturning: true };
      }

      // Generate unique UUID-based visitor identity
      visitorId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
      localStorage.setItem(RETURNING_FLAG_KEY, 'false');

      // Set cookie as secondary fallback persistence
      try {
        document.cookie = `jt_vid=${visitorId};path=/;max-age=31536000;SameSite=Lax`;
      } catch {}

      return { visitorId, isReturning: wasReturning };
    } catch {
      return { visitorId: `vis_${Date.now()}`, isReturning: false };
    }
  }

  /**
   * Evaluates Canonical Customer Status deterministically from all available data sources
   */
  public determineCanonicalStatus(params: {
    email?: string | null;
    user?: any;
    profileRole?: string | null;
    subscriptionStatus?: string | null;
    subscriptionEndDate?: string | null;
    isLead?: boolean;
    createdAt?: string | null;
  }): CanonicalCustomerStatus {
    const cleanEmail = (params.email || params.user?.email || '').toLowerCase().trim();

    // 1. ADMIN check
    if (isAuthorizedAdminEmail(cleanEmail) || params.profileRole === 'admin' || params.profileRole === 'super-admin') {
      return 'ADMIN';
    }

    // 2. Paid / Subscription Active check
    const subStatus = (params.subscriptionStatus || '').toLowerCase();
    if (subStatus === 'active' || subStatus === 'completed' || subStatus === 'success') {
      return 'ACTIVE_CUSTOMER';
    }
    if (subStatus === 'past_due' || subStatus === 'unpaid') {
      return 'PAST_DUE';
    }
    if (subStatus === 'cancelled') {
      return 'CANCELLED';
    }
    if (subStatus === 'expired') {
      return 'EXPIRED';
    }

    // 3. User Registered check
    if (params.user && params.user.id) {
      // Check 14-Day Free Trial window
      const userCreated = params.createdAt || params.user.created_at;
      if (userCreated) {
        const createdTime = new Date(userCreated).getTime();
        const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
        if (Date.now() - createdTime < fourteenDaysMs) {
          return 'TRIAL_USER';
        }
      }
      return 'REGISTERED_USER';
    }

    // 4. Inbound Lead check
    if (params.isLead || cleanEmail) {
      return 'LEAD';
    }

    // 5. Default: Anonymous Visitor
    return 'ANONYMOUS';
  }

  /**
   * Links Visitor ID to Authenticated User ID, CRM contact, and customer records
   * Idempotent Upsert — Prevents creating duplicate records
   */
  public async linkVisitorToUser(params: {
    visitorId: string;
    userId: string;
    email: string;
    fullName?: string;
  }): Promise<UnifiedCustomerIdentity> {
    const cleanEmail = params.email.toLowerCase().trim();
    const cleanName = params.fullName || cleanEmail.split('@')[0] || 'User';

    let crmContactId: string | null = null;
    let customerId: string | null = null;
    let subscriptionId: string | null = null;
    let planTier: string | null = null;
    let activeSubStatus: string | null = null;

    try {
      // 1. Link or Upsert CRM Lead
      const { data: crmData } = await supabase
        .from('crm_leads')
        .upsert({
          contact_email: cleanEmail,
          client_name: cleanName,
          user_id: params.userId,
          visitor_id: params.visitorId,
          status: 'REGISTERED_USER',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'contact_email' })
        .select('id')
        .single();

      if (crmData) crmContactId = crmData.id;
    } catch (e) {
      console.warn('[Identity Link] CRM Lead link notice:', e);
    }

    try {
      // 2. Link or Upsert Customer Record
      const { data: custData } = await supabase
        .from('customers')
        .upsert({
          email: cleanEmail,
          full_name: cleanName,
          user_id: params.userId,
          visitor_id: params.visitorId,
          customer_status: 'REGISTERED_USER',
          verified: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
        .select('id')
        .single();

      if (custData) customerId = custData.id;
    } catch (e) {
      console.warn('[Identity Link] Customer record link notice:', e);
    }

    try {
      // 3. Link existing Subscriptions to user_id if matched by email / customer
      if (customerId) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('id, status, plan_tier')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subData) {
          subscriptionId = subData.id;
          activeSubStatus = subData.status;
          planTier = subData.plan_tier;

          // Attach user_id to subscription if missing
          await supabase
            .from('subscriptions')
            .update({ user_id: params.userId })
            .eq('id', subData.id);
        }
      }
    } catch (e) {
      console.warn('[Identity Link] Subscription link notice:', e);
    }

    // Determine final status
    const status = this.determineCanonicalStatus({
      email: cleanEmail,
      user: { id: params.userId, email: cleanEmail },
      subscriptionStatus: activeSubStatus,
    });

    const identity: UnifiedCustomerIdentity = {
      visitorId: params.visitorId,
      userId: params.userId,
      crmContactId,
      customerId,
      subscriptionId,
      customerStatus: status,
      email: cleanEmail,
      fullName: cleanName,
      planTier,
      isReturning: true,
    };

    try {
      localStorage.setItem(CANONICAL_IDENTITY_CACHE, JSON.stringify(identity));
    } catch {}

    return identity;
  }
}

export const customerIdentityService = CustomerIdentityService.getInstance();
