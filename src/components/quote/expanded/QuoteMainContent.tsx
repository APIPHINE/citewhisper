
import { Quote } from '../../../utils/quotesData';

interface QuoteMainContentProps {
  quote: Quote;
}

export function QuoteMainContent({ quote }: QuoteMainContentProps) {
  return (
    <div className="mb-8">
      <p className="text-balance text-xl leading-relaxed font-medium mb-4">
        "{quote.text}"
      </p>
      <div className="text-sm text-muted-foreground">
        <p>Source: {quote.source || "Source unknown"}</p>
      </div>
    </div>
  );
}
