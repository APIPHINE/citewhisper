
import { BookOpen, ExternalLink, Maximize2, X } from 'lucide-react';
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
  const [imageEnlarged, setImageEnlarged] = useState(false);
  
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
              <div
                className="border border-border rounded-md overflow-hidden cursor-pointer group relative hover:border-primary transition-colors"
                onClick={() => setImageEnlarged(true)}
              >
                <img 
                  src={quote.evidenceImage} 
                  alt={`Evidence for quote by ${quote.author}`} 
                  className="w-full h-auto"
                  onError={handleImageError}
                />
                <div className="absolute top-2 right-2 bg-background/90 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} className="text-foreground" />
                </div>
                <div className="p-2 bg-secondary/20 text-xs text-muted-foreground">
                  <p>This excerpt is used under Fair Use (17 U.S.C. § 107) for educational and transformative commentary purposes. Source linked and attributed. Click to enlarge.</p>
                </div>
              </div>

              {imageEnlarged && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="evidence-image-title"
                  aria-describedby="evidence-image-description"
                  className="fixed inset-0 z-[10000] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setImageEnlarged(false)}
                >
                  <h2 id="evidence-image-title" className="sr-only">Source Evidence Image</h2>
                  <p id="evidence-image-description" className="sr-only">
                    Enlarged view of the evidence image for the quote by {quote.author}
                  </p>

                  <button
                    onClick={() => setImageEnlarged(false)}
                    className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md bg-background/80 border border-border p-2 hover:bg-secondary transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} className="text-foreground" />
                  </button>

                  {quote.evidenceImage && (
                    <a
                      href={quote.evidenceImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 left-4 inline-flex items-center rounded-md bg-background/80 border border-border px-3 py-1.5 text-sm hover:bg-secondary transition-colors"
                    >
                      Open in new tab <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}

                  <div className="relative max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={quote.evidenceImage}
                      alt={`Evidence for quote by ${quote.author}`}
                      className="max-w-full max-h-[90vh] object-contain"
                      onError={handleImageError}
                    />
                  </div>
                </div>
              )}
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
