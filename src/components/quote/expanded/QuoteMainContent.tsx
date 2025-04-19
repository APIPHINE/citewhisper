
import { Quote } from '../../../utils/quotesData';
import { useState } from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface QuoteMainContentProps {
  quote: Quote;
}

export function QuoteMainContent({ quote }: QuoteMainContentProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en");
  
  // Check if quote has translations in either format
  const hasTranslation = Boolean(quote.translations?.fr) || 
    (Array.isArray(quote.translations) && quote.translations.some(t => t.language === "fr"));

  const getTranslation = () => {
    // Check array format first
    if (Array.isArray(quote.translations)) {
      const translation = quote.translations.find(t => t.language === currentLanguage);
      if (translation) {
        return {
          text: translation.text,
          source: translation.source
        };
      }
    }
    // Fallback to old format
    if (currentLanguage === "fr" && quote.translations?.fr) {
      return quote.translations.fr;
    }
    return null;
  };

  const translation = getTranslation();
  const displayText = currentLanguage === "en" ? quote.text : translation?.text || quote.text;
  const displaySource = currentLanguage === "en" ? quote.source : translation?.source || quote.source;
  
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <p className="text-balance text-xl leading-relaxed font-medium">
          "{displayText}"
        </p>
        {hasTranslation && (
          <div className="ml-4">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Source: {displaySource}
          {quote.translator && currentLanguage === "en" && (
            <span className="ml-1">(translated by {quote.translator})</span>
          )}
          {Array.isArray(quote.translations) && currentLanguage !== "en" && (
            quote.translations.find(t => t.language === currentLanguage)?.translator && (
              <span className="ml-1">
                (translated by {quote.translations.find(t => t.language === currentLanguage)?.translator})
              </span>
            )
          )}
        </p>
      </div>
    </div>
  );
}
