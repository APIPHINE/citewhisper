
import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useSearch, FilterOption } from '@/context/SearchContext';
import { Badge } from '@/components/ui/badge';
import AuthorFilter from './filter/AuthorFilter';
import TopicFilter from './filter/TopicFilter';
import ThemeFilter from './filter/ThemeFilter';
import DateRangeFilter from './filter/DateRangeFilter';
import KeywordFilter from './filter/KeywordFilter';
import { dateStringToYear } from '@/utils/dateUtils';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { 
    filters, 
    updateFilter, 
    clearFilters, 
    availableFilters 
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
  
  // Toggle selection for multi-select filters
  const toggleFilter = (filterType: FilterOption, value: string) => {
    const currentValues = filters[filterType] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateFilter(filterType, newValues);
  };
  
  // Handle date range slider
  const MIN_YEAR = -2000;
  const MAX_YEAR = 2025;
  
  // Initial slider values
  const initialStart = filters.date.start ? dateStringToYear(filters.date.start) : MIN_YEAR;
  const initialEnd = filters.date.end ? dateStringToYear(filters.date.end) : MAX_YEAR;
  
  // Handle date range changes
  const handleDateRangeChange = (range: [number, number]) => {
    const [start, end] = range;
    
    // Convert slider value (year number) to date string
    const sliderValueToDate = (value: number): string => {
      // For BCE dates
      if (value <= 0) {
        return `${Math.abs(value)}-01-01 BCE`;
      }
      // For CE dates
      return `${value}-01-01`;
    };
    
    // Update filter with new date range
    updateFilter('date', {
      start: sliderValueToDate(start),
      end: sliderValueToDate(end)
    });
  };

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
            <AuthorFilter 
              authors={availableFilters.authors}
              selectedAuthors={filters.author}
              toggleFilter={toggleFilter}
            />
            
            <TopicFilter 
              topics={availableFilters.topics}
              selectedTopics={filters.topic}
              toggleFilter={toggleFilter}
            />
            
            <ThemeFilter 
              themes={availableFilters.themes}
              selectedThemes={filters.theme}
              toggleFilter={toggleFilter}
            />
            
            <DateRangeFilter 
              initialStart={initialStart}
              initialEnd={initialEnd}
              onRangeChange={handleDateRangeChange}
            />
            
            <KeywordFilter 
              keywords={filters.keyword}
              updateFilter={updateFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
