
import { Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { SectionBox } from './SectionBox';

interface VerificationSectionProps {
  quote: Quote;
}

export function VerificationSection({ quote }: VerificationSectionProps) {
  return (
    <SectionBox title="Source Verification" icon={<Fingerprint size={18} />}>
      <div className="space-y-4">
        {/* OCR Information */}
        {quote.ocrExtractedText && (
          <div>
            <h4 className="font-medium text-sm mb-1">OCR Extraction</h4>
            <p className="text-muted-foreground text-sm">{quote.ocrExtractedText}</p>
            <p className="text-xs text-muted-foreground mt-1">Confidence Score: {quote.ocrConfidenceScore ? `${(quote.ocrConfidenceScore * 100).toFixed(1)}%` : "Unknown"}</p>
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
