-- Enhance translations table with attribution and quality fields
ALTER TABLE public.translations 
ADD COLUMN translation_type text DEFAULT 'human',
ADD COLUMN translator_type text DEFAULT 'human', -- 'human', 'ai', 'community'
ADD COLUMN confidence_score numeric(3,2), -- 0.00 to 1.00
ADD COLUMN verified boolean DEFAULT false,
ADD COLUMN verified_by uuid REFERENCES profiles(id),
ADD COLUMN verified_at timestamp with time zone,
ADD COLUMN quality_rating numeric(2,1), -- 1.0 to 5.0
ADD COLUMN ai_model text, -- for AI translations
ADD COLUMN created_by uuid REFERENCES profiles(id),
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Add trigger for updated_at
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies for enhanced translations
DROP POLICY IF EXISTS "Allow authenticated users to insert translations" ON public.translations;
DROP POLICY IF EXISTS "Allow public read access to translations" ON public.translations;

CREATE POLICY "Allow authenticated users to create translations" 
ON public.translations 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow creators to update their translations" 
ON public.translations 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Allow verifiers to update verification status" 
ON public.translations 
FOR UPDATE 
USING (has_privilege_level(auth.uid(), 'moderator'));

CREATE POLICY "Allow public read access to verified translations" 
ON public.translations 
FOR SELECT 
USING (true);