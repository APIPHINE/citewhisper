import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes total

export const useSessionTimeout = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [warningShown, setWarningShown] = useState(false);

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setWarningShown(false);
  }, []);

  const checkTimeout = useCallback(() => {
    if (!user) return;

    const timeSinceActivity = Date.now() - lastActivity;
    
    // Show warning 5 minutes before timeout
    if (timeSinceActivity >= SESSION_TIMEOUT - SESSION_WARNING_TIME && !warningShown) {
      setWarningShown(true);
      toast({
        title: "Session expiring soon",
        description: "Your session will expire in 5 minutes due to inactivity.",
        variant: "destructive",
        duration: 10000,
      });
    }

    // Auto logout after timeout
    if (timeSinceActivity >= SESSION_TIMEOUT) {
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });
      signOut();
    }
  }, [user, lastActivity, warningShown, toast, signOut]);

  useEffect(() => {
    if (!user) return;

    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => resetActivity();
    
    activities.forEach(activity => {
      document.addEventListener(activity, handleActivity, true);
    });

    const interval = setInterval(checkTimeout, 60000); // Check every minute

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [user, resetActivity, checkTimeout]);

  return { resetActivity, lastActivity };
};