import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle, Bot } from 'lucide-react';
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
      await generateQuotes({
        prompt: prompt.trim(),
        count: count[0],
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleLoadQuote = (quote: any) => {
    // Populate the form with the generated quote
    form.setValue('text', quote.quote_text);
    form.setValue('author', quote.author_name);
    form.setValue('context', quote.source_context_text || '');
    form.setValue('topics', quote.quote_topics || []);
    
    // Populate source info
    form.setValue('sourceInfo.title', quote.source_title || '');
    form.setValue('sourceInfo.author', quote.author_name || '');
    form.setValue('sourceInfo.publication_date', quote.source_date || '');
    
    toast({
      title: 'Quote Loaded',
      description: 'CQ-generated quote loaded into form. You can now edit and submit it.',
    });

    // Clear results after loading
    clearResults();
    
    // Notify parent to advance to next step if needed
    if (onQuoteLoaded) {
      onQuoteLoaded();
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

        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1"
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
          {generatedQuotes.length > 0 && (
            <Button variant="outline" onClick={clearResults}>
              Clear
            </Button>
          )}
        </div>

        {/* Results Display */}
        {generatedQuotes.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Generated {generatedQuotes.length} quotes - Click to load into form</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedQuotes.map((quote) => (
                <Card 
                  key={quote.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                  onClick={() => handleLoadQuote(quote)}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-2">
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
                          <p className="text-xs mt-1">{quote.source_title}</p>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p>💡 CQ generates quotes for review. You can edit them before submission.</p>
        </div>
      </CardContent>
    </Card>
  );
}
