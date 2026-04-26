import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StateBill } from "./use-state-bills";

export interface StateBillDetail extends StateBill {
  history: Array<{ date?: string; action: string; chamber?: string }>;
}

/**
 * Loads a single state bill (by numeric LegiScan id) including full
 * sponsors + history (timeline). Public-readable table — no auth required.
 */
export function useStateBill(id: number | undefined) {
  const [bill, setBill] = useState<StateBillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id || Number.isNaN(id)) {
      setBill(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    (async () => {
      const { data, error: err } = await supabase
        .from("state_bills")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setBill(null);
      } else {
        setBill((data as unknown as StateBillDetail) ?? null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { bill, loading, error };
}
