
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quote, quotes as fallbackQuotes } from '../utils/quotesData';
import { fetchQuotes } from '../services/quoteService';

interface SearchContextProps {
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
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch quotes from Supabase on component mount
  useEffect(() => {
    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const quotes = await fetchQuotes();
        if (quotes.length > 0) {
          setAllQuotes(quotes);
          setFilteredQuotes(quotes);
        } else {
          console.warn('No quotes found from API, using fallback data');
          setAllQuotes(fallbackQuotes);
          setFilteredQuotes(fallbackQuotes);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading quotes:', err);
        setError('Failed to load quotes. Using fallback data.');
        setAllQuotes(fallbackQuotes);
        setFilteredQuotes(fallbackQuotes);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, []);
  
  // Filter quotes when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredQuotes(allQuotes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const newFilteredQuotes = allQuotes.filter(quote => {
      return (
        quote.text.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query) ||
        (quote.topics && quote.topics.some(topic => topic.toLowerCase().includes(query))) ||
        (quote.theme && quote.theme.toLowerCase().includes(query)) ||
        (quote.source && quote.source.toLowerCase().includes(query)) ||
        (quote.context && quote.context.toLowerCase().includes(query)) ||
        (quote.keywords && quote.keywords.some(keyword => keyword.toLowerCase().includes(query)))
      );
    });

    setFilteredQuotes(newFilteredQuotes);
  }, [searchQuery, allQuotes]);

  const filterByTopic = (topic: string) => {
    const filtered = allQuotes.filter(quote => 
      quote.topics && quote.topics.some(t => t.toLowerCase() === topic.toLowerCase())
    );
    setFilteredQuotes(filtered);
    setSearchQuery(topic);
  };

  const filterByTheme = (theme: string) => {
    const filtered = allQuotes.filter(quote => 
      quote.theme && quote.theme.toLowerCase() === theme.toLowerCase()
    );
    setFilteredQuotes(filtered);
    setSearchQuery(theme);
  };

  const filterByAuthor = (author: string) => {
    const filtered = allQuotes.filter(quote => 
      quote.author.toLowerCase() === author.toLowerCase()
    );
    setFilteredQuotes(filtered);
    setSearchQuery(author);
  };

  const resetFilters = () => {
    setSearchQuery('');
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
      resetFilters
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
