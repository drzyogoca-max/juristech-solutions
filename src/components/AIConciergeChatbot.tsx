/**
 * src/components/AIConciergeChatbot.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Live Dynamic AI Legal Concierge Widget
 * Connects directly to Gemini AI model with real-time response rendering and typing indicator.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Send, X, Sparkles, Loader2, Paperclip } from 'lucide-react';
import { callAI } from '../lib/api';
import { getUITranslations } from '../lib/uiTranslations';

export interface ChatbotMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export default function AIConciergeChatbot() {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ui = getUITranslations(i18n.language);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize or update welcome greeting according to active language
  useEffect(() => {
    setMessages([
      {
        id: 'concierge_init',
        role: 'assistant',
        content: t('Chat.welcome') || ui.chatbot.typingIndicator,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || input.trim();
    if (!queryToSend || loading) return;

    if (!customQuery) setInput('');

    // 1. Immediately append User Query to State
    const userMsg: ChatbotMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Invoke Live AI Model with User's Language
      const prompt = `[SYSTEM INSTRUCTION]: You are the Senior AI Legal Advisor for JurisTech Solutions.
Language Directive: Respond COMPLETELY in the requested language (${i18n.language}).
User Inquiry: ${queryToSend}`;

      const reply = await callAI(prompt, i18n.language);

      // 3. Append Live Dynamic AI Reply
      const botReply: ChatbotMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply || t('Common.error'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: t('Chat.error') || 'Error contacting AI service.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-2xl flex items-center gap-2 transition-all hover:scale-105 border border-cyan-400/40"
        >
          <Bot className="w-6 h-6 text-slate-950" />
          <span className="font-extrabold text-xs text-slate-950 hidden sm:inline">
            {ui.chatbot.triggerBtn}
          </span>
        </button>
      ) : (
        <div className="w-[350px] sm:w-[440px] h-[540px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1">
                  <span>{ui.chatbot.headerTitle}</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">{ui.chatbot.connectedStatus}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Query Pills */}
          {ui.chatbot.pills && ui.chatbot.pills.length > 0 && (
            <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
              {ui.chatbot.pills.slice(0, 3).map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, pill.query)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold whitespace-nowrap border border-cyan-500/20 transition-colors"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-bold rounded-tl-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tr-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{ui.chatbot.typingIndicator}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl cursor-pointer transition-colors border border-slate-700 shrink-0" title={ui.chatbot.attachTooltip}>
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const fileMsg: ChatbotMessage = {
                    id: `file_${Date.now()}`,
                    role: 'user',
                    content: `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };

                  setMessages((prev) => [...prev, fileMsg]);
                  setLoading(true);

                  try {
                    const prompt = `Analyze this uploaded contract document "${file.name}". Generate a structured AI executive summary report in ${i18n.language} covering:
1. Executive Contract Summary
2. Key Obligations & Liabilities
3. Detected Risk Level (Low/Medium/High)
4. Missing Critical Clauses & Recommendations.`;

                    const summaryReport = await callAI(prompt, i18n.language);

                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `summary_${Date.now()}`,
                        role: 'assistant',
                        content: summaryReport || ui.chatbot.docReady,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  } catch (err) {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `err_summary_${Date.now()}`,
                        role: 'assistant',
                        content: t('Chat.error'),
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </label>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !loading) {
                    handleSend(e);
                  }
                }
              }}
              placeholder={ui.chatbot.inputPlaceholder}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

