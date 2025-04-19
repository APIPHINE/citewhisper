
import { Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';
import { useState } from 'react';

interface VerificationSectionProps {
  quote: Quote;
}

export function VerificationSection({ quote }: VerificationSectionProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <SectionBox title="Source Verification" icon={<Fingerprint size={18} />}>
      <div className="space-y-4">
        {/* Combined Evidence Image and OCR Section */}
        {quote.evidenceImage && (
          <div>
            <h4 className="font-medium text-sm mb-2">Source Evidence</h4>
            <div className="border border-border/50 rounded-lg overflow-hidden">
              {imageError ? (
                <div className="bg-muted/30 h-48 flex items-center justify-center text-muted-foreground">
                  <p>Image could not be loaded</p>
                </div>
              ) : (
                <img 
                  src={quote.evidenceImage} 
                  alt="Source verification" 
                  className="w-full object-contain max-h-64"
                  onError={handleImageError}
                />
              )}
            </div>
            
            {/* Extracted Text */}
            {quote.ocrExtractedText && (
              <div className="mt-2 bg-secondary/20 p-3 rounded-md">
                <h4 className="font-medium text-sm mb-1">Extracted Text</h4>
                <p className="text-muted-foreground text-sm">{quote.ocrExtractedText}</p>
                {quote.ocrConfidenceScore && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence Score: {(quote.ocrConfidenceScore * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Citation Chain */}
        {quote.citationChain && quote.citationChain.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-1">Citation Chain</h4>
            <div className="space-y-2">
              {quote.citationChain.map((citation, index) => (
                <div key={index} className="text-sm">
                  <Badge variant="outline" className="mr-2">{citation.type}</Badge>
                  <span className="text-muted-foreground">{citation.source}, {citation.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* IIIF & Screenshot */}
        {quote.iiifImageUrl && (
          <div>
            <h4 className="font-medium text-sm mb-1">Digital Archives</h4>
            <p className="text-xs text-muted-foreground">IIIF Manifest Available</p>
            <p className="text-xs text-muted-foreground">Image Coordinates: {JSON.stringify(quote.imageCoordinates)}</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}

