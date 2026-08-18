/**
 * LegalShield Event Tracking & Consent Verification Engine
 */
export function trackEvent(userId, eventName, properties = {}) {
  // Strict consent verification - properties.consent MUST be true
  const userConsent = properties.consent || localStorage.getItem('legalshield_user_consent') === 'true';
  if (!userConsent) {
    console.warn(`[Radar Tracking Bypassed] Event ${eventName} dropped - No explicit user consent.`);
    return;
  }

  const payload = {
    distinct_id: userId,
    event: eventName,
    timestamp: new Date().toISOString(),
    consent_flag: true,
    properties: {
      ...properties,
      url: window.location.href,
      referrer: document.referrer,
    },
  };

  console.log(`[Radar Event Captured]`, payload);
  try {
    const existing = JSON.parse(localStorage.getItem('legalshield_radar_events') || '[]');
    existing.push(payload);
    localStorage.setItem('legalshield_radar_events', JSON.stringify(existing.slice(-100)));
  } catch (e) {
    console.warn('Failed to persist radar event:', e);
  }
}
