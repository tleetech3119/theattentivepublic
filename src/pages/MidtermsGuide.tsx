import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, MapPin, IdCard, Mail, Vote } from "lucide-react";
import Seo from "@/components/seo/Seo";

const STEPS = [
  {
    icon: CheckCircle2,
    title: "1. Confirm you're registered",
    body: "Most states require registration 15–30 days before Election Day (Nov 3, 2026). Check your status on your Secretary of State website or vote.gov. Some states (CA, CO, MI, MN, etc.) offer same-day registration.",
  },
  {
    icon: IdCard,
    title: "2. Know your ID rules",
    body: "Each state has different ID requirements — some require a photo ID, others accept a utility bill or signed affidavit. Look up your state on TAP's Voting Info page so you're not turned away at the polls.",
  },
  {
    icon: Calendar,
    title: "3. Pick how you'll vote",
    body: "Vote by mail (request an absentee ballot early), vote early in-person (offered in most states), or vote on Election Day. Deadlines for requesting and returning mail ballots vary — start early.",
  },
  {
    icon: MapPin,
    title: "4. Find your polling place",
    body: "Your assigned polling place depends on your home address. Confirm the location and hours the week before — they change. Bring your ID, a list of preferred candidates, and water.",
  },
  {
    icon: Vote,
    title: "5. Research what's on your ballot",
    body: "The midterm ballot includes U.S. House, often U.S. Senate, governor, state legislature, judges, and ballot measures. Use TAP's Election pages to see every candidate's platform — Senate, House, and Governor races are all covered.",
  },
  {
    icon: Mail,
    title: "6. Make a plan and bring a friend",
    body: "Voters with a written plan (day, time, transportation) turn out at much higher rates. Share the plan with a friend or family member — accountability matters.",
  },
];

const MidtermsGuide = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Seo
        title="How to Vote in the 2026 Midterm Elections — Step-by-Step Guide"
        description="A nonpartisan, state-by-state guide to voting in the 2026 midterm elections: registration deadlines, ID rules, mail vs in-person, and what's on your ballot."
        path="/guides/2026-midterms-voting-guide"
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Vote in the 2026 Midterm Elections",
          description: "Step-by-step guide to voting in the 2026 U.S. midterm elections.",
          author: { "@type": "Organization", name: "The Attentive Public" },
          datePublished: "2026-06-01",
        }}
      />

      <header className="gradient-hero px-6 pt-12 pb-10">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-4 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
          <p className="text-primary-foreground/70 text-xs uppercase tracking-wider font-bold mb-2">
            Voting Guide
          </p>
          <h1 className="text-3xl font-heading font-extrabold text-primary-foreground mb-3 leading-tight">
            How to Vote in the 2026 Midterm Elections
          </h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xl">
            Election Day is Tuesday, November 3, 2026. Here's a nonpartisan, six-step
            walkthrough so you can show up prepared — whether it's your first time or
            your tenth.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <section key={s.title} className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-civic-teal/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-civic-teal" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-foreground mb-1">{s.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </div>
            </section>
          );
        })}

        <section className="bg-card rounded-xl p-5 shadow-card border-l-4 border-civic-coral">
          <h2 className="font-heading font-bold text-foreground mb-2">Tools on TAP</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/voting" className="text-primary hover:underline">
                State-by-state voting info →
              </Link>
            </li>
            <li>
              <Link to="/election/2026-midterms" className="text-primary hover:underline">
                Senate &amp; House candidates in your state →
              </Link>
            </li>
            <li>
              <Link to="/election/2026-primaries" className="text-primary hover:underline">
                2026 state primary dates →
              </Link>
            </li>
            <li>
              <Link to="/election/2026-registration" className="text-primary hover:underline">
                Voter registration deadlines →
              </Link>
            </li>
          </ul>
        </section>

        <p className="text-xs text-muted-foreground text-center pt-4">
          This guide is general information, not legal advice. Always confirm details
          with your state or local election officials.
        </p>
      </main>
    </div>
  );
};

export default MidtermsGuide;
