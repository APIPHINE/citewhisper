
import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { Badge } from '@/components/ui/badge';
import AuthorFilter from './filter/AuthorFilter';
import TopicFilter from './filter/TopicFilter';
import ThemeFilter from './filter/ThemeFilter';
import DateRangeFilter from './filter/DateRangeFilter';
import KeywordFilter from './filter/KeywordFilter';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { 
    filters, 
    clearFilters 
  } = useSearch();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Count active filters
  const activeFilterCount = 
    filters.author.length + 
    filters.topic.length + 
    filters.theme.length + 
    filters.keyword.length + 
    (filters.date.start || filters.date.end ? 1 : 0);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`button-effect inline-flex items-center justify-center px-4 py-2 rounded-full border transition-all ${
          isOpen || activeFilterCount > 0
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/50 hover:bg-secondary border-border'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter size={18} className="mr-2" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
            {activeFilterCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-72 sm:w-96 origin-top-right right-0 rounded-xl shadow-elevation border border-border bg-white animate-fade-in animate-slide-in">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground button-effect"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <AuthorFilter />
            <TopicFilter />
            <ThemeFilter />
            <DateRangeFilter />
            <KeywordFilter />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
