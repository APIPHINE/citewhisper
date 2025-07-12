import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const SecurityAuditLogger = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Log successful authentication
    const logAuthEvent = async () => {
      try {
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action_type: 'AUTH_SUCCESS',
          p_resource_type: 'authentication',
          p_action_details: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client-side'
          }
        });
      } catch (error) {
        console.error('Failed to log auth event:', error);
      }
    };

    logAuthEvent();

    // Listen for suspicious activities
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Log session resumption
        supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_action_type: 'SESSION_RESUME',
          p_resource_type: 'session',
          p_action_details: {
            timestamp: new Date().toISOString()
          }
        });
        // Handle potential errors silently in production
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return null;
};