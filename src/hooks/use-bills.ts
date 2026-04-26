import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bill } from "@/data/bills";

// Lightweight columns for list views — heavy JSON (sponsors/timeline/votes) is
// only loaded when viewing a single bill. Reduces payload + parse time.
const LIST_COLUMNS =
  "id,title,code,summary,status,topic,progress,introduced_date,last_action";

function mapListRow(row: any): Bill {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    summary: row.summary,
    status: row.status,
    topic: row.topic,
    progress: row.progress,
    introducedDate: row.introduced_date,
    lastAction: row.last_action,
    sponsors: [],
    timeline: [],
    votes: [],
  };
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("bills")
      .select(LIST_COLUMNS)
      .order("introduced_date", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("Failed to load bills:", error);
        else if (data) setBills(data.map(mapListRow));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { bills, loading };
}

export function useBill(id: number | undefined) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (id == null) {
      setBill(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("bills")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          console.error("Failed to load bill:", error);
          setBill(null);
        } else {
          setBill({
            id: data.id,
            title: data.title,
            code: data.code,
            summary: data.summary,
            status: data.status,
            topic: data.topic,
            progress: data.progress,
            introducedDate: (data as any).introduced_date,
            lastAction: (data as any).last_action,
            sponsors: data.sponsors as unknown as Bill["sponsors"],
            timeline: data.timeline as unknown as Bill["timeline"],
            votes: data.votes as unknown as Bill["votes"],
          });
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { bill, loading };
}
