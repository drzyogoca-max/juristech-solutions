/**
 * analyticsConnector.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Real Analytics & Conversion Event Dispatcher
 * Dispatches live browser events to GA4 gtag and prepares server-side API connectors.
 */

export interface ConversionEvent {
  eventName: 'pricing_viewed' | 'checkout_started' | 'purchase_completed' | 'signup_completed' | 'enterprise_inquiry_sent';
  planId?: string;
  amountUSD?: number;
  currency?: string;
  userRole?: string;
  metadata?: Record<string, unknown>;
}

export class AnalyticsConnector {
  private static instance: AnalyticsConnector;
  private gaMeasurementId = 'G-311560459';

  private constructor() {}

  public static getInstance(): AnalyticsConnector {
    if (!AnalyticsConnector.instance) {
      AnalyticsConnector.instance = new AnalyticsConnector();
    }
    return AnalyticsConnector.instance;
  }

  /**
   * 1. Track client-side conversion events to GA4
   */
  public trackEvent(event: ConversionEvent): void {
    if (typeof window === 'undefined') return;

    try {
      // 1. Dispatch to global gtag
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', event.eventName, {
          event_category: 'JurisTech Conversion Funnel',
          plan_id: event.planId,
          value: event.amountUSD || 0,
          currency: event.currency || 'USD',
          ...event.metadata,
        });
      }

      // 2. Log locally for telemetry
      const storageKey = 'juristech_recent_conversion_events';
      const raw = localStorage.getItem(storageKey);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ ...event, timestamp: new Date().toISOString() });
      if (list.length > 50) list.pop();
      localStorage.setItem(storageKey, JSON.stringify(list));

      console.info(`[Analytics Event Tracked] ${event.eventName}`, event);
    } catch (e) {
      console.warn('[Analytics Event Error]', e);
    }
  }

  /**
   * 2. Server-Side GA4 Data API Connector Status
   */
  public getGoogleAnalyticsApiStatus(): { status: 'NOT_CONNECTED' | 'CONNECTED'; message: string } {
    return {
      status: 'NOT_CONNECTED',
      message: 'GA4 tag G-311560459 active on frontend; Google Analytics Data API v1beta service account credentials pending.',
    };
  }

  /**
   * 3. YouTube Analytics API Connector Status
   */
  public getYouTubeAnalyticsApiStatus(): { status: 'NOT_CONNECTED' | 'CONNECTED'; message: string } {
    return {
      status: 'NOT_CONNECTED',
      message: 'Channel @JurisTechSolutions configured; YouTube Analytics Reporting API OAuth token refresh pending.',
    };
  }
}

export const analyticsConnector = AnalyticsConnector.getInstance();
