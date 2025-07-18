
import QuoteCard from '../QuoteCard';
import { SuperAdminBulkActions } from '@/components/admin/SuperAdminBulkActions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useState } from 'react';
import { Quote } from '../../utils/quotesData';

interface QuotesGridProps {
  quotes: Quote[];
  viewMode: 'grid' | 'list';
  anyExpanded: boolean;
  onExpand: (expanded: boolean) => void;
  isAdmin: boolean;
}

const QuotesGrid = ({ quotes, viewMode, anyExpanded, onExpand, isAdmin }: QuotesGridProps) => {
  const { userRole } = useUserRoles();
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const isSuperAdmin = userRole === 'super_admin';

  const handleBulkQuoteAction = async (action: string, quoteIds: string[]) => {
    console.log('Bulk quote action:', action, quoteIds);
    // Implement actual bulk quote operations here
  };

  // Convert quotes to the format expected by SuperAdminBulkActions
  const bulkItems = quotes.map(quote => ({
    id: quote.id,
    type: 'quote',
    title: quote.text.substring(0, 50) + '...',
    status: 'pending', // Default status
    author: quote.author,
    createdAt: new Date().toISOString() // Default date
  }));

  return (
    <>
      {/* Super Admin Bulk Actions */}
      {isSuperAdmin && quotes.length > 0 && (
        <div className="mb-6">
          <SuperAdminBulkActions
            items={bulkItems}
            selectedItems={selectedQuotes}
            onSelectionChange={setSelectedQuotes}
            onBulkAction={handleBulkQuoteAction}
            contentType="quotes"
          />
        </div>
      )}

      <div className={`mt-8 ${!anyExpanded ? (viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4') : ''}`}>
        {quotes.map((quote, index) => (
          <QuoteCard 
            key={quote.id} 
            quote={quote} 
            delay={index} 
            isAnyExpanded={anyExpanded}
            onExpand={onExpand}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </>
  );
};

export default QuotesGrid;
