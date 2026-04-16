import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { SupremeCourtCase } from "@/data/supremeCourtCases";

interface Explanation {
  summary: string;
  keyPoints: string[];
  whyItMatters: string;
}

const CaseExplainer = ({ caseData }: { caseData: SupremeCourtCase }) => {
  const [level, setLevel] = useState<"simple" | "expert">("simple");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Explanation | null>(null);

  const explain = async (readingLevel: "simple" | "expert") => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("explain-case", {
        body: {
          name: caseData.name,
          year: caseData.year,
          background: caseData.background,
          ruling: caseData.ruling,
          significance: caseData.significance,
          readingLevel,
        },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as Explanation);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to explain case";
      toast({ title: "Explanation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (newLevel: "simple" | "expert") => {
    if (newLevel === level && data) return;
    setLevel(newLevel);
    if (data) explain(newLevel);
  };

  return (
    <div className="mt-3 pt-3 border-t border-border">
      {!data && !loading && (
        <Button
          onClick={() => explain(level)}
          variant="outline"
          size="sm"
          className="gap-2 w-full text-civic-teal border-civic-teal/30 hover:bg-civic-teal/5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Explain in plain English
        </Button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-3 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-civic-teal" />
          <span className="text-xs">Explaining…</span>
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
              <p className="text-xs font-semibold text-foreground mb-1.5">Key takeaways</p>
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
                  Why it still matters today
                </p>
                <p className="text-xs text-foreground leading-relaxed">{data.whyItMatters}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => explain(level)} variant="ghost" size="sm" className="gap-1 text-xs h-6">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseExplainer;
