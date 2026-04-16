-- bill_watches: which bills a user follows + snapshot for diffing
CREATE TABLE public.bill_watches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id integer NOT NULL,
  snapshot_status text NOT NULL,
  snapshot_progress integer NOT NULL,
  snapshot_last_action text NOT NULL,
  snapshot_votes_count integer NOT NULL DEFAULT 0,
  snapshot_timeline_count integer NOT NULL DEFAULT 0,
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, bill_id)
);

CREATE INDEX idx_bill_watches_user ON public.bill_watches(user_id);

ALTER TABLE public.bill_watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own watches"
  ON public.bill_watches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create their own watches"
  ON public.bill_watches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own watches"
  ON public.bill_watches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own watches"
  ON public.bill_watches FOR DELETE
  USING (auth.uid() = user_id);

-- bill_notifications: detected changes for a watched bill
CREATE TABLE public.bill_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id integer NOT NULL,
  change_type text NOT NULL, -- status | progress | vote | timeline
  title text NOT NULL,
  detail text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bill_notifications_user_unread
  ON public.bill_notifications(user_id, read_at);
CREATE INDEX idx_bill_notifications_user_created
  ON public.bill_notifications(user_id, created_at DESC);

ALTER TABLE public.bill_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own notifications"
  ON public.bill_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create their own notifications"
  ON public.bill_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own notifications"
  ON public.bill_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own notifications"
  ON public.bill_notifications FOR DELETE
  USING (auth.uid() = user_id);