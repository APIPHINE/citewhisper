
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAccessControl } from '@/hooks/useAccessControl';
import { LogIn } from 'lucide-react';

interface ProtectedButtonProps extends React.ComponentProps<typeof Button> {
  requireAuth?: boolean;
  action?: string;
  onProtectedClick?: () => void;
  fallbackText?: string;
}

export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  children,
  requireAuth = true,
  action,
  onProtectedClick,
  onClick,
  fallbackText = "Sign in to continue",
  ...props
}) => {
  const { checkAccess, isAuthenticated } = useAccessControl({ requireAuth: false });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (requireAuth && !isAuthenticated) {
      e.preventDefault();
      checkAccess(action);
      return;
    }

    if (onProtectedClick) {
      onProtectedClick();
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button {...props} onClick={handleClick}>
      {requireAuth && !isAuthenticated ? (
        <>
          <LogIn size={16} className="mr-2" />
          {fallbackText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
