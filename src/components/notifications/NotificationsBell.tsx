import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

const CHANGE_LABEL: Record<string, string> = {
  status: "Status",
  progress: "Progress",
  vote: "Vote",
  timeline: "Action",
};

const NotificationsBell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, unreadCount, markAllRead } = useNotifications();

  const handleOpenChange = (open: boolean) => {
    if (!open && unreadCount > 0) markAllRead();
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="relative"
        aria-label="Sign in to enable notifications"
      >
        <Bell className="w-5 h-5 text-primary-foreground/70" />
      </button>
    );
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5 text-primary-foreground/70" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-accent rounded-full text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="font-heading font-bold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No updates yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Follow bills to get notified of changes.
              </p>
            </div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(`/bill/${n.bill_id}`)}
                className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${
                  !n.read_at ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-civic-teal">
                    {CHANGE_LABEL[n.change_type] ?? n.change_type}
                  </span>
                  {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <div className="text-sm font-medium text-foreground">{n.title}</div>
                {n.detail && (
                  <div className="text-xs text-muted-foreground mt-0.5">{n.detail}</div>
                )}
                <div className="text-[10px] text-muted-foreground/70 mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
