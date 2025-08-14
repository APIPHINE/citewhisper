import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface SecurityCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  lastChecked: Date;
}

export function SecurityHealthCheck() {
  const { user } = useAuth();
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performSecurityChecks();
  }, [user]);

  const performSecurityChecks = async () => {
    setLoading(true);
    const securityChecks: SecurityCheck[] = [];

    // Check 1: Authentication Status
    securityChecks.push({
      id: 'auth-status',
      name: 'Authentication Status',
      status: user ? 'pass' : 'warning',
      description: user ? 'User is authenticated' : 'User not authenticated',
      lastChecked: new Date(),
    });

    // Check 2: Session Validity
    const { data: session } = await supabase.auth.getSession();
    securityChecks.push({
      id: 'session-validity',
      name: 'Session Validity',
      status: session?.session ? 'pass' : 'warning',
      description: session?.session ? 'Valid session found' : 'No valid session',
      lastChecked: new Date(),
    });

    // Check 3: Recent Failed Login Attempts (if user is authenticated)
    if (user) {
      try {
        const { data: failedAttempts, error } = await supabase
          .from('rate_limit_log')
          .select('*')
          .eq('user_id', user.id)
          .eq('action', 'failed_login')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(5);

        const hasRecentFailures = !error && failedAttempts && failedAttempts.length > 0;
        securityChecks.push({
          id: 'failed-logins',
          name: 'Failed Login Attempts',
          status: hasRecentFailures ? 'warning' : 'pass',
          description: hasRecentFailures 
            ? `${failedAttempts.length} failed attempts in last 24h`
            : 'No recent failed login attempts',
          lastChecked: new Date(),
        });
      } catch (error) {
        securityChecks.push({
          id: 'failed-logins',
          name: 'Failed Login Attempts',
          status: 'warning',
          description: 'Could not check failed login attempts',
          lastChecked: new Date(),
        });
      }
    }

    // Check 4: HTTPS Connection
    securityChecks.push({
      id: 'https-check',
      name: 'Secure Connection',
      status: window.location.protocol === 'https:' ? 'pass' : 'fail',
      description: window.location.protocol === 'https:' 
        ? 'Using HTTPS secure connection'
        : 'Using insecure HTTP connection',
      lastChecked: new Date(),
    });

    // Check 5: Browser Security Features
    const hasContentSecurityPolicy = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    securityChecks.push({
      id: 'browser-security',
      name: 'Browser Security Headers',
      status: hasContentSecurityPolicy ? 'pass' : 'warning',
      description: hasContentSecurityPolicy 
        ? 'Security headers detected'
        : 'Some security headers may be missing',
      lastChecked: new Date(),
    });

    setChecks(securityChecks);
    setLoading(false);
  };

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'fail':
        return <AlertTriangle size={16} className="text-red-600" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    const variants = {
      pass: 'default',
      warning: 'secondary',
      fail: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const overallStatus = checks.every(c => c.status === 'pass') 
    ? 'pass' 
    : checks.some(c => c.status === 'fail') 
    ? 'fail' 
    : 'warning';

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield size={16} />
            Security Health Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            Running security checks...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            Security Health Check
          </div>
          {getStatusBadge(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 text-xs">
            {getStatusIcon(check.status)}
            <div className="flex-1">
              <div className="font-medium">{check.name}</div>
              <div className="text-muted-foreground">{check.description}</div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-border text-xs text-muted-foreground">
          Last checked: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}