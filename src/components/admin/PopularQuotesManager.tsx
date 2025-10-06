import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Search, TrendingUp, BookOpen } from 'lucide-react';
import { PopularQuotesService, PopularQuote } from '@/services/popularQuotesService';
import { useToast } from '@/hooks/use-toast';

export function PopularQuotesManager() {
  const [quotes, setQuotes] = useState<PopularQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PopularQuote['status']>('unverified');
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, [selectedStatus]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await PopularQuotesService.getQuotesByStatus(selectedStatus);
      setQuotes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load popular quotes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (quoteId: string, newStatus: PopularQuote['status']) => {
    try {
      await PopularQuotesService.updateQuoteStatus(quoteId, newStatus);
      toast({
        title: 'Status Updated',
        description: 'Quote status has been updated successfully',
      });
      loadQuotes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quote status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unverified': return 'bg-yellow-500';
      case 'disputed': return 'bg-orange-500';
      case 'misattributed': return 'bg-red-500';
      case 'researching': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Popular Quotes - Attribution Uncertain
          </CardTitle>
          <CardDescription>
            Manage quotes that are widely shared but have uncertain or disputed attribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as PopularQuote['status'])}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
              <TabsTrigger value="researching">Researching</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
              <TabsTrigger value="misattributed">Misattributed</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="space-y-4 mt-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No {selectedStatus} quotes found
                </div>
              ) : (
                quotes.map((quote) => (
                  <Card key={quote.id} className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">"{quote.quote_text}"</CardTitle>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commonly attributed to:</span>
                              <Badge variant="outline">{quote.commonly_attributed_to || 'Unknown'}</Badge>
                            </div>
                            {quote.actual_author_if_known && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Actual author:</span>
                                <Badge variant="default">{quote.actual_author_if_known}</Badge>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Popularity: {quote.popularity_score}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {quote.attribution_notes && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Attribution Notes:</p>
                          <p className="text-sm text-muted-foreground">{quote.attribution_notes}</p>
                        </div>
                      )}
                      
                      {quote.earliest_known_source && (
                        <div className="text-sm">
                          <span className="font-medium">Earliest known source:</span> {quote.earliest_known_source}
                          {quote.earliest_known_date && ` (${quote.earliest_known_date})`}
                        </div>
                      )}

                      {quote.confidence_score && (
                        <div className="text-sm">
                          <span className="font-medium">Confidence score:</span> {(quote.confidence_score * 100).toFixed(0)}%
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {selectedStatus !== 'researching' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(quote.id, 'researching')}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Start Research
                          </Button>
                        )}
                        {selectedStatus !== 'disputed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(quote.id, 'disputed')}
                          >
                            Mark as Disputed
                          </Button>
                        )}
                        {selectedStatus !== 'misattributed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(quote.id, 'misattributed')}
                          >
                            Mark as Misattributed
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Research History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
