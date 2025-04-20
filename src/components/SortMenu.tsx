
import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { useSearch, SortOption } from '../context/SearchContext';

const sortOptions: { label: string; value: SortOption; description: string }[] = [
  { 
    label: 'Relevance', 
    value: 'relevance',
    description: 'Sort by best match to search query'
  },
  { 
    label: 'Author (A-Z)', 
    value: 'author',
    description: 'Sort alphabetically by author name'
  },
  { 
    label: 'Date (Newest)', 
    value: 'date',
    description: 'Sort with newest quotes first'
  },
  { 
    label: 'Theme (A-Z)', 
    value: 'theme',
    description: 'Sort alphabetically by theme'
  },
  { 
    label: 'Topic (A-Z)', 
    value: 'topic',
    description: 'Sort alphabetically by primary topic'
  },
];

const SortMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeSort, setActiveSort } = useSearch();
  
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
  
  // Get label for currently active sort option
  const getActiveSortLabel = () => {
    return sortOptions.find(option => option.value === activeSort)?.label || 'Sort';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="button-effect inline-flex items-center justify-center px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary border border-border transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ArrowUpDown size={18} className="mr-2" />
        <span>{getActiveSortLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-64 origin-top-right right-0 rounded-xl shadow-elevation border border-border bg-white animate-fade-in animate-slide-in overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-medium">Sort by</h3>
          </div>
          <div className="py-1 max-h-[50vh] overflow-y-auto">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setActiveSort(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 ${
                  activeSort === option.value ? 'bg-secondary/80' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 mr-2 flex-shrink-0 ${activeSort === option.value ? 'text-accent' : 'text-transparent'}`}>
                    {activeSort === option.value && <Check size={20} />}
                  </div>
                  <div>
                    <div className={`font-medium ${activeSort === option.value ? 'text-accent' : ''}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortMenu;
