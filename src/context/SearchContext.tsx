import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quote, quotes as initialQuotes } from '../utils/quotesData';
import { dateStringToYear } from '../utils/dateUtils';

export type SortOption = 'author' | 'date' | 'relevance' | 'theme' | 'topic';
export type FilterOption = 'author' | 'topic' | 'keyword' | 'date' | 'theme' | 'language';

interface FilterState {
  author: string[];
  topic: string[];
  keyword: string[];
  date: { start: string; end: string };
  theme: string[];
  language: string[];
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
    languages: string[];
  };
}

const initialFilters: FilterState = {
  author: [],
  topic: [],
  keyword: [],
  date: { start: '', end: '' },
  theme: [],
  language: [],
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
    // Get available languages from quotes
    languages: Array.from(new Set(
      quotes
        .filter(quote => quote.originalLanguage || 
          (Array.isArray(quote.translations) && quote.translations.length > 0) ||
          (!Array.isArray(quote.translations) && quote.translations))
        .map(quote => {
          const languages = [];
          if (quote.originalLanguage) languages.push(quote.originalLanguage);
          if (Array.isArray(quote.translations)) {
            quote.translations.forEach(t => languages.push(t.language));
          } else if (quote.translations) {
            if (quote.translations.fr) languages.push('fr');
          }
          return languages;
        })
        .flat()
    )).map(lang => {
      // Convert language codes to full names
      switch(lang) {
        case 'en': return 'English';
        case 'es': return 'Spanish';
        case 'fr': return 'French';
        default: return lang;
      }
    }).sort(),
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
          quote.theme.toLowerCase().includes(query) ||
          quote.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Apply author filter
    if (filters.author.length > 0) {
      result = result.filter(quote => filters.author.includes(quote.author));
    }

    // Apply topic filter
    if (filters.topic.length > 0) {
      result = result.filter(quote => 
        quote.topics.some(topic => filters.topic.includes(topic))
      );
    }

    // Apply theme filter
    if (filters.theme.length > 0) {
      result = result.filter(quote => filters.theme.includes(quote.theme));
    }

    // Apply language filter
    if (filters.language.length > 0) {
      result = result.filter(quote => {
        // Check original language
        if (quote.originalLanguage) {
          const formattedLang = quote.originalLanguage === 'en' ? 'English' :
                                quote.originalLanguage === 'es' ? 'Spanish' :
                                quote.originalLanguage === 'fr' ? 'French' : quote.originalLanguage;
          
          if (filters.language.includes(formattedLang)) return true;
        }
        
        // Check translations
        if (Array.isArray(quote.translations)) {
          for (const trans of quote.translations) {
            const formattedLang = trans.language === 'en' ? 'English' :
                                  trans.language === 'es' ? 'Spanish' :
                                  trans.language === 'fr' ? 'French' : trans.language;
            
            if (filters.language.includes(formattedLang)) return true;
          }
        } else if (quote.translations) {
          if (quote.translations.fr && filters.language.includes('French')) return true;
        }
        
        return false;
      });
    }

    // Apply keyword filter
    if (filters.keyword.length > 0) {
      result = result.filter(quote => 
        filters.keyword.every(keyword => 
          quote.text.toLowerCase().includes(keyword.toLowerCase()) ||
          (quote.keywords && quote.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())))
        )
      );
    }

    // Apply date range filter
    if (filters.date.start || filters.date.end) {
      result = result.filter(quote => {
        const quoteYear = dateStringToYear(quote.date);
        if (!quoteYear) return true;
        
        const startYear = filters.date.start ? dateStringToYear(filters.date.start) : -Infinity;
        const endYear = filters.date.end ? dateStringToYear(filters.date.end) : Infinity;
        
        return quoteYear >= startYear && quoteYear <= endYear;
      });
    }

    // Apply sorting
    switch (activeSort) {
      case 'author':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'date':
        result.sort((a, b) => {
          // Parse dates and handle BCE (negative years)
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          // Sort from newest to oldest
          return dateB - dateA;
        });
        break;
      case 'theme':
        result.sort((a, b) => a.theme.localeCompare(b.theme));
        break;
      case 'topic':
        result.sort((a, b) => a.topics[0].localeCompare(b.topics[0]));
        break;
      // For relevance, we keep the current order if there's a search query,
      // otherwise default to sorting by author
      case 'relevance':
      default:
        if (!searchQuery) {
          result.sort((a, b) => a.author.localeCompare(b.author));
        }
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

export default SearchContext;
