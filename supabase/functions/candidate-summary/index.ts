// Returns a short AI-generated platform summary for a political candidate.
// Caches results in the candidate_summaries table.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, state, party, office = "Governor" } = await req.json();
    if (!name || !state) {
      return new Response(JSON.stringify({ error: "name and state required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check cache
    const { data: cached } = await supabase
      .from("candidate_summaries")
      .select("summary, source_url")
      .eq("state", state)
      .eq("name", name)
      .eq("office", office)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const partyName = party === "D" ? "Democratic" : party === "R" ? "Republican" : "";
    const prompt = `In 2-3 concise sentences, summarize what ${name}, a ${partyName} candidate for ${office} of ${state} in the 2026 election, stands for — their key policy positions, background, or campaign platform. If you are uncertain about this specific person, briefly say information is limited rather than guessing. Plain text only, no markdown.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI error ${aiResp.status}: ${t}`);
    }

    const aiData = await aiResp.json();
    const summary: string =
      aiData?.choices?.[0]?.message?.content?.trim() ?? "No summary available.";

    const source_url = `https://www.google.com/search?q=${encodeURIComponent(
      `${name} ${state} ${office} 2026 official campaign website`,
    )}`;

    await supabase
      .from("candidate_summaries")
      .insert({ name, state, office, summary, source_url });

    return new Response(JSON.stringify({ summary, source_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("candidate-summary error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
