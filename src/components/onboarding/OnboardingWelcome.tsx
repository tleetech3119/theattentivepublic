import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";

interface Props {
  onNext: () => void;
}

const OnboardingWelcome = ({ onNext }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gradient-hero">
      <div className="max-w-lg mx-auto text-center animate-fade-up">
        <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-8 shadow-glow">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary-foreground mb-4 leading-tight">
          CivicPulse
        </h1>
        <p className="text-lg text-primary-foreground/70 mb-3">
          Your personal guide to what's happening in government — made simple, unbiased, and actionable.
        </p>

        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-primary-foreground/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-civic-teal" />
            <span className="text-sm font-semibold text-primary-foreground">Our Trust Promise</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            We are committed to providing fact-based, nonpartisan information. No spin, no bias — just the facts you need to be an informed citizen.
          </p>
        </div>

        <Button variant="hero" size="lg" onClick={onNext} className="text-base px-8 py-6 rounded-xl">
          Get Started <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
