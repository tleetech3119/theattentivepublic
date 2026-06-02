ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS election_updates_opt_in boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS election_updates_opt_in_at timestamptz;