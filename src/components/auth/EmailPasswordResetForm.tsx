import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DragDropCaptcha } from './DragDropCaptcha';

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('One special character');

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const color = colors[Math.min(score, 4)];

    return { score, feedback, color };
  };

  if (!password) return null;

  const strength = getPasswordStrength(password);
  
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strength.score ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {strength.feedback.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Password needs: {strength.feedback.join(', ')}
        </p>
      )}
    </div>
  );
};

export const EmailPasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Check if we have a valid password reset token from email
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (type === 'recovery' && token) {
      setIsValidSession(true);
    } else {
      setMessage({
        type: 'error',
        text: 'Invalid or expired password reset link. Please request a new one.'
      });
    }
  }, [searchParams]);

  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true);
    setShowPasswordForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!captchaVerified) {
      setMessage({ type: 'error', text: 'Please complete the verification first' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(newPassword);

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password reset successfully! You can now sign in with your new password.' 
        });
        
        // Redirect to login after successful reset
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession && !message) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Validating reset link...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Reset Your Password
        </CardTitle>
        <CardDescription>
          Complete the verification and enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isValidSession ? (
          <div className="space-y-4">
            {message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                This password reset link is invalid or has expired.
              </p>
              <Button
                onClick={() => navigate('/forgot-password')}
                variant="outline"
                className="w-full"
              >
                Request New Reset Link
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                {message.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {!captchaVerified && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Verify You're Human</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete the verification to proceed with password reset
                  </p>
                </div>
                <DragDropCaptcha onVerificationChange={handleCaptchaSuccess} />
              </div>
            )}

            {showPasswordForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <PasswordStrengthIndicator password={newPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};