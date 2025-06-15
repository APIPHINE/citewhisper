
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const routePaths = [
  { name: 'Home', path: '/' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Add Quote', path: '/add-quote', icon: PlusCircle },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Tools', path: '/tools' }
];

export const DesktopNav = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-6">
      {routePaths.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
            location.pathname === route.path ? 'text-primary' : 'text-foreground'
          }`}
        >
          {route.name}
          {route.icon && <route.icon size={14} />}
        </Link>
      ))}
    </div>
  );
};
