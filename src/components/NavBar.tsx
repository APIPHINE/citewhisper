
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, Menu, X } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-350 ease-apple ${
        scrolled 
          ? 'glass backdrop-blur-md border-b border-border/40 py-3' 
          : 'bg-transparent'
      }`}
    >
      <div className="page-padding page-max-width">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center font-medium text-lg transition-opacity duration-250 hover:opacity-80"
          >
            <span className="text-accent mr-1 font-bold text-2xl">"</span>
            <span className="text-xl tracking-tight">CiteQuotes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" active={location.pathname === '/'}>
              <Search size={18} className="mr-1.5" />
              Explore
            </NavLink>
            <NavLink to="/favorites" active={location.pathname === '/favorites'}>
              <Heart size={18} className="mr-1.5" />
              Favorites
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden button-effect p-1.5 rounded-full hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-elevation border border-border/30 overflow-hidden animate-fade-in">
            <div className="py-3 flex flex-col">
              <MobileNavLink to="/" active={location.pathname === '/'}>
                <Search size={18} className="mr-2" />
                Explore
              </MobileNavLink>
              <MobileNavLink to="/favorites" active={location.pathname === '/favorites'}>
                <Heart size={18} className="mr-2" />
                Favorites
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`button-effect flex items-center px-4 py-2 rounded-full transition-all duration-250 ease-apple ${
      active 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'hover:bg-secondary'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`flex items-center px-5 py-3 transition-colors ${
      active 
        ? 'bg-secondary/80 font-medium' 
        : 'hover:bg-secondary/50'
    }`}
  >
    {children}
  </Link>
);

export default NavBar;
