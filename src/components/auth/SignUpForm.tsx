
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Loader2, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DragDropCaptcha } from './DragDropCaptcha';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = confirmPassword && password !== confirmPassword;
  const isFormValid = email && password && passwordsMatch && captchaVerified && displayName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setLoading(true);
    setEmailError('');
    
    try {
      const { error } = await signUp(email, password, fullName, displayName);
      
      if (error) {
        // Check for existing email error
        if (error.message?.toLowerCase().includes('already registered') || 
            error.message?.toLowerCase().includes('already exists') ||
            error.message?.toLowerCase().includes('user already exists')) {
          setEmailError('Account already exists. Please try signing in instead.');
        } else {
          setEmailError(error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-border">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-accent/10 p-3 rounded-full">
          <UserPlus size={24} className="text-accent" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name <span className="text-xs text-muted-foreground">(private)</span>
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            disabled={loading}
          />
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            Display Name <span className="text-xs text-muted-foreground">(public)</span>
          </label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How others will see you"
            required
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This name will be visible to other users
          </p>
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="your.email@example.com"
            required
            disabled={loading}
            className={emailError ? 'border-red-500' : ''}
          />
          {emailError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <X size={12} />
              {emailError}
            </p>
          )}
        </div>
        
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              minLength={6}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              minLength={6}
              className={`pr-16 ${
                confirmPassword ? (passwordsMatch ? 'border-green-500' : 'border-red-500') : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {confirmPassword && (
                passwordsMatch ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground ml-1"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {passwordsDontMatch && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <X size={12} />
              Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Check size={12} />
              Passwords match
            </p>
          )}
        </div>

        {/* CAPTCHA */}
        <DragDropCaptcha
          onVerificationChange={setCaptchaVerified}
          className="my-4"
        />
        
        <Button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2"
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <UserPlus size={16} />
          )}
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-accent hover:underline font-medium"
          disabled={loading}
        >
          Sign In
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>By creating an account, you agree to our terms of service and privacy policy.</p>
      </div>
    </div>
  );
};

export default SignUpForm;
