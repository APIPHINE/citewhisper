
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = "https://yrafjktkkspcptkcaowj.supabase.co";
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface SecurityContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export class SecurityService {
  // Rate limiting check
  static async checkRateLimit(
    userId: string | null,
    ipAddress: string,
    action: string,
    maxAttempts: number = 5,
    windowMinutes: number = 1
  ): Promise<boolean> {
    try {
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes() - windowMinutes);

      // Check rate limit for user or IP
      const { data, error } = await supabase
        .from('rate_limit_log')
        .select('attempt_count')
        .or(`user_id.eq.${userId},ip_address.eq.${ipAddress}`)
        .eq('action', action)
        .gte('window_start', windowStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Rate limit check error:', error);
        return false; // Fail closed
      }

      const currentAttempts = data?.[0]?.attempt_count || 0;
      
      if (currentAttempts >= maxAttempts) {
        return false; // Rate limit exceeded
      }

      // Log this attempt
      await supabase
        .from('rate_limit_log')
        .insert({
          user_id: userId,
          ip_address: ipAddress,
          action,
          attempt_count: currentAttempts + 1,
          window_start: windowStart.toISOString()
        });

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return false; // Fail closed
    }
  }

  // Validate and sanitize input
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 10000); // Limit length
  }

  // Validate authentication token
  static async validateAuth(authHeader: string | null): Promise<{ userId: string | null; error?: string }> {
    if (!authHeader?.startsWith('Bearer ')) {
      return { userId: null, error: 'Missing or invalid authorization header' };
    }

    try {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return { userId: null, error: 'Invalid authentication token' };
      }

      return { userId: user.id };
    } catch (error) {
      console.error('Auth validation error:', error);
      return { userId: null, error: 'Authentication validation failed' };
    }
  }

  // Log security event
  static async logSecurityEvent(
    eventType: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'medium',
    context?: SecurityContext
  ): Promise<void> {
    try {
      // This would typically go to a security events table
      console.log(`[SECURITY ${severity.toUpperCase()}] ${eventType}:`, {
        ...details,
        timestamp: new Date().toISOString(),
        context
      });

      // In production, you might want to send alerts for high severity events
      if (severity === 'high') {
        // Send alert to security team
        console.warn('HIGH SEVERITY SECURITY EVENT:', eventType, details);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  // Extract security context from request
  static extractSecurityContext(req: Request): SecurityContext {
    const headers = req.headers;
    
    return {
      ipAddress: headers.get('x-forwarded-for') || 
                headers.get('x-real-ip') || 
                'unknown',
      userAgent: headers.get('user-agent') || 'unknown',
      sessionId: headers.get('x-session-id') || undefined
    };
  }
}
