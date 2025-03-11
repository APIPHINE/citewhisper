
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal input value when search query changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounce the search input to avoid too many re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, setSearchQuery]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative flex items-center w-full h-14 px-4 rounded-2xl border transition-all duration-250 ease-apple ${
          focused 
            ? 'border-primary ring-1 ring-primary/20 shadow-subtle' 
            : 'border-border bg-secondary/50 hover:bg-secondary/80'
        }`}
      >
        <Search 
          size={20} 
          className="text-muted-foreground mr-3 flex-shrink-0" 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search quotes, authors, topics..."
          className="w-full h-full bg-transparent text-foreground focus:outline-none"
        />
        
        {inputValue && (
          <button
            onClick={handleClear}
            className="ml-2 p-1.5 rounded-full button-effect text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
