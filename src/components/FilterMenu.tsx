
import { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TopicFilter from './filter/TopicFilter';
import AuthorFilter from './filter/AuthorFilter';
import KeywordFilter from './filter/KeywordFilter';
import ThemeFilter from './filter/ThemeFilter';
import DateRangeFilter from './filter/DateRangeFilter';
import { useSearch } from '../context/SearchContext';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { filters, clearFilters } = useSearch();

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

  // Calculate total active filters
  const getTotalActiveFilters = () => {
    return (
      filters.author.length +
      filters.topic.length +
      filters.theme.length +
      filters.keyword.length +
      (filters.date.start || filters.date.end ? 1 : 0)
    );
  };

  const totalActiveFilters = getTotalActiveFilters();

  // Helper function to render active filters as badges
  const renderActiveFilters = () => {
    if (totalActiveFilters === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 py-2">
        {filters.author.map((author) => (
          <Badge key={`author-${author}`} variant="secondary">
            Author: {author}
          </Badge>
        ))}
        {filters.topic.map((topic) => (
          <Badge key={`topic-${topic}`} variant="secondary">
            Topic: {topic}
          </Badge>
        ))}
        {filters.theme.map((theme) => (
          <Badge key={`theme-${theme}`} variant="secondary">
            Theme: {theme}
          </Badge>
        ))}
        {filters.keyword.map((keyword) => (
          <Badge key={`keyword-${keyword}`} variant="secondary">
            Keyword: {keyword}
          </Badge>
        ))}
        {(filters.date.start || filters.date.end) && (
          <Badge variant="secondary">
            Date: {filters.date.start || '...'} - {filters.date.end || '...'}
          </Badge>
        )}
      </div>
    );
  };

  const hasActiveFilters = totalActiveFilters > 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`button-effect inline-flex items-center justify-center px-4 py-2 rounded-full border transition-all ${
          hasActiveFilters
            ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20'
            : 'bg-secondary/50 hover:bg-secondary border-border'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter size={18} className="mr-2" />
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="ml-1.5 flex items-center justify-center bg-accent text-white rounded-full w-5 h-5 text-xs font-medium">
            {totalActiveFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="md:hidden fixed inset-0 bg-black/20 z-[9998]" onClick={() => setIsOpen(false)} />
          
          {/* Filter menu */}
          <div 
            className="fixed md:absolute z-[9999] w-[90vw] md:w-80 rounded-xl shadow-elevation border border-border bg-background overflow-hidden max-h-[80vh] overflow-y-auto"
            style={{ 
              top: 'var(--radix-popper-available-height, 100%)',
              left: '5vw',
              right: 'auto',
            }}
            {...({
              style: window.innerWidth >= 768 ? {
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                left: 'auto'
              } : {
                position: 'fixed',
                top: '120px',
                left: '5vw',
                right: 'auto'
              }
            } as any)}
          >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium">Filter Quotes</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
                Clear All
              </Button>
            )}
          </div>

          {renderActiveFilters()}

          <Tabs defaultValue="topic" className="p-4">
            <TabsList className="w-full grid grid-cols-5 mb-4">
              <TabsTrigger value="topic">Topic</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="author">Author</TabsTrigger>
              <TabsTrigger value="keyword">Keyword</TabsTrigger>
              <TabsTrigger value="date">Date</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topic">
              <TopicFilter />
            </TabsContent>
            
            <TabsContent value="theme">
              <ThemeFilter />
            </TabsContent>
            
            <TabsContent value="author">
              <AuthorFilter />
            </TabsContent>
            
            <TabsContent value="keyword">
              <KeywordFilter />
            </TabsContent>
            
            <TabsContent value="date">
              <DateRangeFilter />
            </TabsContent>
          </Tabs>
        </div>
        </>
      )}
    </div>
  );
};

export default FilterMenu;
