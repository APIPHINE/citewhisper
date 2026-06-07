import { Card, CardContent } from '@/components/ui/card';

interface QuoteCardProps {
  quote: {
    id?: string;
    quote_text?: string;
    author_name?: string;
  };
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <blockquote className="text-lg italic mb-3">"{quote.quote_text}"</blockquote>
        <p className="text-sm text-muted-foreground">— {quote.author_name ?? 'Unknown'}</p>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
