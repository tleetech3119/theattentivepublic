import { useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Translation {
  summary: string;
  winners: { group: string; reason: string }[];
  losers: { group: string; reason: string }[];
}

interface Props {
  billId: number;
  code: string;
  title: string;
  summary: string;
}

const BillTranslator = ({ code, title, summary }: Props) => {
  const [level, setLevel] = useState<"simple" | "expert">("simple");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Translation | null>(null);

  const translate = async (readingLevel: "simple" | "expert") => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("translate-bill", {
        body: { code, title, summary, readingLevel },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as Translation);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to translate bill";
      toast({ title: "Translation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (newLevel: "simple" | "expert") => {
    if (newLevel === level && data) return;
    setLevel(newLevel);
    if (data) translate(newLevel);
  };

  return (
    <section
      className="bg-card rounded-xl p-5 shadow-card animate-fade-up border border-civic-teal/20"
      style={{ animationDelay: "0.07s" }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-civic-teal" /> Plain-English Translator
        </h2>
        {data && (
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => handleLevelChange("simple")}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                level === "simple" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              8th Grade
            </button>
            <button
              onClick={() => handleLevelChange("expert")}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                level === "expert" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Expert
            </button>
          </div>
        )}
      </div>

      {!data && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">
            Get an AI-powered, nonpartisan plain-English breakdown of this bill — including who wins and who loses.
          </p>
          <Button onClick={() => translate(level)} variant="default" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" /> Translate this bill
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-6 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-civic-teal" />
          <p className="text-sm">Analyzing the bill…</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4">
          <div className="bg-civic-teal/5 rounded-lg p-4 border border-civic-teal/10">
            <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-civic-green/5 rounded-lg p-4 border border-civic-green/15">
              <h3 className="text-sm font-semibold text-civic-green flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4" /> Who wins
              </h3>
              <ul className="space-y-2">
                {data.winners.map((w, i) => (
                  <li key={i} className="text-xs">
                    <span className="font-semibold text-foreground">{w.group}</span>
                    <span className="text-muted-foreground"> — {w.reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-civic-coral/5 rounded-lg p-4 border border-civic-coral/15">
              <h3 className="text-sm font-semibold text-civic-coral flex items-center gap-1.5 mb-2">
                <TrendingDown className="w-4 h-4" /> Who loses
              </h3>
              <ul className="space-y-2">
                {data.losers.map((l, i) => (
                  <li key={i} className="text-xs">
                    <span className="font-semibold text-foreground">{l.group}</span>
                    <span className="text-muted-foreground"> — {l.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-muted-foreground italic">
              AI-generated, nonpartisan. May contain inaccuracies — verify with the official summary.
            </p>
            <Button onClick={() => translate(level)} variant="ghost" size="sm" className="gap-1 text-xs h-7">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BillTranslator;
