import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Representative } from "@/data/representatives";

function mapRow(row: any): Representative {
  return {
    id: row.id,
    name: row.name,
    party: row.party,
    chamber: row.chamber,
    state: row.state,
    district: row.district ?? undefined,
    photo: row.photo ?? undefined,
    rating: row.rating,
    bio: row.bio,
    termStart: row.term_start,
    termEnd: row.term_end,
    contact: row.contact as Representative["contact"],
    issueScores: row.issue_scores as Representative["issueScores"],
    votingHistory: row.voting_history as Representative["votingHistory"],
    committees: row.committees as string[],
  };
}

export function useRepresentatives() {
  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("representatives")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error("Failed to load reps:", error);
        else if (data) setReps(data.map(mapRow));
        setLoading(false);
      });
  }, []);

  return { reps, loading };
}

export function useRepresentative(id: string | undefined) {
  const [rep, setRep] = useState<Representative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase
      .from("representatives")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) console.error("Failed to load rep:", error);
        else setRep(mapRow(data));
        setLoading(false);
      });
  }, [id]);

  return { rep, loading };
}
