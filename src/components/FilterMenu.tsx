
import { useState, useRef, useEffect } from 'react';
import { Filter, Check, X } from 'lucide-react';
import { useSearch, FilterOption } from '../context/SearchContext';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { formatDateYear } from '../utils/dateUtils';

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
  
  // Add keyword filter
  const [keywordInput, setKeywordInput] = useState('');
  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      updateFilter('keyword', [...filters.keyword, keywordInput.trim()]);
      setKeywordInput('');
    }
  };
  
  // Handle date range slider
  // Min value is 2000 BCE (-2000), max value is 2025 CE (2025)
  const MIN_YEAR = -2000;
  const MAX_YEAR = 2025;
  const RANGE = MAX_YEAR - MIN_YEAR;
  
  // Convert date string to slider value (year number)
  const dateToSliderValue = (dateStr: string): number => {
    if (!dateStr) return MIN_YEAR;
    const date = new Date(dateStr);
    return date.getFullYear();
  };
  
  // Convert slider value (year number) to date string
  const sliderValueToDate = (value: number): string => {
    // For BCE dates
    if (value <= 0) {
      return `${Math.abs(value)}-01-01 BCE`;
    }
    // For CE dates
    return `${value}-01-01`;
  };
  
  // Initial slider values
  const initialStart = filters.date.start ? dateToSliderValue(filters.date.start) : MIN_YEAR;
  const initialEnd = filters.date.end ? dateToSliderValue(filters.date.end) : MAX_YEAR;
  const [dateRange, setDateRange] = useState<[number, number]>([initialStart, initialEnd]);
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    const [start, end] = values as [number, number];
    setDateRange([start, end]);
    
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
            {/* Filter by Author */}
            <FilterSection title="Author">
              <div className="grid grid-cols-2 gap-2">
                {availableFilters.authors.map((author) => (
                  <FilterChip
                    key={author}
                    label={author}
                    selected={filters.author.includes(author)}
                    onClick={() => toggleFilter('author', author)}
                  />
                ))}
              </div>
            </FilterSection>
            
            {/* Filter by Topic */}
            <FilterSection title="Topic">
              <div className="flex flex-wrap gap-2">
                {availableFilters.topics.map((topic) => (
                  <FilterChip
                    key={topic}
                    label={topic}
                    selected={filters.topic.includes(topic)}
                    onClick={() => toggleFilter('topic', topic)}
                  />
                ))}
              </div>
            </FilterSection>
            
            {/* Filter by Theme */}
            <FilterSection title="Theme">
              <div className="grid grid-cols-2 gap-2">
                {availableFilters.themes.map((theme) => (
                  <FilterChip
                    key={theme}
                    label={theme}
                    selected={filters.theme.includes(theme)}
                    onClick={() => toggleFilter('theme', theme)}
                  />
                ))}
              </div>
            </FilterSection>
            
            {/* Filter by Date Range - Slider */}
            <FilterSection title="Date Range">
              <div className="px-2 pt-6 pb-2">
                <Slider
                  defaultValue={[MIN_YEAR, MAX_YEAR]}
                  value={dateRange}
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <div>
                    <span className="font-medium text-foreground">{formatDateYear(dateRange[0])}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{formatDateYear(dateRange[1])}</span>
                  </div>
                </div>
              </div>
            </FilterSection>
            
            {/* Filter by Keywords */}
            <FilterSection title="Keywords">
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="Add a keyword..."
                    className="flex-grow px-3 py-2 border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={handleAddKeyword}
                    disabled={!keywordInput.trim()}
                    className="px-3 bg-primary text-primary-foreground rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed button-effect"
                  >
                    Add
                  </button>
                </div>
                
                {filters.keyword.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.keyword.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-2 py-1.5 flex items-center gap-1 bg-secondary/80"
                      >
                        {keyword}
                        <button
                          onClick={() => updateFilter(
                            'keyword', 
                            filters.keyword.filter((_, i) => i !== index)
                          )}
                          className="ml-1 hover:text-foreground"
                          aria-label={`Remove ${keyword}`}
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6 last:mb-0">
    <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
    {children}
  </div>
);

const FilterChip = ({ 
  label, 
  selected, 
  onClick 
}: { 
  label: string; 
  selected: boolean; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-250 ease-apple button-effect flex items-center ${
      selected 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'bg-secondary/50 hover:bg-secondary text-foreground'
    }`}
  >
    {selected && <Check size={14} className="mr-1.5" />}
    <span className="truncate">{label}</span>
  </button>
);

export default FilterMenu;
