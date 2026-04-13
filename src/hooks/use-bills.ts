import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bill } from "@/data/bills";

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("bills")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load bills:", error);
        } else if (data) {
          setBills(
            data.map((row: any) => ({
              id: row.id,
              title: row.title,
              code: row.code,
              summary: row.summary,
              status: row.status,
              topic: row.topic,
              progress: row.progress,
              introducedDate: row.introduced_date,
              lastAction: row.last_action,
              sponsors: row.sponsors as unknown as Bill["sponsors"],
              timeline: row.timeline as unknown as Bill["timeline"],
              votes: row.votes as unknown as Bill["votes"],
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { bills, loading };
}

export function useBill(id: number | undefined) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id == null) { setLoading(false); return; }
    supabase
      .from("bills")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Failed to load bill:", error);
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
  }, [id]);

  return { bill, loading };
}
