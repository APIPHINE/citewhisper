
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { PrivilegeDisplay } from '@/components/auth/PrivilegeDisplay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const AuthSection = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <PrivilegeDisplay size="sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden lg:inline">
                {user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/user-profile" className="flex items-center">
                <Activity size={16} className="mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <Settings size={16} className="mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account-settings" className="flex items-center">
                <Settings size={16} className="mr-2" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild variant="default" size="sm">
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};
