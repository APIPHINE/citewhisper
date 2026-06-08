import { useQuoteAiContent } from '@/hooks/useQuoteAiContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteAiPanelProps {
  quoteId?: string;
  quoteText: string;
  author?: string;
}

export function QuoteAiPanel({ quoteId, quoteText, author }: QuoteAiPanelProps) {
  const { data, loading } = useQuoteAiContent({
    quote_id: quoteId,
    quote_text: quoteText,
    author,
  });

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {data.bio && (
          <section>
            <h4 className="font-semibold mb-1">About the author</h4>
            <p className="text-muted-foreground">{data.bio}</p>
          </section>
        )}
        {data.analysis && (
          <section>
            <h4 className="font-semibold mb-1">Analysis</h4>
            <p className="text-muted-foreground">{data.analysis}</p>
          </section>
        )}
        {data.tags && data.tags.length > 0 && (
          <section>
            <h4 className="font-semibold mb-2">Themes</h4>
            <div className="flex flex-wrap gap-1">
              {data.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
