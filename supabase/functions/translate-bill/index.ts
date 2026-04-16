const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, summary, code, readingLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!title || !summary) {
      return new Response(JSON.stringify({ error: "Missing title or summary" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const level = readingLevel === "expert" ? "expert" : "8th-grade";
    const tone =
      level === "expert"
        ? "Use precise legislative and policy terminology suitable for a policy professional."
        : "Write at an 8th-grade reading level. Use simple, everyday words. Avoid jargon. Short sentences.";

    const systemPrompt = `You are a strictly nonpartisan civic explainer for "The Attentive Public". Translate U.S. legislation into plain English. ${tone} Be factual, balanced, and never editorialize. If something is uncertain or speculative, say so. Use the provided tool to return your structured response.`;

    const userPrompt = `Bill: ${code}
Title: ${title}
Official summary: ${summary}

Produce:
1) A 2-sentence plain-English summary of what this bill does.
2) "Who wins" — 2 to 4 short bullets identifying groups likely to benefit, each with a brief why.
3) "Who loses" — 2 to 4 short bullets identifying groups likely to be negatively affected or face costs, each with a brief why.

Be balanced. If wins or losses are unclear, say so honestly.`;

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
              name: "return_bill_translation",
              description: "Return a structured plain-English bill translation.",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "Exactly 2 sentences explaining what this bill does in plain English.",
                  },
                  winners: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        group: { type: "string", description: "Name of the group that benefits." },
                        reason: { type: "string", description: "One short sentence on why they benefit." },
                      },
                      required: ["group", "reason"],
                      additionalProperties: false,
                    },
                  },
                  losers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        group: { type: "string", description: "Name of the group negatively affected." },
                        reason: { type: "string", description: "One short sentence on why they're affected." },
                      },
                      required: ["group", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "winners", "losers"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_bill_translation" } },
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
    console.error("translate-bill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
