CREATE TABLE public.house_candidates_cache (
  state text PRIMARY KEY,
  candidates jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

GRANT SELECT ON public.house_candidates_cache TO anon, authenticated;
GRANT ALL ON public.house_candidates_cache TO service_role;

ALTER TABLE public.house_candidates_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read house candidate cache"
ON public.house_candidates_cache FOR SELECT
TO anon, authenticated
USING (true);