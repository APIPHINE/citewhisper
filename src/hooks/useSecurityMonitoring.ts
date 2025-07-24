import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const logSecurityEvent = useCallback(async (
    eventType: string,
    severity: 'low' | 'medium' | 'high',
    details: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_action_type: `SECURITY_${eventType.toUpperCase()}`,
        p_resource_type: 'security',
        p_action_details: {
          severity,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ...details
        }
      });

      if (severity === 'high') {
        console.warn('HIGH SEVERITY SECURITY EVENT:', eventType, details);
        toast({
          title: "Security Alert",
          description: `High severity security event detected: ${eventType}`,
          variant: "destructive",
          duration: 10000,
        });
      } else if (severity === 'medium') {
        toast({
          title: "Security Notice",
          description: `Security event detected: ${eventType}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user]);

  const detectAbnormalActivity = useCallback(() => {
    // Detect multiple rapid page changes
    let pageChangeCount = 0;
    const resetInterval = setInterval(() => {
      pageChangeCount = 0;
    }, 60000); // Reset every minute

    const handleLocationChange = () => {
      pageChangeCount++;
      if (pageChangeCount > 20) { // More than 20 page changes per minute
        logSecurityEvent('RAPID_NAVIGATION', 'medium', {
          page_changes: pageChangeCount,
          current_url: window.location.href
        });
      }
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(resetInterval);
    };
  }, [logSecurityEvent]);

  const monitorConsoleUsage = useCallback(() => {
    // Monitor for potential console manipulation
    let consoleUsageCount = 0;
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      consoleUsageCount++;
      if (consoleUsageCount > 50) { // Excessive console usage
        logSecurityEvent('CONSOLE_MANIPULATION', 'low', {
          usage_count: consoleUsageCount
        });
      }
      return originalLog.apply(console, args);
    };

    console.error = (...args) => {
      consoleUsageCount++;
      return originalError.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, [logSecurityEvent]);

  useEffect(() => {
    if (!user) return;

    const cleanupAbnormalActivity = detectAbnormalActivity();
    const cleanupConsoleMonitoring = monitorConsoleUsage();

    // Monitor for potential XSS attempts
    const handleBeforeUnload = () => {
      logSecurityEvent('SESSION_END', 'low', {
        duration: Date.now() - (user as any).lastLoginTime || 0
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanupAbnormalActivity();
      cleanupConsoleMonitoring();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, detectAbnormalActivity, monitorConsoleUsage, logSecurityEvent]);

  const detectSuspiciousActivity = useCallback(async () => {
    if (!user) return;

    // Check for rapid quote submissions
    const { data: recentActivity } = await supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('action_type', 'QUOTE_SUBMISSION')
      .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()); // Last 10 minutes

    if (recentActivity && recentActivity.length > 10) {
      logSecurityEvent('RAPID_QUOTE_SUBMISSION', 'high', {
        submission_count: recentActivity.length,
        time_window: '10_minutes'
      });
    }

    // Check for unusual admin actions
    const { data: adminActivity } = await supabase
      .from('admin_audit_log')
      .select('*')
      .eq('admin_user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (adminActivity && adminActivity.length > 20) {
      logSecurityEvent('EXCESSIVE_ADMIN_ACTIVITY', 'medium', {
        action_count: adminActivity.length,
        time_window: '1_hour'
      });
    }
  }, [user, logSecurityEvent]);

  return { logSecurityEvent, detectSuspiciousActivity };
};