
CREATE TABLE public.sponsored_legislation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rep_id TEXT NOT NULL REFERENCES public.representatives(id) ON DELETE CASCADE,
  bill_code TEXT NOT NULL,
  bill_title TEXT NOT NULL,
  introduced_date TEXT,
  status TEXT DEFAULT 'Introduced',
  topic TEXT DEFAULT 'general',
  congress_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rep_id, bill_code)
);

ALTER TABLE public.sponsored_legislation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsored legislation is publicly readable"
  ON public.sponsored_legislation
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_sponsored_legislation_rep_id ON public.sponsored_legislation(rep_id);
