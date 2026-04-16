const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, year, background, ruling, significance, readingLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!name || !ruling) {
      return new Response(JSON.stringify({ error: "Missing case info" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const level = readingLevel === "expert" ? "expert" : "8th-grade";
    const tone =
      level === "expert"
        ? "Use precise legal terminology. Reference doctrine, tests, and dissents where relevant. Suitable for a law student or policy professional."
        : "Write at an 8th-grade reading level. Use simple, everyday words. Avoid legal jargon. Short sentences and a relatable analogy if helpful.";

    const systemPrompt = `You are a strictly nonpartisan civic explainer for "The Attentive Public". Explain U.S. Supreme Court cases in plain English. ${tone} Be factual, balanced, and never editorialize. For controversial cases, present the reasoning neutrally and note ongoing debate without taking sides. Use the provided tool to return your structured response.`;

    const userPrompt = `Case: ${name} (${year})

Background: ${background}

Ruling: ${ruling}

Historical significance: ${significance}

Produce a plain-English explainer with:
1) A 2-3 sentence "in a nutshell" summary anyone can understand.
2) "Key takeaways" — 3 to 4 short bullets covering what the Court decided, the reasoning, and any dissent.
3) "Why it still matters today" — 1-2 sentences on modern impact or how it shows up in daily life.`;

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
              name: "return_case_explanation",
              description: "Return a structured plain-English explanation of a Supreme Court case.",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "2-3 sentence in-a-nutshell summary.",
                  },
                  keyPoints: {
                    type: "array",
                    description: "3-4 short bullets covering decision, reasoning, and any dissent.",
                    items: { type: "string" },
                  },
                  whyItMatters: {
                    type: "string",
                    description: "1-2 sentences on modern impact.",
                  },
                },
                required: ["summary", "keyPoints", "whyItMatters"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_case_explanation" } },
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
    console.error("explain-case error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
