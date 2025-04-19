
import { Quote } from '../../../utils/quotesData';
import { useFormatDate } from '../../../hooks/use-format-date';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';

interface EmbedPreviewProps {
  quote: Quote;
  embedStyle: EmbedStyle;
  embedColor: EmbedColor;
  embedSize: EmbedSize;
}

export function EmbedPreview({ quote, embedStyle, embedColor, embedSize }: EmbedPreviewProps) {
  const { formatDate } = useFormatDate();

  const renderPreviewClasses = () => {
    let classes = "border rounded-lg mt-4 mb-6 relative overflow-hidden";
    
    if (embedColor === 'dark') {
      classes += " bg-slate-800 text-white";
    } else if (embedColor === 'accent') {
      classes += " bg-accent/10 border-accent/30";
    } else {
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
            <div className="flex-1 p-4">
              <p className={`${getTextSize()} mb-3`}>{quote.text}</p>
              {renderMetaInfo()}
            </div>
          </div>
        );
      
      case 'vertical':
        return (
          <div className="flex flex-col">
            <div className="p-4">
              <p className={`${getTextSize()} mb-4`}>{quote.text}</p>
              {renderMetaInfo()}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            <p className={`${getTextSize()} relative mb-4`}>
              <span className={`absolute -left-1 -top-2 text-3xl ${embedColor === 'dark' ? 'text-white/30' : 'text-accent/30'} font-serif`}>"</span>
              {quote.text}
              <span className={`absolute -bottom-4 -right-1 text-3xl ${embedColor === 'dark' ? 'text-white/30' : 'text-accent/30'} font-serif`}>"</span>
            </p>
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
    </div>
  );
}
