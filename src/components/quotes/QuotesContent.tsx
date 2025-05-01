
import { useState } from 'react';
import { Quote } from '../../utils/quotesData';
import QuotesToolbar from './QuotesToolbar';
import EmptyQuotes from './EmptyQuotes';
import QuotesGrid from './QuotesGrid';
import QuotesPagination from './QuotesPagination';
import QuoteSidebar from '../QuoteSidebar';

interface QuotesContentProps {
  quotes: Quote[];
  searchQuery: string;
  anyExpanded: boolean;
  setAnyExpanded: (expanded: boolean) => void;
}

const QUOTES_PER_PAGE = 10;

const QuotesContent = ({ 
  quotes, 
  searchQuery, 
  anyExpanded,
  setAnyExpanded
}: QuotesContentProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {sidebarOpen && <QuoteSidebar />}
      </div>
      
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
