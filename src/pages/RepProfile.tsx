import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRepresentative } from "@/hooks/use-representatives";
import { useSponsoredLegislation } from "@/hooks/use-sponsored-legislation";
import {
  ArrowLeft, Heart, Shield, Briefcase,
  GraduationCap, Leaf, Scale, Home, Wifi, DollarSign, Users,
  FileText, Calendar, Loader2, Megaphone,
} from "lucide-react";
import ActionToolkit from "@/components/representatives/ActionToolkit";

const ISSUE_ICONS: Record<string, React.ElementType> = {
  healthcare: Heart, economy: Briefcase, education: GraduationCap,
  environment: Leaf, justice: Scale, housing: Home, technology: Wifi,
  taxes: DollarSign, immigration: Users, defense: Shield,
};

const ISSUE_LABELS: Record<string, string> = {
  healthcare: "Healthcare", economy: "Economy", education: "Education",
  environment: "Environment", justice: "Justice", housing: "Housing",
  technology: "Technology", taxes: "Taxes", immigration: "Immigration",
  defense: "Defense",
};

const VOTE_COLORS: Record<string, string> = {
  Yea: "bg-civic-green/10 text-civic-green",
  Nay: "bg-destructive/10 text-destructive",
  Present: "bg-muted text-muted-foreground",
  "Not Voting": "bg-muted text-muted-foreground",
};

const RepProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rep, loading } = useRepresentative(id);
  const { bills: sponsoredBills, loading: billsLoading } = useSponsoredLegislation(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!rep) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Representative not found</h2>
          <button onClick={() => navigate(-1)} className="text-primary font-medium text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const partyColor = rep.party === "D" ? "bg-civic-teal" : rep.party === "R" ? "bg-civic-coral" : "bg-muted-foreground";
  const partyBg = rep.party === "D" ? "bg-civic-teal-light text-civic-teal" : rep.party === "R" ? "bg-civic-coral-light text-civic-coral" : "bg-muted text-muted-foreground";
  const partyLabel = rep.party === "D" ? "Democrat" : rep.party === "R" ? "Republican" : "Independent";

  const avgScore = Math.round(rep.issueScores.reduce((a, s) => a + s.score, 0) / rep.issueScores.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-6 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-heading font-bold text-xl ${partyBg}`}>
              {rep.name.split(" ").slice(-1)[0][0]}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary-foreground">{rep.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${partyBg} border-0 text-xs font-semibold`}>{partyLabel}</Badge>
                <span className="text-primary-foreground/60 text-sm">{rep.chamber}</span>
                <span className="text-primary-foreground/60 text-sm">• {rep.state}{rep.district ? ` (${rep.district})` : ""}</span>
              </div>
            </div>
          </div>
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 gap-3 mt-6">
            <div className="bg-primary-foreground/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-heading font-bold text-primary-foreground">{rep.votingHistory.length}</div>
              <div className="text-xs text-primary-foreground/60">Votes Tracked</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-card shadow-card rounded-xl p-1 mb-6 flex-wrap h-auto">
            <TabsTrigger value="overview" className="flex-1 text-xs">Overview</TabsTrigger>
            <TabsTrigger value="legislation" className="flex-1 text-xs">Bills</TabsTrigger>
            <TabsTrigger value="votes" className="flex-1 text-xs">Votes</TabsTrigger>
            <TabsTrigger value="alignment" className="flex-1 text-xs">Alignment</TabsTrigger>
            <TabsTrigger value="action" className="flex-1 text-xs gap-1">
              <Megaphone className="w-3 h-3" /> Take Action
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1 text-xs">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{rep.bio}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Term: {rep.termStart} – {rep.termEnd}</span>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-foreground mb-3">Committees</h3>
              <div className="space-y-2">
                {rep.committees.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
            {/* Top Issues */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-foreground mb-3">Top Issue Alignment</h3>
              <div className="space-y-3">
                {rep.issueScores.sort((a, b) => b.score - a.score).slice(0, 4).map((s) => {
                  const Icon = ISSUE_ICONS[s.issue] || FileText;
                  return (
                    <div key={s.issue} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-civic-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground capitalize">{ISSUE_LABELS[s.issue] || s.issue}</span>
                          <span className="text-sm font-semibold text-foreground">{s.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-accent rounded-full transition-all"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Sponsored Legislation Tab */}
          <TabsContent value="legislation" className="space-y-3 animate-fade-up">
            {billsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Loading sponsored bills…</span>
              </div>
            ) : sponsoredBills.length === 0 ? (
              <div className="bg-card rounded-xl p-6 shadow-card text-center">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No sponsored legislation found yet.</p>
              </div>
            ) : (
              sponsoredBills.map((bill) => {
                const Icon = ISSUE_ICONS[bill.topic] || FileText;
                return (
                  <div key={bill.bill_code} className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-civic-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm mb-1 line-clamp-2">{bill.bill_title}</div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="secondary" className="text-xs capitalize">{bill.topic}</Badge>
                          <span className="text-xs text-muted-foreground">{bill.bill_code}</span>
                        </div>
                        {bill.introduced_date && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Introduced {bill.introduced_date}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{bill.status}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* Votes Tab */}
          <TabsContent value="votes" className="space-y-3 animate-fade-up">
            {rep.votingHistory.map((v) => {
              const Icon = ISSUE_ICONS[v.billTopic] || FileText;
              return (
                <div key={v.billCode + v.date} className="bg-card rounded-xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-civic-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{v.billTitle}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{v.billCode}</span>
                        <span className="text-xs text-muted-foreground">• {v.date}</span>
                      </div>
                    </div>
                    <Badge className={`${VOTE_COLORS[v.vote]} border-0 text-xs font-semibold shrink-0`}>
                      {v.vote}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Alignment Tab */}
          <TabsContent value="alignment" className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="text-center mb-4">
                <div className="text-4xl font-heading font-bold text-foreground">{avgScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Alignment Score</div>
              </div>
            </div>
            <div className="space-y-3">
              {rep.issueScores.sort((a, b) => b.score - a.score).map((s) => {
                const Icon = ISSUE_ICONS[s.issue] || FileText;
                const TrendIcon = s.trend === "up" ? TrendingUp : s.trend === "down" ? TrendingDown : Minus;
                const trendColor = s.trend === "up" ? "text-civic-green" : s.trend === "down" ? "text-destructive" : "text-muted-foreground";
                return (
                  <div key={s.issue} className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-civic-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm capitalize">{ISSUE_LABELS[s.issue] || s.issue}</span>
                          <div className="flex items-center gap-1.5">
                            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
                            <span className="text-sm font-bold text-foreground">{s.score}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              s.score >= 75 ? "bg-civic-green" : s.score >= 50 ? "bg-civic-gold" : "bg-destructive"
                            }`}
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Take Action Tab */}
          <TabsContent value="action" className="animate-fade-up">
            <ActionToolkit
              repId={rep.id}
              repName={rep.name}
              repChamber={rep.chamber}
              repEmail={rep.contact.email}
              repPhone={rep.contact.phone}
            />
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-3 animate-fade-up">
            {[
              { icon: Phone, label: "Phone", value: rep.contact.phone, href: rep.contact.phone ? `tel:${rep.contact.phone}` : undefined },
              { icon: Mail, label: "Email", value: rep.contact.email, href: rep.contact.email ? `mailto:${rep.contact.email}` : undefined },
              { icon: MapPin, label: "Office", value: rep.contact.office },
              { icon: Globe, label: "Website", value: rep.contact.website, href: rep.contact.website || undefined },
              ...(rep.contact.twitter ? [{ icon: ExternalLink, label: "Twitter", value: rep.contact.twitter, href: `https://twitter.com/${rep.contact.twitter.replace("@", "")}` }] : []),
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-card rounded-xl p-4 shadow-card">
                {href && value ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-civic-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{value}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-civic-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="text-sm font-medium text-muted-foreground italic">{value || "Not available"}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RepProfile;
