
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface QuotesPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const QuotesPagination = ({ currentPage, totalPages, setCurrentPage }: QuotesPaginationProps) => {
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

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default QuotesPagination;
