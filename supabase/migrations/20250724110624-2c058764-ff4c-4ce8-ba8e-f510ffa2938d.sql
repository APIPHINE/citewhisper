-- CRITICAL SECURITY FIXES
-- Phase 1: Fix database function search paths and RLS policies

-- 1. Fix all database functions to have secure search_path
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_catalog;
ALTER FUNCTION public.handle_updated_at() SET search_path = public, pg_catalog;
ALTER FUNCTION public.audit_role_changes() SET search_path = public, pg_catalog;
ALTER FUNCTION public.secure_update_user_privilege(uuid, user_privilege, uuid) SET search_path = public, pg_catalog;
ALTER FUNCTION public.get_users_for_admin(uuid) SET search_path = public, pg_catalog;
ALTER FUNCTION public.log_user_activity(uuid, text, text, uuid, inet, text, jsonb, text) SET search_path = public, pg_catalog;
ALTER FUNCTION public.log_user_contribution(uuid, text, uuid, integer, text, jsonb) SET search_path = public, pg_catalog;
ALTER FUNCTION public.process_quote_submission(uuid, boolean) SET search_path = public, pg_catalog;
ALTER FUNCTION public.increment_quote_share_count() SET search_path = public, pg_catalog;
ALTER FUNCTION public.check_submission_duplicates(uuid) SET search_path = public, pg_catalog;
ALTER FUNCTION public.check_rate_limit_db(uuid, text, integer, integer) SET search_path = public, pg_catalog;
ALTER FUNCTION public.get_user_privilege(uuid) SET search_path = public, pg_catalog;
ALTER FUNCTION public.has_privilege_level(uuid, user_privilege) SET search_path = public, pg_catalog;
ALTER FUNCTION public.handle_new_user_role() SET search_path = public, pg_catalog;
ALTER FUNCTION public.increment_quote_share_count(uuid) SET search_path = public, pg_catalog;

-- 2. Fix critical RLS policy vulnerabilities on quotes table
-- Remove overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to update quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated users can create quotes" ON public.quotes;

-- Keep only secure policies for quotes
-- The remaining policies are already secure:
-- - "Allow public read access to quotes" (SELECT only)
-- - "Admins can manage all quotes securely" (admin-only)
-- - "Authenticated users can create quotes securely" (with proper ownership check)
-- - "Owners and admins can update quotes" (proper ownership + admin check)

-- 3. Fix user_roles RLS policy vulnerability
-- Drop the potentially problematic super admin policy
DROP POLICY IF EXISTS "Super admins can manage roles securely" ON public.user_roles;

-- Create a more secure super admin policy
CREATE POLICY "Super admins can manage roles securely" ON public.user_roles
FOR ALL
TO authenticated
USING (
  has_privilege_level(auth.uid(), 'super_admin'::user_privilege) AND
  -- Prevent super admins from demoting themselves
  NOT (user_id = auth.uid() AND privilege = 'super_admin'::user_privilege)
)
WITH CHECK (
  has_privilege_level(auth.uid(), 'super_admin'::user_privilege) AND
  -- Additional validation for privilege assignments
  (privilege != 'super_admin'::user_privilege OR has_privilege_level(auth.uid(), 'super_admin'::user_privilege)) AND
  -- Prevent self-demotion from super_admin
  NOT (user_id = auth.uid() AND privilege != 'super_admin'::user_privilege AND 
       (SELECT privilege FROM public.user_roles WHERE user_id = auth.uid()) = 'super_admin'::user_privilege)
);

-- 4. Clean up IIIF manifests conflicting policies
-- Remove redundant and conflicting policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.iiif_manifests;
DROP POLICY IF EXISTS "Allow read access for all users" ON public.iiif_manifests;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.iiif_manifests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.iiif_manifests;
DROP POLICY IF EXISTS "Enable select for all users" ON public.iiif_manifests;
DROP POLICY IF EXISTS "Enable update for all users" ON public.iiif_manifests;

-- Keep only the secure policies:
-- - "Admins can manage IIIF manifests" (admin-only management)
-- - "Anyone can view IIIF manifests" (public read access)

-- 5. Enhance the secure_update_user_privilege function with additional validation
CREATE OR REPLACE FUNCTION public.secure_update_user_privilege(
  target_user_id uuid, 
  new_privilege user_privilege, 
  admin_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $function$
DECLARE
  current_admin_privilege user_privilege;
  target_current_privilege user_privilege;
  operation_allowed BOOLEAN := false;
BEGIN
  -- Input validation
  IF target_user_id IS NULL OR admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid input: user IDs cannot be null';
  END IF;
  
  IF new_privilege IS NULL THEN
    RAISE EXCEPTION 'Invalid input: privilege cannot be null';
  END IF;
  
  -- Get current admin privilege
  SELECT public.get_user_privilege(admin_user_id) INTO current_admin_privilege;
  
  -- Get target user's current privilege
  SELECT public.get_user_privilege(target_user_id) INTO target_current_privilege;
  
  -- Enhanced security checks
  -- Prevent self-demotion from super_admin
  IF target_user_id = admin_user_id AND 
     target_current_privilege = 'super_admin' AND 
     new_privilege != 'super_admin' THEN
    RAISE EXCEPTION 'Super admins cannot demote themselves';
  END IF;
  
  -- Check if operation is allowed based on privilege hierarchy
  IF current_admin_privilege = 'super_admin' THEN
    operation_allowed := true;
  ELSIF current_admin_privilege = 'admin' AND 
        new_privilege != 'super_admin' AND 
        target_current_privilege != 'super_admin' THEN
    operation_allowed := true;
  END IF;
  
  -- Perform the update if allowed
  IF operation_allowed THEN
    -- Log the action with enhanced details
    INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, old_values, new_values)
    VALUES (
      admin_user_id,
      'UPDATE_USER_PRIVILEGE',
      target_user_id,
      jsonb_build_object(
        'privilege', target_current_privilege,
        'timestamp', now(),
        'admin_privilege', current_admin_privilege
      ),
      jsonb_build_object(
        'privilege', new_privilege,
        'timestamp', now(),
        'validation_passed', true
      )
    );
    
    -- Update the privilege
    UPDATE public.user_roles 
    SET privilege = new_privilege, 
        assigned_by = admin_user_id,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    RETURN true;
  END IF;
  
  -- Log failed attempts
  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, old_values, new_values)
  VALUES (
    admin_user_id,
    'UPDATE_USER_PRIVILEGE_FAILED',
    target_user_id,
    jsonb_build_object(
      'privilege', target_current_privilege,
      'admin_privilege', current_admin_privilege,
      'attempted_privilege', new_privilege
    ),
    jsonb_build_object(
      'error', 'Insufficient privileges',
      'validation_passed', false
    )
  );
  
  RETURN false;
END;
$function$;