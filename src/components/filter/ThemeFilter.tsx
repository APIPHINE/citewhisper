
import React from 'react';
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { useSearch } from '../../context/SearchContext';

const ThemeFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  
  const toggleTheme = (theme: string) => {
    const newThemes = filters.theme.includes(theme)
      ? filters.theme.filter(t => t !== theme)
      : [...filters.theme, theme];
    
    updateFilter('theme', newThemes);
  };
  
  return (
    <FilterSection title="Themes">
      <div className="flex flex-wrap gap-2">
        {availableFilters.themes.map((theme) => (
          <FilterChip
            key={theme}
            label={theme}
            selected={filters.theme.includes(theme)}
            onClick={() => toggleTheme(theme)}
          />
        ))}
      </div>
    </FilterSection>
  );
};

export default ThemeFilter;
