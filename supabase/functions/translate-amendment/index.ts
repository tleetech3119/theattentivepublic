const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, text, readingLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!title || !text) {
      return new Response(JSON.stringify({ error: "Missing title or text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const level = readingLevel === "expert" ? "expert" : "8th-grade";
    const tone =
      level === "expert"
        ? "Use precise constitutional and legal terminology suitable for a law student or policy professional. Reference relevant doctrine where helpful."
        : "Write at an 8th-grade reading level. Use simple, everyday words. Avoid jargon. Short sentences.";

    const systemPrompt = `You are a strictly nonpartisan civic explainer for "The Attentive Public". Translate U.S. constitutional text into plain English. ${tone} Be factual, balanced, and never editorialize. If something is debated or has evolving interpretation, say so neutrally. Use the provided tool to return your structured response.`;

    const userPrompt = `Constitutional text: ${title}

Original text:
"""
${text}
"""

Produce:
1) A 2-3 sentence plain-English summary of what this says and means today.
2) "Key points" — 2 to 4 short bullets with the most important things to know.
3) "Why it matters" — 1-2 sentences on the modern significance or how it shows up in everyday life.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_amendment_translation",
              description: "Return a structured plain-English translation of constitutional text.",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "2-3 sentences explaining what this constitutional text says and means in plain English.",
                  },
                  keyPoints: {
                    type: "array",
                    description: "2-4 short bullets of the most important takeaways.",
                    items: { type: "string" },
                  },
                  whyItMatters: {
                    type: "string",
                    description: "1-2 sentences on modern significance or everyday relevance.",
                  },
                },
                required: ["summary", "keyPoints", "whyItMatters"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_amendment_translation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");
    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-amendment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
