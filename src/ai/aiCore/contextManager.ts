/**
 * src/ai/aiCore/contextManager.ts
 * JurisTech Solutions — Context Manager
 * Specification: JURISTECH-AI-P0 Phase P0-1
 * Manages active session context, language, jurisdiction, legal domain, and turn counting.
 */

import type { AISessionContext, JurisdictionCode, LegalDomain, SupportedAILang, UserTier } from '../types';
import { detectJurisdictionFromQuery, detectLegalDomain } from '../retrieval/semanticSearch';

const CONTEXT_SESSION_KEY = 'juristech_ai_session_ctx';

export class ContextManager {
  private static instance: ContextManager;

  private constructor() {}

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  public getContext(): AISessionContext {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const raw = sessionStorage.getItem(CONTEXT_SESSION_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch { /* ignore */ }

    const newCtx: AISessionContext = {
      sessionId: `ai_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      lang: 'en',
      detectedJurisdiction: 'UNKNOWN',
      legalDomain: 'general',
      userTier: 'free',
      messageCount: 0,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
    this.saveContext(newCtx);
    return newCtx;
  }

  public updateFromQuery(query: string, lang?: SupportedAILang, userTier?: UserTier): AISessionContext {
    const ctx = this.getContext();
    const detectedJurisdiction = detectJurisdictionFromQuery(query);
    const detectedDomain = detectLegalDomain(query);

    ctx.lang = lang || (typeof window !== 'undefined' ? (localStorage.getItem('juristech.locale') as SupportedAILang) || 'en' : 'en');
    if (detectedJurisdiction !== 'UNKNOWN') {
      ctx.detectedJurisdiction = detectedJurisdiction;
    }
    if (detectedDomain !== 'general') {
      ctx.legalDomain = detectedDomain;
    }
    if (userTier) {
      ctx.userTier = userTier;
    }
    ctx.messageCount += 1;
    ctx.lastUpdatedAt = new Date().toISOString();

    this.saveContext(ctx);
    return ctx;
  }

  public resetContext(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CONTEXT_SESSION_KEY);
      }
    } catch { /* ignore */ }
  }

  public clear(): void {
    this.resetContext();
  }

  private saveContext(ctx: AISessionContext): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CONTEXT_SESSION_KEY, JSON.stringify(ctx));
      }
    } catch { /* ignore */ }
  }
}

export const contextManager = ContextManager.getInstance();
