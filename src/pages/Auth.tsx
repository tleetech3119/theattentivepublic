import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, Bell } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [electionUpdates, setElectionUpdates] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const dest = localStorage.getItem("tap_onboarding") ? "/app" : "/onboarding";
      navigate(dest, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });
    if (!error && data.user) {
      // Record election-update preference (best-effort; ignore failure)
      await supabase.from("user_preferences").upsert(
        {
          user_id: data.user.id,
          session_id: data.user.id,
          election_updates_opt_in: electionUpdates,
          election_updates_opt_in_at: electionUpdates ? new Date().toISOString() : null,
        },
        { onConflict: "user_id" },
      );
    }
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created — let's set you up.");
      navigate("/onboarding", { replace: true });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      const dest = localStorage.getItem("tap_onboarding") ? "/app" : "/onboarding";
      navigate(dest, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-6 pt-10 pb-12">
        <div className="max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-6 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-civic-teal" />
            <span className="text-sm text-primary-foreground/70">Watch List</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground mb-1">
            Sign in to follow bills
          </h1>
          <p className="text-sm text-primary-foreground/70">
            Track legislation and get notified when status, votes, or amendments change.
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 -mt-6">
        <div className="bg-card rounded-xl p-5 shadow-card">
          <Tabs defaultValue={initialTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="si-pw">Password</Label>
                  <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="su-pw">Password</Label>
                  <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground mt-1">At least 8 characters.</p>
                </div>
                <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer pt-1">
                  <Checkbox
                    checked={electionUpdates}
                    onCheckedChange={(v) => setElectionUpdates(v === true)}
                    className="mt-0.5"
                  />
                  <span>
                    Email me updates about upcoming elections in my state. You can change this anytime.
                  </span>
                </label>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
