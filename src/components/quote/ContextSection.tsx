
import { FileText } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface ContextSectionProps {
  quote: Quote;
}

export function ContextSection({ quote }: ContextSectionProps) {
  return (
    <SectionBox title="Historical Context" icon={<FileText size={18} />}>
      <div className="space-y-4">
        {/* Quote Context */}
        <div>
          <h4 className="font-medium text-sm mb-1">Quote Context</h4>
          <p className="text-muted-foreground">{quote.context || "No additional context available."}</p>
        </div>
        
        {/* Historical Context */}
        <div>
          <h4 className="font-medium text-sm mb-1">Historical Significance</h4>
          <p className="text-muted-foreground">{quote.historicalContext || "No historical context available."}</p>
        </div>
        
        {/* Impact */}
        {quote.impact && (
          <div>
            <h4 className="font-medium text-sm mb-1">Impact</h4>
            <p className="text-muted-foreground">{quote.impact}</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}
