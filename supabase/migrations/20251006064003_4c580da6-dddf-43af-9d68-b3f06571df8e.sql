-- Create enum for source verification status
CREATE TYPE source_verification_status AS ENUM ('verified', 'needs_review', 'uncertain');

-- Add source_verification_status to quote_submissions
ALTER TABLE quote_submissions 
ADD COLUMN source_verification_status source_verification_status DEFAULT 'needs_review';

-- Create enum for target collection
CREATE TYPE target_collection_type AS ENUM ('verified_quotes', 'popular_unverified');

-- Add target_collection to quote_submissions
ALTER TABLE quote_submissions 
ADD COLUMN target_collection target_collection_type DEFAULT 'verified_quotes';

-- Create enum for popular quote status
CREATE TYPE popular_quote_status AS ENUM ('unverified', 'disputed', 'misattributed', 'researching');

-- Create popular_unverified_quotes table
CREATE TABLE popular_unverified_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  commonly_attributed_to TEXT,
  actual_author_if_known TEXT,
  attribution_notes TEXT,
  earliest_known_source TEXT,
  earliest_known_date TEXT,
  popularity_score INTEGER DEFAULT 0,
  verification_attempts JSONB DEFAULT '[]'::jsonb,
  status popular_quote_status DEFAULT 'unverified',
  research_notes TEXT,
  alternative_attributions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  verified_by UUID REFERENCES auth.users(id),
  source_app TEXT DEFAULT 'cq_ai_worker',
  confidence_score NUMERIC(3,2)
);

-- Enable RLS on popular_unverified_quotes
ALTER TABLE popular_unverified_quotes ENABLE ROW LEVEL SECURITY;

-- RLS policies for popular_unverified_quotes
CREATE POLICY "Anyone can view popular unverified quotes"
ON popular_unverified_quotes FOR SELECT
USING (true);

CREATE POLICY "Admins can manage popular unverified quotes"
ON popular_unverified_quotes FOR ALL
USING (has_privilege_level(auth.uid(), 'admin'::user_privilege))
WITH CHECK (has_privilege_level(auth.uid(), 'admin'::user_privilege));

CREATE POLICY "Authenticated users can contribute popular quotes"
ON popular_unverified_quotes FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Create quote_attribution_research table
CREATE TABLE quote_attribution_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES popular_unverified_quotes(id) ON DELETE CASCADE NOT NULL,
  researcher_id UUID REFERENCES auth.users(id) NOT NULL,
  research_notes TEXT NOT NULL,
  sources_consulted JSONB DEFAULT '[]'::jsonb,
  conclusion TEXT,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on quote_attribution_research
ALTER TABLE quote_attribution_research ENABLE ROW LEVEL SECURITY;

-- RLS policies for quote_attribution_research
CREATE POLICY "Anyone can view attribution research"
ON quote_attribution_research FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can contribute research"
ON quote_attribution_research FOR INSERT
WITH CHECK (auth.uid() = researcher_id);

CREATE POLICY "Researchers can update their own research"
ON quote_attribution_research FOR UPDATE
USING (auth.uid() = researcher_id);

CREATE POLICY "Admins can manage all research"
ON quote_attribution_research FOR ALL
USING (has_privilege_level(auth.uid(), 'admin'::user_privilege))
WITH CHECK (has_privilege_level(auth.uid(), 'admin'::user_privilege));

-- Add trigger for updated_at on popular_unverified_quotes
CREATE TRIGGER update_popular_unverified_quotes_updated_at
BEFORE UPDATE ON popular_unverified_quotes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_popular_quotes_status ON popular_unverified_quotes(status);
CREATE INDEX idx_popular_quotes_popularity ON popular_unverified_quotes(popularity_score DESC);
CREATE INDEX idx_attribution_research_quote ON quote_attribution_research(quote_id);
CREATE INDEX idx_quote_submissions_verification ON quote_submissions(source_verification_status);
CREATE INDEX idx_quote_submissions_collection ON quote_submissions(target_collection);