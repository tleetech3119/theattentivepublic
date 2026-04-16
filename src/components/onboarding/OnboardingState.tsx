import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArrowRight, MapPin, Search } from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

interface Props {
  onNext: (state: string) => void;
  onBack: () => void;
}

const OnboardingState = ({ onNext, onBack }: Props) => {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const filtered = US_STATES.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-12">
      <div className="max-w-lg mx-auto w-full animate-fade-up">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Step 1 of 4</span>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Where do you live?</h2>
        <p className="text-muted-foreground mb-6">
          We'll personalize your feed with local legislation and representatives.
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search states..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1 mb-8">
          {filtered.map((state) => (
            <button
              key={state}
              onClick={() => setSelected(state)}
              className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                selected === state
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-foreground shadow-card hover:shadow-card-hover"
              }`}
            >
              {state}
            </button>
          ))}
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

export default OnboardingState;
