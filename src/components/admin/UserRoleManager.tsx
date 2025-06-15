
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, User, Users, Crown } from 'lucide-react';
import type { UserPrivilege } from '@/types/userRoles';

const privilegeIcons = {
  user: <User size={16} />,
  moderator: <Shield size={16} />,
  admin: <Users size={16} />,
  super_admin: <Crown size={16} />
};

const privilegeColors = {
  user: 'bg-gray-100 text-gray-800',
  moderator: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800',
  super_admin: 'bg-gold-100 text-gold-800'
};

export const UserRoleManager = () => {
  const {
    userRole,
    allUsers,
    loading,
    canManageRoles,
    canManageUser,
    getPrivilegeOptions,
    updateUserPrivilege
  } = useUserRoles();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canManageRoles()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Shield className="mx-auto mb-2" size={48} />
            <p>You don't have permission to manage user roles.</p>
            <p className="text-sm mt-1">Your current role: <Badge className={privilegeColors[userRole]}>{userRole}</Badge></p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRoleUpdate = async (userId: string, newPrivilege: UserPrivilege) => {
    await updateUserPrivilege(userId, newPrivilege);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} />
          User Role Management
        </CardTitle>
        <CardDescription>
          Manage user privileges and access levels. Your role: <Badge className={privilegeColors[userRole]}>{userRole}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No users found.</p>
          ) : (
            allUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{user.full_name || 'Unknown User'}</h4>
                    <Badge className={privilegeColors[user.privilege]} variant="secondary">
                      {privilegeIcons[user.privilege]}
                      <span className="ml-1">{user.privilege}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                {canManageUser(user.privilege) && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.privilege}
                      onValueChange={(value: UserPrivilege) => handleRoleUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getPrivilegeOptions().map((privilege) => (
                          <SelectItem key={privilege} value={privilege}>
                            <div className="flex items-center gap-2">
                              {privilegeIcons[privilege]}
                              {privilege}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
