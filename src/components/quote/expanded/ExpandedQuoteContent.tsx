
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { ShareEmbedButton } from './ShareEmbedButton';
import { QuoteMainContent } from './QuoteMainContent';
import { EmbedCodeSection } from '../EmbedCodeSection';
import { SourceSection } from '../SourceSection';
import { ContextSection } from '../ContextSection';
import { VerificationSection } from '../VerificationSection';
import { RelatedContentSection } from '../RelatedContentSection';
import { TagsSection } from '../TagsSection';
import { CitationSection } from '../CitationSection';
import { ExportSection } from '../ExportSection';
import { CitedBySection } from '../CitedBySection';
import { QuoteActions } from './QuoteActions';
import { EmbedStyle, EmbedColor, EmbedSize } from '@/types/embed';

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
  const [embedStyle, setEmbedStyle] = useState<EmbedStyle>('standard');
  const [embedColor, setEmbedColor] = useState<EmbedColor>('light');
  const [embedSize, setEmbedSize] = useState<EmbedSize>('medium');
  
  const handleShareClick = () => {
    setShowEmbedSection(!showEmbedSection);
  };
  
  return (
    <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
      {/* Quote Text */}
      <QuoteMainContent quote={quote} />
      
      {/* Share/Embed Button */}
      <ShareEmbedButton 
        handleShareClick={handleShareClick} 
        showEmbedSection={showEmbedSection} 
      />
      
      {/* Embed Code Section */}
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
      
      {/* Source Section */}
      <SourceSection quote={quote} />
      
      {/* Context Section */}
      <ContextSection quote={quote} />
      
      {/* Verification Section */}
      <VerificationSection quote={quote} />
      
      {/* Related Content Section */}
      <RelatedContentSection quote={quote} />
      
      {/* Tags Section */}
      <TagsSection quote={quote} />
      
      {/* Citation Section */}
      <CitationSection quote={quote} />
      
      {/* Export Section */}
      <ExportSection quote={quote} />
      
      {/* "Cited By" Section */}
      <CitedBySection quote={quote} />
      
      {/* Actions */}
      <QuoteActions 
        handleShareClick={handleShareClick}
        toggleFavorite={toggleFavorite}
        favorite={favorite}
        shareCount={shareCount}
        favoriteCount={favoriteCount}
      />
    </div>
  );
}
