
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import FilterChip from './FilterChip';
import { useSearch } from '../../context/SearchContext';

const ThemeFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleTheme = (theme: string) => {
    const newThemes = filters.theme.includes(theme)
      ? filters.theme.filter(t => t !== theme)
      : [...filters.theme, theme];
    
    updateFilter('theme', newThemes);
  };
  
  // Filter themes based on search query
  const filteredThemes = searchQuery
    ? availableFilters.themes.filter(theme => 
        theme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFilters.themes;
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search themes..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto py-1">
        {filteredThemes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No themes match your search.</p>
        ) : (
          filteredThemes.map((theme) => (
            <FilterChip
              key={theme}
              label={theme}
              selected={filters.theme.includes(theme)}
              onClick={() => toggleTheme(theme)}
            />
          ))
        )}
      </div>
      
      {availableFilters.themes.length > 15 && !searchQuery && (
        <p className="text-xs text-muted-foreground mt-2">
          {availableFilters.themes.length} themes available. Use search to find specific themes.
        </p>
      )}
    </div>
  );
};

export default ThemeFilter;
