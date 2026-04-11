import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Briefcase, GraduationCap, Leaf, Scale, Home, Wifi, DollarSign, Users } from "lucide-react";

const ISSUES = [
  { id: "healthcare", label: "Healthcare", icon: Heart, color: "text-civic-coral" },
  { id: "economy", label: "Economy & Jobs", icon: Briefcase, color: "text-civic-teal" },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-civic-purple" },
  { id: "environment", label: "Environment", icon: Leaf, color: "text-civic-green" },
  { id: "justice", label: "Criminal Justice", icon: Scale, color: "text-civic-navy" },
  { id: "housing", label: "Housing", icon: Home, color: "text-civic-gold" },
  { id: "technology", label: "Tech & Privacy", icon: Wifi, color: "text-primary" },
  { id: "taxes", label: "Taxes & Spending", icon: DollarSign, color: "text-civic-coral" },
  { id: "immigration", label: "Immigration", icon: Users, color: "text-civic-teal" },
  { id: "defense", label: "National Security", icon: Shield, color: "text-civic-navy" },
];

interface Props {
  onNext: (issues: string[]) => void;
}

const OnboardingIssues = ({ onNext }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-12">
      <div className="max-w-lg mx-auto w-full animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Step 2 of 3</span>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">What matters to you?</h2>
        <p className="text-muted-foreground mb-6">
          Pick at least 3 topics to personalize your feed.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {ISSUES.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all ${
                selected.includes(id)
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-foreground shadow-card hover:shadow-card-hover"
              }`}
            >
              <Icon className={`w-5 h-5 ${selected.includes(id) ? "text-primary-foreground" : color}`} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full rounded-xl py-6 text-base"
          disabled={selected.length < 3}
          onClick={() => onNext(selected)}
        >
          Continue <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
        {selected.length < 3 && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            Select at least {3 - selected.length} more topic{3 - selected.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingIssues;
