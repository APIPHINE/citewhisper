
import { useState } from 'react';
import { Quote } from '../../../utils/quotesData';
import { ShareEmbedButton } from './ShareEmbedButton';
import { LayeredQuoteDisplay } from './LayeredQuoteDisplay';
import { EmbedCodeSection } from '../EmbedCodeSection';
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
  const [embedStyle, setEmbedStyle] = useState<EmbedStyle>('card');
  const [embedColor, setEmbedColor] = useState<EmbedColor>('light');
  const [embedSize, setEmbedSize] = useState<EmbedSize>('medium');
  
  const handleShareClick = () => {
    setShowEmbedSection(!showEmbedSection);
  };
  
  return (
    <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
      <LayeredQuoteDisplay quote={quote} />
      
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
