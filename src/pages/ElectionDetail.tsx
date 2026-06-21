import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, AlertCircle, Landmark, CheckCircle2, Building2 } from "lucide-react";
import { GOV_RACES_2026 } from "@/data/governors2026";
import { SENATE_RACES_2026 } from "@/data/senate2026";
import { getPrimaryResult, type StatePrimaryResult } from "@/data/primaryResults2026";
import { CandidateLink } from "@/components/CandidateLink";
import { HouseCandidates } from "@/components/HouseCandidates";
import Seo from "@/components/seo/Seo";

function PrimaryResultsBlock({
  state,
  result,
  compact = false,
}: {
  state: string;
  result: StatePrimaryResult | undefined;
  compact?: boolean;
}) {
  const ballotpedia = `https://ballotpedia.org/${encodeURIComponent(state.replace(/ /g, "_"))}_elections,_2026`;
  const gov = result?.governor;
  const hasContent = gov && (gov.nominees?.length || gov.runoffs?.length || gov.note);

  return (
    <div className={`rounded-lg border border-accent/30 bg-accent/5 ${compact ? "p-2.5" : "p-3"} space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-bold text-foreground ${compact ? "text-[11px]" : "text-xs"} uppercase tracking-wider`}>
          Results
        </span>
        <a
          href={ballotpedia}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold text-primary hover:underline ${compact ? "text-[10px]" : "text-[11px]"}`}
        >
          Official results ↗
        </a>
      </div>

      {gov?.nominees && gov.nominees.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Nominees advancing to Nov 3
          </div>
          {gov.nominees.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span className="font-medium text-foreground">{n.name}</span>
              <Badge className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${n.party === "D" ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : "bg-red-500/15 text-red-700 dark:text-red-300"}`}>
                {n.party === "D" ? "Dem" : "Rep"}
              </Badge>
              {n.uncontested && (
                <span className="text-[10px] text-muted-foreground">· uncontested</span>
              )}
            </div>
          ))}
        </div>
      )}

      {gov?.runoffs && gov.runoffs.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-civic-purple">
            Runoff scheduled
          </div>
          {gov.runoffs.map((r, i) => (
            <div key={i} className="text-xs text-foreground">
              <span className="font-semibold">{r.party === "D" ? "Democratic" : "Republican"} {r.office} runoff</span>
              <span className="text-muted-foreground"> · {r.date}</span>
              <div className="text-[11px] text-muted-foreground">{r.candidates.join(" vs. ")}</div>
            </div>
          ))}
        </div>
      )}

      {gov?.note && (
        <p className="text-[11px] text-muted-foreground italic">{gov.note}</p>
      )}

      {!hasContent && (
        <p className="text-[11px] text-muted-foreground">
          Final results posted by the state. Use the Ballotpedia link above for live tallies.
        </p>
      )}
    </div>
  );
}

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
      <Seo
        title={`${election.title} — ${election.date} | TAP`}
        description={election.details.slice(0, 158)}
        path={`/election/${slug}`}
      />
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

        {/* Candidates / Nominees — hide for slugs that render their own dedicated candidate lists below */}
        {election.slug !== "2026-midterms" && election.slug !== "2026-governors" && election.slug !== "2026-primaries" && (
          <section className="bg-card rounded-xl p-5 shadow-card">
            <h2 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-civic-purple" /> Nominees & Candidates
            </h2>
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
          </section>
        )}

        {/* State Primaries — dedicated view */}
        {election.slug === "2026-primaries" && (() => {
          const userState = getUserState();
          const today = new Date();
          const userGov = userState ? GOV_RACES_2026.find((r) => r.state === userState) : undefined;
          const userSenate = userState ? SENATE_RACES_2026.find((r) => r.state === userState) : undefined;
          const userPrimaryDate = userGov?.primaryDate;
          const userPrimaryPast = userPrimaryDate ? new Date(userPrimaryDate) < today : false;

          return (
            <>
              {userState ? (
                <section className="bg-card rounded-xl p-5 shadow-card border-l-4 border-civic-purple">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-civic-purple/15 text-civic-purple border-0 text-[10px] uppercase tracking-wider font-bold">
                      Your State
                    </Badge>
                    {userPrimaryDate && (
                      <Badge className={`border-0 text-[10px] ${userPrimaryPast ? "bg-muted text-muted-foreground" : "bg-accent/20 text-accent"}`}>
                        {userPrimaryPast ? "Primary complete" : `Primary ${userPrimaryDate}`}
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-heading font-bold text-foreground mb-1">
                    {userState} Primary
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    {userPrimaryDate
                      ? userPrimaryPast
                        ? `The ${userState} primary was held on ${userPrimaryDate}. Official results are linked below.`
                        : `Voters head to the polls on ${userPrimaryDate} to pick party nominees for federal and state offices.`
                      : `${userState} primary date not yet confirmed in our database.`}
                  </p>

                  {userPrimaryPast && (
                    <div className="mb-4">
                      <PrimaryResultsBlock state={userState!} result={getPrimaryResult(userState!)} />
                    </div>
                  )}

                  {userSenate && (
                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
                        U.S. Senate primary candidates
                      </div>
                      <div className="space-y-1.5">
                        {userSenate.candidates.map((c, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/40">
                            <div className="min-w-0 text-sm">
                              <CandidateLink name={c.name} state={userSenate.state} party={c.party} office="U.S. Senate" />
                              {c.note && <span className="text-xs text-muted-foreground ml-1">· {c.note}</span>}
                            </div>
                            <Badge className={`shrink-0 border-0 text-[10px] ${c.party === "D" ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : c.party === "R" ? "bg-red-500/15 text-red-700 dark:text-red-300" : "bg-muted text-muted-foreground"}`}>
                              {c.party === "D" ? "Dem" : c.party === "R" ? "Rep" : c.party}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userGov && (
                    <div className="mt-4">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
                        Gubernatorial primary candidates
                      </div>
                      <div className="space-y-1.5">
                        {userGov.candidates.map((c, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/40">
                            <div className="min-w-0 text-sm">
                              <CandidateLink name={c.name} state={userGov.state} party={c.party} office="Governor" />
                              {c.note && <span className="text-xs text-muted-foreground ml-1">· {c.note}</span>}
                            </div>
                            <Badge className={`shrink-0 border-0 text-[10px] ${c.party === "D" ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : "bg-red-500/15 text-red-700 dark:text-red-300"}`}>
                              {c.party === "D" ? "Dem" : "Rep"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!userSenate && !userGov && (
                    <div className="p-3 rounded bg-muted/30 text-xs text-muted-foreground">
                      No Senate or gubernatorial primary in {userState} this cycle. Your state may still hold U.S. House and state-legislative primaries — check your local Secretary of State website.
                    </div>
                  )}
                </section>
              ) : (
                <section className="bg-card rounded-xl p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">
                    Set your state in onboarding to see your primary date and candidates.
                  </p>
                </section>
              )}

              {/* All state primaries by date */}
              <section className="bg-card rounded-xl p-5 shadow-card">
                <h2 className="font-heading font-bold text-foreground mb-1">All 2026 state primaries</h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Sorted by date. Tap a state to see declared candidates. Past primaries link to official results.
                </p>
                <div className="space-y-1.5">
                  {[...GOV_RACES_2026]
                    .sort((a, b) => new Date(a.primaryDate).getTime() - new Date(b.primaryDate).getTime())
                    .map((r) => {
                      const past = new Date(r.primaryDate) < today;
                      const isUser = r.state === userState;
                      const senate = SENATE_RACES_2026.find((s) => s.state === r.state);
                      return (
                        <details key={r.state} className={`group rounded-md border text-xs ${isUser ? "bg-primary/10 border-primary/40" : "bg-muted/30 border-border"}`}>
                          <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer list-none">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-muted-foreground group-open:rotate-90 transition-transform">›</span>
                              <span className="font-semibold text-foreground truncate">{r.state}</span>
                              {past && (
                                <Badge className="bg-muted text-muted-foreground border-0 text-[10px] px-1.5 py-0">Complete</Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground shrink-0">{r.primaryDate}</span>
                          </summary>
                          <div className="px-3 pb-3 pt-1 space-y-2 border-t border-border/50">
                            {past && (
                              <PrimaryResultsBlock state={r.state} result={getPrimaryResult(r.state)} compact />
                            )}
                            {senate && senate.candidates.length > 0 && (
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1 mb-1">U.S. Senate</div>
                                {senate.candidates.map((c, i) => (
                                  <div key={i} className="flex items-center justify-between gap-2">
                                    <div className="min-w-0 truncate">
                                      <CandidateLink name={c.name} state={r.state} party={c.party} office="U.S. Senate" />
                                      {c.note && <span className="text-muted-foreground ml-1">· {c.note}</span>}
                                    </div>
                                    <Badge className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${c.party === "D" ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : c.party === "R" ? "bg-red-500/15 text-red-700 dark:text-red-300" : "bg-muted text-muted-foreground"}`}>
                                      {c.party === "D" ? "Dem" : c.party === "R" ? "Rep" : c.party}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1 mb-1">Governor</div>
                              {r.candidates.length === 0 ? (
                                <p className="text-muted-foreground italic">Candidates TBD</p>
                              ) : r.candidates.map((c, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                  <div className="min-w-0 truncate">
                                    <CandidateLink name={c.name} state={r.state} party={c.party} />
                                    {c.note && <span className="text-muted-foreground ml-1">· {c.note}</span>}
                                  </div>
                                  <Badge className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${c.party === "D" ? "bg-blue-500/15 text-blue-700 dark:text-blue-300" : "bg-red-500/15 text-red-700 dark:text-red-300"}`}>
                                    {c.party === "D" ? "Dem" : "Rep"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </details>
                      );
                    })}
                </div>
              </section>
            </>
          );
        })()}


        {/* Senate + House — only for the midterms event */}
        {election.slug === "2026-midterms" && (() => {
          const userState = getUserState();
          const userSenateRace = userState
            ? SENATE_RACES_2026.find((r) => r.state === userState)
            : undefined;
          return (
            <>
              {userSenateRace && (
                <section className="bg-card rounded-xl p-5 shadow-card border-l-4 border-civic-purple">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-civic-purple/15 text-civic-purple border-0 text-[10px] uppercase tracking-wider font-bold">
                      <Building2 className="w-3 h-3 mr-1" /> U.S. Senate
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      Upper chamber · 6-year terms · 2 senators per state
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
                    {userState} Senate Race
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    {userSenateRace.seatStatus === "retiring"
                      ? "Open seat — incumbent retiring."
                      : userSenateRace.seatStatus === "open"
                        ? "Open seat."
                        : "Incumbent seeking re-election."}
                    {userSenateRace.battleground && " Considered a battleground race."}
                  </p>
                  <div className="space-y-2">
                    {userSenateRace.candidates.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 gap-3"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            <CandidateLink
                              name={c.name}
                              state={userSenateRace.state}
                              party={c.party}
                              office="U.S. Senate"
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
                              : c.party === "R"
                                ? "bg-red-500/15 text-red-700 dark:text-red-300"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.party === "D" ? "Democrat" : c.party === "R" ? "Republican" : c.party}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {userState && <HouseCandidates state={userState} />}

              <section className="bg-card rounded-xl p-5 shadow-card border-l-4 border-civic-purple">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-civic-purple/15 text-civic-purple border-0 text-[10px] uppercase tracking-wider font-bold">
                    <Building2 className="w-3 h-3 mr-1" /> U.S. Senate
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">All 33 races nationwide</span>
                </div>
                <h2 className="font-heading font-bold text-foreground mb-3">
                  All 33 U.S. Senate races in 2026
                </h2>
                <div className="space-y-1.5">
                  {SENATE_RACES_2026.map((r) => {
                    const isUser = r.state === userState;
                    return (
                      <details
                        key={r.state}
                        className={`group rounded-md border text-xs ${
                          isUser
                            ? "bg-primary/10 border-primary/40"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer list-none">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground group-open:rotate-90 transition-transform">
                              ›
                            </span>
                            <span className="font-semibold text-foreground truncate">
                              {r.state}
                            </span>
                            {r.battleground && (
                              <Badge className="bg-accent/20 text-accent border-0 text-[10px] px-1.5 py-0">
                                Battleground
                              </Badge>
                            )}
                            {r.seatStatus === "retiring" && (
                              <Badge className="bg-muted text-muted-foreground border-0 text-[10px] px-1.5 py-0">
                                Open seat
                              </Badge>
                            )}
                          </div>
                          <span className="text-muted-foreground shrink-0">
                            {r.incumbentParty === "D" ? "Dem-held" : r.incumbentParty === "R" ? "Rep-held" : "Ind-held"}
                          </span>
                        </summary>
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-border/50">
                          {r.candidates.length === 0 ? (
                            <p className="text-muted-foreground italic">Candidates TBD</p>
                          ) : (
                            r.candidates.map((c, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0 truncate">
                                  <CandidateLink
                                    name={c.name}
                                    state={r.state}
                                    party={c.party}
                                    office="U.S. Senate"
                                  />
                                  {c.note && (
                                    <span className="text-muted-foreground ml-1">
                                      · {c.note}
                                    </span>
                                  )}
                                </div>
                                <Badge
                                  className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${
                                    c.party === "D"
                                      ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                                      : c.party === "R"
                                        ? "bg-red-500/15 text-red-700 dark:text-red-300"
                                        : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {c.party === "D" ? "Dem" : c.party === "R" ? "Rep" : c.party}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            </>
          );
        })()}

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
                      <details
                        key={r.state}
                        className={`group rounded-md border text-xs ${
                          isUser
                            ? "bg-primary/10 border-primary/40"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer list-none">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground group-open:rotate-90 transition-transform">
                              ›
                            </span>
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
                        </summary>
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-border/50">
                          {r.candidates.length === 0 && (
                            <p className="text-muted-foreground italic">
                              Candidates TBD
                            </p>
                          )}
                          {r.candidates.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0 truncate">
                                <CandidateLink
                                  name={c.name}
                                  state={r.state}
                                  party={c.party}
                                />
                                {c.note && (
                                  <span className="text-muted-foreground ml-1">
                                    · {c.note}
                                  </span>
                                )}
                              </div>
                              <Badge
                                className={`shrink-0 border-0 text-[10px] px-1.5 py-0 ${
                                  c.party === "D"
                                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                                    : "bg-red-500/15 text-red-700 dark:text-red-300"
                                }`}
                              >
                                {c.party === "D" ? "Dem" : "Rep"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </details>
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
