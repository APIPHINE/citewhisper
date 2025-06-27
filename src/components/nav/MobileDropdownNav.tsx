
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Wrench, BookOpen, Info, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserRoles } from '@/hooks/useUserRoles';

interface MobileDropdownNavProps {
  onLinkClick: () => void;
}

const MobileDropdownNav: React.FC<MobileDropdownNavProps> = ({ onLinkClick }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { canManageRoles } = useUserRoles();

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
    onLinkClick();
  };

  return (
    <div className="space-y-2">
      {/* Main Navigation Items */}
      <Link
        to="/"
        className="block text-lg font-medium py-2 hover:text-primary transition-colors"
        onClick={handleLinkClick}
      >
        Home
      </Link>
      
      <Link
        to="/quotes"
        className="block text-lg font-medium py-2 hover:text-primary transition-colors"
        onClick={handleLinkClick}
      >
        Quotes
      </Link>

      <Link
        to="/add-quote"
        className="block text-lg font-medium py-2 hover:text-primary transition-colors"
        onClick={handleLinkClick}
      >
        Add Quote
      </Link>

      <Link
        to="/favorites"
        className="block text-lg font-medium py-2 hover:text-primary transition-colors"
        onClick={handleLinkClick}
      >
        Favorites
      </Link>

      {/* Tools Dropdown */}
      <div>
        <button
          onClick={() => toggleDropdown('tools')}
          className="flex items-center justify-between w-full text-lg font-medium py-2 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wrench size={18} />
            Tools
          </div>
          {openDropdown === 'tools' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <AnimatePresence>
          {openDropdown === 'tools' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 space-y-2 overflow-hidden"
            >
              <Link
                to="/tools"
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                All Tools
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resources Dropdown */}
      <div>
        <button
          onClick={() => toggleDropdown('resources')}
          className="flex items-center justify-between w-full text-lg font-medium py-2 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            Resources
          </div>
          {openDropdown === 'resources' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <AnimatePresence>
          {openDropdown === 'resources' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 space-y-2 overflow-hidden"
            >
              <Link
                to="/resources"
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                Research Resources
              </Link>
              <Link
                to="/articles"
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                Articles
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* About Dropdown */}
      <div>
        <button
          onClick={() => toggleDropdown('about')}
          className="flex items-center justify-between w-full text-lg font-medium py-2 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info size={18} />
            About
          </div>
          {openDropdown === 'about' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <AnimatePresence>
          {openDropdown === 'about' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 space-y-2 overflow-hidden"
            >
              <Link
                to="/about"
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                About CiteQuotes
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Dropdown (only for admins) */}
      {canManageRoles() && (
        <div>
          <button
            onClick={() => toggleDropdown('admin')}
            className="flex items-center justify-between w-full text-lg font-medium py-2 hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Admin
            </div>
            {openDropdown === 'admin' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          <AnimatePresence>
            {openDropdown === 'admin' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 space-y-2 overflow-hidden"
              >
                <Link
                  to="/admin"
                  className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/cms"
                  className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  CMS Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MobileDropdownNav;
