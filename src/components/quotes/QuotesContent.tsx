import { useState, useEffect } from 'react';
import { Quote } from '../../utils/quotesData';
import QuotesToolbar from './QuotesToolbar';
import EmptyQuotes from './EmptyQuotes';
import QuotesGrid from './QuotesGrid';
import QuotesPagination from './QuotesPagination';
import QuoteSidebar from '../QuoteSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuotesContentProps {
  quotes: Quote[];
  searchQuery: string;
  anyExpanded: boolean;
  setAnyExpanded: (expanded: boolean) => void;
  isAdmin: boolean;
}

const QUOTES_PER_PAGE = 10;

const QuotesContent = ({ 
  quotes, 
  searchQuery, 
  anyExpanded,
  setAnyExpanded,
  isAdmin
}: QuotesContentProps) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Set default sidebar state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Calculate pagination
  const totalPages = Math.ceil(quotes.length / QUOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * QUOTES_PER_PAGE;
  const endIndex = startIndex + QUOTES_PER_PAGE;
  const paginatedQuotes = quotes.slice(startIndex, endIndex);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleExpand = (isExpanded: boolean) => {
    setAnyExpanded(isExpanded);
  };

  return (
    <div className="flex mt-8">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
          {sidebarOpen && <QuoteSidebar />}
        </div>
      )}
      
      {/* Quotes Grid */}
      <div className="flex-1 ml-0 md:ml-8">
        <QuotesToolbar 
          filteredQuotesCount={quotes.length}
          searchQuery={searchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {quotes.length === 0 ? (
          <EmptyQuotes />
        ) : (
          <>
            <QuotesGrid 
              quotes={paginatedQuotes}
              viewMode={viewMode}
              anyExpanded={anyExpanded}
              onExpand={handleExpand}
              isAdmin={isAdmin}
            />

            {!anyExpanded && (
              <QuotesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuotesContent;
