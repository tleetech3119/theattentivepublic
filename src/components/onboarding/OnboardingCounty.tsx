import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MapPin, Search, Building2 } from "lucide-react";
import { COUNTIES_BY_STATE } from "@/data/counties";

interface Props {
  state: string;
  onNext: (county: string) => void;
  onBack: () => void;
}

const OnboardingCounty = ({ state, onNext, onBack }: Props) => {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const counties = useMemo(() => COUNTIES_BY_STATE[state] || [], [state]);

  const filtered = useMemo(
    () => counties.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [counties, search]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-12">
      <div className="max-w-lg mx-auto w-full animate-fade-up">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Step 2 of 4</span>
        </div>

        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
          Which county?
        </h2>
        <p className="text-muted-foreground mb-2">
          We'll surface district-level voting info, polling places, and local elections in <strong>{state}</strong>.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <MapPin className="w-3.5 h-3.5" />
          <span>{counties.length.toLocaleString()} counties available</span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search counties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1 mb-8">
          {filtered.length === 0 ? (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
              No counties match "{search}"
            </p>
          ) : (
            filtered.map((county) => (
              <button
                key={county}
                onClick={() => setSelected(county)}
                className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                  selected === county
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-card text-foreground shadow-card hover:shadow-card-hover"
                }`}
              >
                {county}
              </button>
            ))
          )}
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full rounded-xl py-6 text-base"
          disabled={!selected}
          onClick={() => onNext(selected)}
        >
          Continue <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCounty;
