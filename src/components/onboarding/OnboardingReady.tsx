import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

interface Props {
  state: string;
  issues: string[];
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingReady = ({ state, issues, onComplete, onBack }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gradient-hero">
      <div className="max-w-lg mx-auto text-center animate-fade-up">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors mx-auto">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-8 shadow-glow animate-scale-in">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>

        <span className="text-sm font-medium text-primary-foreground/60 mb-2 block">Step 3 of 3</span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
          You're all set!
        </h2>
        <p className="text-primary-foreground/70 mb-8">
          Your personalized civic feed is ready.
        </p>

        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 mb-8 border border-primary-foreground/10 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-civic-teal" />
            <span className="text-primary-foreground text-sm">
              Tracking legislation in <strong>{state}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-civic-teal" />
            <span className="text-primary-foreground text-sm">
              Following <strong>{issues.length} topics</strong> you care about
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-civic-teal" />
            <span className="text-primary-foreground text-sm">
              Nonpartisan, fact-based updates ready
            </span>
          </div>
        </div>

        <Button variant="hero" size="lg" onClick={onComplete} className="text-base px-8 py-6 rounded-xl">
          Go to My Dashboard
        </Button>
      </div>
    </div>
  );
};

export default OnboardingReady;
