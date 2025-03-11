
import React from 'react';
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { useSearch } from '../../context/SearchContext';

const AuthorFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  
  const toggleAuthor = (author: string) => {
    const newAuthors = filters.author.includes(author)
      ? filters.author.filter(a => a !== author)
      : [...filters.author, author];
    
    updateFilter('author', newAuthors);
  };
  
  return (
    <FilterSection title="Authors">
      <div className="flex flex-wrap gap-2">
        {availableFilters.authors.map((author) => (
          <FilterChip
            key={author}
            label={author}
            selected={filters.author.includes(author)}
            onClick={() => toggleAuthor(author)}
          />
        ))}
      </div>
    </FilterSection>
  );
};

export default AuthorFilter;
