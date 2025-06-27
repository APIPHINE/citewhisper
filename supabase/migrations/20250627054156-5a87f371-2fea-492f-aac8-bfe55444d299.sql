
-- Phase 1: Core Database Security & User Ownership (Fixed)

-- First, create missing tables that are referenced in security policies
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  ip_address INET,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limit_log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Add user ownership to quotes table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Update existing quotes to have a created_by (set to first admin if available)
UPDATE public.quotes 
SET created_by = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.privilege IN ('admin', 'super_admin') 
  LIMIT 1
)
WHERE created_by IS NULL;

-- Create user contributions tracking table
CREATE TABLE IF NOT EXISTS public.user_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL, -- 'quote_submission', 'evidence_upload', 'quote_edit', 'source_addition'
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 0,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create detailed user activity log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'upload', 'download'
  resource_type TEXT NOT NULL, -- 'quote', 'evidence', 'source', 'profile'
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  action_details JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create evidence submissions tracking
CREATE TABLE IF NOT EXISTS public.evidence_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  attribution_metadata JSONB,
  approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_contributions
CREATE POLICY "Users can view their own contributions"
  ON public.user_contributions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can log contributions"
  ON public.user_contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all contributions"
  ON public.user_contributions
  FOR SELECT
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'));

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
  ON public.user_activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can log activity"
  ON public.user_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow system logging

CREATE POLICY "Admins can view all activity"
  ON public.user_activity_log
  FOR SELECT
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'));

-- RLS Policies for evidence_submissions
CREATE POLICY "Users can view their own evidence submissions"
  ON public.evidence_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = submitted_by);

CREATE POLICY "Users can submit evidence"
  ON public.evidence_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Admins can manage all evidence"
  ON public.evidence_submissions
  FOR ALL
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'))
  WITH CHECK (public.has_privilege_level(auth.uid(), 'admin'));

-- Fix existing RLS policies based on security feedback

-- 1. Fix quotes UPDATE policy - restrict to owners/admins only
DROP POLICY IF EXISTS "Users can update own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON public.quotes;

CREATE POLICY "Owners and admins can update quotes"
  ON public.quotes
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    public.has_privilege_level(auth.uid(), 'admin')
  );

-- 2. Fix admin_audit_log - restrict INSERT to system/service role only
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;

CREATE POLICY "System can insert audit logs"
  ON public.admin_audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3. Fix rate_limit_log - restrict to INSERT only
CREATE POLICY "System can insert rate limits"
  ON public.rate_limit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view rate limits"
  ON public.rate_limit_log
  FOR SELECT
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'));

-- 4. Fix quote_topics - separate user INSERT from admin management
DROP POLICY IF EXISTS "Authenticated users can manage quote_topics" ON public.quote_topics;

CREATE POLICY "Users can add quote topics"
  ON public.quote_topics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage quote topics"
  ON public.quote_topics
  FOR ALL
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'))
  WITH CHECK (public.has_privilege_level(auth.uid(), 'admin'));

-- Create functions for activity tracking
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_action_details JSONB DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activity_log (
    user_id, action_type, resource_type, resource_id, 
    ip_address, user_agent, action_details, session_id
  )
  VALUES (
    p_user_id, p_action_type, p_resource_type, p_resource_id,
    p_ip_address, p_user_agent, p_action_details, p_session_id
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Create function to log contributions and award points
CREATE OR REPLACE FUNCTION public.log_user_contribution(
  p_user_id UUID,
  p_contribution_type TEXT,
  p_quote_id UUID DEFAULT NULL,
  p_points INTEGER DEFAULT 0,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  contribution_id UUID;
BEGIN
  INSERT INTO public.user_contributions (
    user_id, contribution_type, quote_id, points_earned, description, metadata
  )
  VALUES (
    p_user_id, p_contribution_type, p_quote_id, p_points, p_description, p_metadata
  )
  RETURNING id INTO contribution_id;
  
  RETURN contribution_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_created_by ON public.quotes(created_by);
CREATE INDEX IF NOT EXISTS idx_user_contributions_user_id ON public.user_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_submissions_quote_id ON public.evidence_submissions(quote_id);
CREATE INDEX IF NOT EXISTS idx_evidence_submissions_submitted_by ON public.evidence_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_user_id ON public.rate_limit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_ip_address ON public.rate_limit_log(ip_address);
