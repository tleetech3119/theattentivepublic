import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const saved = localStorage.getItem("tap_onboarding");
  const parsed = saved ? JSON.parse(saved) : null;

  useEffect(() => {
    if (!parsed) navigate("/onboarding", { replace: true });
  }, [parsed, navigate]);

  if (!parsed) return null;

  return (
    <Dashboard
      state={parsed.state || ""}
      county={parsed.county || ""}
      issues={parsed.issues || []}
    />
  );
};

export default Index;
