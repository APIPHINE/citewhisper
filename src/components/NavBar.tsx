
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, PlusCircle, User, LogOut, Settings } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define the type for route items
type RouteItem = {
  name: string;
  path: string;
  icon?: React.ComponentType<any>;
  external?: boolean;
};

const routePaths: RouteItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Add Quote', path: '/add-quote', icon: PlusCircle },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Tools', path: '/tools' }
];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!mounted || loading) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border"
    >
      <div className="page-padding py-4">
        <div className="page-max-width flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold">
            CiteQuotes
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {routePaths.map((route) => (
              route.external ? (
                <a
                  key={route.path}
                  href={route.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                >
                  {route.name}
                  {route.icon && <route.icon size={14} />}
                </a>
              ) : (
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
              )
            ))}
            
            {/* Authentication Section */}
            {user ? (
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
                    <Link to="/profile" className="flex items-center">
                      <Settings size={16} className="mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="page-padding py-4 flex flex-col gap-4">
            {routePaths.map((route) => (
              route.external ? (
                <a
                  key={route.path}
                  href={route.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.name}
                  {route.icon && <route.icon size={14} />}
                </a>
              ) : (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-lg font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                    location.pathname === route.path ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.name}
                  {route.icon && <route.icon size={14} />}
                </Link>
              )
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
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
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
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full">
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavBar;
