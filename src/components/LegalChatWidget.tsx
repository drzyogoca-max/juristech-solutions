import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react';
import { callAI } from '../lib/api';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export default function LegalChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'أهلاً بك. أنا المستشار القانوني الذكي لمنصة JurisTech Solutions. تفطّل بطرح استفسارك القانوني، العقدي، أو المتعلق بإدارة المخاطر للبدء فوراً.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await callAI(userText, 'ar');
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: 'أنا مستشارك التشريعي الذكي من JurisTech. استلمت استفسارك وسأزودك بالمزيد من التفاصيل والأنظمة المباشرة.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // منع القفز لنهاية الصفحة وإرسال الرسالة حصراً
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4 font-sans text-slate-100" dir="rtl">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between rounded-t-xl">
        <span className="text-amber-400 font-bold text-sm tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          JurisTech AI Legal Concierge & Risk Engine
        </span>
        <span className="text-xs bg-blue-900/80 text-blue-200 border border-blue-700/50 px-2.5 py-1 rounded-full font-mono">
          Active Repository
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 my-2 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20' : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none shadow-md'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 text-slate-400 border border-slate-800 px-4 py-3 rounded-xl text-xs animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              المستشار الذكي يحلل الاستفسار ويستدعي المواد من المستودع القانوني...
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <form onSubmit={handleSend} className="mt-auto pt-3 border-t border-slate-800 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب استفسارك القانوني للشركات أو العقود أو المخاطر..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500"
        />
        <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition shrink-0 shadow-lg shadow-amber-500/20">
          إرسال
        </button>
      </form>
    </div>
  );
}
