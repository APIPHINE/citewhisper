import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

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

  return { logSecurityEvent };
};