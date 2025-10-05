-- Create quote_drafts table for saving unpublished quotes
CREATE TABLE public.quote_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT,
  ocr_text TEXT,
  quote_text TEXT,
  author_name TEXT,
  quote_context TEXT,
  date_original DATE,
  topics TEXT[],
  source_info JSONB,
  evidence_image_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_image UNIQUE (user_id, image_url)
);

-- Enable RLS
ALTER TABLE public.quote_drafts ENABLE ROW LEVEL SECURITY;

-- Users can view their own drafts
CREATE POLICY "Users can view their own drafts"
ON public.quote_drafts
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own drafts
CREATE POLICY "Users can insert their own drafts"
ON public.quote_drafts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own drafts
CREATE POLICY "Users can update their own drafts"
ON public.quote_drafts
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own drafts
CREATE POLICY "Users can delete their own drafts"
ON public.quote_drafts
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_quote_drafts_updated_at
BEFORE UPDATE ON public.quote_drafts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to limit drafts per user to 12
CREATE OR REPLACE FUNCTION public.enforce_draft_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has 12 or more drafts
  IF (SELECT COUNT(*) FROM public.quote_drafts WHERE user_id = NEW.user_id) >= 12 THEN
    -- Delete the oldest draft
    DELETE FROM public.quote_drafts
    WHERE id = (
      SELECT id FROM public.quote_drafts
      WHERE user_id = NEW.user_id
      ORDER BY updated_at ASC
      LIMIT 1
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Create trigger to enforce draft limit before insert
CREATE TRIGGER enforce_draft_limit_trigger
BEFORE INSERT ON public.quote_drafts
FOR EACH ROW
EXECUTE FUNCTION public.enforce_draft_limit();