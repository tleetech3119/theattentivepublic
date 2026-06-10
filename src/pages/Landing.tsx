import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Scale,
  Users,
  Bell,
  Sparkles,
  BookOpen,
  CheckCircle2,
  MapPin,
  Compass,
} from "lucide-react";
import tapLogo from "@/assets/tap-logo-v4.png";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/seo/Seo";

const FEATURES = [
  {
    icon: Scale,
    title: "Both Sides, AI-Powered",
    desc: "See the strongest arguments for and against every tracked bill — written in plain English, no spin.",
  },
  {
    icon: Compass,
    title: "Connect the Dots",
    desc: "Instantly link any bill to the constitutional amendments and Supreme Court cases that shaped it.",
  },
  {
    icon: Users,
    title: "Know Your Reps",
    desc: "Voting history, committees, contact info, and one-tap action toolkit for every elected official.",
  },
  {
    icon: Bell,
    title: "Watch & Get Notified",
    desc: "Follow the bills you care about and we'll ping you when status, votes, or amendments change.",
  },
  {
    icon: BookOpen,
    title: "Civic Library",
    desc: "Constitution, amendments, and landmark Supreme Court cases — all explained like a human wrote them.",
  },
  {
    icon: Sparkles,
    title: "Personalized Feed",
    desc: "Pick your state and the issues you care about. We surface what matters to you, locally and federally.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Tell us where you live",
    desc: "Pick your state and the issues you care about most. Takes 30 seconds.",
  },
  {
    n: "2",
    title: "Get your personalized feed",
    desc: "See bills, reps, and elections that actually affect you — no noise.",
  },
  {
    n: "3",
    title: "Engage with confidence",
    desc: "Watch bills, contact reps, and walk into any conversation informed.",
  },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="The Attentive Public — Nonpartisan civic engagement hub"
        description="Track legislation, know your representatives, and stay informed on 2026 elections — nonpartisan, AI-powered, always free."
        path="/"
      />
      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="hero" size="sm" className="rounded-lg">
                <Link to="/app">Open app <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild variant="hero" size="sm" className="rounded-lg">
                  <Link to="/auth?mode=signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-up flex flex-col items-center">
          <div className="bg-primary-foreground rounded-3xl p-5 mb-7 shadow-2xl">
            <img
              src={tapLogo}
              alt="TAP — The Attentive Public"
              className="w-40 h-40 md:w-56 md:h-56 block"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-3.5 h-3.5 text-civic-teal" />
            <span className="text-xs font-medium text-primary-foreground/80">Nonpartisan · Fact-based · Always free</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4 leading-tight tracking-tight">
            Simplify Election Info,<br />
            <span className="bg-gradient-to-r from-civic-teal to-civic-gold bg-clip-text text-transparent">Empower Your Voice</span>
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/75 max-w-2xl mx-auto mb-9 leading-relaxed">
            The single source of truth for engaged citizens and campaign volunteers. Track bills, know your reps, and walk into every conversation prepared.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Button asChild variant="hero" size="lg" className="rounded-xl px-8 py-6 text-base">
                <Link to="/app">Open your dashboard <ArrowRight className="w-5 h-5 ml-1" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="hero" size="lg" className="rounded-xl px-8 py-6 text-base">
                  <Link to="/auth?mode=signup">Get started free <ArrowRight className="w-5 h-5 ml-1" /></Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="rounded-xl px-8 py-6 text-base text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/auth">I already have an account</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-primary-foreground/60">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-civic-teal" /> No ads</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-civic-teal" /> No tracking</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-civic-teal" /> No spin</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-3">What you get</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Six tools that turn 4 hours of research into a 4-minute briefing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all border border-border"
              >
                <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center mb-4 shadow-glow">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 md:py-28 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-3">How it works</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              From confused to confident in 3 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="relative bg-card rounded-2xl p-7 shadow-card border border-border">
                <div className="absolute -top-4 left-7 w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
                  <span className="font-heading font-extrabold text-primary-foreground">{n}</span>
                </div>
                <div className="pt-4">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-10 md:p-14 shadow-card-hover border border-border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-accent mb-5 shadow-glow">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Your democracy. Your move.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join citizens across the country who are paying attention — and making it count.
          </p>
          {user ? (
            <Button asChild variant="hero" size="lg" className="rounded-xl px-8 py-6 text-base">
              <Link to="/app">Open your dashboard <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
          ) : (
            <Button asChild variant="hero" size="lg" className="rounded-xl px-8 py-6 text-base">
              <Link to="/auth?mode=signup">Create your free account <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={tapLogo} alt="TAP — The Attentive Public" className="w-8 h-8 rounded" />
            <span className="text-sm text-muted-foreground">
              <span className="font-heading font-bold text-foreground">TAP</span> — The Attentive Public
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Nonpartisan civic tech. Built for the people.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
