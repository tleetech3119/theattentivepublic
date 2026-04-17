import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingState from "@/components/onboarding/OnboardingState";
import OnboardingCounty from "@/components/onboarding/OnboardingCounty";
import OnboardingIssues from "@/components/onboarding/OnboardingIssues";
import OnboardingReady from "@/components/onboarding/OnboardingReady";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Step = "welcome" | "state" | "county" | "issues" | "ready";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [userState, setUserState] = useState("");
  const [userCounty, setUserCounty] = useState("");
  const [userIssues, setUserIssues] = useState<string[]>([]);

  // If onboarding already done, skip to app
  useEffect(() => {
    if (localStorage.getItem("tap_onboarding")) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  const completeOnboarding = async (state: string, county: string, issues: string[]) => {
    // Persist locally first so the app works even offline / without auth
    localStorage.setItem(
      "tap_onboarding",
      JSON.stringify({ state, county, issues })
    );

    // Only persist to the backend for authenticated users — anonymous users
    // keep their preferences in localStorage to avoid storing unsecured rows.
    if (user) {
      try {
        const { data: existing } = await supabase
          .from("user_preferences")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_preferences")
            .update({
              selected_state: state,
              selected_county: county,
              selected_issues: issues,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("user_preferences").insert({
            user_id: user.id,
            session_id: user.id,
            selected_state: state,
            selected_county: county,
            selected_issues: issues,
          });
        }
      } catch (err) {
        // Non-fatal — user still gets the app
        console.error("Failed to persist preferences:", err);
      }
    }

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
          setStep("county");
        }}
      />
    );
  }

  if (step === "county") {
    return (
      <OnboardingCounty
        state={userState}
        onBack={() => setStep("state")}
        onNext={(county) => {
          setUserCounty(county);
          setStep("issues");
        }}
      />
    );
  }

  if (step === "issues") {
    return (
      <OnboardingIssues
        onBack={() => setStep("county")}
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
      county={userCounty}
      issues={userIssues}
      onBack={() => setStep("issues")}
      onComplete={() => completeOnboarding(userState, userCounty, userIssues)}
    />
  );
};

export default Onboarding;
