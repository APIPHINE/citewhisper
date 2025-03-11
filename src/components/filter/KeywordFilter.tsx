
import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilterSection from './FilterSection';
import { useSearch } from '../../context/SearchContext';

const KeywordFilter = () => {
  const { filters, updateFilter } = useSearch();
  const [inputValue, setInputValue] = useState('');

  const handleAddKeyword = () => {
    if (inputValue.trim() && !filters.keyword.includes(inputValue.trim())) {
      updateFilter('keyword', [...filters.keyword, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateFilter('keyword', filters.keyword.filter(k => k !== keyword));
  };

  return (
    <FilterSection title="Keywords">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add keyword..."
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddKeyword}
            disabled={!inputValue.trim()}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
          
        {filters.keyword.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.keyword.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-accent" 
                  onClick={() => handleRemoveKeyword(keyword)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </FilterSection>
  );
};

export default KeywordFilter;
