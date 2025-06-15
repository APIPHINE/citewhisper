
import type { Database } from '@/integrations/supabase/types';

export type UserPrivilege = Database['public']['Enums']['user_privilege'];

export interface UserRole {
  id: string;
  user_id: string;
  privilege: UserPrivilege;
  assigned_by: string | null;
  assigned_at: string;
  updated_at: string;
}

export interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  privilege: UserPrivilege;
  role_id?: string;
}
