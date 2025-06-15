
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAuthRedirect = (requireAuth: boolean = true) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, loading, requireAuth, navigate, toast]);

  return { isAuthenticated, loading };
};

export const useRequireAuth = () => {
  return useAuthRedirect(true);
};
