const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, title, summary, amendments, cases } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!title || !summary || !Array.isArray(amendments) || !Array.isArray(cases)) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amendmentList = amendments
      .map((a: any) => `#${a.number} (${a.shortName})`)
      .join("; ");
    const caseList = cases
      .map((c: any) => `${c.id} — ${c.name} (${c.year}, ${c.category}): ${c.shortDescription}`)
      .join("\n");

    const systemPrompt = `You are a strictly nonpartisan civic educator for "The Attentive Public". Your job is to "connect the dots" between a current piece of U.S. legislation and the constitutional amendments and landmark Supreme Court cases that gave it its legal context. Be accurate, neutral, and educational. NEVER editorialize or pick a political side. Only choose amendments and cases from the lists provided. If nothing is genuinely relevant, return an empty array — do NOT force a connection.`;

    const userPrompt = `Bill: ${code}
Title: ${title}
Official summary: ${summary}

Available amendments (pick by number):
${amendmentList}

Available landmark Supreme Court cases (pick by id):
${caseList}

Identify 1-3 amendments and 1-3 landmark cases that are most directly relevant to this bill's subject matter or constitutional questions it raises. For each, write a 1-2 sentence neutral explanation of HOW it connects to this bill. Also provide a single 2-3 sentence "big picture" summary tying it all together.`;

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
              name: "return_connections",
              description: "Return the constitutional amendments and Supreme Court cases connected to this bill.",
              parameters: {
                type: "object",
                properties: {
                  bigPicture: {
                    type: "string",
                    description: "2-3 sentence neutral summary of how this bill fits into broader constitutional history.",
                  },
                  amendments: {
                    type: "array",
                    description: "1-3 most relevant amendments. Empty array if none truly relevant.",
                    items: {
                      type: "object",
                      properties: {
                        number: { type: "integer", description: "Amendment number, 1-27." },
                        connection: { type: "string", description: "1-2 sentence neutral explanation of the link." },
                      },
                      required: ["number", "connection"],
                      additionalProperties: false,
                    },
                  },
                  cases: {
                    type: "array",
                    description: "1-3 most relevant Supreme Court cases. Empty array if none truly relevant.",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Case id from the provided list." },
                        connection: { type: "string", description: "1-2 sentence neutral explanation of the link." },
                      },
                      required: ["id", "connection"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["bigPicture", "amendments", "cases"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_connections" } },
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
    console.error("connect-the-dots error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
