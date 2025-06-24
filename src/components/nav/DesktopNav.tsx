
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Shield, BookOpen, FileText, Settings } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';

const routePaths = [
  { name: 'Home', path: '/' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Articles', path: '/articles', icon: FileText },
  { name: 'Add Quote', path: '/add-quote', icon: PlusCircle },
  { name: 'Resources', path: '/resources', icon: BookOpen },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Tools', path: '/tools' }
];

export const DesktopNav = () => {
  const location = useLocation();
  const { canManageRoles } = useUserRoles();

  // Add admin routes if user has admin privileges
  const allRoutes = canManageRoles() 
    ? [
        ...routePaths, 
        { name: 'CMS', path: '/admin/cms', icon: Settings },
        { name: 'Admin', path: '/admin', icon: Shield }
      ]
    : routePaths;

  return (
    <div className="hidden md:flex items-center space-x-6">
      {allRoutes.map((route) => (
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
