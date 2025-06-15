
import type { UserPrivilege } from '@/types/userRoles';

export const canManageRoles = (userRole: UserPrivilege): boolean => {
  return ['admin', 'super_admin'].includes(userRole);
};

export const canManageUser = (userRole: UserPrivilege, targetPrivilege: UserPrivilege): boolean => {
  if (userRole === 'super_admin') return true;
  if (userRole === 'admin' && targetPrivilege !== 'super_admin') return true;
  return false;
};

export const getPrivilegeOptions = (userRole: UserPrivilege): UserPrivilege[] => {
  if (userRole === 'super_admin') {
    return ['user', 'moderator', 'admin', 'super_admin'];
  }
  if (userRole === 'admin') {
    return ['user', 'moderator', 'admin'];
  }
  return [];
};
