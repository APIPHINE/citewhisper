
import React from 'react';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
  disabled?: boolean;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
  errors,
  disabled
}) => {
  const hasPasswordRequirements = password.length >= 6;
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';
  const passwordsDoNotMatch = confirmPassword !== '' && password !== confirmPassword;

  return (
    <>
      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onChange}
            placeholder="Create a password"
            className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {hasPasswordRequirements ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <X size={14} className="text-red-500" />
          )}
          <span className={hasPasswordRequirements ? 'text-green-600' : 'text-muted-foreground'}>
            At least 6 characters
          </span>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X size={14} />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={onChange}
            placeholder="Confirm your password"
            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : passwordsDoNotMatch ? 'border-red-500' : passwordsMatch ? 'border-green-500' : ''}`}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center gap-2 text-sm">
            {passwordsMatch ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <X size={14} className="text-red-500" />
                <span className="text-red-500">Passwords do not match</span>
              </>
            )}
          </div>
        )}
        
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X size={14} />
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </>
  );
};
