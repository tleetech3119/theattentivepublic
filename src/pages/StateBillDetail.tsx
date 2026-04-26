import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStateBill } from "@/hooks/use-state-bill";
import BillTranslator from "@/components/bills/BillTranslator";
import BillBothSides from "@/components/bills/BillBothSides";
import ConnectTheDots from "@/components/bills/ConnectTheDots";
import {
  ArrowLeft, Calendar, CheckCircle2, Circle, Clock, FileText,
  Heart, Shield, Briefcase, GraduationCap, Leaf, Scale, Home,
  Wifi, DollarSign, Users, ExternalLink, Baby, Vote, ThumbsUp,
} from "lucide-react";

const ISSUE_ICONS: Record<string, React.ElementType> = {
  healthcare: Heart, economy: Briefcase, education: GraduationCap,
  environment: Leaf, justice: Scale, housing: Home, technology: Wifi,
  taxes: DollarSign, immigration: Users, defense: Shield,
  reproductive_rights: Baby, voting: Vote,
};

const TOPIC_LABEL: Record<string, string> = {
  reproductive_rights: "Reproductive Rights",
  voting: "Voting Rights",
};

const StateBillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bill, loading } = useStateBill(id ? Number(id) : undefined);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">State bill not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const Icon = ISSUE_ICONS[bill.topic] || FileText;
  const topicLabel = TOPIC_LABEL[bill.topic] ?? bill.topic;
  const officialUrl = bill.state_url || bill.legiscan_url;

  // Sort history newest-first for timeline display
  const timeline = [...(bill.history ?? [])].sort((a, b) => {
    const da = a?.date ? new Date(a.date).getTime() : 0;
    const db = b?.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="gradient-hero px-6 pt-10 pb-16">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-6 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-primary-foreground/10">
              <Icon className="w-5 h-5 text-civic-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-civic-purple/20 text-primary-foreground border-0 text-xs">
                  {bill.state} STATE
                </Badge>
                <Badge className="bg-primary-foreground/10 text-primary-foreground/80 border-0 text-xs">
                  {bill.bill_code}
                </Badge>
              </div>
              <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-2">
                {bill.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/60 flex-wrap">
                {bill.introduced_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {bill.introduced_date}
                  </span>
                )}
                <Badge className="bg-primary-foreground/10 text-primary-foreground border-0 text-xs font-semibold">
                  {bill.status}
                </Badge>
                {bill.session_name && (
                  <span className="text-xs text-primary-foreground/50">{bill.session_name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-8 space-y-6">
        {/* Official link */}
        {officialUrl && (
          <div className="flex justify-end animate-fade-up">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                {bill.state_url ? `View on ${bill.state} legislature site` : "View on LegiScan"}
              </a>
            </Button>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-card rounded-xl p-5 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Legislative Progress</span>
            <span className="text-sm font-bold text-primary">{bill.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-accent rounded-full transition-all" style={{ width: `${bill.progress}%` }} />
          </div>
          {bill.last_action && (
            <p className="text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3 inline mr-1" />
              {bill.last_action_date ? `${bill.last_action_date} — ` : ""}{bill.last_action}
            </p>
          )}
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs capitalize">{topicLabel}</Badge>
          </div>
        </div>

        {/* Summary */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Summary
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {bill.summary || "No summary provided yet by the state legislature."}
          </p>
          {bill.subjects && bill.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {bill.subjects.slice(0, 8).map((s) => (
                <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
              ))}
            </div>
          )}
        </section>

        {/* AI Plain-English Translator */}
        <BillTranslator
          billId={bill.id}
          code={`${bill.state} ${bill.bill_code}`}
          title={bill.title}
          summary={bill.summary || bill.title}
        />

        {/* Both Sides */}
        <BillBothSides
          code={`${bill.state} ${bill.bill_code}`}
          title={bill.title}
          summary={bill.summary || bill.title}
        />

        {/* Connect the Dots: Constitution + SCOTUS */}
        <ConnectTheDots
          code={`${bill.state} ${bill.bill_code}`}
          title={bill.title}
          summary={bill.summary || bill.title}
        />

        {/* Timeline (from LegiScan history) */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-civic-teal" /> Timeline
          </h2>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timeline events recorded yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="shrink-0 z-10">
                      {i === 0 ? (
                        <CheckCircle2 className="w-6 h-6 text-civic-teal" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {event.action}
                        </span>
                        {event.date && (
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        )}
                        {event.chamber && (
                          <Badge variant="outline" className="text-[10px] py-0">
                            {event.chamber === "H" ? "House" : event.chamber === "S" ? "Senate" : event.chamber}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Sponsors */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-civic-purple" /> Sponsors ({bill.sponsors?.length ?? 0})
          </h2>
          {(!bill.sponsors || bill.sponsors.length === 0) ? (
            <p className="text-sm text-muted-foreground">No sponsor data available.</p>
          ) : (
            <div className="space-y-2">
              {bill.sponsors.map((sponsor, i) => {
                const initial = sponsor.name?.split(" ").slice(-1)[0]?.[0] ?? "?";
                return (
                  <div key={`${sponsor.name}-${i}`} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        sponsor.party === "D" ? "bg-civic-teal-light text-civic-teal" :
                        sponsor.party === "R" ? "bg-civic-coral-light text-civic-coral" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{sponsor.name}</div>
                        {sponsor.party && (
                          <div className="text-xs text-muted-foreground">{sponsor.party === "D" ? "Democrat" : sponsor.party === "R" ? "Republican" : sponsor.party}</div>
                        )}
                      </div>
                    </div>
                    {sponsor.role && (
                      <Badge variant="secondary" className="text-xs shrink-0">{sponsor.role}</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Votes — state bill votes aren't synced from LegiScan yet */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-civic-green" /> Voting History
          </h2>
          <div className="text-center py-6">
            <Circle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Roll-call votes not yet available for state bills.</p>
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
              >
                View votes on official site <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </section>

        <p className="text-[11px] text-muted-foreground text-center pt-2">
          State bill data via{" "}
          <a href="https://legiscan.com" target="_blank" rel="noopener noreferrer" className="underline">
            LegiScan
          </a>
        </p>
      </div>
    </div>
  );
};

export default StateBillDetail;
