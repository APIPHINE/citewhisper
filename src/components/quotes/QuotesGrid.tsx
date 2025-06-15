
import QuoteCard from '../QuoteCard';
import { Quote } from '../../utils/quotesData';

interface QuotesGridProps {
  quotes: Quote[];
  viewMode: 'grid' | 'list';
  anyExpanded: boolean;
  onExpand: (expanded: boolean) => void;
  isAdmin: boolean;
}

const QuotesGrid = ({ quotes, viewMode, anyExpanded, onExpand, isAdmin }: QuotesGridProps) => {
  return (
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
  );
};

export default QuotesGrid;
