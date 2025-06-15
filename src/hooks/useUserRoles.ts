
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type UserPrivilege = Database['public']['Enums']['user_privilege'];

interface UserRole {
  id: string;
  user_id: string;
  privilege: UserPrivilege;
  assigned_by: string | null;
  assigned_at: string;
  updated_at: string;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  privilege: UserPrivilege;
  role_id?: string;
}

export const useUserRoles = () => {
  const [userRole, setUserRole] = useState<UserPrivilege>('user');
  const [allUsers, setAllUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch current user's role
  const fetchUserRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('privilege')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        return;
      }

      setUserRole(data?.privilege || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users with their roles (for admins)
  const fetchAllUsers = async () => {
    if (!user || !canManageRoles()) return;

    try {
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Then get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        return;
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

      setAllUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  // Update user privilege
  const updateUserPrivilege = async (userId: string, newPrivilege: UserPrivilege) => {
    if (!user || !canManageRoles()) {
      toast({
        title: "Access denied",
        description: "You don't have permission to manage user roles.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          privilege: newPrivilege,
          assigned_by: user.id
        });

      if (error) {
        console.error('Error updating user privilege:', error);
        toast({
          title: "Error",
          description: "Failed to update user privilege.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "User privilege updated successfully."
      });

      // Refresh the users list
      await fetchAllUsers();
      return true;
    } catch (error) {
      console.error('Error updating user privilege:', error);
      toast({
        title: "Error",
        description: "Failed to update user privilege.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Helper functions
  const canManageRoles = () => {
    return ['admin', 'super_admin'].includes(userRole);
  };

  const canManageUser = (targetPrivilege: UserPrivilege) => {
    if (userRole === 'super_admin') return true;
    if (userRole === 'admin' && targetPrivilege !== 'super_admin') return true;
    return false;
  };

  const getPrivilegeOptions = (): UserPrivilege[] => {
    if (userRole === 'super_admin') {
      return ['user', 'moderator', 'admin', 'super_admin'];
    }
    if (userRole === 'admin') {
      return ['user', 'moderator', 'admin'];
    }
    return [];
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (canManageRoles()) {
      fetchAllUsers();
    }
  }, [userRole, user]);

  return {
    userRole,
    allUsers,
    loading,
    canManageRoles,
    canManageUser,
    getPrivilegeOptions,
    updateUserPrivilege,
    fetchAllUsers,
    fetchUserRole
  };
};
