
import { BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';
import { useFormatDate } from '../../hooks/use-format-date';
import { useState } from 'react';

interface SourceSectionProps {
  quote: Quote;
}

export function SourceSection({ quote }: SourceSectionProps) {
  const { formatDate } = useFormatDate();
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.warn('Image failed to load:', quote.evidenceImage);
    setImageError(true);
  };
  
  return (
    <SectionBox title="Source Information" icon={<BookOpen size={18} />}>
      <div className="space-y-3">
        {/* Evidence Image */}
        {quote.evidenceImage && !imageError && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Source Evidence</h4>
            <div className="border border-border rounded-md overflow-hidden">
              <img 
                src={quote.evidenceImage} 
                alt={`Evidence for quote by ${quote.author}`} 
                className="w-full h-auto"
                onError={handleImageError}
              />
              <div className="p-2 bg-secondary/20 text-xs text-muted-foreground">
                <p>This excerpt is used under Fair Use (17 U.S.C. § 107) for educational and transformative commentary purposes. Source linked and attributed.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* OCR extracted text - show right after evidence image */}
        {quote.ocrExtractedText && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1">Extracted Text</h4>
            <div className="bg-secondary/20 p-3 rounded-md italic text-sm">
              {quote.ocrExtractedText}
            </div>
            {quote.ocrConfidenceScore !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                Confidence Score: {(quote.ocrConfidenceScore * 100).toFixed(1)}%
              </p>
            )}
          </div>
        )}
        
        {/* Original language */}
        {quote.originalLanguage && (
          <div>
            <h4 className="font-medium text-sm mb-1">Original Language: {quote.originalLanguage}</h4>
            {quote.originalText && <p className="italic text-muted-foreground">{quote.originalText}</p>}
          </div>
        )}
        
        {/* Source details */}
        <div>
          <h4 className="font-medium text-sm mb-1">Source</h4>
          <p className="text-muted-foreground">{quote.source || "Unknown source"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Publication date: {quote.sourcePublicationDate ? formatDate(quote.sourcePublicationDate) : "Unknown"}
          </p>
          
          {quote.sourceUrl && (
            <a 
              href={quote.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-accent hover:underline text-sm"
            >
              View original source <ExternalLink size={14} className="ml-1" />
            </a>
          )}
        </div>
        
        {/* Manuscript reference */}
        {quote.originalManuscriptReference && (
          <div>
            <h4 className="font-medium text-sm mb-1">Original Manuscript</h4>
            <p className="text-muted-foreground text-sm">{quote.originalManuscriptReference}</p>
          </div>
        )}
        
        {/* Attribution status */}
        <div>
          <h4 className="font-medium text-sm mb-1">Attribution</h4>
          <Badge variant={quote.attributionStatus === "Confirmed" ? "outline" : "secondary"} className="bg-secondary/80">
            {quote.attributionStatus || "Unknown"}
          </Badge>
          {quote.translator && (
            <p className="text-xs text-muted-foreground mt-2">Translator: {quote.translator}</p>
          )}
        </div>

        {/* Fair Use Notice */}
        <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          <p>
            This excerpt is used under Fair Use (17 U.S.C. § 107) for educational and transformative commentary purposes. 
            Source linked and attributed. <a href="/fair-use-policy" className="text-accent hover:underline">Learn more</a> about our Fair Use Policy.
          </p>
        </div>
      </div>
    </SectionBox>
  );
}
