
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { trackAPICall } = usePerformanceMonitor();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Pre-computed search suggestions for better UX
  const searchSuggestions = useMemo(() => [
    'philosophy', 'wisdom', 'life', 'love', 'truth', 'science',
    'literature', 'politics', 'ethics', 'freedom', 'justice'
  ], []);

  // Update internal input value when search query changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Generate search suggestions based on input
  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, searchSuggestions]);

  // Debounce the search input with performance tracking
  useEffect(() => {
    const startTime = performance.now();
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
      const duration = performance.now() - startTime;
      trackAPICall('search', duration, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, setSearchQuery, trackAPICall]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSearchQuery(suggestion);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
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
      
      {/* Search Suggestions */}
      {suggestions.length > 0 && focused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-secondary/50 first:rounded-t-xl last:rounded-b-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search size={16} className="text-muted-foreground" />
                <span className="text-foreground">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
