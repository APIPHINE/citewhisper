
import { Heart, Share2, ChevronDown, Circle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface QuoteCardMainProps {
  quote: Quote;
  delay: number;
  isAnyExpanded: boolean;
  expanded: boolean;
  favorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  toggleExpanded: (scrollToCitedBy?: boolean) => void;
  shareCount: number;
  favoriteCount: number;
}

export function QuoteCardMain({
  quote,
  delay,
  isAnyExpanded,
  expanded,
  favorite,
  toggleFavorite,
  handleShare,
  toggleExpanded,
  shareCount,
  favoriteCount
}: QuoteCardMainProps) {
  const { formatDate } = useFormatDate();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "es" | "fr">("en");
  
  if (expanded) return null;

  // Handle translations and original text
  const getTranslation = () => {
    if (currentLanguage === 'es' && quote.originalLanguage === 'es') {
      return { text: quote.originalText, source: quote.originalSource?.title };
    }
    if (Array.isArray(quote.translations)) {
      const translation = quote.translations.find(t => t.language === currentLanguage);
      if (translation) {
        return translation;
      }
    }
    if (!Array.isArray(quote.translations) && quote.translations && currentLanguage === "fr") {
      return quote.translations.fr;
    }
    return null;
  };

  const translation = getTranslation();
  const displayText = currentLanguage === "en" ? 
    quote.text : 
    (translation?.text || quote.text);
    
  const displaySource = currentLanguage === "en" ? 
    quote.source : 
    (translation?.source || quote.source);
    
  const isVerified = Boolean(quote.evidenceImage);
  const hasTranslation = (
    !Array.isArray(quote.translations) && quote.translations && !!quote.translations.fr
  ) || (
    Array.isArray(quote.translations) && quote.translations.some(t => t.language === "fr")
  );

  const displayDate = formatDate(quote.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1,
        y: 0 
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: delay * 0.08 
      }}
      className={`group relative ${isAnyExpanded && !expanded ? 'hidden' : ''}`}
      style={{ height: 'fit-content' }} 
    >
      <div className="rounded-2xl transition-all duration-350 ease-apple border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2 overflow-hidden h-full relative">
        {/* Action Buttons and Verification Status in a column on the right */}
        <div className="absolute top-4 right-4 flex flex-col items-center gap-3">
          {/* Verification Status */}
          {isVerified ? (
            <div className="relative">
              <Circle size={24} className="text-[#6dbb6c] fill-[#6dbb6c]" />
              <Check size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          ) : (
            <Circle size={24} className="text-[#ea384c] fill-[#ea384c]" />
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-1">
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={20} 
                className={favorite ? "fill-accent text-accent" : "text-foreground"} 
              />
            </button>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Share this quote"
            >
              <Share2 size={20} />
            </button>
            
            {/* Expand Button */}
            <button
              onClick={() => toggleExpanded()}
              className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Expand quote details"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* Quote Text */}
        <div className="pr-20">
          <p className="text-lg leading-relaxed mb-2">
            "{displayText}"
          </p>
        </div>

        {/* Updated display order for Author, Date, Source */}
        <div className="mt-4">
          <p className="font-semibold text-base text-foreground">{quote.author}</p>
          <p className="text-sm text-muted-foreground mb-1">{displayDate}</p>
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Source:</span> {displaySource}
            {quote.translator && currentLanguage === "en" && (
              <span className="ml-1">(translated by {quote.translator})</span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quote.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="secondary" className="bg-secondary/80">
                {topic}
              </Badge>
            ))}
            {quote.theme && (
              <Badge variant="outline" className="border-accent/30 text-accent">
                {quote.theme}
              </Badge>
            )}
          </div>
        </div>
        
        {/* www.CiteQuotes.com branding */}
        <div className="absolute bottom-2 right-4 text-xs text-muted-foreground/60 select-none pointer-events-none">
          www.CiteQuotes.com
        </div>

        {/* Language Switcher */}
        <div className="mt-6 flex items-center">
          {(hasTranslation || quote.originalLanguage === 'es') && (
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              hasTranslations={hasTranslation}
              originalLanguage={quote.originalLanguage}
            />
          )}
          
          {/* Display counts */}
          <div className="ml-auto flex items-center gap-4">
            {favoriteCount > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Heart size={14} className={favorite ? "fill-accent text-accent" : ""} /> 
                {favoriteCount}
              </span>
            )}
            
            {shareCount > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Share2 size={14} /> 
                {shareCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
