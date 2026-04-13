import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import tapLogo from "@/assets/tap-logo-v2.png";
import { useBills } from "@/hooks/use-bills";
import { useRepresentatives } from "@/hooks/use-representatives";
import {
  FileText, Users, Vote, Bell, TrendingUp, ArrowRight,
  Calendar, MapPin, Heart, Shield, Briefcase, GraduationCap,
  Leaf, Scale, Home, Wifi, DollarSign, ChevronRight,
} from "lucide-react";

const ISSUE_ICONS: Record<string, React.ElementType> = {
  healthcare: Heart, economy: Briefcase, education: GraduationCap,
  environment: Leaf, justice: Scale, housing: Home, technology: Wifi,
  taxes: DollarSign, immigration: Users, defense: Shield,
};

const MOCK_ELECTIONS = [
  { title: "State Primary Election", date: "May 14, 2026", daysAway: 33 },
  { title: "City Council Special Election", date: "Jun 2, 2026", daysAway: 52 },
];

interface Props {
  state: string;
  issues: string[];
}

const Dashboard = ({ state, issues }: Props) => {
  const navigate = useNavigate();
  const { bills, loading: billsLoading } = useBills();
  const { reps, loading: repsLoading } = useRepresentatives();

  const relevantBills = bills.filter((b) => issues.includes(b.topic));
  const displayBills = relevantBills.length > 0 ? relevantBills : bills.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img src={tapLogo} alt="TAP" width={32} height={32} />
              <span className="font-heading font-bold text-primary-foreground text-lg">TAP</span>
            </div>
            <button className="relative">
              <Bell className="w-5 h-5 text-primary-foreground/70" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full" />
            </button>
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-1">
            Good morning 👋
          </h1>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {state} • {issues.length} topics tracked
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-24 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          {[
            { icon: FileText, label: "Bills Tracked", value: displayBills.length, color: "text-civic-teal" },
            { icon: Users, label: "Your Reps", value: reps.length, color: "text-civic-coral" },
            { icon: Vote, label: "Elections", value: MOCK_ELECTIONS.length, color: "text-civic-purple" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-xl p-4 shadow-card text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Elections */}
        <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-civic-coral" /> Upcoming Elections
            </h2>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_ELECTIONS.map((e) => (
              <div key={e.title} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground text-sm">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.date}</div>
                </div>
                <Badge className="bg-accent/10 text-accent border-0 font-semibold text-xs">
                  {e.daysAway} days
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Legislation Tracker */}
        <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-civic-teal" /> Legislation For You
            </h2>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {displayBills.map((bill) => {
              const Icon = ISSUE_ICONS[bill.topic] || FileText;
              return (
                <div key={bill.id} onClick={() => navigate(`/bill/${bill.id}`)} className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-civic-teal-light flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-civic-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm mb-1">{bill.title}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs capitalize">{bill.topic}</Badge>
                        <span className="text-xs text-muted-foreground">{bill.status}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-accent rounded-full transition-all"
                          style={{ width: `${bill.progress}%` }}
                        />
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Your Representatives */}
        <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-civic-purple" /> Your Representatives
            </h2>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {reps.map((rep) => (
              <div key={rep.id} onClick={() => navigate(`/rep/${rep.id}`)} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                    rep.party === "D" ? "bg-civic-teal-light text-civic-teal" : "bg-civic-coral-light text-civic-coral"
                  }`}>
                    {rep.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{rep.name}</div>
                    <div className="text-xs text-muted-foreground">{rep.chamber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-civic-green bg-civic-green/10 px-2 py-0.5 rounded-full">
                    {rep.rating}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
        <div className="max-w-2xl mx-auto flex justify-around">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: FileText, label: "Bills" },
            { icon: Users, label: "Reps" },
            { icon: Vote, label: "Vote" },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-1">
              <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
