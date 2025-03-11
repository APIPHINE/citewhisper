
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import SortMenu from '../components/SortMenu';
import QuoteCard from '../components/QuoteCard';
import { useSearch } from '../context/SearchContext';

const Index = () => {
  const { filteredQuotes, searchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [anyExpanded, setAnyExpanded] = useState(false);
  
  // Set mounted after initial render to ensure animations work properly
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleExpand = (isExpanded: boolean) => {
    setAnyExpanded(isExpanded);
  };
  
  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: anyExpanded ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`text-center mb-10 ${anyExpanded ? 'pointer-events-none' : ''}`}
        >
          <div className="inline-flex items-center justify-center mb-3 bg-secondary/80 text-foreground px-3 py-1.5 rounded-full text-sm">
            <SearchIcon size={14} className="mr-1.5" />
            Discover Wisdom
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Find the Perfect Quote</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Search through our curated collection of quotes from influential thinkers, designers, and visionaries.
          </p>
        </motion.div>
        
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: anyExpanded ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className={`mb-8 ${anyExpanded ? 'pointer-events-none' : ''}`}
        >
          <SearchBar />
        </motion.div>
        
        {/* Filters & Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: anyExpanded ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={anyExpanded ? 'pointer-events-none' : ''}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium text-foreground">{filteredQuotes.length}</span>
              <span className="ml-1.5">
                {filteredQuotes.length === 1 ? 'quote' : 'quotes'} found
              </span>
              {searchQuery && (
                <span className="ml-1">for "{searchQuery}"</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <FilterMenu />
              <SortMenu />
            </div>
          </div>
          
          {/* Quotes Grid */}
          {filteredQuotes.length === 0 ? (
            <div className={`bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border ${anyExpanded ? 'opacity-0' : ''}`}>
              <SearchIcon size={40} className="mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-medium mb-2">No quotes found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {filteredQuotes.map((quote, index) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  delay={index} 
                  isAnyExpanded={anyExpanded}
                  onExpand={handleExpand}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
