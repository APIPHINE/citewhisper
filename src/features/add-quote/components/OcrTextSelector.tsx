import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Highlighter, User, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OcrTextSelectorProps {
  extractedText: string;
  onQuoteSelected: (quote: string) => void;
  onAuthorSelected: (author: string) => void;
  onConfirm: () => void;
  confidence: number;
}

export function OcrTextSelector({
  extractedText,
  onQuoteSelected,
  onAuthorSelected,
  onConfirm,
  confidence
}: OcrTextSelectorProps) {
  const [selectedText, setSelectedText] = useState('');
  const [mode, setMode] = useState<'quote' | 'author'>('quote');
  const [quoteSelection, setQuoteSelection] = useState('');
  const [authorSelection, setAuthorSelection] = useState('');

  const words = extractedText.split(/\s+/).filter(Boolean);

  const handleWordClick = useCallback((word: string, index: number) => {
    if (mode === 'quote') {
      const newSelection = quoteSelection ? `${quoteSelection} ${word}` : word;
      setQuoteSelection(newSelection);
      onQuoteSelected(newSelection);
    } else {
      const newSelection = authorSelection ? `${authorSelection} ${word}` : word;
      setAuthorSelection(newSelection);
      onAuthorSelected(newSelection);
    }
  }, [mode, quoteSelection, authorSelection, onQuoteSelected, onAuthorSelected]);

  const handleClearQuote = () => {
    setQuoteSelection('');
    onQuoteSelected('');
  };

  const handleClearAuthor = () => {
    setAuthorSelection('');
    onAuthorSelected('');
  };

  const confidenceColor = 
    confidence >= 0.7 ? 'bg-green-500' :
    confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5" />
            Select Text from Image
          </CardTitle>
          <Badge className={confidenceColor}>
            {Math.round(confidence * 100)}% OCR Confidence
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Click words to build your quote or identify the author
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'quote' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('quote')}
            className="flex-1"
          >
            <Highlighter className="h-4 w-4 mr-2" />
            Select Quote
          </Button>
          <Button
            type="button"
            variant={mode === 'author' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('author')}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            Select Author
          </Button>
        </div>

        {/* Current Selections */}
        <div className="space-y-2">
          {quoteSelection && (
            <div className="p-3 bg-primary/10 rounded-md">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Quote:</p>
                  <p className="text-sm">{quoteSelection}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearQuote}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {authorSelection && (
            <div className="p-3 bg-accent/10 rounded-md">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Author:</p>
                  <p className="text-sm">{authorSelection}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAuthor}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Word Selection Area */}
        <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed min-h-[200px]">
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => {
              const isInQuote = quoteSelection.includes(word);
              const isInAuthor = authorSelection.includes(word);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleWordClick(word, index)}
                  className={cn(
                    "px-2 py-1 rounded text-sm transition-all hover:scale-105",
                    isInQuote && "bg-primary text-primary-foreground font-medium",
                    isInAuthor && "bg-accent text-accent-foreground font-medium",
                    !isInQuote && !isInAuthor && "bg-background hover:bg-muted"
                  )}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        {(quoteSelection || authorSelection) && (
          <Button
            type="button"
            onClick={onConfirm}
            className="w-full"
            size="lg"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirm & Continue to Form
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
