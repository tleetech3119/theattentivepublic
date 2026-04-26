import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StateBill {
  id: number;
  state: string;
  bill_code: string;
  title: string;
  summary: string;
  status: string;
  topic: string;
  progress: number;
  last_action: string;
  last_action_date: string | null;
  introduced_date: string | null;
  session_name: string | null;
  state_url: string | null;
  legiscan_url: string | null;
  sponsors: Array<{ name: string; party?: string; role?: string }>;
  subjects: string[];
}

const LIST_COLUMNS =
  "id,state,bill_code,title,summary,status,topic,progress,last_action,last_action_date,state_url,legiscan_url";

/**
 * Fetches state bills for a given USPS state code.
 * Triggers an on-demand LegiScan sync if the state has never been synced
 * or if the cached data is stale (server-side cooldown handles dedup).
 */
export function useStateBills(state: string | undefined) {
  const [bills, setBills] = useState<StateBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!state) {
      setBills([]);
      setLoading(false);
      return;
    }

    const stateCode = state.toUpperCase();
    setLoading(true);
    setError(null);

    async function load() {
      // Step 1: read whatever is cached locally first (fast)
      const { data: existing, error: readErr } = await supabase
        .from("state_bills")
        .select(LIST_COLUMNS)
        .eq("state", stateCode)
        .order("last_action_date", { ascending: false, nullsFirst: false })
        .limit(200);

      if (cancelled) return;
      if (readErr) {
        console.error("Failed to load state bills:", readErr);
      } else if (existing) {
        setBills(existing as unknown as StateBill[]);
      }
      setLoading(false);

      // Step 2: trigger background sync (server enforces cooldown)
      const needsSync = !existing || existing.length === 0;
      setSyncing(true);
      try {
        const { error: fnErr } = await supabase.functions.invoke("sync-legiscan-bills", {
          body: { state: stateCode },
        });
        if (cancelled) return;
        if (fnErr) {
          // Only show error if we have nothing to display
          if (needsSync) setError(fnErr.message);
        } else {
          // Re-read after sync to pick up new data
          const { data: refreshed } = await supabase
            .from("state_bills")
            .select(LIST_COLUMNS)
            .eq("state", stateCode)
            .order("last_action_date", { ascending: false, nullsFirst: false })
            .limit(200);
          if (!cancelled && refreshed) setBills(refreshed as unknown as StateBill[]);
        }
      } catch (e: any) {
        if (!cancelled && needsSync) setError(e?.message ?? "Sync failed");
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [state]);

  return { bills, loading, syncing, error };
}
