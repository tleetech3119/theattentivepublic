import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Bill } from "@/data/bills";

export interface WatchRow {
  id: string;
  bill_id: number;
  snapshot_status: string;
  snapshot_progress: number;
  snapshot_last_action: string;
  snapshot_votes_count: number;
  snapshot_timeline_count: number;
  last_checked_at: string;
}

function snapshotFromBill(bill: Bill) {
  return {
    snapshot_status: bill.status,
    snapshot_progress: bill.progress,
    snapshot_last_action: bill.lastAction,
    snapshot_votes_count: bill.votes?.length ?? 0,
    snapshot_timeline_count: bill.timeline?.length ?? 0,
  };
}

export function useWatchList() {
  const { user } = useAuth();
  const [watches, setWatches] = useState<WatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setWatches([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("bill_watches")
      .select("*")
      .eq("user_id", user.id);
    if (error) console.error("Failed to load watches:", error);
    else setWatches((data ?? []) as WatchRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isWatching = useCallback(
    (billId: number) => watches.some((w) => w.bill_id === billId),
    [watches]
  );

  const watch = useCallback(
    async (bill: Bill) => {
      if (!user) return { error: "Not signed in" };
      const { error } = await supabase.from("bill_watches").insert({
        user_id: user.id,
        bill_id: bill.id,
        ...snapshotFromBill(bill),
        last_checked_at: new Date().toISOString(),
      });
      if (!error) await refresh();
      return { error: error?.message ?? null };
    },
    [user, refresh]
  );

  const unwatch = useCallback(
    async (billId: number) => {
      if (!user) return;
      await supabase.from("bill_watches").delete().eq("user_id", user.id).eq("bill_id", billId);
      await refresh();
    },
    [user, refresh]
  );

  return { watches, loading, isWatching, watch, unwatch, refresh };
}
