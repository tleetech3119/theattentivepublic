import { useState } from "react";
import { Link2, Scroll, Gavel, Sparkles, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BILL_OF_RIGHTS, ADDITIONAL_AMENDMENTS, type Amendment } from "@/data/constitution";
import { SUPREME_COURT_CASES, type SupremeCourtCase } from "@/data/supremeCourtCases";

interface ConnectTheDotsProps {
  code: string;
  title: string;
  summary: string;
}

interface AmendmentLink { number: number; connection: string; }
interface CaseLink { id: string; connection: string; }
interface Connections {
  bigPicture: string;
  amendments: AmendmentLink[];
  cases: CaseLink[];
}

const ALL_AMENDMENTS: Amendment[] = [...BILL_OF_RIGHTS, ...ADDITIONAL_AMENDMENTS];

const ConnectTheDots = ({ code, title, summary }: ConnectTheDotsProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Connections | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("connect-the-dots", {
        body: {
          code,
          title,
          summary,
          amendments: ALL_AMENDMENTS.map((a) => ({ number: a.number, shortName: a.shortName })),
          cases: SUPREME_COURT_CASES.map((c) => ({
            id: c.id,
            name: c.name,
            year: c.year,
            category: c.category,
            shortDescription: c.shortDescription,
          })),
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as Connections);
    } catch (e: any) {
      console.error("connect-the-dots error:", e);
      toast.error(e?.message || "Couldn't connect the dots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const findAmendment = (n: number) => ALL_AMENDMENTS.find((a) => a.number === n);
  const findCase = (id: string): SupremeCourtCase | undefined =>
    SUPREME_COURT_CASES.find((c) => c.id === id);

  return (
    <section
      className="bg-card rounded-xl p-5 shadow-card animate-fade-up"
      style={{ animationDelay: "0.08s" }}
    >
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
          <Link2 className="w-4 h-4 text-civic-purple" /> Connect the Dots
        </h2>
        {!data && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleConnect}
            disabled={loading}
            className="shrink-0"
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Connecting…</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Find connections</>
            )}
          </Button>
        )}
      </div>

      {!data && !loading && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          See which constitutional amendments and landmark Supreme Court cases shape the legal
          context of this bill — explained in plain English by AI.
        </p>
      )}

      {loading && !data && (
        <div className="py-6 text-center text-sm text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-civic-purple" />
          Tracing the constitutional thread…
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* Big picture */}
          <div className="bg-civic-purple/5 border border-civic-purple/20 rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-civic-purple mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Big Picture
            </div>
            <p className="text-sm text-foreground leading-relaxed">{data.bigPicture}</p>
          </div>

          {/* Amendments */}
          {data.amendments.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-civic-teal" /> Constitutional Amendments
              </div>
              <div className="space-y-2">
                {data.amendments.map((a) => {
                  const amend = findAmendment(a.number);
                  if (!amend) return null;
                  return (
                    <Link
                      key={a.number}
                      to={`/glossary?tab=amendments&amendment=${a.number}`}
                      className="block border border-border rounded-lg p-3 hover:border-civic-teal/40 hover:bg-civic-teal/5 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-civic-teal/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-civic-teal">{amend.romanNumeral}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-foreground">
                              {amend.number}{amend.number === 1 ? "st" : amend.number === 2 ? "nd" : amend.number === 3 ? "rd" : "th"} Amendment
                            </span>
                            <Badge variant="secondary" className="text-[10px] py-0">
                              {amend.shortName}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{a.connection}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-civic-teal shrink-0 mt-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cases */}
          {data.cases.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-civic-coral" /> Landmark Supreme Court Cases
              </div>
              <div className="space-y-2">
                {data.cases.map((c) => {
                  const sc = findCase(c.id);
                  if (!sc) return null;
                  return (
                    <Link
                      key={c.id}
                      to={`/glossary?tab=cases&case=${c.id}`}
                      className="block border border-border rounded-lg p-3 hover:border-civic-coral/40 hover:bg-civic-coral/5 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-civic-coral/10 flex items-center justify-center shrink-0">
                          <Gavel className="w-4 h-4 text-civic-coral" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-sm font-semibold text-foreground italic">
                              {sc.name}
                            </span>
                            <span className="text-xs text-muted-foreground">({sc.year})</span>
                            <Badge variant="secondary" className="text-[10px] py-0">{sc.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{c.connection}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-civic-coral shrink-0 mt-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {data.amendments.length === 0 && data.cases.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No strong constitutional or landmark-case connection identified for this bill.
            </p>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleConnect}
            disabled={loading}
            className="w-full text-xs text-muted-foreground"
          >
            {loading ? (
              <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Regenerating…</>
            ) : (
              <><Sparkles className="w-3 h-3 mr-1.5" /> Regenerate</>
            )}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ConnectTheDots;
