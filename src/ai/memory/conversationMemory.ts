/**
 * src/ai/memory/conversationMemory.ts
 * JurisTech Solutions — Per-session Conversation Memory
 * Specification: JURISTECH-AI-P0 Phase P0-4
 * Uses sessionStorage only. Max 20 turns. No persistent legal data in localStorage.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  lang?: string;
}

const SESSION_KEY = 'juristech_ai_conversation';
const MAX_TURNS = 20;

function isAvailable(): boolean {
  try { return typeof sessionStorage !== 'undefined'; } catch { return false; }
}

export function addMessage(msg: Omit<ChatMessage, 'timestamp'>): void {
  if (!isAvailable()) return;
  try {
    const history = getHistory();
    history.push({ ...msg, timestamp: new Date().toISOString() });
    const trimmed = history.slice(-MAX_TURNS * 2);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(trimmed));
  } catch { /* sessionStorage full or unavailable */ }
}

export function getHistory(): ChatMessage[] {
  if (!isAvailable()) return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getHistoryForAI(): Array<{ role: 'user' | 'assistant'; content: string }> {
  return getHistory()
    .filter(m => m.role !== 'system')
    .slice(-10)
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
}

export function clearHistory(): void {
  if (!isAvailable()) return;
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export function getMessageCount(): number {
  return getHistory().filter(m => m.role === 'user').length;
}
