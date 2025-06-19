
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';
import type { UserPrivilege, UserWithRole } from "@/types/userRoles";

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
    // Use the new secure function instead of direct queries
    const { data, error } = await supabase.rpc('get_users_for_admin');

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Access denied or insufficient privileges');
    }

    return data?.map((user: any) => ({
      id: user.user_id,
      email: user.email || '',
      full_name: user.full_name || '',
      privilege: user.privilege || 'user',
      role_id: user.user_id
    })) || [];
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
    // Use the new secure function for privilege updates
    const { data, error } = await supabase.rpc('secure_update_user_privilege', {
      target_user_id: userId,
      new_privilege: newPrivilege,
      admin_user_id: assignedBy
    });

    if (error) {
      console.error('Error updating user privilege:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error updating user privilege:', error);
    return false;
  }
};
