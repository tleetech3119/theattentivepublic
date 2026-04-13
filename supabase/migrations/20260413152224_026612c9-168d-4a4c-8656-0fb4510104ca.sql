
-- Create representatives table
CREATE TABLE public.representatives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  party TEXT NOT NULL CHECK (party IN ('D', 'R', 'I')),
  chamber TEXT NOT NULL CHECK (chamber IN ('Senate', 'House')),
  state TEXT NOT NULL,
  district TEXT,
  photo TEXT,
  rating TEXT NOT NULL,
  bio TEXT NOT NULL,
  term_start TEXT NOT NULL,
  term_end TEXT NOT NULL,
  contact JSONB NOT NULL DEFAULT '{}',
  issue_scores JSONB NOT NULL DEFAULT '[]',
  voting_history JSONB NOT NULL DEFAULT '[]',
  committees JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bills table
CREATE TABLE public.bills (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  topic TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  introduced_date TEXT NOT NULL,
  last_action TEXT NOT NULL,
  sponsors JSONB NOT NULL DEFAULT '[]',
  timeline JSONB NOT NULL DEFAULT '[]',
  votes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table (localStorage-backed for now, DB-ready for auth)
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  selected_state TEXT,
  selected_issues JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Representatives and bills are publicly readable
CREATE POLICY "Representatives are publicly readable"
  ON public.representatives FOR SELECT USING (true);

CREATE POLICY "Bills are publicly readable"
  ON public.bills FOR SELECT USING (true);

-- User preferences: anyone can read/write by session_id (no auth yet)
CREATE POLICY "Anyone can read preferences"
  ON public.user_preferences FOR SELECT USING (true);

CREATE POLICY "Anyone can insert preferences"
  ON public.user_preferences FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update preferences"
  ON public.user_preferences FOR UPDATE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_representatives_updated_at
  BEFORE UPDATE ON public.representatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
