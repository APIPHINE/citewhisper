
import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { useSearch, SortOption } from '../context/SearchContext';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Author', value: 'author' },
  { label: 'Date', value: 'date' },
  { label: 'Theme', value: 'theme' },
  { label: 'Topic', value: 'topic' },
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
        <div className="absolute z-40 mt-2 w-48 origin-top-right right-0 rounded-xl shadow-elevation border border-border bg-white animate-fade-in animate-slide-in overflow-hidden">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setActiveSort(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center hover:bg-secondary/50 transition-colors ${
                  activeSort === option.value ? 'bg-secondary/80 font-medium' : ''
                }`}
              >
                {activeSort === option.value && (
                  <Check size={16} className="mr-2 text-accent" />
                )}
                <span className={activeSort === option.value ? 'ml-0' : 'ml-6'}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortMenu;
