
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { ShareEmbedButton } from './ShareEmbedButton';
import { QuoteMainContent } from './QuoteMainContent';
import { EmbedCodeSection } from '../EmbedCodeSection';
import { SourceSection } from '../SourceSection';
import { ContextSection } from '../ContextSection';
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
      <QuoteMainContent quote={quote} />
      
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
      
      <SourceSection quote={quote} />
      <ContextSection quote={quote} />
      <RelatedContentSection quote={quote} />
      <TagsSection quote={quote} />
      <CitationSection quote={quote} />
      <ExportSection quote={quote} />
      <CitedBySection quote={quote} />
      
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
