
import { useState } from 'react';
import { FileText, Copy, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { UseFormReset } from 'react-hook-form';

interface CsvImportSectionProps {
  formReset: UseFormReset<QuoteFormValues>;
}

export function CsvImportSection({ formReset }: CsvImportSectionProps) {
  const [csvInput, setCsvInput] = useState('');
  const { toast } = useToast();

  const csvPlaceholder = `text,author,date,source,sourceUrl,theme
"The future belongs to those who believe in the beauty of their dreams.",Eleanor Roosevelt,1945,"As We Are" journal,,Inspiration
"Stay hungry. Stay foolish.",Steve Jobs,2005,Stanford Commencement Address,https://news.stanford.edu/news/2005/june15/jobs-061505.html,Ambition`;

  const handleCsvImport = () => {
    try {
      const rows = csvInput.trim().split('\n');
      if (rows.length < 2) {
        throw new Error("CSV must contain at least a header row and one data row");
      }

      const headers = rows[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
      const dataRow = rows[1].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      
      // Basic validation
      if (headers.length < 2 || dataRow.length < 2) {
        throw new Error("CSV must contain at least text and author columns");
      }
      
      if (!headers.includes('text') || !headers.includes('author')) {
        throw new Error("CSV must contain 'text' and 'author' columns");
      }
      
      // Create data object from CSV
      const quoteData: Partial<QuoteFormValues> = {
        text: '',
        author: '',
        topics: [],
        keywords: []
      };
      
      headers.forEach((header, index) => {
        if (index < dataRow.length) {
          if (header === 'topics' || header === 'keywords') {
            quoteData[header] = dataRow[index].split(';').map(item => item.trim());
          } else if (header in quoteData) {
            quoteData[header] = dataRow[index];
          }
        }
      });
      
      // Fill form with CSV data
      formReset(quoteData as QuoteFormValues);
      
      toast({
        title: "CSV Imported",
        description: "Form has been populated with the first row of CSV data.",
      });
    } catch (error) {
      toast({
        title: "Invalid CSV",
        description: error instanceof Error ? error.message : "Please check your CSV format",
        variant: "destructive"
      });
    }
  };

  const handleCopyCsvStructure = () => {
    navigator.clipboard.writeText(csvPlaceholder).then(() => {
      toast({
        title: "Copied",
        description: "CSV structure copied to clipboard.",
      });
    }).catch((err) => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy CSV structure.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FileText className="mr-2 h-5 w-5" /> CSV Import
      </h3>
      <div className="space-y-3">
        <Textarea 
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder={csvPlaceholder}
          className="h-28 font-mono text-sm"
        />
        <div className="flex flex-col space-y-2">
          <Button onClick={handleCsvImport} size="sm" className="w-full">
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button 
            onClick={handleCopyCsvStructure} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy CSV Template
          </Button>
        </div>
      </div>
    </div>
  );
}
