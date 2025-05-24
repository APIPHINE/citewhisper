
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Share, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '../../../context/FavoritesContext';

interface FavoriteQuoteActionsProps {
  quotes: Quote[];
}

export function FavoriteQuoteActions({ quotes }: FavoriteQuoteActionsProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const { removeFavorite } = useFavorites();
  const { toast } = useToast();

  const handleSelectAll = () => {
    if (selectedQuotes.length === quotes.length) {
      setSelectedQuotes([]);
    } else {
      setSelectedQuotes(quotes.map(q => q.id));
    }
  };

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleShare = () => {
    const selectedQuoteTexts = quotes
      .filter(q => selectedQuotes.includes(q.id))
      .map(q => `"${q.text}" — ${q.author}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(selectedQuoteTexts);
    toast({
      title: "Quotes copied to clipboard",
      description: `${selectedQuotes.length} quotes copied for sharing.`,
    });
  };

  const handleExport = () => {
    const selectedQuoteData = quotes.filter(q => selectedQuotes.includes(q.id));
    const dataStr = JSON.stringify(selectedQuoteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'favorite-quotes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Quotes exported",
      description: `${selectedQuotes.length} quotes exported as JSON.`,
    });
  };

  const handleDelete = () => {
    selectedQuotes.forEach(quoteId => {
      removeFavorite(quoteId);
    });
    setSelectedQuotes([]);
    toast({
      title: "Quotes removed",
      description: `${selectedQuotes.length} quotes removed from favorites.`,
    });
  };

  if (quotes.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedQuotes.length === quotes.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select all ({quotes.length})
          </label>
        </div>
        
        {selectedQuotes.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedQuotes.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
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
