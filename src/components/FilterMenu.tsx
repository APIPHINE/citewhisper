
import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AuthorFilter from './filter/AuthorFilter';
import TopicFilter from './filter/TopicFilter';
import ThemeFilter from './filter/ThemeFilter';
import DateRangeFilter from './filter/DateRangeFilter';
import KeywordFilter from './filter/KeywordFilter';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { filters, clearFilters } = useSearch();
  
  // Section open states
  const [sectionsOpen, setSectionsOpen] = useState({
    authors: false,
    topics: false,
    themes: false,
    dates: false,
    keywords: false
  });
  
  // Toggle section open state
  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
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

  // Count active filters by type
  const getActiveCount = (type: keyof typeof filters) => {
    if (type === 'date') {
      return (filters.date.start || filters.date.end) ? 1 : 0;
    }
    return filters[type].length;
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
          
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Authors Filter Section */}
            <Collapsible 
              open={sectionsOpen.authors} 
              onOpenChange={() => toggleSection('authors')}
              className="border-b border-border"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center">
                  <span className="font-medium">Authors</span>
                  {getActiveCount('author') > 0 && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/30">
                      {getActiveCount('author')}
                    </Badge>
                  )}
                </div>
                {sectionsOpen.authors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3">
                <AuthorFilter />
              </CollapsibleContent>
            </Collapsible>
            
            {/* Topics Filter Section */}
            <Collapsible 
              open={sectionsOpen.topics} 
              onOpenChange={() => toggleSection('topics')}
              className="border-b border-border"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center">
                  <span className="font-medium">Topics</span>
                  {getActiveCount('topic') > 0 && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/30">
                      {getActiveCount('topic')}
                    </Badge>
                  )}
                </div>
                {sectionsOpen.topics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3">
                <TopicFilter />
              </CollapsibleContent>
            </Collapsible>
            
            {/* Themes Filter Section */}
            <Collapsible 
              open={sectionsOpen.themes} 
              onOpenChange={() => toggleSection('themes')}
              className="border-b border-border"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center">
                  <span className="font-medium">Themes</span>
                  {getActiveCount('theme') > 0 && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/30">
                      {getActiveCount('theme')}
                    </Badge>
                  )}
                </div>
                {sectionsOpen.themes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3">
                <ThemeFilter />
              </CollapsibleContent>
            </Collapsible>
            
            {/* Date Range Filter Section */}
            <Collapsible 
              open={sectionsOpen.dates} 
              onOpenChange={() => toggleSection('dates')}
              className="border-b border-border"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center">
                  <span className="font-medium">Date Range</span>
                  {getActiveCount('date') > 0 && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/30">
                      Active
                    </Badge>
                  )}
                </div>
                {sectionsOpen.dates ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3">
                <DateRangeFilter />
              </CollapsibleContent>
            </Collapsible>
            
            {/* Keywords Filter Section */}
            <Collapsible 
              open={sectionsOpen.keywords} 
              onOpenChange={() => toggleSection('keywords')}
              className="border-b border-border last:border-0"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center">
                  <span className="font-medium">Keywords</span>
                  {getActiveCount('keyword') > 0 && (
                    <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/30">
                      {getActiveCount('keyword')}
                    </Badge>
                  )}
                </div>
                {sectionsOpen.keywords ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3">
                <KeywordFilter />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
