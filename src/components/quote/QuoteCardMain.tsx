
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
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en");
  
  if (expanded) return null;

  const isVerified = Boolean(quote.evidenceImage);
  const hasTranslation = Boolean(quote.translations?.fr) && quote.originalLanguage === "French";
  
  // Display logic
  const displayText = currentLanguage === "en" ? quote.text : quote.translations?.fr?.text || quote.text;
  const displaySource = currentLanguage === "en" ? quote.source : quote.translations?.fr?.source || quote.source;
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
      {/* Verification Status */}
      <div className="absolute top-4 right-4 z-10">
        {isVerified ? (
          <div className="relative">
            <Circle size={24} className="text-[#6dbb6c] fill-[#6dbb6c]" />
            <Check size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        ) : (
          <Circle size={24} className="text-[#ea384c] fill-[#ea384c]" />
        )}
      </div>

      <div className="rounded-2xl transition-all duration-350 ease-apple border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2 overflow-hidden h-full relative">
        {/* Quote Text */}
        <div className="pr-12">
          <p className="text-lg leading-relaxed mb-2">
            "{displayText}"
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Source: {displaySource}
            {quote.translator && currentLanguage === "en" && (
              <span className="ml-1">(translated by {quote.translator})</span>
            )}
          </p>
        </div>
        
        {/* Quote Meta */}
        <div className="mt-6 flex items-start justify-between">
          <div>
            <p className="font-medium text-foreground">{quote.author}</p>
            <p className="text-sm text-muted-foreground">{displayDate}</p>
            
            {/* Topics & Theme */}
            <div className="mt-3 flex flex-wrap gap-2">
              {quote.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="bg-secondary/80">
                  {topic}
                </Badge>
              ))}
              <Badge variant="outline" className="border-accent/30 text-accent">
                {quote.theme}
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            {hasTranslation && (
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            )}
            
            {/* Favorite Button */}
            <div className="flex items-center gap-2">
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
              <span className="text-sm text-muted-foreground">
                {favoriteCount}
              </span>
            </div>
            
            {/* Share Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="button-effect p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Share this quote"
              >
                <Share2 size={20} />
              </button>
              <span className="text-sm text-muted-foreground">
                {shareCount}
              </span>
            </div>
            
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
      </div>
    </motion.div>
  );
}
