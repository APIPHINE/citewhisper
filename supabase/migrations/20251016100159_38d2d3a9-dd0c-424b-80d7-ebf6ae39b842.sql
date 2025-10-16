-- Allow NULL admin_user_id for self-registration cases
ALTER TABLE public.admin_audit_log 
ALTER COLUMN admin_user_id DROP NOT NULL;

-- Update the audit trigger to handle self-registration
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.privilege != NEW.privilege THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      target_user_id,
      old_values,
      new_values
    ) VALUES (
      NEW.assigned_by,
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
      NEW.assigned_by,
      CASE 
        WHEN NEW.assigned_by IS NULL THEN 'SELF_REGISTRATION'
        ELSE 'ROLE_ASSIGNED'
      END,
      NEW.user_id,
      jsonb_build_object('privilege', NEW.privilege)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;