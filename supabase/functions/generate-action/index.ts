const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { repName, repTitle, userName, billCode, billTitle, billSummary, stance, kind } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!repName || !billCode || !billTitle || !stance || !kind) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stanceLabel = stance === "support" ? "SUPPORT" : "OPPOSE";
    const sender = userName?.trim() ? userName.trim() : "[Your Name]";

    const systemPrompt = `You are a nonpartisan civic-engagement assistant for "The Attentive Public". Generate respectful, clear, fact-based constituent communications. No partisan attacks, no inflammatory language. The constituent's stance is given — represent it honestly and politely. Use the provided tool to return your structured response.`;

    const userPrompt = kind === "email"
      ? `Write a polite, persuasive email from a constituent to ${repTitle || "Representative"} ${repName} asking them to ${stanceLabel} ${billCode}: "${billTitle}".

Bill summary: ${billSummary || "(not provided)"}

Requirements:
- Subject line: clear, specific, under 70 characters
- Body: 120-180 words, 3 short paragraphs
  1) Identify as a constituent and state the ask
  2) Brief reasoning (cite the bill's actual content, not partisan talking points)
  3) Request their action and thank them
- Sign off with: "Sincerely, ${sender}"
- Tone: respectful, civic-minded, never hostile`
      : `Write a short phone call script for a constituent calling ${repTitle || "Representative"} ${repName}'s office to ask them to ${stanceLabel} ${billCode}: "${billTitle}".

Bill summary: ${billSummary || "(not provided)"}

Requirements:
- Greeting: 1 sentence (introduce as constituent, state purpose)
- Main message: 2-3 sentences (the ask + 1 brief reason)
- Closing: 1 sentence (thank the staffer, ask for the rep's position)
- Total: under 90 words, easy to read aloud
- Tone: polite, brief, respectful — staffers are busy`;

    const tools = kind === "email"
      ? [{
          type: "function",
          function: {
            name: "return_email_draft",
            description: "Return a constituent email draft.",
            parameters: {
              type: "object",
              properties: {
                subject: { type: "string", description: "Email subject line, under 70 characters." },
                body: { type: "string", description: "Email body with line breaks. Sign off with constituent name." },
              },
              required: ["subject", "body"],
              additionalProperties: false,
            },
          },
        }]
      : [{
          type: "function",
          function: {
            name: "return_call_script",
            description: "Return a constituent phone-call script.",
            parameters: {
              type: "object",
              properties: {
                script: { type: "string", description: "Full call script, ready to read aloud, under 90 words." },
                tips: {
                  type: "array",
                  items: { type: "string" },
                  description: "2-3 short, practical tips for the call (e.g., what to do if asked for ZIP code).",
                },
              },
              required: ["script", "tips"],
              additionalProperties: false,
            },
          },
        }];

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
        tools,
        tool_choice: { type: "function", function: { name: kind === "email" ? "return_email_draft" : "return_call_script" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
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
    console.error("generate-action error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
