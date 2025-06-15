
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};
