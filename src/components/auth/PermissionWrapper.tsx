
import React from 'react';
import { useAccessControl } from '@/hooks/useAccessControl';

interface PermissionWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  permission?: 'read' | 'write' | 'delete';
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  requireAuth = true,
  fallback = null,
  permission = 'read'
}) => {
  const { canRead, canWrite, canDelete, loading } = useAccessControl({ requireAuth: false });

  if (loading) {
    return <div className="animate-pulse bg-muted h-4 w-full rounded"></div>;
  }

  const hasPermission = () => {
    switch (permission) {
      case 'read':
        return canRead;
      case 'write':
        return canWrite;
      case 'delete':
        return canDelete;
      default:
        return canRead;
    }
  };

  if (!requireAuth || hasPermission()) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
