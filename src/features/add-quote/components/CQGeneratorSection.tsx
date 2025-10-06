import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2, CheckCircle, Bot, Download, Trash2 } from 'lucide-react';
import { useCQWorker } from '@/hooks/useCQWorker';
import { useToast } from '@/hooks/use-toast';
import { QuoteFormValues } from '@/utils/formSchemas';

interface CQGeneratorSectionProps {
  form: UseFormReturn<QuoteFormValues>;
  onQuoteLoaded?: () => void;
}

export function CQGeneratorSection({ form, onQuoteLoaded }: CQGeneratorSectionProps) {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState([3]);
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());
  const { isGenerating, generatedQuotes, generateQuotes, clearResults } = useCQWorker();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter a topic or theme to generate quotes.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSelectedQuotes(new Set());
      await generateQuotes({
        prompt: prompt.trim(),
        count: count[0],
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const toggleQuoteSelection = (quoteId: string) => {
    const newSelection = new Set(selectedQuotes);
    if (newSelection.has(quoteId)) {
      newSelection.delete(quoteId);
    } else {
      newSelection.add(quoteId);
    }
    setSelectedQuotes(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedQuotes.size === generatedQuotes.length) {
      setSelectedQuotes(new Set());
    } else {
      setSelectedQuotes(new Set(generatedQuotes.map(q => q.id)));
    }
  };

  const handleLoadSelected = () => {
    if (selectedQuotes.size === 0) {
      toast({
        title: 'No Quotes Selected',
        description: 'Please select at least one quote to load.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedQuotes.size === 1) {
      // Single quote - load into form
      const selectedQuote = generatedQuotes.find(q => selectedQuotes.has(q.id));
      if (selectedQuote) {
        form.setValue('text', selectedQuote.quote_text);
        form.setValue('author', selectedQuote.author_name);
        form.setValue('context', selectedQuote.source_context_text || '');
        form.setValue('topics', selectedQuote.quote_topics || []);
        
        // Populate source info
        form.setValue('sourceInfo.title', selectedQuote.source_title || '');
        form.setValue('sourceInfo.author', selectedQuote.author_name || '');
        form.setValue('sourceInfo.publication_date', selectedQuote.source_date || '');
        
        toast({
          title: 'Quote Loaded',
          description: 'CQ-generated quote loaded into form. You can now edit and submit it.',
        });

        clearResults();
        setSelectedQuotes(new Set());
        
        if (onQuoteLoaded) {
          onQuoteLoaded();
        }
      }
    } else {
      // Multiple quotes - they're already submitted in the quote_submissions table
      toast({
        title: 'Quotes Ready for Review',
        description: `${selectedQuotes.size} quotes are already submitted and pending admin review.`,
      });
      clearResults();
      setSelectedQuotes(new Set());
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              CQ AI Quote Generator
              <Badge variant="secondary" className="text-xs">Super Admin Only</Badge>
            </CardTitle>
            <CardDescription>
              Generate quotes using AI and load them directly into the form
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cq-prompt">What quotes would you like CQ to generate?</Label>
          <Textarea
            id="cq-prompt"
            placeholder="e.g., 'Science quotes about discovery' or 'Quotes from Albert Einstein about relativity'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cq-count">Number of Quotes: {count[0]}</Label>
          <Slider
            id="cq-count"
            min={1}
            max={5}
            step={1}
            value={count}
            onValueChange={setCount}
            disabled={isGenerating}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Quotes
            </>
          )}
        </Button>

        {/* Results Display */}
        {generatedQuotes.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedQuotes.size === generatedQuotes.length && generatedQuotes.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {selectedQuotes.size} of {generatedQuotes.length} selected
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleLoadSelected}
                  disabled={selectedQuotes.size === 0}
                  size="sm"
                  variant="default"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {selectedQuotes.size === 1 ? 'Load to Form' : `Submit ${selectedQuotes.size} Quotes`}
                </Button>
                <Button
                  onClick={() => {
                    clearResults();
                    setSelectedQuotes(new Set());
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedQuotes.map((quote) => (
                <Card 
                  key={quote.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    selectedQuotes.has(quote.id) ? 'ring-2 ring-primary' : 'border-l-4 border-l-primary/30'
                  }`}
                  onClick={() => toggleQuoteSelection(quote.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <div className="pt-1">
                        <Checkbox
                          checked={selectedQuotes.has(quote.id)}
                          onCheckedChange={() => toggleQuoteSelection(quote.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <blockquote className="flex-1 italic">
                            "{quote.quote_text}"
                          </blockquote>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {Math.round(quote.confidence_score * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium">— {quote.author_name}</p>
                          {quote.source_title && (
                            <p className="text-xs mt-1">
                              {quote.source_title}
                              {quote.source_date && ` (${quote.source_date})`}
                            </p>
                          )}
                        </div>

                        {quote.quote_topics && quote.quote_topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quote.quote_topics.map((topic: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
          <p>💡 <strong>Single quote:</strong> Load into form to edit and submit</p>
          <p>💡 <strong>Multiple quotes:</strong> They're already submitted for admin review</p>
        </div>
      </CardContent>
    </Card>
  );
}
