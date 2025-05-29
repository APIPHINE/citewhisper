
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

  const csvPlaceholder = `text,author,date,topics,theme,source,sourceUrl,sourcePublicationDate,originalLanguage,originalText,originalSourceTitle,originalSourcePublisher,originalSourcePublicationDate,originalSourceLocation,originalSourceIsbn,originalSourceUrl,context,historicalContext,keywords,emotionalTone,translationLanguage,translationText,translationSource,translator,translationPublication,translationPublicationDate,translationSourceUrl
"The future belongs to those who believe in the beauty of their dreams.",Eleanor Roosevelt,1945-06-15,"Dreams;Inspiration",Inspiration,"As We Are" journal,,1945-06-15,English,,"As We Are" journal,Roosevelt Foundation,1945-06-15,New York,,https://example.com/source,"Spoken during a speech about hope and perseverance",Post-war America context,"dreams;hope;future;inspiration",Hopeful,,,,,,,`;

  const handleCsvImport = () => {
    try {
      const rows = csvInput.trim().split('\n');
      if (rows.length < 2) {
        throw new Error("CSV must contain at least a header row and one data row");
      }

      const headers = rows[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
      const dataRow = parseCSVRow(rows[1]);
      
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
        keywords: [],
        originalSource: {
          title: '',
          publisher: '',
          publicationDate: '',
          location: '',
          isbn: '',
          sourceUrl: ''
        },
        translations: []
      };
      
      headers.forEach((header, index) => {
        if (index < dataRow.length && dataRow[index]) {
          const value = dataRow[index];
          
          switch (header) {
            case 'topics':
            case 'keywords':
              quoteData[header] = value.split(';').map(item => item.trim()).filter(Boolean);
              break;
            case 'originalSourceTitle':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.title = value;
              break;
            case 'originalSourcePublisher':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.publisher = value;
              break;
            case 'originalSourcePublicationDate':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.publicationDate = value;
              break;
            case 'originalSourceLocation':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.location = value;
              break;
            case 'originalSourceIsbn':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.isbn = value;
              break;
            case 'originalSourceUrl':
              if (!quoteData.originalSource) quoteData.originalSource = {};
              quoteData.originalSource.sourceUrl = value;
              break;
            case 'translationLanguage':
            case 'translationText':
            case 'translationSource':
            case 'translator':
            case 'translationPublication':
            case 'translationPublicationDate':
            case 'translationSourceUrl':
              // Handle translations - collect all translation data
              if (!quoteData.translations) quoteData.translations = [];
              if (quoteData.translations.length === 0) {
                quoteData.translations.push({
                  language: '',
                  text: '',
                  source: '',
                  translator: '',
                  publication: '',
                  publicationDate: '',
                  sourceUrl: ''
                });
              }
              
              const translationField = header.replace('translation', '').toLowerCase();
              const mappedField = translationField === 'publicationdate' ? 'publicationDate' : 
                                 translationField === 'sourceurl' ? 'sourceUrl' : translationField;
              
              if (quoteData.translations[0] && mappedField in quoteData.translations[0]) {
                quoteData.translations[0][mappedField] = value;
              }
              break;
            default:
              if (header in quoteData && typeof quoteData[header as keyof QuoteFormValues] === 'string') {
                (quoteData as any)[header] = value;
              }
              break;
          }
        }
      });
      
      // Clean up empty originalSource and translations
      if (quoteData.originalSource && !Object.values(quoteData.originalSource).some(v => v)) {
        quoteData.originalSource = undefined;
      }
      
      if (quoteData.translations && (!quoteData.translations[0] || !Object.values(quoteData.translations[0]).some(v => v))) {
        quoteData.translations = [];
      }
      
      // Fill form with CSV data
      formReset(quoteData as QuoteFormValues);
      
      toast({
        title: "CSV Imported",
        description: "Form has been populated with the CSV data including nested objects.",
      });
    } catch (error) {
      toast({
        title: "Invalid CSV",
        description: error instanceof Error ? error.message : "Please check your CSV format",
        variant: "destructive"
      });
    }
  };

  // Helper function to properly parse CSV row with quoted fields
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    
    return result;
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
        <div className="text-sm text-muted-foreground mb-2">
          <p>Use semicolons (;) to separate multiple topics, keywords, etc.</p>
          <p>All fields from the JSON structure are supported as CSV columns.</p>
        </div>
        <Textarea 
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder={csvPlaceholder}
          className="h-32 font-mono text-xs"
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
