import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGISCAN_BASE = "https://api.legiscan.com/";

// State USPS codes accepted by LegiScan (lowercase for safety; we uppercase)
const VALID_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
  "WI","WY","DC"
]);

// Re-sync a state at most once per 6 hours unless force=true
const SYNC_COOLDOWN_MS = 6 * 60 * 60 * 1000;

// LegiScan free tier: keep counts modest
const MAX_BILLS_PER_STATE = 200;

function mapTopic(title: string, description: string, subjects: string[]): string {
  const text = `${title} ${description} ${subjects.join(" ")}`.toLowerCase();

  if (/abortion|reproductive|contracept|prenatal|fetal|fetus|roe|pregnan/.test(text)) return "reproductive_rights";
  if (/health|medicaid|medicare|insur|hospital|drug|opioid|mental health/.test(text)) return "healthcare";
  if (/educat|school|teacher|student|university|college|tuition/.test(text)) return "education";
  if (/environ|climate|emission|pollut|renewable|solar|wind energy|conservation/.test(text)) return "environment";
  if (/hous|rent|landlord|tenant|zoning|homeless|mortgage/.test(text)) return "housing";
  if (/tax|revenue|fiscal|budget|appropriat/.test(text)) return "taxes";
  if (/immigr|border|asylum|refugee|visa/.test(text)) return "immigration";
  if (/police|criminal|prison|justice|sentenc|firearm|gun|weapon/.test(text)) return "justice";
  if (/econom|business|jobs|employ|labor|wage|union/.test(text)) return "economy";
  if (/technolog|internet|data|privacy|cyber|ai |artificial intelligence/.test(text)) return "technology";
  if (/defense|military|veteran|national security/.test(text)) return "defense";
  if (/voting|election|ballot|voter/.test(text)) return "voting";
  return "general";
}

function mapStatus(statusCode: number): string {
  // LegiScan progress codes
  switch (statusCode) {
    case 1: return "Introduced";
    case 2: return "Engrossed";
    case 3: return "Enrolled";
    case 4: return "Passed";
    case 5: return "Vetoed";
    case 6: return "Failed";
    default: return "Pending";
  }
}

