
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Save, X } from 'lucide-react';

interface EditableProfileFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const EditableProfileField: React.FC<EditableProfileFieldProps> = ({
  label,
  value,
  onSave,
  placeholder,
  type = 'text',
  disabled = false,
  icon,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the parent component
      setCurrentValue(value); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
        
        {!isEditing ? (
          <>
            <div className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 ${icon ? 'pl-10' : ''}`}>
              {value || <span className="text-muted-foreground">{placeholder}</span>}
            </div>
            {!disabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="shrink-0"
              >
                <Edit2 size={14} />
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="relative flex-1">
              <Input
                id={label.toLowerCase()}
                type={type}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={placeholder}
                className={icon ? 'pl-10' : ''}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="shrink-0"
            >
              <Save size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="shrink-0"
            >
              <X size={14} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
