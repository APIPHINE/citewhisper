
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quote, quotes as fallbackQuotes } from '../utils/quotesData';
import { fetchQuotes } from '../services/quoteService';

// Define sorting options
export type SortOption = 'relevance' | 'author' | 'date' | 'theme' | 'topic';

// Define filter state
interface FilterState {
  author: string[];
  topic: string[];
  theme: string[];
  keyword: string[];
  language: string[];
  date: {
    start: string;
    end: string;
  };
}

// Define available filters
interface AvailableFilters {
  authors: string[];
  topics: string[];
  themes: string[];
}

export interface SearchContextProps {
  allQuotes: Quote[];
  filteredQuotes: Quote[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  filterByTopic: (topic: string) => void;
  filterByTheme: (theme: string) => void;
  filterByAuthor: (author: string) => void;
  resetFilters: () => void;
  // Add new properties for filtering
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  // Add new properties for sorting
  activeSort: SortOption;
  setActiveSort: (option: SortOption) => void;
  // Add new property for available filters
  availableFilters: AvailableFilters;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortOption>('relevance');
  
  // Add filter state
  const [filters, setFilters] = useState<FilterState>({
    author: [],
    topic: [],
    theme: [],
    keyword: [],
    language: [],
    date: {
      start: '',
      end: '',
    }
  });
  
  // Calculated available filters based on quotes
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    authors: [],
    topics: [],
    themes: [],
  });
  
  // Fetch quotes from Supabase on component mount
  useEffect(() => {
    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const quotes = await fetchQuotes();
        if (quotes.length > 0) {
          setAllQuotes(quotes);
          setFilteredQuotes(quotes);
          // Extract available filters from quotes
          extractAvailableFilters(quotes);
        } else {
          console.warn('No quotes found from API, using fallback data');
          setAllQuotes(fallbackQuotes);
          setFilteredQuotes(fallbackQuotes);
          // Extract available filters from fallback quotes
          extractAvailableFilters(fallbackQuotes);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading quotes:', err);
        setError('Failed to load quotes. Using fallback data.');
        setAllQuotes(fallbackQuotes);
        setFilteredQuotes(fallbackQuotes);
        // Extract available filters from fallback quotes
        extractAvailableFilters(fallbackQuotes);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, []);
  
  // Extract available filters from quotes
  const extractAvailableFilters = (quotes: Quote[]) => {
    const authorsSet = new Set<string>();
    const topicsSet = new Set<string>();
    const themesSet = new Set<string>();
    
    quotes.forEach(quote => {
      // Make sure quote is defined before accessing properties
      if (!quote) return;
      
      // Add author
      if (quote.author) {
        authorsSet.add(quote.author);
      }
      
      // Add topics - ensure quote.topics exists before iterating
      if (quote.topics && Array.isArray(quote.topics)) {
        quote.topics.forEach(topic => {
          if (topic) topicsSet.add(topic);
        });
      }
      
      // Add theme
      if (quote.theme) {
        themesSet.add(quote.theme);
      }
    });
    
    setAvailableFilters({
      authors: Array.from(authorsSet).sort(),
      topics: Array.from(topicsSet).sort(),
      themes: Array.from(themesSet).sort(),
    });
  };

  // Update filter value
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      author: [],
      topic: [],
      theme: [],
      keyword: [],
      language: [],
      date: {
        start: '',
        end: '',
      }
    });
  };
  
  // Effect to apply filters and sorting
  useEffect(() => {
    let newFilteredQuotes = [...allQuotes];
    
    // Apply text search if searchQuery exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      newFilteredQuotes = newFilteredQuotes.filter(quote => {
        // Ensure quote is defined before accessing properties
        if (!quote) return false;
        
        return (
          (quote.text && quote.text.toLowerCase().includes(query)) ||
          (quote.author && quote.author.toLowerCase().includes(query)) ||
          (quote.topics && Array.isArray(quote.topics) && quote.topics.some(topic => topic && topic.toLowerCase().includes(query))) ||
          (quote.theme && quote.theme.toLowerCase().includes(query)) ||
          (quote.source && quote.source.toLowerCase().includes(query)) ||
          (quote.context && quote.context.toLowerCase().includes(query)) ||
          (quote.keywords && Array.isArray(quote.keywords) && quote.keywords.some(keyword => keyword && keyword.toLowerCase().includes(query)))
        );
      });
    }
    
    // Apply author filter
    if (filters.author.length > 0) {
      newFilteredQuotes = newFilteredQuotes.filter(quote => 
        quote && quote.author && filters.author.includes(quote.author)
      );
    }
    
    // Apply topic filter
    if (filters.topic.length > 0) {
      newFilteredQuotes = newFilteredQuotes.filter(quote => 
        quote && quote.topics && Array.isArray(quote.topics) && 
        quote.topics.some(topic => filters.topic.includes(topic))
      );
    }
    
    // Apply theme filter
    if (filters.theme.length > 0) {
      newFilteredQuotes = newFilteredQuotes.filter(quote => 
        quote && quote.theme && filters.theme.includes(quote.theme)
      );
    }
    
    // Apply keyword filter
    if (filters.keyword.length > 0) {
      newFilteredQuotes = newFilteredQuotes.filter(quote => {
        if (!quote) return false;
        
        // Check in text
        if (quote.text && filters.keyword.some(keyword => 
          quote.text.toLowerCase().includes(keyword.toLowerCase())
        )) return true;
        
        // Check in keywords array
        if (quote.keywords && Array.isArray(quote.keywords) && 
            quote.keywords.some(quoteKeyword => 
              filters.keyword.some(filterKeyword => 
                quoteKeyword.toLowerCase().includes(filterKeyword.toLowerCase())
              )
            )) return true;
        
        return false;
      });
    }
    
    // Apply date filter
    if (filters.date.start || filters.date.end) {
      newFilteredQuotes = newFilteredQuotes.filter(quote => {
        if (!quote || !quote.date) return false;
        
        const quoteDate = new Date(quote.date);
        let matchesStart = true;
        let matchesEnd = true;
        
        if (filters.date.start) {
          const startDate = new Date(filters.date.start);
          matchesStart = quoteDate >= startDate;
        }
        
        if (filters.date.end) {
          const endDate = new Date(filters.date.end);
          matchesEnd = quoteDate <= endDate;
        }
        
        return matchesStart && matchesEnd;
      });
    }
    
    // Apply sorting
    if (activeSort !== 'relevance' || !searchQuery) {
      newFilteredQuotes.sort((a, b) => {
        if (!a || !b) return 0;
        
        switch (activeSort) {
          case 'author':
            return (a.author || '').localeCompare(b.author || '');
          case 'date':
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
          case 'theme':
            return (a.theme || '').localeCompare(b.theme || '');
          case 'topic':
            const aFirstTopic = a.topics && a.topics.length ? a.topics[0] : '';
            const bFirstTopic = b.topics && b.topics.length ? b.topics[0] : '';
            return (aFirstTopic || '').localeCompare(bFirstTopic || '');
          default:
            return 0;
        }
      });
    }
    
    setFilteredQuotes(newFilteredQuotes);
  }, [searchQuery, allQuotes, filters, activeSort]);

  const filterByTopic = (topic: string) => {
    setFilters(prev => ({
      ...prev,
      topic: [topic]
    }));
    setSearchQuery(topic);
  };

  const filterByTheme = (theme: string) => {
    setFilters(prev => ({
      ...prev,
      theme: [theme]
    }));
    setSearchQuery(theme);
  };

  const filterByAuthor = (author: string) => {
    setFilters(prev => ({
      ...prev,
      author: [author]
    }));
    setSearchQuery(author);
  };

  const resetFilters = () => {
    setSearchQuery('');
    clearFilters();
    setFilteredQuotes(allQuotes);
  };

  return (
    <SearchContext.Provider value={{
      allQuotes,
      filteredQuotes,
      searchQuery,
      isLoading,
      error,
      setSearchQuery,
      filterByTopic,
      filterByTheme,
      filterByAuthor,
      resetFilters,
      // Add new properties
      filters,
      updateFilter,
      clearFilters,
      activeSort,
      setActiveSort,
      availableFilters
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