function progressFromStatus(statusCode: number): number {
  switch (statusCode) {
    case 1: return 15;
    case 2: return 45;
    case 3: return 70;
    case 4: return 100;
    case 5: return 90;
    case 6: return 100;
    default: return 10;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LEGISCAN_API_KEY = Deno.env.get("LEGISCAN_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LEGISCAN_API_KEY) {
      return new Response(JSON.stringify({ error: "LEGISCAN_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const stateRaw = String(body?.state ?? "").toUpperCase().trim();
    const force = Boolean(body?.force);

    if (!VALID_STATES.has(stateRaw)) {
      return new Response(JSON.stringify({ error: "Invalid or missing 'state' (must be 2-letter US state code)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Cooldown check
    if (!force) {
      const { data: log } = await supabase
        .from("state_sync_log")
        .select("last_synced_at, bill_count")
        .eq("state", stateRaw)
        .maybeSingle();
      if (log && Date.now() - new Date(log.last_synced_at).getTime() < SYNC_COOLDOWN_MS) {
        return new Response(JSON.stringify({
          state: stateRaw, skipped: true, reason: "cooldown",
          last_synced_at: log.last_synced_at, bill_count: log.bill_count,
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // 1) Get current session for the state
    const sessionResp = await fetch(
      `${LEGISCAN_BASE}?key=${LEGISCAN_API_KEY}&op=getSessionList&state=${stateRaw}`
    );
    const sessionData = await sessionResp.json();
    if (sessionData?.status !== "OK" || !Array.isArray(sessionData.sessions) || sessionData.sessions.length === 0) {
      throw new Error(`LegiScan getSessionList failed: ${JSON.stringify(sessionData)?.slice(0, 200)}`);
    }
    // Pick the most recent non-special session, fall back to first
    const sessions = sessionData.sessions.sort((a: any, b: any) => (b.year_end - a.year_end) || (b.session_id - a.session_id));
    const session = sessions.find((s: any) => s.special === 0) ?? sessions[0];

    // 2) Get master list (lightweight bill index)
    const masterResp = await fetch(
      `${LEGISCAN_BASE}?key=${LEGISCAN_API_KEY}&op=getMasterListRaw&id=${session.session_id}`
    );
    const masterData = await masterResp.json();
    if (masterData?.status !== "OK" || !masterData.masterlist) {
      throw new Error(`LegiScan getMasterListRaw failed: ${JSON.stringify(masterData)?.slice(0, 200)}`);
    }

    // masterlist is a dict with "0": {session info}, "1..N": bills
    const billStubs: any[] = Object.entries(masterData.masterlist)
      .filter(([k]) => k !== "session")
      .map(([, v]) => v as any)
      .filter((b: any) => b && b.bill_id);

    // Sort by last_action_date desc, take top N
    billStubs.sort((a, b) => String(b.last_action_date ?? "").localeCompare(String(a.last_action_date ?? "")));
    const targetBills = billStubs.slice(0, MAX_BILLS_PER_STATE);

    // 3) Fetch each bill's details (sequential w/ small concurrency to respect API limits)
    const CONCURRENCY = 4;
    const upserts: any[] = [];
    let failures = 0;

    async function fetchBill(stub: any) {
      try {
        const r = await fetch(`${LEGISCAN_BASE}?key=${LEGISCAN_API_KEY}&op=getBill&id=${stub.bill_id}`);
        const j = await r.json();
        if (j?.status !== "OK" || !j.bill) { failures++; return; }
        const b = j.bill;
        const subjects: string[] = Array.isArray(b.subjects) ? b.subjects.map((s: any) => s.subject_name).filter(Boolean) : [];
        const summary = b.description ?? b.title ?? "";
        const topic = mapTopic(b.title ?? "", summary, subjects);
        const sponsors = Array.isArray(b.sponsors) ? b.sponsors.map((s: any) => ({
          name: s.name, party: s.party, role: s.sponsor_type_id === 1 ? "Primary" : "Co-sponsor",
        })) : [];
        const history = Array.isArray(b.history) ? b.history.slice(-10).map((h: any) => ({
          date: h.date, action: h.action, chamber: h.chamber,
        })) : [];

        upserts.push({
          id: b.bill_id,
          state: stateRaw,
          bill_code: b.bill_number ?? stub.number ?? "",
          title: (b.title ?? "").slice(0, 500),
          summary: summary.slice(0, 4000),
          status: mapStatus(b.status ?? stub.status ?? 0),
          topic,
          progress: progressFromStatus(b.status ?? stub.status ?? 0),
          last_action: (stub.last_action ?? "").slice(0, 500),
          last_action_date: stub.last_action_date ?? null,
          introduced_date: b.history?.[0]?.date ?? stub.last_action_date ?? null,
          session_name: session.session_name ?? null,
          state_url: b.state_link ?? null,
          legiscan_url: b.url ?? null,
          sponsors,
          history,
          subjects,
        });
      } catch (e) {
        failures++;
        console.error("fetchBill error", stub?.bill_id, e);
      }
    }

    // Run in chunks
    for (let i = 0; i < targetBills.length; i += CONCURRENCY) {
      const chunk = targetBills.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(fetchBill));
    }

    // 4) Upsert into DB (batch of 100)
    let written = 0;
    for (let i = 0; i < upserts.length; i += 100) {
      const batch = upserts.slice(i, i + 100);
      const { error } = await supabase.from("state_bills").upsert(batch, { onConflict: "id" });
      if (error) {
        console.error("upsert error", error);
      } else {
        written += batch.length;
      }
    }

    // 5) Update sync log
    await supabase.from("state_sync_log").upsert({
      state: stateRaw,
      last_synced_at: new Date().toISOString(),
      bill_count: written,
      last_error: failures > 0 ? `${failures} bill fetches failed` : null,
    }, { onConflict: "state" });

    return new Response(JSON.stringify({
      state: stateRaw,
      session: session.session_name,
      bills_processed: targetBills.length,
      bills_written: written,
      failures,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("sync-legiscan-bills error", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
