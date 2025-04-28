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
import QuoteSidebar from '../components/QuoteSidebar';
import { CollectionsCarousel } from '../components/collections/CollectionsCarousel';

const QUOTES_PER_PAGE = 10;

const Index = () => {
  const { filteredQuotes, searchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [anyExpanded, setAnyExpanded] = useState(false);
  const [viewMode, setViewMode<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-background border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
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
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Collections Carousel */}
        <CollectionsCarousel />
        
        {/* Main Content Area */}
        <div className="flex mt-8">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {sidebarOpen && <QuoteSidebar />}
          </div>
          
          {/* Quotes Grid */}
          <div className="flex-1 ml-0 md:ml-8">
            {/* Sidebar toggle and filters row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center text-muted-foreground">
                <Button variant="outline" size="sm" onClick={toggleSidebar} className="md:hidden mr-4">
                  {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <span>
                  <span className="font-medium text-foreground">{filteredQuotes.length}</span>
                  <span className="ml-1.5">
                    {filteredQuotes.length === 1 ? 'quote' : 'quotes'} found
                  </span>
                  {searchQuery && (
                    <span className="ml-1">for "{searchQuery}"</span>
                  )}
                </span>
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

            {/* Quotes Grid */}
            {filteredQuotes.length === 0 ? (
              <div className="bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border">
                <SearchIcon size={40} className="mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-medium mb-2">No quotes found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            ) : (
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
            )}

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
                      <PaginationItem key={pageNumber as number}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
