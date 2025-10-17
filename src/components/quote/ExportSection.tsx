
import { FileDown, FileJson, FileSpreadsheet, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';
import { toast } from 'sonner';

interface ExportSectionProps {
  quote: Quote;
}

export function ExportSection({ quote }: ExportSectionProps) {
  const exportAsJSON = () => {
    const jsonData = JSON.stringify(quote, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Quote exported as JSON');
  };

  const exportAsCSV = () => {
    const csvRows = [
      ['Field', 'Value'],
      ['ID', quote.id],
      ['Text', quote.text],
      ['Author', quote.author],
      ['Date', quote.date || ''],
      ['Source', quote.source || ''],
      ['Topics', quote.topics?.join('; ') || ''],
      ['Theme', quote.theme || ''],
      ['Context', quote.context || ''],
      ['Historical Context', quote.historicalContext || ''],
    ];
    
    const csvContent = csvRows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Quote exported as CSV');
  };

  const exportAsCFF = () => {
    const cffData = `cff-version: 1.2.0
message: "If you use this quote, please cite it as below."
type: dataset
title: "${quote.text}"
authors:
  - name: "${quote.author}"
date-released: ${quote.date || 'unknown'}
${quote.sourceUrl ? `url: "${quote.sourceUrl}"` : ''}
${quote.citationAPA ? `preferred-citation:\n  type: generic\n  citation: "${quote.citationAPA}"` : ''}
`;
    
    const blob = new Blob([cffData], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CITATION-${quote.id}.cff`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Citation file exported');
  };
  
  return (
    <SectionBox title="Export & Download" icon={<FileDown size={18} />}>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Export this quote in various formats for use in your research, publications, or personal collection.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsJSON}
            className="flex items-center gap-2"
          >
            <FileJson size={16} />
            Export as JSON
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsCSV}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet size={16} />
            Export as CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsCFF}
            className="flex items-center gap-2"
          >
            <FileCode size={16} />
            Citation File (CFF)
          </Button>
        </div>
      </div>
    </SectionBox>
  );
}
