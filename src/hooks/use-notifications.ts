import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Bill } from "@/data/bills";

export interface BillNotification {
  id: string;
  bill_id: number;
  change_type: "status" | "progress" | "vote" | "timeline";
  title: string;
  detail: string | null;
  read_at: string | null;
  created_at: string;
}

function mapBillRow(row: any): Bill {
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
    sponsors: row.sponsors,
    timeline: row.timeline,
    votes: row.votes,
  };
}

/**
 * Diffs each watched bill against its stored snapshot. For every detected
 * change, inserts a bill_notifications row and updates the snapshot.
 */
async function runDiff(userId: string) {
  const { data: watches, error: wErr } = await supabase
    .from("bill_watches")
    .select("*")
    .eq("user_id", userId);
  if (wErr || !watches || watches.length === 0) return;

  const billIds = watches.map((w) => w.bill_id);
  const { data: billRows, error: bErr } = await supabase
    .from("bills")
    .select("*")
    .in("id", billIds);
  if (bErr || !billRows) return;

  const billMap = new Map<number, Bill>(
    billRows.map((r: any) => [r.id, mapBillRow(r)])
  );

  for (const w of watches) {
    const bill = billMap.get(w.bill_id);
    if (!bill) continue;

    const notes: { change_type: string; title: string; detail: string }[] = [];

    if (bill.status !== w.snapshot_status) {
      notes.push({
        change_type: "status",
        title: `${bill.code}: status changed`,
        detail: `${w.snapshot_status} → ${bill.status}`,
      });
    }
    if (bill.progress !== w.snapshot_progress) {
      notes.push({
        change_type: "progress",
        title: `${bill.code}: progress updated`,
        detail: `${w.snapshot_progress}% → ${bill.progress}%`,
      });
    }
    const votesCount = bill.votes?.length ?? 0;
    if (votesCount > w.snapshot_votes_count) {
      notes.push({
        change_type: "vote",
        title: `${bill.code}: new vote recorded`,
        detail: `${votesCount - w.snapshot_votes_count} new vote(s)`,
      });
    }
    const timelineCount = bill.timeline?.length ?? 0;
    if (timelineCount > w.snapshot_timeline_count) {
      notes.push({
        change_type: "timeline",
        title: `${bill.code}: new amendment / action`,
        detail: `${timelineCount - w.snapshot_timeline_count} new event(s)`,
      });
    }

    if (notes.length > 0) {
      await supabase.from("bill_notifications").insert(
        notes.map((n) => ({
          user_id: userId,
          bill_id: bill.id,
          change_type: n.change_type,
          title: n.title,
          detail: n.detail,
        }))
      );
    }

    await supabase
      .from("bill_watches")
      .update({
        snapshot_status: bill.status,
        snapshot_progress: bill.progress,
        snapshot_last_action: bill.lastAction,
        snapshot_votes_count: votesCount,
        snapshot_timeline_count: timelineCount,
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", w.id);
  }
}

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<BillNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const ranDiffRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("bill_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) console.error("Failed to load notifications:", error);
    else setItems((data ?? []) as BillNotification[]);
    setLoading(false);
  }, [user]);

  // Run diff once per session when the user lands, then load notifications.
  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      ranDiffRef.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      if (!ranDiffRef.current) {
        ranDiffRef.current = true;
        try {
          await runDiff(user.id);
        } catch (e) {
          console.error("Diff failed:", e);
        }
      }
      if (!cancelled) await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [user, refresh]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    const now = new Date().toISOString();
    await supabase
      .from("bill_notifications")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);
    await refresh();
  }, [user, refresh]);

  const unreadCount = items.filter((n) => !n.read_at).length;

  return { items, loading, unreadCount, refresh, markAllRead };
}
