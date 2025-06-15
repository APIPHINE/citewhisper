
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserPrivilege, UserWithRole } from '@/types/userRoles';

export const fetchCurrentUserRole = async (userId: string): Promise<UserPrivilege> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('privilege')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user role:', error);
    return 'user';
  }

  return data?.privilege || 'user';
};

export const fetchAllUsersWithRoles = async (): Promise<UserWithRole[]> => {
  try {
    // First get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    // Then get user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return [];
    }

    // Get auth users with proper typing
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    const usersWithRoles: UserWithRole[] = [];

    if (authData && authData.users) {
      (authData.users as User[]).forEach(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id);
        const role = roles?.find(r => r.user_id === authUser.id);
        
        usersWithRoles.push({
          id: authUser.id,
          email: authUser.email || '',
          full_name: profile?.full_name || '',
          privilege: role?.privilege || 'user',
          role_id: role?.id
        });
      });
    }

    return usersWithRoles;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const updateUserPrivilege = async (
  userId: string, 
  newPrivilege: UserPrivilege, 
  assignedBy: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        privilege: newPrivilege,
        assigned_by: assignedBy
      });

    if (error) {
      console.error('Error updating user privilege:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user privilege:', error);
    return false;
  }
};
