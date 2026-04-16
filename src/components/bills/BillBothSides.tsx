import { useState } from "react";
import { Scale, ThumbsUp, ThumbsDown, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Side {
  headline: string;
  argument: string;
  sources: string[];
}
interface BothSides {
  for: Side;
  against: Side;
}

interface Props {
  code: string;
  title: string;
  summary: string;
}

const BillBothSides = ({ code, title, summary }: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BothSides | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("bill-both-sides", {
        body: { code, title, summary },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as BothSides);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate arguments";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="bg-card rounded-xl p-5 shadow-card animate-fade-up border border-civic-purple/20"
      style={{ animationDelay: "0.08s" }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
          <Scale className="w-4 h-4 text-civic-purple" /> Both Sides
        </h2>
        {data && (
          <Button onClick={generate} variant="ghost" size="sm" className="gap-1 text-xs h-7">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </Button>
        )}
      </div>

      {!data && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">
            See the strongest argument for and against this bill — steelmanned, balanced, with source types.
          </p>
          <Button onClick={generate} variant="default" size="sm" className="gap-2">
            <Scale className="w-4 h-4" /> Show both sides
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-6 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-civic-purple" />
          <p className="text-sm">Building balanced arguments…</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            {/* FOR */}
            <div className="bg-civic-green/5 rounded-lg p-4 border border-civic-green/15">
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsUp className="w-4 h-4 text-civic-green" />
                <span className="text-xs font-bold uppercase tracking-wide text-civic-green">For</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">
                {data.for.headline}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {data.for.argument}
              </p>
              <div className="pt-2 border-t border-civic-green/15">
                <div className="flex items-center gap-1 mb-1.5">
                  <BookOpen className="w-3 h-3 text-civic-green" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-civic-green">
                    Typical sources
                  </span>
                </div>
                <ul className="space-y-1">
                  {data.for.sources.map((s, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground leading-snug">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AGAINST */}
            <div className="bg-civic-coral/5 rounded-lg p-4 border border-civic-coral/15">
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsDown className="w-4 h-4 text-civic-coral" />
                <span className="text-xs font-bold uppercase tracking-wide text-civic-coral">Against</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">
                {data.against.headline}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {data.against.argument}
              </p>
              <div className="pt-2 border-t border-civic-coral/15">
                <div className="flex items-center gap-1 mb-1.5">
                  <BookOpen className="w-3 h-3 text-civic-coral" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-civic-coral">
                    Typical sources
                  </span>
                </div>
                <ul className="space-y-1">
                  {data.against.sources.map((s, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground leading-snug">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            AI-generated, nonpartisan steelman. Source types are illustrative — verify specific claims independently.
          </p>
        </div>
      )}
    </section>
  );
};

export default BillBothSides;
