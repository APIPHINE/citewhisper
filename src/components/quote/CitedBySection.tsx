
import { Link, ExternalLink } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';
import { useFormatDate } from '../../hooks/use-format-date';

interface CitedBySectionProps {
  quote: Quote;
}

export function CitedBySection({ quote }: CitedBySectionProps) {
  const { formatDate } = useFormatDate();
  
  return (
    <SectionBox 
      title={`Cited By (${quote.citedBy?.length || 0})`} 
      icon={<Link size={18} />}
      id={`cited-by-section-${quote.id}`}
    >
      {quote.citedBy && quote.citedBy.length > 0 ? (
        <div className="space-y-4">
          {quote.citedBy.map((citation, index) => (
            <div key={index} className="flex justify-between items-start p-3 border border-border/50 rounded-lg hover:bg-secondary/10 transition-colors">
              <div>
                <p className="font-medium">{citation.siteName}</p>
                <p className="text-xs text-muted-foreground">Embedded on: {formatDate(citation.embedDate)}</p>
              </div>
              <a 
                href={citation.siteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline flex items-center text-sm"
              >
                Visit <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">This quote hasn't been embedded on any websites yet.</p>
          <p className="text-sm mt-2">
            Share it using the embed code to see sites that cite this quote.
          </p>
        </div>
      )}
    </SectionBox>
  );
}
