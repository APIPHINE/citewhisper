import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Highlighter, User, CheckCircle2, XCircle, Edit2 } from 'lucide-react';
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
  const [mode, setMode] = useState<'quote' | 'author'>('quote');
  const [quoteSelection, setQuoteSelection] = useState('');
  const [authorSelection, setAuthorSelection] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedWordIndices, setSelectedWordIndices] = useState<Set<number>>(new Set());
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const words = extractedText.split(/\s+/).filter(Boolean);

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setSelectedWordIndices(new Set([index]));
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      setSelectedWordIndices(prev => new Set([...prev, index]));
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Build selection from selected indices
      const sortedIndices = Array.from(selectedWordIndices).sort((a, b) => a - b);
      const newSelection = sortedIndices.map(i => words[i]).join(' ');
      
      if (mode === 'quote') {
        setQuoteSelection(newSelection);
        onQuoteSelected(newSelection);
      } else {
        setAuthorSelection(newSelection);
        onAuthorSelected(newSelection);
      }
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, selectedWordIndices, mode]);

  const handleClearQuote = () => {
    setQuoteSelection('');
    onQuoteSelected('');
    if (mode === 'quote') {
      setSelectedWordIndices(new Set());
    }
  };

  const handleClearAuthor = () => {
    setAuthorSelection('');
    onAuthorSelected('');
    if (mode === 'author') {
      setSelectedWordIndices(new Set());
    }
  };

  const handleQuoteEdit = (value: string) => {
    setQuoteSelection(value);
    onQuoteSelected(value);
  };

  const handleAuthorEdit = (value: string) => {
    setAuthorSelection(value);
    onAuthorSelected(value);
  };

  const isWordSelected = (index: number) => {
    return selectedWordIndices.has(index);
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
            <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-medium text-muted-foreground">Quote:</p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingQuote(!isEditingQuote)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              {isEditingQuote ? (
                <Textarea
                  value={quoteSelection}
                  onChange={(e) => handleQuoteEdit(e.target.value)}
                  className="min-h-[80px]"
                  onBlur={() => setIsEditingQuote(false)}
                  autoFocus
                />
              ) : (
                <p className="text-sm">{quoteSelection}</p>
              )}
            </div>
          )}
          {authorSelection && (
            <div className="p-3 bg-accent/10 rounded-md border border-accent/20">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-medium text-muted-foreground">Author:</p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingAuthor(!isEditingAuthor)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              {isEditingAuthor ? (
                <Textarea
                  value={authorSelection}
                  onChange={(e) => handleAuthorEdit(e.target.value)}
                  className="min-h-[60px]"
                  onBlur={() => setIsEditingAuthor(false)}
                  autoFocus
                />
              ) : (
                <p className="text-sm">{authorSelection}</p>
              )}
            </div>
          )}
        </div>

        {/* Word Selection Area with Image Overlay */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Click and drag to select words for {mode === 'quote' ? 'quote' : 'author'}
          </p>
          <div 
            className="relative p-4 bg-muted/30 rounded-lg border-2 border-dashed min-h-[200px] select-none"
            onMouseLeave={handleMouseUp}
          >
            <div className="flex flex-wrap gap-0.5">
              {words.map((word, index) => {
                const isSelected = isWordSelected(index);
                const isCurrentHover = selectedWordIndices.has(index) && isDragging && index === Math.max(...Array.from(selectedWordIndices));
                
                return (
                  <button
                    key={index}
                    ref={el => wordRefs.current[index] = el}
                    type="button"
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    className={cn(
                      "px-2 py-1 rounded text-sm transition-all relative",
                      isSelected && "font-medium",
                      !isSelected && "bg-background hover:bg-muted",
                      isCurrentHover && "ring-2 ring-primary"
                    )}
                    style={{
                      backgroundColor: isSelected 
                        ? mode === 'quote' 
                          ? 'hsl(var(--primary) / 0.1)' 
                          : 'hsl(var(--accent) / 0.1)'
                        : undefined
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
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
