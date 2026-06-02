// Returns a list of 2026 U.S. House districts and major-party candidates for a given state.
// AI-generated with a 7-day cache to avoid repeated calls.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { state } = await req.json();
    if (!state || typeof state !== "string") {
      return new Response(JSON.stringify({ error: "state required" }), {
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
      .from("house_candidates_cache")
      .select("candidates, expires_at, updated_at")
      .eq("state", state)
      .maybeSingle();

    if (cached && new Date(cached.expires_at) > new Date()) {
      return new Response(
        JSON.stringify({ candidates: cached.candidates, cached: true, updated_at: cached.updated_at }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `List the 2026 U.S. House of Representatives races in ${state}. For each congressional district, list the incumbent (if running for re-election) and the major-party (Democratic and Republican) candidates who have publicly declared or filed.

Return ONLY valid JSON in this exact shape, no markdown, no commentary:
{
  "districts": [
    {
      "district": "1",
      "incumbent": "Name (D or R)",
      "candidates": [
        { "name": "Full Name", "party": "D" | "R", "note": "Incumbent" | "Challenger" | "" }
      ]
    }
  ]
}

If you are unsure about a specific candidate, omit them rather than guess. If information for a district is unavailable, include the district with an empty candidates array.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
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
    const raw = aiData?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON if model wrapped it
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { districts: [] };
    }
    const candidates = parsed?.districts ?? [];

    await supabase
      .from("house_candidates_cache")
      .upsert({
        state,
        candidates,
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

    return new Response(
      JSON.stringify({ candidates, cached: false, updated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("house-candidates error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
