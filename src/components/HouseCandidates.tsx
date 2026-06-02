import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Landmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CandidateLink } from "@/components/CandidateLink";

interface HouseCandidate {
  name: string;
  party: "D" | "R" | string;
  note?: string;
}
interface DistrictRow {
  district: string;
  incumbent?: string;
  candidates: HouseCandidate[];
}

interface HouseCandidatesProps {
  state: string;
}

export const HouseCandidates = ({ state }: HouseCandidatesProps) => {
  const [rows, setRows] = useState<DistrictRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke(
        "house-candidates",
        { body: { state } },
      );
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      setRows(data?.candidates ?? []);
      setUpdatedAt(data?.updated_at ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Could not load House candidates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card rounded-xl p-5 shadow-card border-l-4 border-civic-teal">
      <div className="flex items-center gap-2 mb-2">
        <Badge className="bg-civic-teal/15 text-civic-teal border-0 text-[10px] uppercase tracking-wider font-bold">
          <Landmark className="w-3 h-3 mr-1" /> U.S. House
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          Lower chamber · 2-year terms · by district
        </span>
      </div>
      <h2 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
        {state} House Candidates
      </h2>
      <p className="text-xs text-muted-foreground mb-3">
        AI-generated list of major-party candidates for each U.S. House district in {state}. Verify on Ballotpedia before voting.
      </p>

      {!rows && !loading && (
        <Button size="sm" onClick={load} className="w-full">
          Load House candidates for {state}
        </Button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading candidates…
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      {rows && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No districts returned. Try again later.</p>
      )}

      {rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((d) => (
            <div key={d.district} className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs font-semibold text-foreground mb-2">
                District {d.district}
                {d.incumbent && (
                  <span className="ml-2 text-muted-foreground font-normal">
                    · Incumbent: {d.incumbent}
                  </span>
                )}
              </div>
              {d.candidates.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Candidates TBD
                </p>
              ) : (
                <div className="space-y-1.5">
                  {d.candidates.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 truncate">
                        <CandidateLink
                          name={c.name}
                          state={state}
                          party={c.party}
                          office={`U.S. House (${state} ${d.district})`}
                        />
                        {c.note && (
                          <span className="text-muted-foreground ml-1">· {c.note}</span>
                        )}
                      </div>
                      <Badge
                        className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${
                          c.party === "D"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                            : c.party === "R"
                              ? "bg-red-500/15 text-red-700 dark:text-red-300"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.party === "D" ? "Dem" : c.party === "R" ? "Rep" : c.party}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {updatedAt && (
            <p className="text-[10px] text-muted-foreground italic">
              Generated {new Date(updatedAt).toLocaleDateString()}. AI-assisted — verify on Ballotpedia.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
