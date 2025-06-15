
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { DragDropCaptcha } from '../DragDropCaptcha';
import { EmailField } from './EmailField';
import { NameFields } from './NameFields';
import { PasswordFields } from './PasswordFields';

export const SignUpFormContainer = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    displayName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!captchaVerified) {
      newErrors.captcha = 'Please complete the human verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.displayName
      );

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'Account already exists. Please sign in instead.' });
        } else {
          setErrors({ submit: error.message });
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-elevation p-8 border border-border"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <EmailField
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={loading}
          />

          {/* Name Fields */}
          <NameFields
            fullName={formData.fullName}
            displayName={formData.displayName}
            onChange={handleInputChange}
            errors={errors}
            disabled={loading}
          />

          {/* Password Fields */}
          <PasswordFields
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onChange={handleInputChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            errors={errors}
            disabled={loading}
          />

          {/* CAPTCHA */}
          <div className="space-y-2">
            <DragDropCaptcha
              onVerificationChange={setCaptchaVerified}
              className={errors.captcha ? 'border-red-500' : ''}
            />
            {errors.captcha && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X size={14} />
                {errors.captcha}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X size={14} />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !captchaVerified}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
