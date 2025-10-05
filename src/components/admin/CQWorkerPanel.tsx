import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { useCQWorker } from '@/hooks/useCQWorker';
import { CQAiService } from '@/services/cqAiService';
import { useToast } from '@/hooks/use-toast';

export function CQWorkerPanel() {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState([3]);
  const [sourceType, setSourceType] = useState<string>('');
  const [statistics, setStatistics] = useState<any>(null);
  const { isGenerating, generatedQuotes, generateQuotes, clearResults } = useCQWorker();
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await CQAiService.getCQStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter a prompt to generate quotes.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await generateQuotes({
        prompt: prompt.trim(),
        count: count[0],
        sourceType: sourceType || undefined,
      });
      
      // Reload statistics after successful generation
      loadStatistics();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">CQ AI Worker</h2>
          <p className="text-muted-foreground">
            Generate quote submissions using AI for later approval
          </p>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.approvalRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Quotes</CardTitle>
          <CardDescription>
            Describe what quotes you'd like CQ to generate (e.g., "Science quotes about discovery" or "Historical quotes from Winston Churchill")
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Generation Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter topic, theme, or author to generate quotes about..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="count">Number of Quotes: {count[0]}</Label>
              <Slider
                id="count"
                min={1}
                max={10}
                step={1}
                value={count}
                onValueChange={setCount}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceType">Source Type Preference (Optional)</Label>
              <Select value={sourceType} onValueChange={setSourceType} disabled={isGenerating}>
                <SelectTrigger id="sourceType">
                  <SelectValue placeholder="Any source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any source type</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="speech">Speech</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                Clear Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {generatedQuotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generated Quotes ({generatedQuotes.length})
            </CardTitle>
            <CardDescription>
              These quotes have been added to the submissions queue for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuotes.map((quote, index) => (
                <Card key={quote.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <blockquote className="flex-1 italic text-lg">
                          "{quote.quote_text}"
                        </blockquote>
                        <Badge variant="outline" className="shrink-0">
                          {Math.round(quote.confidence_score * 100)}% confidence
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">— {quote.author_name}</p>
                        <p className="mt-1">{quote.source_title}</p>
                        {quote.source_date && (
                          <p className="mt-1">{new Date(quote.source_date).getFullYear()}</p>
                        )}
                      </div>

                      {quote.source_context_text && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm">{quote.source_context_text}</p>
                        </div>
                      )}

                      {quote.quote_topics && quote.quote_topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
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
          </CardContent>
        </Card>
      )}

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Maximum 50 quotes can be generated per hour</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>All CQ-generated quotes require manual approval before publication</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Review submissions in the "Quote Submissions" tab</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Confidence scores indicate AI certainty about quote accuracy</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
