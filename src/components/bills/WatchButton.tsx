import { Button } from "@/components/ui/button";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchList } from "@/hooks/use-watch-list";
import { toast } from "sonner";
import type { Bill } from "@/data/bills";
import { useState } from "react";

interface Props {
  bill: Bill;
}

const WatchButton = ({ bill }: Props) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isWatching, watch, unwatch, loading } = useWatchList();
  const [busy, setBusy] = useState(false);

  const watching = isWatching(bill.id);

  const handleClick = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setBusy(true);
    if (watching) {
      await unwatch(bill.id);
      toast.success(`Unfollowed ${bill.code}`);
    } else {
      const { error } = await watch(bill);
      if (error) toast.error(error);
      else toast.success(`Now watching ${bill.code} — we'll flag any changes.`);
    }
    setBusy(false);
  };

  const disabled = busy || authLoading || loading;

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      variant={watching ? "secondary" : "default"}
      size="sm"
      className="gap-2"
    >
      {watching ? (
        <>
          <BellRing className="w-4 h-4" /> Watching
        </>
      ) : user ? (
        <>
          <Bell className="w-4 h-4" /> Watch this bill
        </>
      ) : (
        <>
          <BellOff className="w-4 h-4" /> Sign in to watch
        </>
      )}
    </Button>
  );
};

export default WatchButton;
