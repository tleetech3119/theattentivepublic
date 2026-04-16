import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBill } from "@/hooks/use-bills";
import BillTranslator from "@/components/bills/BillTranslator";
import {
  ArrowLeft, Calendar, CheckCircle2, Circle, Clock, FileText,
  Heart, Shield, Briefcase, GraduationCap, Leaf, Scale, Home,
  Wifi, DollarSign, Users, ThumbsUp, ThumbsDown, Minus,
} from "lucide-react";

const ISSUE_ICONS: Record<string, React.ElementType> = {
  healthcare: Heart, economy: Briefcase, education: GraduationCap,
  environment: Leaf, justice: Scale, housing: Home, technology: Wifi,
  taxes: DollarSign, immigration: Users, defense: Shield,
};

const BillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bill, loading } = useBill(id ? Number(id) : undefined);

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
          <p className="text-muted-foreground mb-4">Bill not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const Icon = ISSUE_ICONS[bill.topic] || FileText;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="gradient-hero px-6 pt-10 pb-16">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-6 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-primary-foreground/10">
              <Icon className="w-5 h-5 text-civic-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge className="bg-primary-foreground/10 text-primary-foreground/80 border-0 text-xs mb-2">
                {bill.code}
              </Badge>
              <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-2">
                {bill.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {bill.introducedDate}
                </span>
                <Badge className={`border-0 text-xs font-semibold ${
                  bill.status === "Floor Vote" ? "bg-civic-coral/20 text-civic-coral" :
                  bill.status === "Introduced" ? "bg-civic-teal/20 text-civic-teal" :
                  "bg-civic-gold/20 text-civic-gold"
                }`}>
                  {bill.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-8 space-y-6">
        {/* Progress Card */}
        <div className="bg-card rounded-xl p-5 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Legislative Progress</span>
            <span className="text-sm font-bold text-primary">{bill.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-accent rounded-full transition-all" style={{ width: `${bill.progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <Clock className="w-3 h-3 inline mr-1" /> Last action: {bill.lastAction}
          </p>
        </div>

        {/* Summary */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Summary
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{bill.summary}</p>
        </section>

        {/* AI Plain-English Translator */}
        <BillTranslator billId={bill.id} code={bill.code} title={bill.title} summary={bill.summary} />

        {/* Timeline */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-civic-teal" /> Timeline
          </h2>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-4">
              {bill.timeline.map((event, i) => (
                <div key={i} className="flex gap-3 relative">
                  <div className="shrink-0 z-10">
                    {event.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-civic-teal" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-medium ${event.completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {event.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-civic-purple" /> Sponsors ({bill.sponsors.length})
          </h2>
          <div className="space-y-2">
            {bill.sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    sponsor.party === "D" ? "bg-civic-teal-light text-civic-teal" :
                    sponsor.party === "R" ? "bg-civic-coral-light text-civic-coral" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {sponsor.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{sponsor.name}</div>
                    <div className="text-xs text-muted-foreground">{sponsor.chamber}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{sponsor.role}</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Voting History */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-civic-green" /> Voting History
          </h2>
          {bill.votes.length === 0 ? (
            <div className="text-center py-6">
              <Circle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No votes recorded yet</p>
              <p className="text-xs text-muted-foreground">Votes will appear here as the bill progresses</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bill.votes.map((vote, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{vote.chamber}</div>
                      <div className="text-xs text-muted-foreground">{vote.date}</div>
                    </div>
                    <Badge className={`border-0 text-xs font-semibold ${
                      vote.result === "Passed" ? "bg-civic-green/15 text-civic-green" :
                      vote.result === "Failed" ? "bg-destructive/15 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {vote.result}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-civic-green/10 rounded-lg p-2.5 text-center">
                      <ThumbsUp className="w-4 h-4 text-civic-green mx-auto mb-1" />
                      <div className="text-lg font-heading font-bold text-civic-green">{vote.yea}</div>
                      <div className="text-xs text-muted-foreground">Yea</div>
                    </div>
                    <div className="bg-destructive/10 rounded-lg p-2.5 text-center">
                      <ThumbsDown className="w-4 h-4 text-destructive mx-auto mb-1" />
                      <div className="text-lg font-heading font-bold text-destructive">{vote.nay}</div>
                      <div className="text-xs text-muted-foreground">Nay</div>
                    </div>
                    <div className="bg-muted rounded-lg p-2.5 text-center">
                      <Minus className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <div className="text-lg font-heading font-bold text-muted-foreground">{vote.present}</div>
                      <div className="text-xs text-muted-foreground">Present</div>
                    </div>
                  </div>
                  {/* Vote bar */}
                  <div className="flex h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-civic-green" style={{ width: `${(vote.yea / (vote.yea + vote.nay + vote.present)) * 100}%` }} />
                    <div className="bg-destructive" style={{ width: `${(vote.nay / (vote.yea + vote.nay + vote.present)) * 100}%` }} />
                    <div className="bg-muted-foreground/30" style={{ width: `${(vote.present / (vote.yea + vote.nay + vote.present)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BillDetail;
