
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const EnhancedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showPasswordResetHelper, setShowPasswordResetHelper] = useState(false);

  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Show password reset helper after 3 failed attempts
    if (failedAttempts >= 3) {
      setShowPasswordResetHelper(true);
    }
  }, [failedAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic rate limiting (client-side)
    if (failedAttempts >= 5) {
      setError('Too many failed attempts. Please wait before trying again.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        setFailedAttempts(prev => prev + 1);
        
        // Log failed login attempt
        console.warn('Failed login attempt:', {
          email,
          timestamp: new Date().toISOString(),
          attempts: failedAttempts + 1
        });
      } else {
        setFailedAttempts(0);
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setFailedAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showPasswordResetHelper && (
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  Having trouble logging in? You can{' '}
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                  >
                    reset your password
                  </Link>{' '}
                  or contact support if you continue to experience issues.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      {failedAttempts >= 2 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-amber-800">
                  Need Help Signing In?
                </h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• Make sure your email and password are correct</p>
                  <p>• Check if Caps Lock is on</p>
                  <p>• Try resetting your password if you can't remember it</p>
                </div>
                <Link
                  to="/forgot-password"
                  className="inline-block text-sm font-medium text-amber-800 underline underline-offset-4 hover:no-underline"
                >
                  Reset Password →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
