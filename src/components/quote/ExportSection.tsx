
import { FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface ExportSectionProps {
  quote: Quote;
}

export function ExportSection({ quote }: ExportSectionProps) {
  if (!quote.exportFormats || !Object.values(quote.exportFormats).some(val => val)) {
    return null;
  }
  
  return (
    <SectionBox title="Export Options" icon={<FileDown size={18} />}>
      <div className="flex flex-wrap gap-2">
        {quote.exportFormats.json && (
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">JSON</Badge>
        )}
        {quote.exportFormats.csv && (
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">CSV</Badge>
        )}
        {quote.exportFormats.cff && (
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary/30">CFF</Badge>
        )}
      </div>
    </SectionBox>
  );
}
