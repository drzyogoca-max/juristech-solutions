/**
 * src/ai/memory/sessionMemory.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Turn Session Memory & Deduplication Engine
 * Specification: JURISTECH-AI-P0 Phase P0-2
 *
 * Maintains conversational context, persists detected jurisdiction & legal domain,
 * and prevents repetitive responses across multi-turn user dialogues.
 */

import type {
  AISessionContext,
  JurisdictionCode,
  LegalDomain,
  SupportedAILang,
  UserTier,
} from '../types';

export interface TurnRecord {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citedStatuteIds?: string[];
  summaryKey?: string;
}

export interface StoredSession {
  context: AISessionContext;
  turns: TurnRecord[];
  citedStatutesHistory: Set<string>;
  previousAdviceSummaries: string[];
}

// In-memory store for active sessions
const ACTIVE_SESSIONS = new Map<string, StoredSession>();

/**
 * Creates or retrieves an existing AI session context.
 */
export function getOrCreateSession(
  sessionId: string,
  defaults: {
    lang?: SupportedAILang;
    userTier?: UserTier;
    jurisdiction?: JurisdictionCode;
    domain?: LegalDomain;
  } = {}
): StoredSession {
  const existing = ACTIVE_SESSIONS.get(sessionId);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const context: AISessionContext = {
    sessionId,
    lang: defaults.lang || 'ar',
    detectedJurisdiction: defaults.jurisdiction || 'SA',
    legalDomain: defaults.domain || 'general',
    userTier: defaults.userTier || 'free',
    messageCount: 0,
    createdAt: now,
    lastUpdatedAt: now,
  };

  const newSession: StoredSession = {
    context,
    turns: [],
    citedStatutesHistory: new Set<string>(),
    previousAdviceSummaries: [],
  };

  ACTIVE_SESSIONS.set(sessionId, newSession);
  return newSession;
}

/**
 * Appends a conversation turn and updates session metadata.
 */
export function recordTurn(
  sessionId: string,
  turn: {
    role: 'user' | 'assistant';
    content: string;
    citedStatuteIds?: string[];
    summaryKey?: string;
  },
  contextUpdates?: Partial<AISessionContext>
): void {
  const session = getOrCreateSession(sessionId);
  const now = new Date().toISOString();

  session.turns.push({
    role: turn.role,
    content: turn.content,
    timestamp: now,
    citedStatuteIds: turn.citedStatuteIds,
    summaryKey: turn.summaryKey,
  });

  if (turn.citedStatuteIds) {
    for (const id of turn.citedStatuteIds) {
      session.citedStatutesHistory.add(id);
    }
  }

  if (turn.summaryKey) {
    session.previousAdviceSummaries.push(turn.summaryKey);
    // Keep max 10 summaries
    if (session.previousAdviceSummaries.length > 10) {
      session.previousAdviceSummaries.shift();
    }
  }

  session.context.messageCount = session.turns.length;
  session.context.lastUpdatedAt = now;

  if (contextUpdates) {
    Object.assign(session.context, contextUpdates);
  }

  // Keep max 20 turns in memory to avoid unbounded context growth
  if (session.turns.length > 20) {
    session.turns = session.turns.slice(-20);
  }
}

/**
 * Checks if a proposed advice snippet or rule is a duplicate of something
 * already given in recent turns within the session.
 */
export function isDuplicateAdvice(sessionId: string, snippet: string): boolean {
  const session = ACTIVE_SESSIONS.get(sessionId);
  if (!session || session.previousAdviceSummaries.length === 0) return false;

  const normalized = snippet.toLowerCase().trim();
  return session.previousAdviceSummaries.some(prev => {
    const prevNorm = prev.toLowerCase().trim();
    return prevNorm.includes(normalized) || normalized.includes(prevNorm);
  });
}

/**
 * Returns formatted conversation history formatted for LLM prompts.
 */
export function getFormattedHistory(
  sessionId: string,
  maxTurns = 6
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const session = ACTIVE_SESSIONS.get(sessionId);
  if (!session) return [];

  return session.turns.slice(-maxTurns).map(t => ({
    role: t.role,
    content: t.content,
  }));
}

/**
 * Clears an active session.
 */
export function clearSession(sessionId: string): void {
  ACTIVE_SESSIONS.delete(sessionId);
}
