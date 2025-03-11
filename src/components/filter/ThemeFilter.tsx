
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { FilterOption } from '@/context/SearchContext';

interface ThemeFilterProps {
  themes: string[];
  selectedThemes: string[];
  toggleFilter: (filterType: FilterOption, value: string) => void;
}

const ThemeFilter = ({ 
  themes, 
  selectedThemes, 
  toggleFilter 
}: ThemeFilterProps) => (
  <FilterSection title="Theme">
    <div className="grid grid-cols-2 gap-2">
      {themes.map((theme) => (
        <FilterChip
          key={theme}
          label={theme}
          selected={selectedThemes.includes(theme)}
          onClick={() => toggleFilter('theme', theme)}
        />
      ))}
    </div>
  </FilterSection>
);

export default ThemeFilter;
