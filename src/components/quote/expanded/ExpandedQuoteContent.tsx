
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { ShareEmbedButton } from './ShareEmbedButton';
import { LayeredQuoteDisplay } from './LayeredQuoteDisplay';
import { EmbedCodeSection } from '../EmbedCodeSection';
import { QuoteActions } from './QuoteActions';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';
import { SourceSection } from '../SourceSection';
import { ContextSection } from '../ContextSection';
import { RelatedContentSection } from '../RelatedContentSection';
import { CitedBySection } from '../CitedBySection';
import { CitationSection } from '../CitationSection';
import { ExportSection } from '../ExportSection';

interface ExpandedQuoteContentProps {
  quote: Quote;
  toggleFavorite: () => void;
  favorite: boolean;
  shareCount: number;
  favoriteCount: number;
  showEmbedCode: boolean;
}

export function ExpandedQuoteContent({
  quote,
  toggleFavorite,
  favorite,
  shareCount,
  favoriteCount,
  showEmbedCode
}: ExpandedQuoteContentProps) {
  const [showEmbedSection, setShowEmbedSection] = useState(showEmbedCode);
  const [embedStyle, setEmbedStyle] = useState<EmbedStyle>('card');
  const [embedColor, setEmbedColor] = useState<EmbedColor>('light');
  const [embedSize, setEmbedSize] = useState<EmbedSize>('medium');
  
  const handleShareClick = () => {
    setShowEmbedSection(!showEmbedSection);
  };
  
  // Check what content sections to display
  const hasSourceInfo = quote.evidenceImage || quote.sourceInfo || quote.sourceUrl || quote.ocrExtractedText;
  const hasContext = quote.context || quote.historicalContext || quote.impact;
  const hasRelatedContent = (quote.variations && quote.variations.length > 0) || 
                            (quote.crossReferencedQuotes && quote.crossReferencedQuotes.length > 0);
  const hasCitations = quote.citationAPA || quote.citationMLA || quote.citationChicago;
  
  return (
    <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
      {/* Core Quote Information */}
      <LayeredQuoteDisplay quote={quote} />
      
      {/* Source Verification & Evidence */}
      {hasSourceInfo && (
        <div className="mt-6">
          <SourceSection quote={quote} />
        </div>
      )}
      
      {/* Historical Context & Impact */}
      {hasContext && (
        <div className="mt-6">
          <ContextSection quote={quote} />
        </div>
      )}
      
      {/* Academic Citations */}
      {hasCitations && (
        <div className="mt-6">
          <CitationSection quote={quote} />
        </div>
      )}
      
      {/* Related Content */}
      {hasRelatedContent && (
        <div className="mt-6">
          <RelatedContentSection quote={quote} />
        </div>
      )}
      
      {/* Citation Tracking - Always show to encourage embedding */}
      <div className="mt-6">
        <CitedBySection quote={quote} />
      </div>
      
      {/* Export Options - Always available */}
      <div className="mt-6">
        <ExportSection quote={quote} />
      </div>
      
      {/* Share & Embed */}
      <div className="mt-6 pt-6 border-t border-border">
        <ShareEmbedButton 
          handleShareClick={handleShareClick} 
          showEmbedSection={showEmbedSection} 
        />
        
        {showEmbedSection && (
          <EmbedCodeSection
            quote={quote}
            embedStyle={embedStyle}
            setEmbedStyle={setEmbedStyle}
            embedColor={embedColor}
            setEmbedColor={setEmbedColor}
            embedSize={embedSize}
            setEmbedSize={setEmbedSize}
          />
        )}
      </div>
      
      {/* Actions */}
      <QuoteActions 
        handleShareClick={handleShareClick}
        toggleFavorite={toggleFavorite}
        favorite={favorite}
        shareCount={shareCount}
        favoriteCount={favoriteCount}
        quoteId={quote.id}
      />
    </div>
  );
}
