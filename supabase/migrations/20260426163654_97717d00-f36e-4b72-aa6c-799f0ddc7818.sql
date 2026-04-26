-- State bills table (separate from federal `bills` table)
CREATE TABLE public.state_bills (
  id BIGINT PRIMARY KEY,
  state TEXT NOT NULL,
  bill_code TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Introduced',
  topic TEXT NOT NULL DEFAULT 'general',
  progress INTEGER NOT NULL DEFAULT 0,
  last_action TEXT NOT NULL DEFAULT '',
  last_action_date TEXT,
  introduced_date TEXT,
  session_name TEXT,
  state_url TEXT,
  legiscan_url TEXT,
  sponsors JSONB NOT NULL DEFAULT '[]'::jsonb,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_state_bills_state ON public.state_bills(state);
CREATE INDEX idx_state_bills_topic ON public.state_bills(topic);
CREATE INDEX idx_state_bills_last_action_date ON public.state_bills(last_action_date DESC);

ALTER TABLE public.state_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "State bills are publicly readable"
  ON public.state_bills FOR SELECT
  USING (true);

CREATE TRIGGER update_state_bills_updated_at
  BEFORE UPDATE ON public.state_bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tracks last sync per state so we don't hammer the LegiScan API
CREATE TABLE public.state_sync_log (
  state TEXT PRIMARY KEY,
  last_synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bill_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.state_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sync log is publicly readable"
  ON public.state_sync_log FOR SELECT
  USING (true);

CREATE TRIGGER update_state_sync_log_updated_at
  BEFORE UPDATE ON public.state_sync_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();