
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import FilterChip from './FilterChip';
import { useSearch } from '../../context/SearchContext';

const AuthorFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleAuthor = (author: string) => {
    const newAuthors = filters.author.includes(author)
      ? filters.author.filter(a => a !== author)
      : [...filters.author, author];
    
    updateFilter('author', newAuthors);
  };
  
  // Filter authors based on search query
  const filteredAuthors = searchQuery
    ? availableFilters.authors.filter(author => 
        author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFilters.authors;
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search authors..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto py-1">
        {filteredAuthors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No authors match your search.</p>
        ) : (
          filteredAuthors.map((author) => (
            <FilterChip
              key={author}
              label={author}
              selected={filters.author.includes(author)}
              onClick={() => toggleAuthor(author)}
            />
          ))
        )}
      </div>
      
      {availableFilters.authors.length > 20 && !searchQuery && (
        <p className="text-xs text-muted-foreground mt-2">
          {availableFilters.authors.length} authors available. Use search to find specific authors.
        </p>
      )}
    </div>
  );
};

export default AuthorFilter;
