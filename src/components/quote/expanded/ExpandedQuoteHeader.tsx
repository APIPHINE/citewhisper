
import { X } from 'lucide-react';
import { useFormatDate } from '../../../hooks/use-format-date';
import { VerificationIndicator } from './VerificationIndicator';
import { Quote } from '../../../utils/quotesData';

interface ExpandedQuoteHeaderProps {
  quote: Quote;
  toggleExpanded: () => void;
}

export function ExpandedQuoteHeader({ quote, toggleExpanded }: ExpandedQuoteHeaderProps) {
  const { formatDate } = useFormatDate();
  
  return (
    <div className="flex justify-between items-start border-b border-border p-6">
      <div>
        <h2 className="text-2xl font-bold">{quote.author}</h2>
        <p className="text-muted-foreground">{formatDate(quote.date)}</p>
      </div>
      
      <button 
        onClick={toggleExpanded}
        className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
        aria-label="Close expanded view"
      >
        <X size={20} />
      </button>
    </div>
  );
}
