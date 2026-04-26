import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SponsoredBill {
  id: string;
  rep_id: string;
  bill_code: string;
  bill_title: string;
  introduced_date: string;
  status: string;
  topic: string;
  congress_url: string;
}

export function useSponsoredLegislation(repId: string | undefined) {
  const [bills, setBills] = useState<SponsoredBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!repId) {
      setBills([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        // Forward the user's session token if available so the function
        // can authorize gracefully; otherwise fall back to the anon key.
        const { data: sessionData } = await supabase.auth.getSession();
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const token = sessionData.session?.access_token ?? anonKey;

        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-rep-legislation?rep_id=${encodeURIComponent(repId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: anonKey,
            },
          },
        );
        const result = await res.json();
        if (!cancelled) setBills(result.legislation ?? []);
      } catch (err) {
        console.error("Failed to fetch sponsored legislation:", err);
        if (!cancelled) setBills([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repId]);

  return { bills, loading };
}
