/**
 * featureFlags.ts
 * JurisTech Solutions - Safe Feature Flags & Runtime Performance Governance
 * Rule: Freeze / Move / Optimize - NEVER delete business functionality.
 */

export const FEATURE_FLAGS = {
  // Client Background Execution:
  // Set to false to prevent visitor browsers from executing heavy background engines (moved to backend cron)
  ENABLE_CLIENT_BACKGROUND_ENGINES: false,

  // Outreach & Ad loop in visitor browser (moved to /api/cron/):
  ENABLE_CLIENT_OUTREACH_AUTOPILOT: false,
  ENABLE_CLIENT_AD_CAMPAIGN_LOOP: false,

  // GeoIP Unified Single-Lookup Caching (Consolidates 4 external calls into 1 session cache):
  ENABLE_UNIFIED_GEO_CACHE: true,

  // Lazy Modal Mounting:
  ENABLE_LAZY_MODALS: true,
};
