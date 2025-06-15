
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useUserRoles } from '@/hooks/useUserRoles';
import { User, Shield, Users, Crown } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserPrivilege = Database['public']['Enums']['user_privilege'];

const privilegeConfig = {
  user: {
    icon: <User size={12} />,
    label: 'User',
    className: 'bg-gray-100 text-gray-800'
  },
  moderator: {
    icon: <Shield size={12} />,
    label: 'Moderator',
    className: 'bg-blue-100 text-blue-800'
  },
  admin: {
    icon: <Users size={12} />,
    label: 'Admin',
    className: 'bg-purple-100 text-purple-800'
  },
  super_admin: {
    icon: <Crown size={12} />,
    label: 'Super Admin',
    className: 'bg-yellow-100 text-yellow-800'
  }
};

interface PrivilegeDisplayProps {
  size?: 'sm' | 'default';
  showIcon?: boolean;
}

export const PrivilegeDisplay: React.FC<PrivilegeDisplayProps> = ({ 
  size = 'default',
  showIcon = true 
}) => {
  const { userRole, loading } = useUserRoles();

  if (loading) {
    return <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>;
  }

  const config = privilegeConfig[userRole];

  return (
    <Badge 
      variant="secondary" 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-1' : ''}`}
    >
      {showIcon && config.icon}
      <span className={showIcon ? 'ml-1' : ''}>{config.label}</span>
    </Badge>
  );
};
