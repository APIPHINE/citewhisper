
import { Quote } from '../../../utils/quotesData';
import { useState } from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface QuoteMainContentProps {
  quote: Quote;
}

export function QuoteMainContent({ quote }: QuoteMainContentProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en");
  const hasTranslation = Boolean(quote.translations?.fr) && quote.originalLanguage === "French";

  const displayText = currentLanguage === "en" ? quote.text : quote.translations?.fr?.text || quote.text;
  const displaySource = currentLanguage === "en" ? quote.source : quote.translations?.fr?.source || quote.source;
  
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
        </p>
      </div>
    </div>
  );
}
