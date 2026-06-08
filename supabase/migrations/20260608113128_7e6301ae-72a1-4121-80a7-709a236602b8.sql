CREATE TABLE public.quote_ai_cache (
  quote_id text PRIMARY KEY,
  bio text,
  analysis text,
  tags text[],
  related_quote_ids text[],
  model text,
  prompt_version int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quote_ai_cache TO anon, authenticated;
GRANT ALL ON public.quote_ai_cache TO service_role;

ALTER TABLE public.quote_ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read quote ai cache"
  ON public.quote_ai_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);