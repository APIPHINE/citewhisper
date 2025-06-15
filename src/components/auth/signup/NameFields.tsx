
import React from 'react';
import { User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameFieldsProps {
  fullName: string;
  displayName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    fullName?: string;
    displayName?: string;
  };
  disabled?: boolean;
}

export const NameFields: React.FC<NameFieldsProps> = ({
  fullName,
  displayName,
  onChange,
  errors,
  disabled
}) => {
  return (
    <>
      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={onChange}
            placeholder="Enter your full name"
            className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X size={14} />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Display Name Field */}
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </Label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            id="displayName"
            name="displayName"
            type="text"
            value={displayName}
            onChange={onChange}
            placeholder="Choose a public display name"
            className={`pl-10 ${errors.displayName ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This will be your public-facing name on the platform
        </p>
        {errors.displayName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X size={14} />
            {errors.displayName}
          </p>
        )}
      </div>
    </>
  );
};
