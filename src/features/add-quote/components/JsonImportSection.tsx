
import { useState } from 'react';
import { FileJson, Import } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { QuoteFormValues } from '@/utils/formSchemas';
import { UseFormReset } from 'react-hook-form';

interface JsonImportSectionProps {
  formReset: UseFormReset<QuoteFormValues>;
}

export function JsonImportSection({ formReset }: JsonImportSectionProps) {
  const [jsonInput, setJsonInput] = useState('');
  const { toast } = useToast();

  const handleJsonImport = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      if (!parsedJson.text || !parsedJson.author) {
        throw new Error("Quote text and author are required");
      }

      const formattedData = {
        ...parsedJson,
        topics: Array.isArray(parsedJson.topics) ? parsedJson.topics : [],
        keywords: Array.isArray(parsedJson.keywords) ? parsedJson.keywords : [],
      };

      formReset(formattedData);

      toast({
        title: "JSON Imported",
        description: "Form fields have been populated from JSON data.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: error instanceof Error ? error.message : "Please check your JSON format",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileJson className="mr-2" /> Import from JSON
      </h2>
      <div className="space-y-4">
        <Textarea 
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`{
  "text": "",
  "author": "",
  "date": "YYYY-MM-DD",
  "topics": ["topic1", "topic2"],
  "theme": "",
  "source": "",
  "sourceUrl": "",
  "sourcePublicationDate": "YYYY-MM-DD",
  "originalLanguage": "",
  "originalText": "",
  "context": "",
  "historicalContext": "",
  "keywords": ["keyword1", "keyword2"],
  "citationAPA": "",
  "citationMLA": "",
  "citationChicago": ""
}`}
          className="min-h-[200px] font-mono text-sm"
        />
        <Button onClick={handleJsonImport} className="w-full">
          <Import className="mr-2" /> Import JSON and Fill Form
        </Button>
      </div>
    </div>
  );
}
