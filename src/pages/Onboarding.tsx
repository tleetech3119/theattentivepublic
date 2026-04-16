import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingState from "@/components/onboarding/OnboardingState";
import OnboardingIssues from "@/components/onboarding/OnboardingIssues";
import OnboardingReady from "@/components/onboarding/OnboardingReady";

type Step = "welcome" | "state" | "issues" | "ready";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [userState, setUserState] = useState("");
  const [userIssues, setUserIssues] = useState<string[]>([]);

  // If onboarding already done, skip to app
  useEffect(() => {
    if (localStorage.getItem("tap_onboarding")) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  const completeOnboarding = (state: string, issues: string[]) => {
    localStorage.setItem("tap_onboarding", JSON.stringify({ state, issues }));
    navigate("/app", { replace: true });
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

  return (
    <OnboardingReady
      state={userState}
      issues={userIssues}
      onBack={() => setStep("issues")}
      onComplete={() => completeOnboarding(userState, userIssues)}
    />
  );
};

export default Onboarding;
