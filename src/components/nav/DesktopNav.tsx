
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Heart } from 'lucide-react';
import NavigationDropdown from './NavigationDropdown';

export const DesktopNav = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link
        to="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === '/' ? 'text-primary' : 'text-foreground'
        }`}
      >
        Home
      </Link>
      
      <Link
        to="/quotes"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === '/quotes' ? 'text-primary' : 'text-foreground'
        }`}
      >
        Quotes
      </Link>

      <Link
        to="/add-quote"
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
          location.pathname === '/add-quote' ? 'text-primary' : 'text-foreground'
        }`}
      >
        Add Quote
        <PlusCircle size={14} />
      </Link>

      <Link
        to="/favorites"
        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
          location.pathname === '/favorites' ? 'text-primary' : 'text-foreground'
        }`}
      >
        Favorites
        <Heart size={14} />
      </Link>

      <NavigationDropdown />
    </div>
  );
};
