
import { useState } from 'react';
import { Import, Copy } from 'lucide-react';
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
  "text": "The quote text goes here",
  "author": "Author Name",
  "date": "YYYY-MM-DD",
  "context": "Context where the quote was said/written",
  "historicalContext": "Historical background information",
  "topics": ["topic1", "topic2"],
  "theme": "Main theme of the quote",
  "keywords": ["keyword1", "keyword2"],
  "originalLanguage": "es",
  "originalText": "Original text if not in English",
  "emotionalTone": "inspirational",
  "sourceInfo": {
    "source_type": "book",
    "title": "Source Title",
    "author": "Source Author",
    "publisher": "Publisher Name",
    "publication_date": "YYYY-MM-DD",
    "primary_url": "https://example.com/source",
    "backup_url": "https://archive.org/backup",
    "page_number": "42",
    "page_range": "42-45",
    "chapter_number": "3",
    "chapter_title": "Chapter Title",
    "language": "en",
    "isbn": "978-0-123456-78-9",
    "doi": "10.1234/example"
  },
  "translations": [
    {
      "language": "fr",
      "text": "Translated text",
      "source": "Translation source",
      "translator": "Translator Name",
      "publication": "Publication info",
      "publicationDate": "YYYY-MM-DD",
      "sourceUrl": "https://example.com/translation",
      "translationType": "human",
      "translatorType": "human",
      "verified": true,
      "confidenceScore": 0.95
    }
  ]
}`;

  const handleJsonImport = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      if (!parsedJson.text || !parsedJson.author) {
        throw new Error("Quote text and author are required");
      }

      // Map JSON to form structure with proper defaults
      const formattedData = {
        text: parsedJson.text,
        author: parsedJson.author,
        date: parsedJson.date || '',
        context: parsedJson.context || '',
        historicalContext: parsedJson.historicalContext || '',
        topics: Array.isArray(parsedJson.topics) ? parsedJson.topics : [],
        theme: parsedJson.theme || '',
        keywords: Array.isArray(parsedJson.keywords) ? parsedJson.keywords : [],
        originalLanguage: parsedJson.originalLanguage || '',
        originalText: parsedJson.originalText || '',
        emotionalTone: parsedJson.emotionalTone || '',
        sourceInfo: parsedJson.sourceInfo || {
          source_type: 'book',
          title: '',
          author: '',
          publisher: '',
          publication_date: '',
          primary_url: '',
          language: 'en'
        },
        translations: Array.isArray(parsedJson.translations) ? parsedJson.translations : [],
      };

      formReset(formattedData);
      setJsonInput(''); // Clear the input after successful import

      toast({
        title: "JSON Imported Successfully",
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
    <div className="space-y-4">
      <Textarea 
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder={importPlaceholder}
        className="min-h-[200px] font-mono text-sm bg-muted/30"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleJsonImport} 
          className="flex-1"
          disabled={!jsonInput.trim()}
        >
          <Import className="mr-2 h-4 w-4" /> Import JSON and Fill Form
        </Button>
        <Button 
          onClick={handleCopyImportStructure} 
          variant="outline" 
          className="flex-1"
        >
          <Copy className="mr-2 h-4 w-4" /> Copy JSON Structure
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Paste your JSON data above and click "Import" to populate the form, or copy the structure to create your own.
      </p>
    </div>
  );
}
