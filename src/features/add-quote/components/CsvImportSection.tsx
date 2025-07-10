
import { FileText, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { QuoteFormValues } from '@/utils/formSchemas';
import type { UseFormReset } from 'react-hook-form';
import { useCsvImport } from '@/features/add-quote/hooks/useCsvImport';
import { CsvTemplateSection } from './CsvTemplateSection';

const CSV_PLACEHOLDER = `text,author,date,topics,theme,source,sourceUrl,sourcePublicationDate,originalLanguage,originalText,originalSourceTitle,originalSourcePublisher,originalSourcePublicationDate,originalSourceLocation,originalSourceIsbn,originalSourceUrl,context,historicalContext,keywords,emotionalTone,translationLanguage,translationText,translationSource,translator,translationPublication,translationPublicationDate,translationSourceUrl
"The future belongs to those who believe in the beauty of their dreams.",Eleanor Roosevelt,1945-06-15,"Dreams;Inspiration",Inspiration,"As We Are" journal,,1945-06-15,English,,"As We Are" journal,Roosevelt Foundation,1945-06-15,New York,,https://example.com/source,"Spoken during a speech about hope and perseverance",Post-war America context,"dreams;hope;future;inspiration",Hopeful,,,,,,,`;

interface CsvImportSectionProps {
  formReset: UseFormReset<QuoteFormValues>;
}

export function CsvImportSection({ formReset }: CsvImportSectionProps) {
  const { csvInput, setCsvInput, handleCsvImport, isSubmitting } = useCsvImport({ formReset });

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
          placeholder={CSV_PLACEHOLDER}
          className="h-32 font-mono text-xs"
        />
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={handleCsvImport} 
            size="sm" 
            className="w-full"
            disabled={isSubmitting}
          >
            <Upload className="mr-2 h-4 w-4" /> 
            {isSubmitting ? 'Processing...' : 'Import CSV'}
          </Button>
          <CsvTemplateSection />
        </div>
      </div>
    </div>
  );
}
