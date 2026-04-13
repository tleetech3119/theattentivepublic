import { useEffect, useState } from "react";

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
    if (!repId) {
      setLoading(false);
      return;
    }

    const fetchLegislation = async () => {
      setLoading(true);
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-rep-legislation?rep_id=${encodeURIComponent(repId)}`,
          {
            headers: {
              Authorization: `Bearer ${anonKey}`,
              apikey: anonKey,
            },
          }
        );
        const result = await res.json();
        setBills(result.legislation || []);
      } catch (err) {
        console.error("Failed to fetch sponsored legislation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLegislation();
  }, [repId]);

  return { bills, loading };
}
