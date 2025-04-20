
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, LayoutGrid, LayoutList } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import SortMenu from '../components/SortMenu';
import QuoteCard from '../components/QuoteCard';
import { useSearch } from '../context/SearchContext';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const QUOTES_PER_PAGE = 10;

const Index = () => {
  const { filteredQuotes, searchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [anyExpanded, setAnyExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Set mounted after initial render to ensure animations work properly
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Reset page when quotes change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredQuotes.length]);
  
  const handleExpand = (isExpanded: boolean) => {
    setAnyExpanded(isExpanded);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredQuotes.length / QUOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * QUOTES_PER_PAGE;
  const endIndex = startIndex + QUOTES_PER_PAGE;
  const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);
  
  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if we have few pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push(null); // Ellipsis
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push(null); // Ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
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
          className={anyExpanded ? 'hidden' : ''}
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
          className={anyExpanded ? 'hidden' : 'mb-8'}
        >
          <SearchBar />
        </motion.div>
        
        {/* Filters & Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: anyExpanded ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={anyExpanded ? 'hidden' : ''}
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
              {/* View mode toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 rounded-none px-3 ${viewMode === 'grid' ? 'bg-secondary text-foreground' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 rounded-none px-3 ${viewMode === 'list' ? 'bg-secondary text-foreground' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList size={18} />
                </Button>
              </div>
              
              <FilterMenu />
              <SortMenu />
            </div>
          </div>
          
          {/* No Quotes Found Message */}
          {filteredQuotes.length === 0 && (
            <div className="bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border">
              <SearchIcon size={40} className="mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-medium mb-2">No quotes found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Quotes Grid or List */}
        {filteredQuotes.length > 0 && (
          <>
            <div className={`mt-8 ${!anyExpanded ? (viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4') : ''}`}>
              {paginatedQuotes.map((quote, index) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  delay={index} 
                  isAnyExpanded={anyExpanded}
                  onExpand={handleExpand}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && !anyExpanded && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((pageNumber, index) => (
                    pageNumber === null ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber as number)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
