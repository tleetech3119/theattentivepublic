import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CONGRESS_API = "https://api.congress.gov/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const repId = url.searchParams.get("rep_id");

  if (!repId) {
    return new Response(JSON.stringify({ error: "rep_id required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check cache first (less than 24h old)
  const { data: cached } = await supabase
    .from("sponsored_legislation")
    .select("*")
    .eq("rep_id", repId)
    .order("introduced_date", { ascending: false });

  if (cached && cached.length > 0) {
    const newest = new Date(cached[0].created_at);
    const ageHours = (Date.now() - newest.getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) {
      return new Response(JSON.stringify({ legislation: cached, source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // Fetch from Congress API
  const CONGRESS_API_KEY = Deno.env.get("CONGRESS_API_KEY");
  if (!CONGRESS_API_KEY) {
    // Return cache if available, even if stale
    if (cached && cached.length > 0) {
      return new Response(JSON.stringify({ legislation: cached, source: "stale_cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "CONGRESS_API_KEY not configured", legislation: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const bioguideId = repId.toUpperCase();
    const res = await fetch(
      `${CONGRESS_API}/member/${bioguideId}/sponsored-legislation?limit=20&format=json&api_key=${CONGRESS_API_KEY}`
    );
    if (!res.ok) throw new Error(`Congress API ${res.status}`);
    const data = await res.json();
    const bills = data.sponsoredLegislation || [];

    const rows = bills.map((b: any) => {
      const type = (b.type || "").toLowerCase();
      const code = `${type.toUpperCase()}.${b.number}`;
      return {
        rep_id: repId,
        bill_code: code,
        bill_title: b.title || "Untitled",
        introduced_date: b.introducedDate || "",
        status: b.latestAction?.text ? truncate(b.latestAction.text, 100) : "Introduced",
        topic: mapTopic(b.policyArea?.name || ""),
        congress_url: b.url || "",
      };
    });

    if (rows.length > 0) {
      const { error } = await supabase
        .from("sponsored_legislation")
        .upsert(rows, { onConflict: "rep_id,bill_code" });
      if (error) console.error("Upsert error:", error);
    }

    // Fetch fresh from DB
    const { data: fresh } = await supabase
      .from("sponsored_legislation")
      .select("*")
      .eq("rep_id", repId)
      .order("introduced_date", { ascending: false });

    return new Response(JSON.stringify({ legislation: fresh || rows, source: "api" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching legislation:", err);
    // Fall back to cache
    if (cached && cached.length > 0) {
      return new Response(JSON.stringify({ legislation: cached, source: "stale_cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: (err as Error).message, legislation: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function mapTopic(name: string): string {
  if (!name) return "general";
  const n = name.toLowerCase();
  const topicMap: Record<string, string> = {
    environmental: "environment", energy: "environment", climate: "environment",
    education: "education", health: "healthcare",
    "armed forces": "defense", taxation: "economy", economics: "economy",
    finance: "economy", housing: "housing", science: "technology",
    technology: "technology", immigration: "immigration", crime: "justice",
  };
  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (n.includes(keyword)) return topic;
  }
  return "general";
}
