import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, prompt, messages, history } = body;

    const userMessage = message || prompt || (Array.isArray(messages) ? messages[messages.length - 1]?.content : '');

    if (!userMessage) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
    }

    const systemInstruction = `أنت "جوريس" — المستشار القانوني والاستثماري الذكي لمنصة Juristech.solutions. أجب بديناميكية ومهنية عالية على استفسارات العملاء والمستثمرين دون استخدام أي رسائل مبرمجة مسبقاً.`;

    const contents = [
      { role: 'user', parts: [{ text: `[SYSTEM INSTRUCTION]: ${systemInstruction}` }] },
      { role: 'model', parts: [{ text: 'مرحباً، أنا مستشارك الذكي لمنصة Juristech.solutions. كيف أساعدك؟' }] },
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 502 });
    }

    const data = await geminiRes.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      reply: replyText,
      result: replyText,
      response: replyText,
      source: 'Google Gemini AI'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to process AI response' }, { status: 500 });
  }
}
