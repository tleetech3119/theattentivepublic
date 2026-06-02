import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";

interface CandidateLinkProps {
  name: string;
  state: string;
  party?: string;
  office?: string;
  className?: string;
}

export const CandidateLink = ({
  name,
  state,
  party,
  office = "Governor",
  className,
}: CandidateLinkProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${name} ${state} ${office} 2026 official campaign website`,
  )}`;

  const load = async () => {
    if (summary || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke(
        "candidate-summary",
        { body: { name, state, party, office } },
      );
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      setSummary(data?.summary ?? "No summary available.");
      setSourceUrl(data?.source_url ?? fallbackUrl);
    } catch (e: any) {
      setError(e?.message ?? "Could not load summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={sourceUrl ?? fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={load}
          onFocus={load}
          className={`hover:text-primary hover:underline underline-offset-2 transition-colors inline-flex items-center gap-1 ${className ?? ""}`}
        >
          {name}
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-xs leading-relaxed" side="top">
        <div className="font-semibold text-foreground mb-1">{name}</div>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading AI summary…
          </div>
        )}
        {error && <div className="text-destructive">{error}</div>}
        {summary && <p className="text-muted-foreground">{summary}</p>}
        {!loading && !summary && !error && (
          <p className="text-muted-foreground">Hover to load AI summary.</p>
        )}
        <p className="mt-2 text-[10px] text-muted-foreground/70 italic">
          AI-generated. Verify on the candidate's official site.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};
