
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';

interface FavoriteQuoteActionsProps {
  quotes: Quote[];
}

export function FavoriteQuoteActions({ quotes }: FavoriteQuoteActionsProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  const handleSelectAll = () => {
    setSelectedQuotes(quotes.map(q => q.id));
  };

  const handleDeselectAll = () => {
    setSelectedQuotes([]);
  };

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  if (quotes.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="h-8"
          >
            <Check className="h-4 w-4 mr-1" />
            Select all ({quotes.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Deselect all
          </Button>
        </div>
        
        {selectedQuotes.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedQuotes.length} selected
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-center space-x-2 p-2 rounded border">
            <Checkbox
              id={`quote-${quote.id}`}
              checked={selectedQuotes.includes(quote.id)}
              onCheckedChange={() => handleSelectQuote(quote.id)}
            />
            <label 
              htmlFor={`quote-${quote.id}`} 
              className="text-xs truncate flex-1 cursor-pointer"
            >
              {quote.text.substring(0, 30)}...
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
