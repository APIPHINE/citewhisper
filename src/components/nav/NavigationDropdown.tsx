
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileText, Wrench, BookOpen, Info, Settings, Shield } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useUserRoles } from '@/hooks/useUserRoles';
import { cn } from '@/lib/utils';

const NavigationDropdown = () => {
  const { canManageRoles } = useUserRoles();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap gap-2">
        {/* Tools Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <Wrench size={16} />
            Tools
            <ChevronDown size={14} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              <NavigationMenuLink asChild>
                <Link
                  to="/tools"
                  className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Wrench size={16} />
                    <span>All Tools</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Explore our collection of research tools
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <BookOpen size={16} />
            Resources
            <ChevronDown size={14} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-64 p-2">
              <div className="space-y-1">
                <NavigationMenuLink asChild>
                  <Link
                    to="/resources"
                    className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>Research Resources</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Academic and research materials
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/articles"
                    className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>Articles</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      In-depth articles and analysis
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* About Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1">
            <Info size={16} />
            About
            <ChevronDown size={14} />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-56 p-2">
              <div className="space-y-1">
                <NavigationMenuLink asChild>
                  <Link
                    to="/about"
                    className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Info size={16} />
                      <span>About CiteQuotes</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn about our mission and values
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Admin Dropdown (only for admins) */}
        {canManageRoles() && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-1">
              <Shield size={16} />
              Admin
              <ChevronDown size={14} />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-48 p-2">
                <div className="space-y-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin"
                      className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage users and roles
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/cms"
                      className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Settings size={16} />
                        <span>CMS Dashboard</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage content and articles
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationDropdown;
