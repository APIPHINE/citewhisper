
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Users, Crown, AlertTriangle } from 'lucide-react';
import { adminActionLimiter } from '@/services/validationService';
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
  super_admin: 'bg-yellow-100 text-yellow-800'
};

export const UserRoleManager = () => {
  const {
    userRole,
    allUsers,
    loading,
    canManageRoles,
    canManageUser,
    getPrivilegeOptions,
    updateUserPrivilege,
    loadAllUsers
  } = useUserRoles();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (canManageRoles()) {
      loadAllUsers();
    }
  }, [canManageRoles, loadAllUsers]);

  const handleRoleUpdate = async (userId: string, newPrivilege: UserPrivilege) => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting check
    if (!adminActionLimiter.isAllowed(user.id)) {
      const remainingTime = Math.ceil(adminActionLimiter.getRemainingTime(user.id) / 1000);
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait ${remainingTime} seconds before performing another admin action.`,
        variant: "destructive"
      });
      return;
    }

    // Prevent self-privilege modification
    if (userId === user.id) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot modify your own privileges.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      const success = await updateUserPrivilege(userId, newPrivilege, user.id);
      
      if (success) {
        toast({
          title: "Role Updated",
          description: `User privilege has been updated to ${newPrivilege}.`,
        });
        // Reload users to reflect changes
        await loadAllUsers();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update user role. You may not have sufficient privileges.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Role update error:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the user role.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="mx-auto mb-2 text-destructive" size={48} />
            <p className="font-medium">Insufficient Privileges</p>
            <p className="text-sm mt-1">
              Your current role: <Badge className={privilegeColors[userRole]}>{userRole}</Badge>
            </p>
            <p className="text-sm mt-2">
              Admin or Super Admin privileges required to manage user roles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} />
          User Role Management
        </CardTitle>
        <CardDescription>
          Manage user privileges and access levels. Your role: <Badge className={privilegeColors[userRole]}>{userRole}</Badge>
          <br />
          <span className="text-xs text-muted-foreground">All actions are logged for security audit purposes.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No users found.</p>
          ) : (
            allUsers.map((targetUser) => (
              <div key={targetUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{targetUser.full_name || 'Unknown User'}</h4>
                    <Badge className={privilegeColors[targetUser.privilege]} variant="secondary">
                      {privilegeIcons[targetUser.privilege]}
                      <span className="ml-1">{targetUser.privilege}</span>
                    </Badge>
                    {targetUser.id === user?.id && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{targetUser.email}</p>
                </div>
                
                {canManageUser(targetUser.privilege) && targetUser.id !== user?.id && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={targetUser.privilege}
                      onValueChange={(value: UserPrivilege) => handleRoleUpdate(targetUser.id, value)}
                      disabled={isUpdating}
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
