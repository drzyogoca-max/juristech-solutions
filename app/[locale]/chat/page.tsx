'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Loader as Loader2 } from 'lucide-react';

export default function ChatPage() {
  const t = useTranslations('Chat');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
      setPrompt('');
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        <div className="bg-slate-900 rounded-xl p-4 h-[600px] overflow-y-auto mb-4 border border-slate-800">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-cyan-400' : 'text-green-400'}`}>
              <strong>{msg.role}:</strong>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? t('thinking') : t('send')}
          </button>
        </div>
      </div>
    </main>
  );
}
