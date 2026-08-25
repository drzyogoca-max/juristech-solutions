/**
 * src/ai/memory/userContext.ts
 * JurisTech Solutions — User Preference Context
 * Specification: JURISTECH-AI-P0 Phase P0-4
 * Stores non-sensitive user preferences only (lang, jurisdiction preference).
 * Permissions come from useSubscription() / useAuth() — NOT from here.
 */

import type { JurisdictionCode, LegalDomain, SupportedAILang } from '../types';

export interface UserAIPreferences {
  preferredLang: SupportedAILang;
  preferredJurisdiction: JurisdictionCode;
  preferredDomain: LegalDomain;
  lastQueryAt: string;
}

const PREF_KEY = 'juristech_ai_preferences';

export function getUserPreferences(): UserAIPreferences {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(PREF_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    preferredLang: 'en',
    preferredJurisdiction: 'UNKNOWN',
    preferredDomain: 'general',
    lastQueryAt: '',
  };
}

export function setUserPreferences(prefs: Partial<UserAIPreferences>): void {
  try {
    if (typeof window === 'undefined') return;
    const current = getUserPreferences();
    const updated = { ...current, ...prefs, lastQueryAt: new Date().toISOString() };
    window.sessionStorage.setItem(PREF_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function clearUserPreferences(): void {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(PREF_KEY);
  } catch { /* ignore */ }
}
