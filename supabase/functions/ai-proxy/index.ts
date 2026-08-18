import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, messages, systemPrompt } = body;

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    // Construct full messages payload
    let chatMessages: ChatMessage[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      if (systemPrompt) {
        chatMessages.push({ role: "system", content: systemPrompt });
      }
      chatMessages.push(...messages);
    } else if (prompt && typeof prompt === "string") {
      chatMessages = [
        { role: "system", content: systemPrompt || "أنت مساعد ذكي واحترافي لـ JurisTech Solutions ومحرك Engine AI." },
        { role: "user", content: prompt }
      ];
    } else {
      return new Response(
        JSON.stringify({ error: "prompt or messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return new Response(
        JSON.stringify({ error: `LLM Engine API error: ${err}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await openaiRes.json();
    const result = data.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ result, response: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
