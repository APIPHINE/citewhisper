-- Update the source_app check constraint to include 'cq_ai_worker'
ALTER TABLE quote_submissions 
DROP CONSTRAINT IF EXISTS quote_submissions_source_app_check;

-- Add updated constraint with cq_ai_worker included
ALTER TABLE quote_submissions
ADD CONSTRAINT quote_submissions_source_app_check 
CHECK (source_app IN ('web_app', 'mobile_app', 'api', 'cq_ai_worker', 'external_submission'));