import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, AlertCircle, Landmark, CheckCircle2 } from "lucide-react";
import { GOV_RACES_2026 } from "@/data/governors2026";
import { CandidateLink } from "@/components/CandidateLink";

const GUBERNATORIAL_STATES_2026 = GOV_RACES_2026.map((r) => r.state);


function getUserState(): string | null {
  try {
    const raw = localStorage.getItem("tap_onboarding");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state || null;
  } catch {
    return null;
  }
}

const ELECTIONS_2026 = [
  {
    slug: "2026-midterms",
    title: "2026 Midterm Elections",
    date: "Nov 3, 2026",
    dateObj: new Date("2026-11-03"),
    description: "All 435 House seats + 34 Senate seats",
    type: "Federal",
    details:
      "The 2026 midterm elections will determine the composition of the 120th United States Congress. All 435 seats in the House of Representatives and 34 of the 100 seats in the Senate will be contested.",
    candidates: [] as { name: string; party: string; office: string }[],
  },
  {
    slug: "2026-primaries",
    title: "State Primary Elections",
    date: "Varies by state (Jun–Sep 2026)",
    dateObj: new Date("2026-06-09"),
    description: "Party nominations for midterm candidates",
    type: "Primary",
    details:
      "Primary elections are held in each state to determine which candidates will represent their respective parties in the general election. Dates vary significantly by state.",
    candidates: [],
  },
  {
    slug: "2026-governors",
    title: "Gubernatorial Races",
    date: "Nov 3, 2026",
    dateObj: new Date("2026-11-03"),
    description: "36 states elect governors",
    type: "State",
    details:
      "Thirty-six states and three territories will hold gubernatorial elections in 2026. Governors serve as the chief executive of their state, overseeing state agencies and budgets.",
    candidates: [],
  },
  {
    slug: "2026-registration",
    title: "Voter Registration Deadline",
    date: "Varies by state (Oct 2026)",
    dateObj: new Date("2026-10-05"),
    description: "Register or verify your registration",
    type: "Deadline",
    details:
      "Most states require voters to register before Election Day. Deadlines vary by state — some allow same-day registration while others require registration 30 days in advance. Check your state's requirements early.",
    candidates: [],
  },
];

function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const ElectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const election = ELECTIONS_2026.find((e) => e.slug === slug);

  if (!election) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-heading font-bold text-foreground mb-2">
            Election not found
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const days = daysUntil(election.dateObj);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-accent/20 text-accent border-0 text-xs font-semibold">
              {election.type}
            </Badge>
            <Badge className="bg-primary-foreground/10 text-primary-foreground border-0 text-xs">
              {days > 0 ? `${days} days away` : "Today!"}
            </Badge>
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-1">
            {election.title}
          </h1>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {election.date}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* About */}
        <section className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {election.details}
          </p>
        </section>

        {/* Candidates / Nominees */}
        <section className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-civic-purple" /> Nominees & Candidates
          </h2>
          {election.candidates.length > 0 ? (
            <div className="space-y-2">
              {election.candidates.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {c.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.office}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {c.party}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-foreground text-sm">
                  Awaiting Candidates
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nominations have not been finalized yet. Check back closer to
                  election day for a full list of candidates.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Gubernatorial races — only for the governors event */}
        {election.slug === "2026-governors" && (() => {
          const userState = getUserState();
          const userRace = userState
            ? GOV_RACES_2026.find((r) => r.state === userState)
            : undefined;
          const userIsElecting = !!userRace;
          return (
            <>
              <section className="bg-card rounded-xl p-5 shadow-card">
                <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-civic-purple" /> Your State
                </h2>

                {userState ? (
                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      userIsElecting
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    {userIsElecting ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {userIsElecting
                          ? `${userState} is electing a governor in 2026`
                          : `${userState} is not holding a gubernatorial election in 2026`}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {userIsElecting
                          ? `Primary: ${userRace!.primaryDate}. General election Nov 3, 2026.`
                          : "Your state's next gubernatorial race falls in a different cycle."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Set your state in onboarding to see whether you have a gubernatorial race this year.
                  </p>
                )}
              </section>

              {userRace && (
                <section className="bg-card rounded-xl p-5 shadow-card">
                  <h2 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-civic-purple" /> {userRace.state} Candidates
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    Major-party candidates who have filed or declared. Updated periodically.
                  </p>
                  <div className="space-y-2">
                    {userRace.candidates.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 gap-3"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            <CandidateLink
                              name={c.name}
                              state={userRace.state}
                              party={c.party}
                            />
                          </div>
                          {c.note && (
                            <div className="text-xs text-muted-foreground truncate">
                              {c.note}
                            </div>
                          )}
                        </div>
                        <Badge
                          className={`text-xs shrink-0 border-0 ${
                            c.party === "D"
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                              : "bg-red-500/15 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {c.party === "D" ? "Democrat" : "Republican"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-card rounded-xl p-5 shadow-card">
                <h2 className="font-heading font-bold text-foreground mb-3">
                  All 36 states electing governors in 2026
                </h2>
                <div className="space-y-1.5">
                  {GOV_RACES_2026.map((r) => {
                    const isUser = r.state === userState;
                    return (
                      <div
                        key={r.state}
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-xs ${
                          isUser
                            ? "bg-primary/10 border-primary/40"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-foreground truncate">
                            {r.state}
                          </span>
                          {r.battleground && (
                            <Badge className="bg-accent/20 text-accent border-0 text-[10px] px-1.5 py-0">
                              Battleground
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground shrink-0">
                          Primary {r.primaryDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          );
        })()}

        {/* Key Dates */}
        <section className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-civic-coral" /> What You Can Do
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Verify your voter registration status
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Research candidates running in your district
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Mark key dates on your calendar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              Share election information with friends and family
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ElectionDetail;
