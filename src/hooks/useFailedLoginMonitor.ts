import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useFailedLoginMonitor = () => {
  const { toast } = useToast();

  const trackFailedLogin = useCallback(async (email: string) => {
    try {
      // Log failed attempt
      await supabase.rpc('log_user_activity', {
        p_user_id: null,
        p_action_type: 'AUTH_FAILED_LOGIN',
        p_resource_type: 'authentication',
        p_action_details: {
          email,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client-side'
        }
      });

      // Check if this IP/email has too many recent failures
      const { data: recentFailures } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('action_type', 'AUTH_FAILED_LOGIN')
        .gte('created_at', new Date(Date.now() - LOCKOUT_DURATION).toISOString())
        .filter('action_details->email', 'eq', email);

      if (recentFailures && recentFailures.length >= MAX_ATTEMPTS) {
        toast({
          title: "Account temporarily locked",
          description: `Too many failed login attempts. Please try again in 15 minutes.`,
          variant: "destructive",
          duration: 10000,
        });

        // Log security event
        await supabase.rpc('log_user_activity', {
          p_user_id: null,
          p_action_type: 'SECURITY_ACCOUNT_LOCKOUT',
          p_resource_type: 'security',
          p_action_details: {
            email,
            failed_attempts: recentFailures.length,
            lockout_duration: LOCKOUT_DURATION,
            timestamp: new Date().toISOString(),
          }
        });

        return true; // Account is locked
      }

      if (recentFailures && recentFailures.length >= 3) {
        toast({
          title: "Multiple failed attempts detected",
          description: `${recentFailures.length} failed login attempts. Account will be locked after ${MAX_ATTEMPTS} attempts.`,
          variant: "destructive",
        });
      }

      return false; // Account not locked
    } catch (error) {
      console.error('Failed to track failed login:', error);
      return false;
    }
  }, [toast]);

  const trackSuccessfulLogin = useCallback(async (userId: string) => {
    try {
      await supabase.rpc('log_user_activity', {
        p_user_id: userId,
        p_action_type: 'AUTH_SUCCESS_LOGIN',
        p_resource_type: 'authentication',
        p_action_details: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client-side'
        }
      });
    } catch (error) {
      console.error('Failed to track successful login:', error);
    }
  }, []);

  const checkAccountLocked = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data: recentFailures } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('action_type', 'AUTH_FAILED_LOGIN')
        .gte('created_at', new Date(Date.now() - LOCKOUT_DURATION).toISOString())
        .filter('action_details->email', 'eq', email);

      return (recentFailures?.length || 0) >= MAX_ATTEMPTS;
    } catch (error) {
      console.error('Failed to check account lock status:', error);
      return false;
    }
  }, []);

  return {
    trackFailedLogin,
    trackSuccessfulLogin,
    checkAccountLocked,
  };
};