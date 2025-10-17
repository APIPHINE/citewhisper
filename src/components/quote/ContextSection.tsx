
import { FileText } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface ContextSectionProps {
  quote: Quote;
}

export function ContextSection({ quote }: ContextSectionProps) {
  return (
    <SectionBox title="Enhanced Context" icon={<FileText size={18} />}>
      <div className="space-y-6">
        {/* Quote Context */}
        <div>
          <h4 className="font-semibold text-base mb-2">Quote Context</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {quote.context || "No additional context available."}
          </p>
        </div>
        
        {/* Historical Context */}
        <div>
          <h4 className="font-semibold text-base mb-2">Historical Context</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {quote.historicalContext || "No historical context available."}
          </p>
        </div>
        
        {/* Historical Significance */}
        <div>
          <h4 className="font-semibold text-base mb-2">Historical Significance</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No historical significance information available.
          </p>
        </div>
        
        {/* Impact */}
        {quote.impact && (
          <div>
            <h4 className="font-semibold text-base mb-2">Impact</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{quote.impact}</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}
