
import React from 'react';
import { Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium">
        Email Address
      </Label>
      <div className="relative">
        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          id="email"
          name="email"
          type="email"
          value={value}
          onChange={onChange}
          placeholder="Enter your email"
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
