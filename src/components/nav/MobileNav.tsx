
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Settings, LogOut, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const routePaths = [
  { name: 'Home', path: '/' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Research', path: '/research', icon: Search },
  { name: 'Add Quote', path: '/add-quote', icon: PlusCircle },
  { name: 'Friends', path: '/friends', icon: Users },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Tools', path: '/tools' }
];

interface MobileNavProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onLinkClick }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden"
    >
      <div className="page-padding py-4 flex flex-col gap-4">
        {routePaths.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`text-lg font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              location.pathname === route.path ? 'text-primary' : 'text-foreground'
            }`}
            onClick={onLinkClick}
          >
            {route.name}
            {route.icon && <route.icon size={14} />}
          </Link>
        ))}
        
        {/* Mobile Authentication */}
        {user ? (
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-start"
            >
              <Link to="/profile" onClick={onLinkClick}>
                <Settings size={16} className="mr-2" />
                Profile Settings
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="border-t pt-4 space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login" onClick={onLinkClick}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="default" className="w-full">
              <Link to="/signup" onClick={onLinkClick}>
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
