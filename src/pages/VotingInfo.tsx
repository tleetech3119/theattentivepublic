import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVotingInfo, getIdLabel, type StateVotingInfo } from "@/data/votingInfo";
import {
  ArrowLeft, MapPin, IdCard, Calendar, Mail, Clock, ExternalLink,
  CheckCircle2, XCircle, Building2, FileCheck, Vote as VoteIcon,
  AlertCircle, Printer,
} from "lucide-react";
import Seo from "@/components/seo/Seo";

interface YesNoProps {
  yes: boolean;
  yesText?: string;
  noText?: string;
}

const YesNo = ({ yes, yesText = "Available", noText = "Not available" }: YesNoProps) => (
  <span className={`inline-flex items-center gap-1 text-xs font-medium ${yes ? "text-civic-green" : "text-muted-foreground"}`}>
    {yes ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
    {yes ? yesText : noText}
  </span>
);

const VotingInfo = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<StateVotingInfo | null>(null);
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tap_onboarding");
    if (!saved) {
      navigate("/onboarding", { replace: true });
      return;
    }
    const parsed = JSON.parse(saved);
    setState(parsed.state || "");
    setCounty(parsed.county || "");
    setInfo(getVotingInfo(parsed.state));
  }, [navigate]);

  if (!info) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl mb-2">No voting info available yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We don't have curated rules for <strong>{state || "your state"}</strong> yet. Visit your Secretary of State's website for official guidance.
          </p>
          <Button asChild variant="hero">
            <Link to="/app"><ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const idLabel = getIdLabel(info.idRequirement);
  const idTone =
    idLabel.tone === "strict" ? "bg-civic-coral/10 text-civic-coral" :
    idLabel.tone === "warn" ? "bg-civic-gold/10 text-civic-gold" :
    "bg-civic-green/10 text-civic-green";

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo
        title={state ? `Voting Info for ${state} — TAP` : "Voting Information — TAP"}
        description={state
          ? `Registration deadlines, polling info, and ID rules for voters in ${state}.`
          : "Voter registration deadlines, ID requirements, and polling information for every U.S. state."}
        path="/voting"
      />
      {/* Header */}
      <header className="gradient-hero px-6 pt-10 pb-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 mb-2">
            <VoteIcon className="w-5 h-5 text-civic-teal" />
            <span className="text-sm font-medium text-primary-foreground/70">Voting Information</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary-foreground mb-1">
            How to Vote in {info.state}
          </h1>
          <p className="text-primary-foreground/70 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {county ? `${county} County, ` : ""}{info.state}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-4 space-y-5">
        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up">
          <a href={info.pollingPlaceUrl} target="_blank" rel="noopener noreferrer"
             className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-civic-teal/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-civic-teal" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">Find polling place</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">Open lookup <ExternalLink className="w-3 h-3" /></div>
            </div>
          </a>
          <a href={info.registerUrl} target="_blank" rel="noopener noreferrer"
             className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-civic-coral/10 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-civic-coral" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">Register to vote</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">Open form <ExternalLink className="w-3 h-3" /></div>
            </div>
          </a>
        </div>

        {/* Voter ID */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-civic-purple/10 flex items-center justify-center shrink-0">
              <IdCard className="w-5 h-5 text-civic-purple" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-foreground text-base mb-1">Voter ID</h2>
              <Badge className={`${idTone} border-0 font-semibold text-xs`}>{idLabel.label}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{info.idDescription}</p>
        </section>

        {/* Registration */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-civic-teal/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-civic-teal" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-foreground text-base">Voter Registration</h2>
              <p className="text-xs text-muted-foreground">Deadline: {info.registrationDeadlineRule}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Online</div>
              <YesNo yes={info.onlineRegistration} />
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Automatic (at DMV)</div>
              <YesNo yes={info.automaticRegistration} />
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Same-day at polls</div>
              <YesNo yes={info.sameDayRegistration} />
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={info.registerUrl} target="_blank" rel="noopener noreferrer">
              Register or check status <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        </section>

        {/* Absentee / Mail */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-civic-coral/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-civic-coral" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-foreground text-base">Absentee / Mail Ballot</h2>
              <YesNo yes={info.noExcuseAbsentee} yesText="No excuse required" noText="Excuse required" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{info.absenteeNotes}</p>
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={info.absenteeUrl} target="_blank" rel="noopener noreferrer">
              Request a mail ballot <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        </section>

        {/* Early voting */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-civic-gold/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-civic-gold" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-foreground text-base">Early Voting</h2>
              <YesNo yes={info.earlyVoting} yesText="Available" noText="Not available" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{info.earlyVotingNotes}</p>
        </section>

        {/* Polling place */}
        <section className="bg-card rounded-xl p-5 shadow-card animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-civic-teal/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-civic-teal" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-foreground text-base">Polling Places</h2>
              <p className="text-xs text-muted-foreground">Find your specific location by address</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Polling places are assigned by your home address — they can change between elections.
            Use {info.state}'s official lookup tool to confirm your location.
          </p>
          <Button asChild variant="hero" size="sm" className="w-full">
            <a href={info.pollingPlaceUrl} target="_blank" rel="noopener noreferrer">
              Look up my polling place <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        </section>

        {/* Official source */}
        <section className="bg-secondary/40 rounded-xl p-5 border border-border animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Official source</h3>
          <a href={info.sosUrl} target="_blank" rel="noopener noreferrer"
             className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            {info.sosName} <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Rules and deadlines can change. Always confirm with your state's official elections office before voting.
          </p>
        </section>

        {/* Print */}
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          <Printer className="w-4 h-4" /> Print this page
        </button>
      </div>
    </div>
  );
};

export default VotingInfo;
