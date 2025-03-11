
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { FilterOption } from '@/context/SearchContext';

interface AuthorFilterProps {
  authors: string[];
  selectedAuthors: string[];
  toggleFilter: (filterType: FilterOption, value: string) => void;
}

const AuthorFilter = ({ 
  authors, 
  selectedAuthors, 
  toggleFilter 
}: AuthorFilterProps) => (
  <FilterSection title="Author">
    <div className="grid grid-cols-2 gap-2">
      {authors.map((author) => (
        <FilterChip
          key={author}
          label={author}
          selected={selectedAuthors.includes(author)}
          onClick={() => toggleFilter('author', author)}
        />
      ))}
    </div>
  </FilterSection>
);

export default AuthorFilter;
