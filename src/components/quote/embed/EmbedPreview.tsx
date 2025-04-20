
import { Quote } from '../../../utils/quotesData';
import { useFormatDate } from '../../../hooks/use-format-date';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';
import { Badge } from '@/components/ui/badge';

interface EmbedPreviewProps {
  quote: Quote;
  embedStyle: EmbedStyle;
  embedColor: EmbedColor;
  embedSize: EmbedSize;
}

export function EmbedPreview({ quote, embedStyle, embedColor, embedSize }: EmbedPreviewProps) {
  const { formatDate } = useFormatDate();

  const renderPreviewClasses = () => {
    let classes = "border rounded-2xl relative overflow-hidden transition-all duration-350 ease-apple border-border/80 hover:border-accent/50";
    
    switch(embedColor) {
      case 'dark':
        classes += " bg-slate-800 text-white";
        break;
      case 'accent':
        classes += " bg-accent/10 border-accent/30";
        break;
      case 'muted':
        classes += " bg-secondary/50";
        break;
      case 'warm':
        classes += " bg-amber-50";
        break;
      case 'cool':
        classes += " bg-blue-50";
        break;
      case 'vintage':
        classes += " bg-sepia-50";
        break;
      case 'modern':
        classes += " bg-zinc-50";
        break;
      default:
        classes += " bg-white";
    }
    
    if (embedStyle === 'vertical') {
      classes += " w-[400px] aspect-[9/16]";
    }
    
    return classes;
  };

  const renderMetaInfo = () => (
    <div className="text-sm space-y-1">
      <p className="font-medium">{quote.author}</p>
      <p className="text-muted-foreground">{formatDate(quote.date)}</p>
      <p className="opacity-70">Source: {quote.source || "Unknown"}</p>
      
      {/* Topics & Theme */}
      <div className="mt-3 flex flex-wrap gap-2">
        {quote.topics.map((topic) => (
          <Badge key={topic} variant="secondary" className="bg-secondary/80">
            {topic}
          </Badge>
        ))}
        <Badge variant="outline" className="border-accent/30 text-accent">
          {quote.theme}
        </Badge>
      </div>
    </div>
  );

  const getTextSize = () => {
    return embedSize === 'small' ? "text-sm" : embedSize === 'large' ? "text-lg" : "text-base";
  };

  const renderQuoteContent = () => {
    switch(embedStyle) {
      case 'horizontal':
        return (
          <div className="flex items-stretch">
            <div className="flex-1 p-6">
              <p className={`${getTextSize()} mb-3`}>{quote.text}</p>
              {renderMetaInfo()}
            </div>
          </div>
        );
      
      case 'vertical':
        return (
          <div className="flex flex-col">
            <div className="p-6">
              <p className={`${getTextSize()} mb-4`}>{quote.text}</p>
              {renderMetaInfo()}
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div className="p-6">
            <p className={`${getTextSize()} mb-4`}>{quote.text}</p>
            {renderMetaInfo()}
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <p className={`${getTextSize()} mb-4`}>{quote.text}</p>
            <div className="mt-6">
              {renderMetaInfo()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={renderPreviewClasses()}>
      {renderQuoteContent()}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground/60">www.CiteQuotes.com</span>
      </div>
    </div>
  );
}
