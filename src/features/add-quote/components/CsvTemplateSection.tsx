import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CSV_TEMPLATE = `text,author,date,topics,theme,source,sourceUrl,sourcePublicationDate,originalLanguage,originalText,originalSourceTitle,originalSourcePublisher,originalSourcePublicationDate,originalSourceLocation,originalSourceIsbn,originalSourceUrl,context,historicalContext,keywords,emotionalTone,translationLanguage,translationText,translationSource,translator,translationPublication,translationPublicationDate,translationSourceUrl
"The future belongs to those who believe in the beauty of their dreams.",Eleanor Roosevelt,1945-06-15,"Dreams;Inspiration",Inspiration,"As We Are" journal,,1945-06-15,English,,"As We Are" journal,Roosevelt Foundation,1945-06-15,New York,,https://example.com/source,"Spoken during a speech about hope and perseverance",Post-war America context,"dreams;hope;future;inspiration",Hopeful,,,,,,,`;

export function CsvTemplateSection() {
  const { toast } = useToast();

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE).then(() => {
      toast({
        title: "Copied",
        description: "CSV template copied to clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy CSV template.",
        variant: "destructive"
      });
    });
  };

  return (
    <Button 
      onClick={handleCopyTemplate} 
      variant="outline" 
      size="sm"
      className="w-full"
    >
      <Copy className="mr-2 h-4 w-4" /> Copy CSV Template
    </Button>
  );
}