
import { Award } from 'lucide-react';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface CitationSectionProps {
  quote: Quote;
}

export function CitationSection({ quote }: CitationSectionProps) {
  return (
    <SectionBox title="Citation Formats" icon={<Award size={18} />}>
      <div className="space-y-3">
        {/* APA */}
        <div>
          <h4 className="font-medium text-sm mb-1">APA</h4>
          <p className="text-sm text-muted-foreground">{quote.citationAPA}</p>
        </div>
        
        {/* MLA */}
        <div>
          <h4 className="font-medium text-sm mb-1">MLA</h4>
          <p className="text-sm text-muted-foreground">{quote.citationMLA}</p>
        </div>
        
        {/* Chicago */}
        <div>
          <h4 className="font-medium text-sm mb-1">Chicago</h4>
          <p className="text-sm text-muted-foreground">{quote.citationChicago}</p>
        </div>
      </div>
    </SectionBox>
  );
}
