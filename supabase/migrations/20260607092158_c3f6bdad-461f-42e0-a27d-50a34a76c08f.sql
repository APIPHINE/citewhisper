-- Enable fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Permanent AI enrichment cache for quotes
CREATE TABLE public.quote_enrichments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_hash TEXT NOT NULL UNIQUE,
  normalized_text TEXT NOT NULL,
  author_normalized TEXT NOT NULL DEFAULT '',
  original_text TEXT NOT NULL,
  original_author TEXT,
  enrichment JSONB NOT NULL,
  model TEXT NOT NULL,
  confidence NUMERIC,
  hit_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quote_enrichments TO anon;
GRANT SELECT, INSERT, UPDATE ON public.quote_enrichments TO authenticated;
GRANT ALL ON public.quote_enrichments TO service_role;

ALTER TABLE public.quote_enrichments ENABLE ROW LEVEL SECURITY;

-- Cache is shared knowledge — anyone can read, only edge function (service_role) writes
CREATE POLICY "Anyone can read quote enrichments"
  ON public.quote_enrichments FOR SELECT
  USING (true);

-- Trigram indexes for fuzzy matching
CREATE INDEX quote_enrichments_normalized_text_trgm
  ON public.quote_enrichments USING gin (normalized_text gin_trgm_ops);
CREATE INDEX quote_enrichments_author_trgm
  ON public.quote_enrichments USING gin (author_normalized gin_trgm_ops);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER quote_enrichments_set_updated_at
  BEFORE UPDATE ON public.quote_enrichments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Fuzzy lookup function: returns best match above similarity threshold
CREATE OR REPLACE FUNCTION public.find_similar_enrichment(
  p_normalized_text TEXT,
  p_author_normalized TEXT DEFAULT '',
  p_threshold NUMERIC DEFAULT 0.75
)
RETURNS TABLE (
  id UUID,
  text_hash TEXT,
  enrichment JSONB,
  model TEXT,
  confidence NUMERIC,
  text_similarity REAL,
  author_similarity REAL
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    qe.id,
    qe.text_hash,
    qe.enrichment,
    qe.model,
    qe.confidence,
    similarity(qe.normalized_text, p_normalized_text) AS text_similarity,
    CASE
      WHEN p_author_normalized = '' OR qe.author_normalized = '' THEN 1.0
      ELSE similarity(qe.author_normalized, p_author_normalized)
    END AS author_similarity
  FROM public.quote_enrichments qe
  WHERE similarity(qe.normalized_text, p_normalized_text) >= p_threshold
    AND (
      p_author_normalized = ''
      OR qe.author_normalized = ''
      OR similarity(qe.author_normalized, p_author_normalized) >= 0.6
    )
  ORDER BY similarity(qe.normalized_text, p_normalized_text) DESC
  LIMIT 1;
$$;

-- Hit-count bump (called by edge function on cache hit)
CREATE OR REPLACE FUNCTION public.bump_enrichment_hit(p_id UUID)
RETURNS VOID
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE public.quote_enrichments
  SET hit_count = hit_count + 1,
      last_used_at = now()
  WHERE id = p_id;
$$;