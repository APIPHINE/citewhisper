-- Create enum for source types
CREATE TYPE source_type AS ENUM (
  'book',
  'journal_article', 
  'newspaper',
  'magazine',
  'website',
  'speech',
  'interview',
  'letter',
  'diary',
  'manuscript',
  'documentary',
  'podcast',
  'social_media',
  'government_document',
  'legal_document',
  'academic_thesis',
  'conference_paper',
  'other'
);

-- Create comprehensive source_info table
CREATE TABLE public.source_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  
  -- Basic source information
  source_type source_type NOT NULL,
  title TEXT,
  author TEXT,
  publication_date TEXT,
  publisher TEXT,
  
  -- Location in source fields (dynamic based on source_type)
  page_number TEXT,
  page_range TEXT,
  chapter_number TEXT,
  chapter_title TEXT,
  section_title TEXT,
  verse_reference TEXT,
  line_number TEXT,
  paragraph_number TEXT,
  timestamp_start TEXT,
  timestamp_end TEXT,
  minute_mark TEXT,
  act_scene TEXT,
  stanza_number TEXT,
  
  -- Publication details
  volume_number TEXT,
  issue_number TEXT,
  edition TEXT,
  series_title TEXT,
  journal_name TEXT,
  newspaper_name TEXT,
  magazine_name TEXT,
  
  -- Identifiers
  isbn TEXT,
  issn TEXT,
  doi TEXT,
  pmid TEXT,
  arxiv_id TEXT,
  
  -- URLs and links
  primary_url TEXT,
  backup_url TEXT, -- This will store the Wayback Machine URL
  publisher_url TEXT,
  doi_url TEXT,
  isbn_link TEXT,
  amazon_link TEXT,
  google_books_link TEXT,
  jstor_link TEXT,
  pubmed_link TEXT,
  arxiv_link TEXT,
  youtube_link TEXT,
  spotify_link TEXT,
  
  -- Additional metadata
  language TEXT DEFAULT 'en',
  translation_info TEXT,
  archive_location TEXT,
  call_number TEXT,
  collection_name TEXT,
  
  -- Verification and quality
  verification_status TEXT DEFAULT 'unverified',
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.source_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view source info" 
ON public.source_info 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create source info" 
ON public.source_info 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators and admins can update source info" 
ON public.source_info 
FOR UPDATE 
USING (auth.uid() = created_by OR has_privilege_level(auth.uid(), 'admin'::user_privilege));

CREATE POLICY "Admins can delete source info" 
ON public.source_info 
FOR DELETE 
USING (has_privilege_level(auth.uid(), 'admin'::user_privilege));

-- Create indexes for performance
CREATE INDEX idx_source_info_quote_id ON public.source_info(quote_id);
CREATE INDEX idx_source_info_source_type ON public.source_info(source_type);
CREATE INDEX idx_source_info_verification_status ON public.source_info(verification_status);
CREATE INDEX idx_source_info_created_at ON public.source_info(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_source_info_updated_at
  BEFORE UPDATE ON public.source_info
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();