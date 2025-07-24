import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SecurityAlertManager = () => {
  const { user } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();
  const { toast } = useToast();
  useSessionTimeout(); // Activate session timeout monitoring

  useEffect(() => {
    if (!user) return;

    // Monitor for suspicious device/location changes
    const checkDeviceFingerprint = () => {
      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const currentFingerprint = JSON.stringify(fingerprint);
      const lastFingerprint = localStorage.getItem('device_fingerprint');

      if (lastFingerprint && lastFingerprint !== currentFingerprint) {
        logSecurityEvent('DEVICE_CHANGE_DETECTED', 'medium', {
          previous_fingerprint: lastFingerprint,
          current_fingerprint: currentFingerprint,
        });

        toast({
          title: "New device detected",
          description: "We noticed you're logging in from a new device or browser.",
          variant: "default",
        });
      }

      localStorage.setItem('device_fingerprint', currentFingerprint);
    };

    // Monitor for multiple tab usage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_warning' && e.newValue) {
        toast({
          title: "Multiple sessions detected",
          description: "You are logged in from multiple tabs. Please use only one tab for security.",
          variant: "destructive",
        });
      }
    };

    // Set flag for other tabs
    localStorage.setItem('auth_warning', 'active');

    // Real-time security monitoring
    const securityChannel = supabase
      .channel('security_alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_activity_log',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const actionType = payload.new.action_type;
        
        if (actionType?.startsWith('SECURITY_') && payload.new.action_details?.severity === 'high') {
          toast({
            title: "Security Alert",
            description: "Suspicious activity detected on your account. Please review your recent activity.",
            variant: "destructive",
            duration: 10000,
          });
        }
      })
      .subscribe();

    checkDeviceFingerprint();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      localStorage.removeItem('auth_warning');
      window.removeEventListener('storage', handleStorageChange);
      securityChannel.unsubscribe();
    };
  }, [user, logSecurityEvent, toast]);

  // Monitor for potential session hijacking
  useEffect(() => {
    if (!user) return;

    const validateSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          logSecurityEvent('SESSION_VALIDATION_FAILED', 'high', {
            reason: 'Session not found during validation',
          });
        }
      } catch (error) {
        logSecurityEvent('SESSION_VALIDATION_ERROR', 'medium', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    // Validate session every 5 minutes
    const interval = setInterval(validateSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, logSecurityEvent]);

  return null;
};