import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from '../../utils/quotesData';
import { useFormatDate } from '../../hooks/use-format-date';
import { useState } from 'react';
import { VerificationBadge } from './card/VerificationBadge';
import { ActionButtons } from './card/ActionButtons';
import { QuoteText } from './card/QuoteText';
import { QuoteMetadata } from './card/QuoteMetadata';
import { QuoteFooter } from './card/QuoteFooter';

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
  isAdmin?: boolean;
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
  favoriteCount,
  isAdmin = false
}: QuoteCardMainProps) {
  const { formatDate } = useFormatDate();
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  
  if (expanded) return null;

  // Handle translations and original text
  const getTranslation = () => {
    if (currentLanguage === 'es' && quote.originalLanguage === 'es') {
      return { text: quote.originalText, source: quote.sourceInfo?.title };
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
    (quote.sourceInfo?.title || quote.source) : 
    (translation?.source || quote.sourceInfo?.title || quote.source);
    
  const isVerified = Boolean(quote.evidenceImage);
  const hasTranslation = (
    !Array.isArray(quote.translations) && quote.translations && !!quote.translations.fr
  ) || (
    Array.isArray(quote.translations) && quote.translations.some(t => t.language === "fr")
  );

  const displayDate = formatDate(quote.date);

  return (
    <AnimatePresence>
      {!expanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1,
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          transition={{ 
            duration: 0.5, 
            ease: 'easeInOut',
            delay: delay * 0.08 
          }}
          className={`group relative ${isAnyExpanded && !expanded ? 'hidden' : ''}`}
          style={{ height: 'fit-content' }} 
        >
          <motion.div 
            className="rounded-2xl transition-all duration-350 ease-apple border-border/80 hover:border-accent/50 bg-white p-6 shadow-subtle hover:shadow-elevation border-2 overflow-hidden h-full relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Action Buttons and Verification Status in a column on the right */}
            <div className="absolute top-4 right-4 flex flex-col items-center gap-3">
              {/* Verification Status */}
              <VerificationBadge isVerified={isVerified} />
              
              {/* Action Buttons */}
              <ActionButtons 
                favorite={favorite}
                toggleFavorite={toggleFavorite}
                handleShare={handleShare}
                toggleExpanded={toggleExpanded}
                isAdmin={isAdmin}
              />
            </div>

            {/* Quote Text */}
            <QuoteText text={displayText} />

            {/* Quote Metadata */}
            <QuoteMetadata 
              author={quote.author}
              date={displayDate}
              source={displaySource}
              translator={quote.translator}
              currentLanguage={currentLanguage}
              topics={quote.topics}
              theme={quote.theme}
            />
            
            {/* www.CiteQuotes.com branding */}
            <div className="absolute bottom-2 right-4 text-xs text-muted-foreground/60 select-none pointer-events-none">
              www.CiteQuotes.com
            </div>

            {/* Footer with Language Switcher and Counts */}
            <QuoteFooter 
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
              translations={Array.isArray(quote.translations) ? quote.translations : []}
              originalLanguage={quote.originalLanguage}
              favoriteCount={favoriteCount}
              shareCount={shareCount}
              favorite={favorite}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
