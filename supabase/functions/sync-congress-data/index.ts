import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const CONGRESS_API = "https://api.congress.gov/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const CONGRESS_API_KEY = Deno.env.get("CONGRESS_API_KEY");
  
  if (!CONGRESS_API_KEY) {
    return new Response(JSON.stringify({ error: "CONGRESS_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const congress = 119; // Current congress (2025-2027)

    // --- Fetch bills ---
    const billsResult = await fetchBills(CONGRESS_API_KEY, congress);
    const membersResult = await fetchMembers(CONGRESS_API_KEY, congress);

    // Upsert bills
    if (billsResult.length > 0) {
      const { error: billErr } = await supabase
        .from("bills")
        .upsert(billsResult, { onConflict: "code" });
      if (billErr) console.error("Bills upsert error:", billErr);
    }

    // Upsert representatives
    if (membersResult.length > 0) {
      const { error: repErr } = await supabase
        .from("representatives")
        .upsert(membersResult, { onConflict: "id" });
      if (repErr) console.error("Reps upsert error:", repErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        bills_synced: billsResult.length,
        reps_synced: membersResult.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function congressFetch(url: string, apiKey: string) {
  const separator = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${separator}api_key=${apiKey}&format=json`);
  if (!res.ok) throw new Error(`Congress API ${res.status}: ${await res.text()}`);
  return res.json();
}

function mapStatus(actions: any[]): { status: string; progress: number } {
  if (!actions || actions.length === 0) return { status: "Introduced", progress: 10 };

  const texts = actions.map((a: any) => (a.text || "").toLowerCase());
  const joined = texts.join(" ");

  if (joined.includes("became public law")) return { status: "Signed into Law", progress: 100 };
  if (joined.includes("passed senate") && joined.includes("passed house")) return { status: "Passed Both Chambers", progress: 90 };
  if (joined.includes("passed senate") || joined.includes("passed house")) return { status: "Floor Vote", progress: 70 };
  if (joined.includes("reported by") || joined.includes("ordered to be reported")) return { status: "Reported by Committee", progress: 55 };
  if (joined.includes("committee")) return { status: "In Committee", progress: 35 };
  if (joined.includes("referred to")) return { status: "Referred", progress: 20 };
  return { status: "Introduced", progress: 10 };
}

function mapTopic(subjects: any[]): string {
  if (!subjects || subjects.length === 0) return "general";
  const name = (subjects[0]?.name || "").toLowerCase();

  const topicMap: Record<string, string> = {
    "environmental": "environment",
    "energy": "environment",
    "climate": "environment",
    "education": "education",
    "health": "healthcare",
    "armed forces": "defense",
    "taxation": "economy",
    "economics": "economy",
    "finance": "economy",
    "housing": "housing",
    "science": "technology",
    "technology": "technology",
    "immigration": "immigration",
    "crime": "justice",
  };

  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (name.includes(keyword)) return topic;
  }
  return "general";
}

async function fetchBills(apiKey: string, congress: number) {
  // Fetch recent bills from both chambers
  const billTypes = ["hr", "s"];
  const allBills: any[] = [];

  for (const type of billTypes) {
    try {
      const data = await congressFetch(
        `${CONGRESS_API}/bill/${congress}/${type}?limit=10&sort=updateDate+desc`,
        apiKey
      );
      const bills = data.bills || [];

      for (const bill of bills.slice(0, 5)) {
        try {
          // Fetch bill detail
          const detail = await congressFetch(bill.url, apiKey);
          const b = detail.bill;
          if (!b) continue;

          // Fetch actions
          let actions: any[] = [];
          try {
            const actData = await congressFetch(
              `${CONGRESS_API}/bill/${congress}/${type}/${b.number}/actions?limit=10`,
              apiKey
            );
            actions = actData.actions || [];
          } catch { /* skip */ }

          // Fetch subjects
          let subjects: any[] = [];
          try {
            const subData = await congressFetch(
              `${CONGRESS_API}/bill/${congress}/${type}/${b.number}/subjects?limit=5`,
              apiKey
            );
            subjects = subData.legislativeSubjects || subData.subjects?.legislativeSubjects || [];
          } catch { /* skip */ }

          const { status, progress } = mapStatus(actions);
          const code = `${type.toUpperCase()}.${b.number}`;
          const latestAction = b.latestAction?.text || "";
          const latestActionDate = b.latestAction?.actionDate || "";

          // Build sponsors from cosponsors endpoint
          let sponsors: any[] = [];
          if (b.sponsors) {
            sponsors = (Array.isArray(b.sponsors) ? b.sponsors : [b.sponsors]).map((s: any) => ({
              name: formatMemberName(s),
              party: mapParty(s.party),
              chamber: s.chamber || (type === "s" ? "Senate" : "House"),
              role: "Primary" as const,
            }));
          }

          // Build timeline from actions
          const timeline = actions.slice(0, 6).map((a: any) => ({
            date: a.actionDate || "",
            title: truncate(a.text || "Action", 50),
            description: a.text || "",
            completed: true,
          }));

          allBills.push({
            id: parseInt(`${congress}${type === "s" ? "2" : "1"}${b.number}`.slice(0, 9)) || Math.floor(Math.random() * 100000),
            title: b.title || "Untitled Bill",
            code,
            summary: b.title || "No summary available.",
            status,
            topic: mapTopic(subjects),
            progress,
            introduced_date: b.introducedDate || latestActionDate || "",
            last_action: latestAction,
            sponsors,
            timeline,
            votes: [],
          });
        } catch (err) {
          console.error(`Error fetching bill detail:`, err);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type} bills:`, err);
    }
  }

  return allBills;
}

async function fetchMembers(apiKey: string, congress: number) {
  const members: any[] = [];

  try {
    const data = await congressFetch(
      `${CONGRESS_API}/member?limit=20&currentMember=true`,
      apiKey
    );
    const memberList = data.members || [];

    for (const m of memberList.slice(0, 10)) {
      try {
        const detail = await congressFetch(m.url, apiKey);
        const member = detail.member;
        if (!member) continue;

        const currentTerm = member.terms?.item?.[member.terms.item.length - 1];
        const chamber = currentTerm?.chamber === "Senate" ? "Senate" : "House";
        // partyHistory is an array; partyName is top-level on list, but detail uses partyHistory
        const partyRaw = member.partyName || member.partyHistory?.[0]?.partyName || m.partyName || "";
        const party = mapParty(partyRaw);

        const stateCode = member.state || currentTerm?.stateCode || "";
        const district = currentTerm?.district ? `${stateCode}-${currentTerm.district}` : undefined;

        members.push({
          id: (member.bioguideId || "").toLowerCase(),
          name: `${chamber === "Senate" ? "Sen." : "Rep."} ${member.directOrderName || member.invertedOrderName || "Unknown"}`,
          party,
          chamber,
          state: member.state || stateCode,
          district: district || null,
          photo: member.depiction?.imageUrl || null,
          rating: "N/A",
          bio: `${chamber === "Senate" ? "Senator" : "Representative"} from ${member.state || "unknown state"}. ${member.directOrderName || ""} has served in the ${congress}th Congress.`,
          term_start: currentTerm?.startYear ? `Jan ${currentTerm.startYear}` : "",
          term_end: currentTerm?.endYear ? `Jan ${currentTerm.endYear}` : "Present",
          contact: {
            phone: member.officialWebsiteUrl ? "" : "",
            email: "",
            office: member.addressInformation?.officeAddress || "",
            website: member.officialWebsiteUrl || "",
          },
          issue_scores: [],
          voting_history: [],
          committees: [],
        });
      } catch (err) {
        console.error("Error fetching member detail:", err);
      }
    }
  } catch (err) {
    console.error("Error fetching members:", err);
  }

  return members;
}

function formatMemberName(sponsor: any): string {
  if (sponsor.fullName) return sponsor.fullName;
  if (sponsor.firstName && sponsor.lastName) return `${sponsor.firstName} ${sponsor.lastName}`;
  return "Unknown";
}

function mapParty(party: string | undefined): "D" | "R" | "I" {
  if (!party) return "I";
  const p = party.toLowerCase();
  if (p.includes("democrat")) return "D";
  if (p.includes("republican")) return "R";
  return "I";
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}
