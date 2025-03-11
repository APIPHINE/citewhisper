import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote, quotes as initialQuotes } from '../utils/quotesData';

export type SortOption = 'author' | 'date' | 'relevance' | 'theme' | 'topic';
export type FilterOption = 'author' | 'topic' | 'keyword' | 'date' | 'theme';

interface FilterState {
  author: string[];
  topic: string[];
  keyword: string[];
  date: { start: string; end: string };
  theme: string[];
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSort: SortOption;
  setActiveSort: (option: SortOption) => void;
  filters: FilterState;
  updateFilter: (filterType: FilterOption, value: any) => void;
  clearFilters: () => void;
  filteredQuotes: Quote[];
  availableFilters: {
    authors: string[];
    topics: string[];
    themes: string[];
  };
}

const initialFilters: FilterState = {
  author: [],
  topic: [],
  keyword: [],
  date: { start: '', end: '' },
  theme: [],
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [quotes] = useState<Quote[]>(initialQuotes);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(quotes);

  // Extract available filter options
  const availableFilters = {
    authors: Array.from(new Set(quotes.map(quote => quote.author))).sort(),
    topics: Array.from(new Set(quotes.flatMap(quote => quote.topics))).sort(),
    themes: Array.from(new Set(quotes.map(quote => quote.theme))).sort(),
  };

  // Update filtered quotes whenever search query, filters, or sort option changes
  useEffect(() => {
    let result = [...quotes];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        quote => 
          quote.text.toLowerCase().includes(query) ||
          quote.author.toLowerCase().includes(query) ||
          quote.topics.some(topic => topic.toLowerCase().includes(query)) ||
          quote.theme.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.author.length) {
      result = result.filter(quote => filters.author.includes(quote.author));
    }
    
    if (filters.topic.length) {
      result = result.filter(quote => 
        quote.topics.some(topic => filters.topic.includes(topic))
      );
    }
    
    if (filters.theme.length) {
      result = result.filter(quote => filters.theme.includes(quote.theme));
    }
    
    if (filters.keyword.length) {
      result = result.filter(quote => 
        filters.keyword.some(keyword => 
          quote.text.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
    
    if (filters.date.start || filters.date.end) {
      result = result.filter(quote => {
        const quoteDate = new Date(quote.date);
        const startValid = !filters.date.start || quoteDate >= new Date(filters.date.start);
        const endValid = !filters.date.end || quoteDate <= new Date(filters.date.end);
        return startValid && endValid;
      });
    }

    // Apply sorting
    switch (activeSort) {
      case 'author':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'date':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'theme':
        result.sort((a, b) => a.theme.localeCompare(b.theme));
        break;
      case 'topic':
        result.sort((a, b) => a.topics[0].localeCompare(b.topics[0]));
        break;
      case 'relevance':
      default:
        // For relevance, we keep the default order or could implement a more sophisticated algorithm
        break;
    }

    setFilteredQuotes(result);
  }, [searchQuery, filters, activeSort, quotes]);

  const updateFilter = (filterType: FilterOption, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchQuery, 
        setSearchQuery, 
        activeSort, 
        setActiveSort,
        filters,
        updateFilter,
        clearFilters,
        filteredQuotes,
        availableFilters
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
