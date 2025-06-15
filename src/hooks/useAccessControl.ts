
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface AccessControlOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
}

export const useAccessControl = (options: AccessControlOptions = {}) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    requireAuth = true,
    redirectTo = '/login',
    showToast = true,
    toastMessage = 'Please sign in to access this feature.'
  } = options;

  const checkAccess = (action?: string) => {
    if (loading) return false;
    
    if (requireAuth && !isAuthenticated) {
      if (showToast) {
        toast({
          title: "Authentication required",
          description: action ? `Please sign in to ${action}.` : toastMessage,
          variant: "destructive"
        });
      }
      navigate(redirectTo);
      return false;
    }
    
    return true;
  };

  const hasAccess = !requireAuth || isAuthenticated;
  const canRead = true; // Everyone can read
  const canWrite = isAuthenticated; // Only authenticated users can write
  const canDelete = isAuthenticated; // Only authenticated users can delete

  return {
    isAuthenticated,
    loading,
    hasAccess,
    canRead,
    canWrite,
    canDelete,
    checkAccess
  };
};
