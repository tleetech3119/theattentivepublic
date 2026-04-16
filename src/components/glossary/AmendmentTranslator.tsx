import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Translation {
  summary: string;
  keyPoints: string[];
  whyItMatters: string;
}

interface Props {
  title: string;
  text: string;
}

const AmendmentTranslator = ({ title, text }: Props) => {
  const [level, setLevel] = useState<"simple" | "expert">("simple");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Translation | null>(null);

  const translate = async (readingLevel: "simple" | "expert") => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("translate-amendment", {
        body: { title, text, readingLevel },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as Translation);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to translate";
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
    <div className="mt-3 pt-3 border-t border-border">
      {!data && !loading && (
        <Button
          onClick={() => translate(level)}
          variant="outline"
          size="sm"
          className="gap-2 w-full text-civic-teal border-civic-teal/30 hover:bg-civic-teal/5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Translate to plain English
        </Button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-3 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-civic-teal" />
          <span className="text-xs">Translating…</span>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-civic-teal flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Plain English
            </span>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              <button
                onClick={() => handleLevelChange("simple")}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                  level === "simple"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                8th Grade
              </button>
              <button
                onClick={() => handleLevelChange("expert")}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                  level === "expert"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expert
              </button>
            </div>
          </div>

          <div className="bg-civic-teal/5 rounded-lg p-3 border border-civic-teal/10">
            <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
          </div>

          {data.keyPoints?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5">Key points</p>
              <ul className="space-y-1">
                {data.keyPoints.map((p, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-civic-teal mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.whyItMatters && (
            <div className="bg-muted/50 rounded-lg p-3 flex gap-2">
              <Lightbulb className="w-4 h-4 text-civic-coral flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Why it matters
                </p>
                <p className="text-xs text-foreground leading-relaxed">{data.whyItMatters}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => translate(level)} variant="ghost" size="sm" className="gap-1 text-xs h-6">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmendmentTranslator;
