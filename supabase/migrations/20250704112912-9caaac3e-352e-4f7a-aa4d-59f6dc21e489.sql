
-- Create quote_submissions table for the external submission system
CREATE TABLE public.quote_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  source_app TEXT NOT NULL CHECK (source_app IN ('citequotesfinder_mobile', 'citequotesfinder_extension', 'web_form')),
  external_submission_id TEXT,
  quote_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  source_title TEXT NOT NULL,
  original_language TEXT,
  translation_language TEXT,
  translated_quote TEXT,
  is_translation BOOLEAN DEFAULT false,
  source_date TEXT,
  chapter_or_section TEXT,
  translator_name TEXT,
  ocr_text TEXT,
  image_url TEXT,
  image_crop_coords JSONB,
  image_language_hint TEXT,
  citation_style TEXT,
  generated_citation TEXT,
  evidence_type TEXT,
  source_manifest_url TEXT,
  source_context_text TEXT,
  quote_topics TEXT[],
  seo_slug TEXT,
  seo_keywords TEXT[],
  quote_rating INTEGER,
  confidence_score DECIMAL(3,2),
  duplicate_check_performed BOOLEAN DEFAULT false,
  potential_duplicate_ids TEXT[],
  processing_notes TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  device_type TEXT,
  user_agent TEXT,
  final_quote_id UUID REFERENCES public.quotes(id)
);

-- Enable RLS
ALTER TABLE public.quote_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all submissions" 
  ON public.quote_submissions 
  FOR ALL 
  USING (has_privilege_level(auth.uid(), 'admin'::user_privilege))
  WITH CHECK (has_privilege_level(auth.uid(), 'admin'::user_privilege));

CREATE POLICY "System can insert submissions" 
  ON public.quote_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create database functions for quote submission processing
CREATE OR REPLACE FUNCTION public.process_quote_submission(
  submission_id UUID,
  approve BOOLEAN
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_record public.quote_submissions%ROWTYPE;
  new_quote_id UUID;
BEGIN
  -- Get the submission
  SELECT * INTO submission_record
  FROM public.quote_submissions
  WHERE id = submission_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;
  
  IF approve THEN
    -- Create new quote
    INSERT INTO public.quotes (
      quote_text,
      author_name,
      quote_context,
      seo_slug,
      seo_keywords,
      created_by
    ) VALUES (
      submission_record.quote_text,
      submission_record.author_name,
      submission_record.source_context_text,
      submission_record.seo_slug,
      submission_record.seo_keywords,
      submission_record.processed_by
    ) RETURNING id INTO new_quote_id;
    
    -- Update submission status
    UPDATE public.quote_submissions
    SET status = 'approved',
        processed_at = now(),
        final_quote_id = new_quote_id
    WHERE id = submission_id;
    
    RETURN new_quote_id;
  ELSE
    -- Reject submission
    UPDATE public.quote_submissions
    SET status = 'rejected',
        processed_at = now()
    WHERE id = submission_id;
    
    RETURN NULL;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_submission_duplicates(
  submission_id UUID
) RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_text TEXT;
  duplicate_ids TEXT[];
BEGIN
  -- Get the submission text
  SELECT quote_text INTO submission_text
  FROM public.quote_submissions
  WHERE id = submission_id;
  
  -- Find potential duplicates (simplified - you can enhance this)
  SELECT ARRAY_AGG(id::TEXT)
  INTO duplicate_ids
  FROM public.quotes
  WHERE similarity(quote_text, submission_text) > 0.8;
  
  RETURN COALESCE(duplicate_ids, ARRAY[]::TEXT[]);
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_quote_submissions_updated_at
  BEFORE UPDATE ON public.quote_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
