
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '@/components/ui/button';

const routePaths = [
  { name: 'Home', path: '/' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Favorites', path: '/favorites' }
];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) {
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
              <Link
                key={route.path}
                to={route.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === route.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {route.name}
              </Link>
            ))}
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
              <Link
                key={route.path}
                to={route.path}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location.pathname === route.path ? 'text-primary' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavBar;
