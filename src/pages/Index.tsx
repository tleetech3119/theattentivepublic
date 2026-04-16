import { useState, useEffect } from "react";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingState from "@/components/onboarding/OnboardingState";
import OnboardingIssues from "@/components/onboarding/OnboardingIssues";
import OnboardingReady from "@/components/onboarding/OnboardingReady";
import Dashboard from "@/components/dashboard/Dashboard";

type Step = "welcome" | "state" | "issues" | "ready" | "dashboard";

const Index = () => {
  const saved = localStorage.getItem("tap_onboarding");
  const parsed = saved ? JSON.parse(saved) : null;

  const [step, setStep] = useState<Step>(parsed ? "dashboard" : "welcome");
  const [userState, setUserState] = useState(parsed?.state || "");
  const [userIssues, setUserIssues] = useState<string[]>(parsed?.issues || []);

  const completeOnboarding = (state: string, issues: string[]) => {
    localStorage.setItem("tap_onboarding", JSON.stringify({ state, issues }));
    setStep("dashboard");
  };

  if (step === "welcome") {
    return <OnboardingWelcome onNext={() => setStep("state")} />;
  }

  if (step === "state") {
    return (
      <OnboardingState
        onBack={() => setStep("welcome")}
        onNext={(state) => {
          setUserState(state);
          setStep("issues");
        }}
      />
    );
  }

  if (step === "issues") {
    return (
      <OnboardingIssues
        onBack={() => setStep("state")}
        onNext={(issues) => {
          setUserIssues(issues);
          setStep("ready");
        }}
      />
    );
  }

  if (step === "ready") {
    return (
      <OnboardingReady
        state={userState}
        issues={userIssues}
        onBack={() => setStep("issues")}
        onComplete={() => completeOnboarding(userState, userIssues)}
      />
    );
  }

  return <Dashboard state={userState} issues={userIssues} />;
};

export default Index;
