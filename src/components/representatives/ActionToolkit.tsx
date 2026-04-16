import { useEffect, useState } from "react";
import { Mail, Phone, Sparkles, Loader2, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSponsoredLegislation } from "@/hooks/use-sponsored-legislation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Stance = "support" | "oppose";
type Kind = "email" | "call";

interface Props {
  repId: string;
  repName: string;
  repChamber: string;
  repEmail?: string;
  repPhone?: string;
}

interface EmailDraft {
  subject: string;
  body: string;
}
interface CallScript {
  script: string;
  tips: string[];
}

const STORAGE_KEY = "tap-user-name";

const ActionToolkit = ({ repId, repName, repChamber, repEmail, repPhone }: Props) => {
  const { bills, loading: billsLoading } = useSponsoredLegislation(repId);

  const [billCode, setBillCode] = useState<string>("");
  const [stance, setStance] = useState<Stance>("support");
  const [userName, setUserName] = useState("");
  const [kind, setKind] = useState<Kind>("email");

  const [generating, setGenerating] = useState(false);
  const [emailDraft, setEmailDraft] = useState<EmailDraft | null>(null);
  const [callScript, setCallScript] = useState<CallScript | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Persist user name across sessions
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUserName(saved);
  }, []);
  useEffect(() => {
    if (userName.trim()) localStorage.setItem(STORAGE_KEY, userName.trim());
  }, [userName]);

  // Default to first bill once loaded
  useEffect(() => {
    if (!billCode && bills.length > 0) setBillCode(bills[0].bill_code);
  }, [bills, billCode]);

  const selectedBill = bills.find((b) => b.bill_code === billCode);
  const repTitle = repChamber === "Senate" ? "Senator" : "Representative";

  const generate = async (k: Kind) => {
    if (!selectedBill) {
      toast({ title: "Pick a bill", description: "Select a bill to generate your message." });
      return;
    }
    setGenerating(true);
    setKind(k);
    try {
      const { data, error } = await supabase.functions.invoke("generate-action", {
        body: {
          repName,
          repTitle,
          userName,
          billCode: selectedBill.bill_code,
          billTitle: selectedBill.bill_title,
          billSummary: selectedBill.status || "",
          stance,
          kind: k,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (k === "email") {
        setEmailDraft(data as EmailDraft);
        setCallScript(null);
      } else {
        setCallScript(data as CallScript);
        setEmailDraft(null);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const copy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      toast({ title: "Copy failed", description: "Unable to copy to clipboard.", variant: "destructive" });
    }
  };

  const mailtoHref = emailDraft
    ? `mailto:${repEmail || ""}?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`
    : "";

  const telHref = repPhone ? `tel:${repPhone.replace(/[^+\d]/g, "")}` : "";

  return (
    <div className="space-y-4">
      {/* Setup card */}
      <div className="bg-card rounded-xl p-5 shadow-card animate-fade-up border border-civic-teal/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-civic-teal" />
          <h3 className="font-heading font-bold text-foreground">One-Tap Action Toolkit</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Generate a respectful, ready-to-send message to {repTitle} {repName} about a specific bill.
        </p>

        <div className="space-y-3">
          {/* Bill */}
          <div>
            <Label htmlFor="bill" className="text-xs font-medium mb-1 block">Bill</Label>
            {billsLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading bills…
              </div>
            ) : bills.length === 0 ? (
              <div className="text-xs text-muted-foreground italic py-2">
                No sponsored bills available for this representative.
              </div>
            ) : (
              <Select value={billCode} onValueChange={setBillCode}>
                <SelectTrigger id="bill" className="h-10 text-sm">
                  <SelectValue placeholder="Choose a bill" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {bills.map((b) => (
                    <SelectItem key={b.bill_code} value={b.bill_code} className="text-sm">
                      <span className="font-mono text-xs text-muted-foreground mr-2">{b.bill_code}</span>
                      <span className="line-clamp-1">{b.bill_title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Stance */}
          <div>
            <Label className="text-xs font-medium mb-1 block">Your stance</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStance("support")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  stance === "support"
                    ? "bg-civic-green/10 border-civic-green text-civic-green"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className="w-4 h-4" /> Support
              </button>
              <button
                type="button"
                onClick={() => setStance("oppose")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  stance === "oppose"
                    ? "bg-civic-coral/10 border-civic-coral text-civic-coral"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsDown className="w-4 h-4" /> Oppose
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-xs font-medium mb-1 block">Your name (optional)</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Jane Constituent"
              className="h-10 text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              onClick={() => generate("email")}
              disabled={generating || !selectedBill}
              variant="default"
              className="gap-2"
            >
              {generating && kind === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Draft Email
            </Button>
            <Button
              onClick={() => generate("call")}
              disabled={generating || !selectedBill}
              variant="secondary"
              className="gap-2"
            >
              {generating && kind === "call" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              Call Script
            </Button>
          </div>
        </div>
      </div>

      {/* Email draft */}
      {emailDraft && (
        <div className="bg-card rounded-xl p-5 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-civic-teal" /> Your Email Draft
            </h3>
            <Button onClick={() => generate("email")} variant="ghost" size="sm" className="gap-1 text-xs h-7" disabled={generating}>
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-medium">Subject</Label>
                <button
                  onClick={() => copy(emailDraft.subject, "subject")}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {copiedField === "subject" ? <Check className="w-3 h-3 text-civic-green" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <Input
                value={emailDraft.subject}
                onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-medium">Body</Label>
                <button
                  onClick={() => copy(emailDraft.body, "body")}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {copiedField === "body" ? <Check className="w-3 h-3 text-civic-green" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <Textarea
                value={emailDraft.body}
                onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })}
                className="text-sm min-h-[220px] leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="default" size="sm" className="gap-2 flex-1 min-w-[140px]">
                <a href={mailtoHref}>
                  <Mail className="w-4 h-4" /> Open in Email App
                </a>
              </Button>
              {!repEmail && (
                <p className="text-[10px] text-muted-foreground italic w-full">
                  No email on file — copy the draft and paste it into your email client.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call script */}
      {callScript && (
        <div className="bg-card rounded-xl p-5 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-civic-teal" /> Your Call Script
            </h3>
            <Button onClick={() => generate("call")} variant="ghost" size="sm" className="gap-1 text-xs h-7" disabled={generating}>
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-medium">Script</Label>
                <button
                  onClick={() => copy(callScript.script, "script")}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {copiedField === "script" ? <Check className="w-3 h-3 text-civic-green" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <Textarea
                value={callScript.script}
                onChange={(e) => setCallScript({ ...callScript, script: e.target.value })}
                className="text-sm min-h-[140px] leading-relaxed"
              />
            </div>

            {callScript.tips.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-civic-teal" />
                  <span className="text-xs font-semibold text-foreground">Tips</span>
                </div>
                <ul className="space-y-1">
                  {callScript.tips.map((t, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-snug">• {t}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild variant="default" size="sm" className="gap-2 w-full" disabled={!repPhone}>
              {repPhone ? (
                <a href={telHref}>
                  <Phone className="w-4 h-4" /> Call {repPhone}
                </a>
              ) : (
                <span><Phone className="w-4 h-4" /> No phone on file</span>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground italic text-center">
        AI-generated drafts. Always review and personalize before sending.
      </p>
    </div>
  );
};

export default ActionToolkit;
