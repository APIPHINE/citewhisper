
-- Phase 1: Critical RLS Policy Implementation

-- 1. Enable RLS on unprotected tables
ALTER TABLE public.original_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_genconten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_paraphrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cited_by ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iiif_manifests ENABLE ROW LEVEL SECURITY;

-- 2. Add RLS policies for original_sources
CREATE POLICY "Anyone can view original sources"
  ON public.original_sources
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create original sources"
  ON public.original_sources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update original sources"
  ON public.original_sources
  FOR UPDATE
  TO authenticated
  USING (true);

-- 3. Add RLS policies for topics (admin-only write, public read)
CREATE POLICY "Anyone can view topics"
  ON public.topics
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage topics"
  ON public.topics
  FOR ALL
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'))
  WITH CHECK (public.has_privilege_level(auth.uid(), 'admin'));

-- 4. Add RLS policies for quote_genconten
CREATE POLICY "Anyone can view generated content"
  ON public.quote_genconten
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create generated content"
  ON public.quote_genconten
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Add RLS policies for quote_paraphrases
CREATE POLICY "Anyone can view paraphrases"
  ON public.quote_paraphrases
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create paraphrases"
  ON public.quote_paraphrases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Add RLS policies for cited_by
CREATE POLICY "Anyone can view citations"
  ON public.cited_by
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add citations"
  ON public.cited_by
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Add RLS policies for iiif_manifests (admin-only)
CREATE POLICY "Anyone can view IIIF manifests"
  ON public.iiif_manifests
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage IIIF manifests"
  ON public.iiif_manifests
  FOR ALL
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'))
  WITH CHECK (public.has_privilege_level(auth.uid(), 'admin'));

-- 8. Secure quotes table - require authentication for writes
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.quotes;
CREATE POLICY "Authenticated users can create quotes"
  ON public.quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update quotes"
  ON public.quotes
  FOR UPDATE
  TO authenticated
  USING (true);

-- 9. Add missing display_name column to user_roles for better admin management
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 10. Create audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  old_values JSONB,
  new_values JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (public.has_privilege_level(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON public.admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 11. Create secure user management functions
CREATE OR REPLACE FUNCTION public.secure_update_user_privilege(
  target_user_id UUID,
  new_privilege user_privilege,
  admin_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_privilege user_privilege;
  target_current_privilege user_privilege;
  operation_allowed BOOLEAN := false;
BEGIN
  -- Get current admin privilege
  SELECT public.get_user_privilege(admin_user_id) INTO current_admin_privilege;
  
  -- Get target user's current privilege
  SELECT public.get_user_privilege(target_user_id) INTO target_current_privilege;
  
  -- Check if operation is allowed based on privilege hierarchy
  IF current_admin_privilege = 'super_admin' THEN
    operation_allowed := true;
  ELSIF current_admin_privilege = 'admin' AND new_privilege != 'super_admin' AND target_current_privilege != 'super_admin' THEN
    operation_allowed := true;
  END IF;
  
  -- Perform the update if allowed
  IF operation_allowed THEN
    -- Log the action
    INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, old_values, new_values)
    VALUES (
      admin_user_id,
      'UPDATE_USER_PRIVILEGE',
      target_user_id,
      jsonb_build_object('privilege', target_current_privilege),
      jsonb_build_object('privilege', new_privilege)
    );
    
    -- Update the privilege
    UPDATE public.user_roles 
    SET privilege = new_privilege, 
        assigned_by = admin_user_id,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 12. Create function to safely list users for admin
CREATE OR REPLACE FUNCTION public.get_users_for_admin(requesting_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  privilege user_privilege,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if requesting user has admin privileges
  IF NOT public.has_privilege_level(requesting_user_id, 'admin') THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.full_name,
    COALESCE(ur.privilege, 'user'::user_privilege),
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$;
