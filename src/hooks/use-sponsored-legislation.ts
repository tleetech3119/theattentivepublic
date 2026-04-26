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
        const { data, error } = await supabase.functions.invoke("get-rep-legislation", {
          body: null,
          // pass rep_id via query string — invoke supports it via headers/path; fall back to manual URL
        });
        // The invoke helper doesn't take query params, so use direct fetch with the SDK's session
        const { data: sessionData } = await supabase.auth.getSession();
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const token = sessionData.session?.access_token ?? anonKey;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-rep-legislation?rep_id=${encodeURIComponent(repId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: anonKey,
            },
          }
        );
        const result = await res.json();
        if (!cancelled) setBills(result.legislation ?? []);
        // suppress unused-var lint
        void data; void error;
      } catch (err) {
        console.error("Failed to fetch sponsored legislation:", err);
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
