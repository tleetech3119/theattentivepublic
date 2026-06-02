CREATE TABLE public.candidate_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  name text NOT NULL,
  office text NOT NULL DEFAULT 'Governor',
  summary text NOT NULL,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state, name, office)
);

GRANT SELECT ON public.candidate_summaries TO anon, authenticated;
GRANT ALL ON public.candidate_summaries TO service_role;

ALTER TABLE public.candidate_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read candidate summaries"
ON public.candidate_summaries FOR SELECT
TO anon, authenticated
USING (true);