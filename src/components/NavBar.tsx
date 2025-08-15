
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { NavLogo } from './nav/NavLogo';
import { MobileMenuButton } from './nav/MobileMenuButton';
import { DesktopNav } from './nav/DesktopNav';
import { AuthSection } from './nav/AuthSection';
import { MobileNav } from './nav/MobileNav';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
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
          <NavLogo />

          {/* Mobile Menu Button */}
          {isMobile && (
            <MobileMenuButton 
              isOpen={isMobileMenuOpen} 
              onClick={toggleMobileMenu} 
            />
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <DesktopNav />
            <AuthSection />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileNav 
          isOpen={isMobileMenuOpen} 
          onLinkClick={handleMobileLinkClick} 
        />
      )}
    </motion.nav>
  );
};

export default NavBar;
