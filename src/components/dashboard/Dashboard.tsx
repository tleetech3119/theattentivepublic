import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import tapLogo from "@/assets/tap-logo-v3.png";
import { useBills } from "@/hooks/use-bills";
import { useRepresentatives } from "@/hooks/use-representatives";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificationsBell from "@/components/notifications/NotificationsBell";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText, Users, Vote, TrendingUp, ArrowRight,
  Calendar, MapPin, Heart, Shield, Briefcase, GraduationCap,
  Leaf, Scale, Home, Wifi, DollarSign, ChevronRight, RefreshCw, BookOpen,
  User as UserIcon, LogOut, LogIn, IdCard,
} from "lucide-react";

const ISSUE_ICONS: Record<string, React.ElementType> = {
  healthcare: Heart, economy: Briefcase, education: GraduationCap,
  environment: Leaf, justice: Scale, housing: Home, technology: Wifi,
  taxes: DollarSign, immigration: Users, defense: Shield,
};

const ELECTIONS_2026 = [
  {
    slug: "2026-midterms",
    title: "2026 Midterm Elections",
    date: "Nov 3, 2026",
    dateObj: new Date("2026-11-03"),
    description: "All 435 House seats + 34 Senate seats",
    type: "Federal",
  },
  {
    slug: "2026-primaries",
    title: "State Primary Elections",
    date: "Varies by state (Jun–Sep 2026)",
    dateObj: new Date("2026-06-09"),
    description: "Party nominations for midterm candidates",
    type: "Primary",
  },
  {
    slug: "2026-governors",
    title: "Gubernatorial Races",
    date: "Nov 3, 2026",
    dateObj: new Date("2026-11-03"),
    description: "36 states elect governors",
    type: "State",
  },
  {
    slug: "2026-registration",
    title: "Voter Registration Deadline",
    date: "Varies by state (Oct 2026)",
    dateObj: new Date("2026-10-05"),
    description: "Register or verify your registration",
    type: "Deadline",
  },
];

function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface Props {
  state: string;
  county?: string;
  issues: string[];
}

const Dashboard = ({ state, county, issues }: Props) => {
  const navigate = useNavigate();
  const { bills, loading: billsLoading } = useBills();
  const { reps, loading: repsLoading } = useRepresentatives(state);
  const { user, signOut } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-congress-data");
      if (error) throw error;
      toast.success(`Synced ${data.bills_synced} bills and ${data.reps_synced} representatives from Congress.gov`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync data");
    } finally {
      setSyncing(false);
    }
  };

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
            <div className="flex items-center gap-3">
              <button onClick={handleSync} disabled={syncing} className="relative" aria-label="Sync data">
                <RefreshCw className={`w-5 h-5 text-primary-foreground/70 ${syncing ? "animate-spin" : ""}`} />
              </button>
              <NotificationsBell />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center" aria-label="Account">
                      <UserIcon className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button onClick={() => navigate("/auth")} className="text-xs text-primary-foreground/80 hover:text-primary-foreground flex items-center gap-1" aria-label="Sign in">
                  <LogIn className="w-4 h-4" /> Sign in
                </button>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-1">
            Hello 👋
          </h1>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {county ? `${county} County, ${state}` : state} • {issues.length} topics tracked
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-24 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          {[
            { icon: FileText, label: "Bills Tracked", value: displayBills.length, color: "text-civic-teal" },
            { icon: Users, label: "Your Reps", value: reps.length, color: "text-civic-coral" },
            { icon: Vote, label: "Elections", value: ELECTIONS_2026.length, color: "text-civic-purple" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-xl p-4 shadow-card text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* How to Vote — quick access to district voting info */}
        <section
          onClick={() => navigate("/voting")}
          className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex items-center justify-between animate-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center shrink-0 shadow-glow">
              <IdCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-foreground text-sm">
                How to Vote in {state}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {county ? `${county} County • ` : ""}Polling, voter ID, deadlines & mail ballots
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </section>

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
            {ELECTIONS_2026.map((e) => {
              const days = daysUntil(e.dateObj);
              return (
                <div key={e.title} onClick={() => navigate(`/election/${e.slug}`)} className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground text-sm">{e.title}</div>
                    <Badge className="bg-accent/10 text-accent border-0 font-semibold text-xs">
                      {days > 0 ? `${days} days` : "Today!"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{e.date}</div>
                  <div className="text-xs text-muted-foreground/70">{e.description}</div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                </div>
              );
            })}
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

        {/* Political Glossary */}
        <section className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div
            onClick={() => navigate("/glossary")}
            className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-civic-purple/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-civic-purple" />
              </div>
              <div>
                <div className="font-heading font-bold text-foreground text-sm">Political Glossary</div>
                <div className="text-xs text-muted-foreground">Learn key election terms & vocabulary</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
        <div className="max-w-2xl mx-auto flex justify-around">
          {[
            { icon: Home, label: "Home", path: "/app", active: true },
            { icon: FileText, label: "Bills", path: "/app" },
            { icon: Users, label: "Reps", path: "/app" },
            { icon: Vote, label: "Vote", path: "/voting" },
            { icon: BookOpen, label: "Glossary", path: "/glossary" },
          ].map(({ icon: Icon, label, path, active }) => (
            <button
              key={label}
              onClick={() => path && path !== "/app" && navigate(path)}
              className="flex flex-col items-center gap-1"
            >
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
