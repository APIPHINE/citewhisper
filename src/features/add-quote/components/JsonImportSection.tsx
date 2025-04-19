
import { useState } from 'react';
import { FileJson, Import, Copy } from 'lucide-react';
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

  const importPlaceholder = `{
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
  "originalSource": {
    "title": "",
    "publisher": "",
    "publicationDate": "YYYY-MM-DD",
    "location": "",
    "isbn": "",
    "sourceUrl": ""
  },
  "context": "",
  "historicalContext": "",
  "keywords": ["keyword1", "keyword2"],
  "citationAPA": "",
  "citationMLA": "",
  "citationChicago": "",
  "translations": [
    {
      "language": "",
      "text": "",
      "source": "",
      "translator": "",
      "publication": "",
      "publicationDate": "YYYY-MM-DD",
      "sourceUrl": ""
    }
  ]
}`;

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
        translations: Array.isArray(parsedJson.translations) ? parsedJson.translations : [],
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

  const handleCopyImportStructure = () => {
    navigator.clipboard.writeText(importPlaceholder).then(() => {
      toast({
        title: "Copied",
        description: "JSON import structure copied to clipboard.",
      });
    }).catch((err) => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy JSON import structure.",
        variant: "destructive"
      });
    });
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
          placeholder={importPlaceholder}
          className="min-h-[300px] font-mono text-sm"
        />
        <div className="flex space-x-4">
          <Button onClick={handleJsonImport} className="flex-1">
            <Import className="mr-2" /> Import JSON and Fill Form
          </Button>
          <Button 
            onClick={handleCopyImportStructure} 
            variant="secondary" 
            className="flex-1"
          >
            <Copy className="mr-2" /> Copy Import Structure
          </Button>
        </div>
      </div>
    </div>
  );
}
