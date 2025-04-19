
import { Button } from '@/components/ui/button';
import { Quote } from '../../../utils/quotesData';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';

interface EmbedCodeGeneratorProps {
  quote: Quote;
  embedStyle: EmbedStyle;
  embedColor: EmbedColor;
  embedSize: EmbedSize;
  onCopy: () => void;
}

export function EmbedCodeGenerator({ quote, embedStyle, embedColor, embedSize, onCopy }: EmbedCodeGeneratorProps) {
  const generateEmbedCode = () => {
    const width = embedStyle === 'vertical' 
      ? '400'
      : embedSize === 'small' ? '300' : embedSize === 'medium' ? '450' : '600';
    
    const height = embedStyle === 'vertical'
      ? '640'
      : embedSize === 'small' ? '180' : embedSize === 'medium' ? '240' : '300';

    return `<iframe 
  src="https://citequotes.com/embed/quote/${quote.id}?style=${embedStyle}&color=${embedColor}&size=${embedSize}" 
  width="${width}" 
  height="${height}" 
  frameborder="0"
  title="Quote by ${quote.author}"
></iframe>
<a href="https://citequotes.com/quotes/${quote.id}" target="_blank" rel="noopener noreferrer" style="display: block; margin-top: 4px; font-size: 12px; color: #666;">View on CiteQuotes</a>`;
  };

  return (
    <>
      <div className="bg-white border border-border p-3 rounded-md text-sm font-mono mb-3 overflow-x-auto">
        {generateEmbedCode()}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          By embedding this quote, your site will be listed in the "Cited By" section.
        </p>
        <Button variant="outline" size="sm" onClick={onCopy} className="ml-4">
          Copy Code
        </Button>
      </div>
    </>
  );
}
