
import { useState } from 'react';
import { X } from 'lucide-react';
import FilterSection from './FilterSection';
import { Badge } from '@/components/ui/badge';
import { FilterOption } from '@/context/SearchContext';

interface KeywordFilterProps {
  keywords: string[];
  updateFilter: (filterType: FilterOption, value: any) => void;
}

const KeywordFilter = ({ 
  keywords, 
  updateFilter 
}: KeywordFilterProps) => {
  const [keywordInput, setKeywordInput] = useState('');
  
  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      updateFilter('keyword', [...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  return (
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
        
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="px-2 py-1.5 flex items-center gap-1 bg-secondary/80"
              >
                {keyword}
                <button
                  onClick={() => updateFilter(
                    'keyword', 
                    keywords.filter((_, i) => i !== index)
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
  );
};

export default KeywordFilter;
