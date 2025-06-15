
import { useState, useCallback } from "react";
import type { UserPrivilege, UserWithRole } from "@/types/userRoles";
import {
  fetchCurrentUserRole,
  fetchAllUsersWithRoles,
  updateUserPrivilege as supabaseUpdateUserPrivilege,
} from "@/services/userRoleService";
import {
  canManageRoles,
  canManageUser,
  getPrivilegeOptions,
} from "@/utils/privilegeUtils";

// This hook provides role utilities for admin/etc pages
export function useUserRoles() {
  const [userRole, setUserRole] = useState<UserPrivilege>("user");
  const [allUsers, setAllUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Loads the current user's role
  const loadRole = useCallback(async (userId?: string) => {
    setLoading(true);
    if (userId) {
      const privilege = await fetchCurrentUserRole(userId);
      setUserRole(privilege);
    }
    setLoading(false);
  }, []);

  // Loads all users (for admin)
  const loadAllUsers = useCallback(async () => {
    setLoading(true);
    const users = await fetchAllUsersWithRoles();
    setAllUsers(users);
    setLoading(false);
  }, []);

  const updateUserPrivilege = useCallback(
    async (userId: string, newPrivilege: UserPrivilege, assignedBy?: string) => {
      setLoading(true);
      const result = await supabaseUpdateUserPrivilege(
        userId,
        newPrivilege,
        assignedBy ?? ""
      );
      await loadAllUsers();
      setLoading(false);
      return result;
    },
    [loadAllUsers]
  );

  return {
    userRole,
    allUsers,
    loading,
    loadRole,
    loadAllUsers,
    canManageRoles: () => canManageRoles(userRole),
    canManageUser: (targetPrivilege: UserPrivilege) =>
      canManageUser(userRole, targetPrivilege),
    getPrivilegeOptions: () => getPrivilegeOptions(userRole),
    updateUserPrivilege,
  };
}

