
import { GitBranch } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface RelatedContentSectionProps {
  quote: Quote;
}

export function RelatedContentSection({ quote }: RelatedContentSectionProps) {
  return (
    <SectionBox title="Related Content" icon={<GitBranch size={18} />}>
      {/* Alternative Versions */}
      {quote.variations && quote.variations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Alternative Versions</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {quote.variations.map((variation, index) => (
              <li key={index}>{variation}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Cross-Referenced Quotes */}
      {quote.crossReferencedQuotes && quote.crossReferencedQuotes.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-1">Related Quotes</h4>
          <div className="space-y-2">
            {quote.crossReferencedQuotes.map((relatedQuote, index) => (
              <div key={index} className="text-sm border-l-2 border-accent/30 pl-3 py-1">
                <p className="italic">"{relatedQuote.text}"</p>
                <p className="text-xs text-muted-foreground">— {relatedQuote.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionBox>
  );
}
