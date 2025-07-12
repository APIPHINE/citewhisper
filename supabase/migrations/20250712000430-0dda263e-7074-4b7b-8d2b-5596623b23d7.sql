-- Security Fix Migration: Address Critical Vulnerabilities
-- Phase 1: Remove conflicting and insecure RLS policies

-- Remove conflicting policies on user_roles that allow privilege escalation
DROP POLICY IF EXISTS "Admins can manage lower roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;

-- Create secure role management policies
CREATE POLICY "Super admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (has_privilege_level(auth.uid(), 'super_admin'::user_privilege));

CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage roles securely" 
ON public.user_roles 
FOR ALL 
USING (
  has_privilege_level(auth.uid(), 'super_admin'::user_privilege) AND
  -- Prevent super_admin self-demotion
  (privilege != 'super_admin'::user_privilege OR auth.uid() != user_id)
)
WITH CHECK (
  has_privilege_level(auth.uid(), 'super_admin'::user_privilege) AND
  -- Only super_admins can create other super_admins
  (privilege != 'super_admin'::user_privilege OR has_privilege_level(auth.uid(), 'super_admin'::user_privilege))
);

-- Phase 2: Remove insecure anonymous access policies for quotes
DROP POLICY IF EXISTS "Allow public inserts to quotes" ON public.quotes;
DROP POLICY IF EXISTS "Allow authenticated users to insert quotes" ON public.quotes;

-- Create secure quote policies requiring authentication
CREATE POLICY "Authenticated users can create quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Admins can manage all quotes" 
ON public.quotes 
FOR ALL 
USING (has_privilege_level(auth.uid(), 'admin'::user_privilege))
WITH CHECK (has_privilege_level(auth.uid(), 'admin'::user_privilege));

-- Phase 3: Add foreign key constraint for CMS articles author validation
ALTER TABLE public.cms_articles 
ADD CONSTRAINT fk_cms_articles_author 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

-- Phase 4: Create audit trigger for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.privilege != NEW.privilege THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      target_user_id,
      old_values,
      new_values
    ) VALUES (
      COALESCE(NEW.assigned_by, auth.uid()),
      'ROLE_PRIVILEGE_CHANGE',
      NEW.user_id,
      jsonb_build_object('privilege', OLD.privilege),
      jsonb_build_object('privilege', NEW.privilege)
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      target_user_id,
      new_values
    ) VALUES (
      COALESCE(NEW.assigned_by, auth.uid()),
      'ROLE_ASSIGNED',
      NEW.user_id,
      jsonb_build_object('privilege', NEW.privilege)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_role_changes_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();

-- Phase 5: Strengthen rate limiting at database level
CREATE OR REPLACE FUNCTION public.check_rate_limit_db(
  user_id_param UUID,
  action_param TEXT,
  max_attempts INTEGER DEFAULT 5,
  window_minutes INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start := NOW() - (window_minutes || ' minutes')::INTERVAL;
  
  SELECT COUNT(*) INTO attempt_count
  FROM public.rate_limit_log
  WHERE (user_id = user_id_param OR user_id IS NULL)
    AND action = action_param
    AND created_at >= window_start;
  
  IF attempt_count >= max_attempts THEN
    RETURN FALSE;
  END IF;
  
  -- Log this attempt
  INSERT INTO public.rate_limit_log (user_id, action, attempt_count)
  VALUES (user_id_param, action_param, attempt_count + 1);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 6: Remove conflicting citation policies
DROP POLICY IF EXISTS "Allow authenticated users to insert cited_by" ON public.cited_by;
DROP POLICY IF EXISTS "Authenticated users can add citations" ON public.cited_by;

-- Create single secure citation policy
CREATE POLICY "Authenticated users can add citations" 
ON public.cited_by 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Phase 7: Strengthen CMS access control
DROP POLICY IF EXISTS "Admins can manage all articles" ON public.cms_articles;
CREATE POLICY "Super admins can manage all articles" 
ON public.cms_articles 
FOR ALL 
USING (has_privilege_level(auth.uid(), 'super_admin'::user_privilege))
WITH CHECK (
  has_privilege_level(auth.uid(), 'super_admin'::user_privilege) AND
  author_id = auth.uid()
);