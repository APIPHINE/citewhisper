
-- Create an enum for different privilege levels
CREATE TYPE public.user_privilege AS ENUM ('user', 'moderator', 'admin', 'super_admin');

-- Create a user_roles table to manage user privileges
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  privilege user_privilege NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user privileges
CREATE OR REPLACE FUNCTION public.get_user_privilege(user_id UUID)
RETURNS user_privilege
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT privilege FROM public.user_roles WHERE user_roles.user_id = $1),
    'user'::user_privilege
  );
$$;

-- Create a function to check if user has specific privilege level or higher
CREATE OR REPLACE FUNCTION public.has_privilege_level(user_id UUID, required_level user_privilege)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN required_level = 'user' THEN true
    WHEN required_level = 'moderator' THEN public.get_user_privilege($1) IN ('moderator', 'admin', 'super_admin')
    WHEN required_level = 'admin' THEN public.get_user_privilege($1) IN ('admin', 'super_admin')
    WHEN required_level = 'super_admin' THEN public.get_user_privilege($1) = 'super_admin'
    ELSE false
  END;
$$;

-- RLS Policies for user_roles table
-- Users can view their own role
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins and super_admins can view all roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Only super_admins can insert/update roles
CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_privilege_level(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_privilege_level(auth.uid(), 'super_admin'));

-- Admins can update roles below their level (but not super_admin roles)
CREATE POLICY "Admins can manage lower roles"
  ON public.user_roles
  FOR UPDATE
  USING (
    public.has_privilege_level(auth.uid(), 'admin') AND 
    privilege != 'super_admin' AND 
    auth.uid() != user_id
  )
  WITH CHECK (
    public.has_privilege_level(auth.uid(), 'admin') AND 
    privilege != 'super_admin'
  );

-- Create trigger to automatically assign default role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, privilege)
  VALUES (NEW.id, 'user'::user_privilege);
  RETURN NEW;
END;
$$;

-- Trigger to assign role when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Update the existing profiles trigger to also handle the role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Add updated_at trigger for user_roles
CREATE TRIGGER handle_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
