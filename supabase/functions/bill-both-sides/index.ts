import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function requireUser(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data, error } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (error || !data?.claims?.sub) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const unauth = await requireUser(req);
    if (unauth) return unauth;

    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code.slice(0, 50) : "";
    const title = typeof body.title === "string" ? body.title.slice(0, 1000) : "";
    const summary = typeof body.summary === "string" ? body.summary.slice(0, 5000) : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!title || !summary) {
      return new Response(JSON.stringify({ error: "Missing title or summary" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a strictly nonpartisan civic explainer for "The Attentive Public". Present the strongest, most intellectually honest arguments FOR and AGAINST a piece of U.S. legislation. Steelman both sides — represent each as its best advocates would. Never editorialize, never indicate a preferred side, and keep tone neutral. Cite credible source TYPES (e.g., "Congressional Budget Office report", "Brookings Institution analysis", "Heritage Foundation brief", "American Medical Association statement") rather than fabricating specific URLs. Use the provided tool to return your structured response.`;

    const userPrompt = `Bill: ${code}
Title: ${title}
Official summary: ${summary}

Produce the strongest argument FOR this bill and the strongest argument AGAINST it. For each side:
- A short headline (max 8 words)
- A 2-3 sentence steelmanned argument
- 2-3 source types that typically advance this view (organization or report types, not fabricated URLs)`;

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
              name: "return_both_sides",
              description: "Return the strongest arguments for and against the bill.",
              parameters: {
                type: "object",
                properties: {
                  for: {
                    type: "object",
                    properties: {
                      headline: { type: "string", description: "Short headline (max 8 words)." },
                      argument: { type: "string", description: "2-3 sentence steelmanned argument in favor." },
                      sources: {
                        type: "array",
                        items: { type: "string" },
                        description: "2-3 source types (orgs, report types) that typically support this view.",
                      },
                    },
                    required: ["headline", "argument", "sources"],
                    additionalProperties: false,
                  },
                  against: {
                    type: "object",
                    properties: {
                      headline: { type: "string", description: "Short headline (max 8 words)." },
                      argument: { type: "string", description: "2-3 sentence steelmanned argument against." },
                      sources: {
                        type: "array",
                        items: { type: "string" },
                        description: "2-3 source types (orgs, report types) that typically oppose this view.",
                      },
                    },
                    required: ["headline", "argument", "sources"],
                    additionalProperties: false,
                  },
                },
                required: ["for", "against"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_both_sides" } },
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
    console.error("bill-both-sides error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
