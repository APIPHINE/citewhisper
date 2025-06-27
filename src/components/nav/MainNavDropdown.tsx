
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Home, Quote, PlusCircle, Heart, Wrench, BookOpen, FileText, User2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface MainNavDropdownProps {
  onLinkClick?: () => void;
}

export const MainNavDropdown: React.FC<MainNavDropdownProps> = ({ onLinkClick }) => {
  const location = useLocation();

  const navigationItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/quotes', label: 'Quotes', icon: Quote },
    { to: '/add-quote', label: 'Add Quote', icon: PlusCircle },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/tools', label: 'Tools', icon: Wrench },
    { to: '/resources', label: 'Resources', icon: BookOpen },
    { to: '/articles', label: 'Articles', icon: FileText },
    { to: '/about', label: 'About', icon: User2 },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Menu
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigationItems.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link 
              to={item.to} 
              className={`flex items-center gap-2 w-full ${
                location.pathname === item.to ? 'bg-accent' : ''
              }`}
              onClick={onLinkClick}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
