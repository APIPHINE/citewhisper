import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !rolesLoading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const isAdmin = userRole === 'admin' || userRole === 'super_admin';
      const isSuperAdmin = userRole === 'super_admin';

      if (requireSuperAdmin && !isSuperAdmin) {
        toast({
          title: "Access denied",
          description: "Super admin privileges required.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!requireSuperAdmin && !isAdmin) {
        toast({
          title: "Access denied", 
          description: "Admin privileges required.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
    }
  }, [user, userRole, authLoading, rolesLoading, requireSuperAdmin, navigate, toast]);

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;
  
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';
  
  if (requireSuperAdmin && !isSuperAdmin) return null;
  if (!requireSuperAdmin && !isAdmin) return null;

  return <>{children}</>;
};