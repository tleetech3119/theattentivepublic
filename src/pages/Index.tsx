import { useState } from "react";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingState from "@/components/onboarding/OnboardingState";
import OnboardingIssues from "@/components/onboarding/OnboardingIssues";
import OnboardingReady from "@/components/onboarding/OnboardingReady";
import Dashboard from "@/components/dashboard/Dashboard";

type Step = "welcome" | "state" | "issues" | "ready" | "dashboard";

const Index = () => {
  const [step, setStep] = useState<Step>("welcome");
  const [userState, setUserState] = useState("");
  const [userIssues, setUserIssues] = useState<string[]>([]);

  if (step === "welcome") {
    return <OnboardingWelcome onNext={() => setStep("state")} />;
  }

  if (step === "state") {
    return (
      <OnboardingState
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
        onComplete={() => setStep("dashboard")}
      />
    );
  }

  return <Dashboard state={userState} issues={userIssues} />;
};

export default Index;
