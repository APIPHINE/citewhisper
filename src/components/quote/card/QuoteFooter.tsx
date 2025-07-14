
import { Heart, Share2 } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface QuoteFooterProps {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  translations?: Array<{
    language: string;
    text: string;
    translatorType?: 'human' | 'ai' | 'community';
    verified?: boolean;
  }>;
  originalLanguage?: string;
  favoriteCount: number;
  shareCount: number;
  favorite: boolean;
}

export function QuoteFooter({ 
  currentLanguage, 
  setCurrentLanguage,
  translations = [],
  originalLanguage,
  favoriteCount,
  shareCount,
  favorite
}: QuoteFooterProps) {
  return (
    <div className="mt-6 flex items-center">
      {/* Language Switcher */}
      {(translations.length > 0 || originalLanguage === 'es') && (
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          translations={translations}
          originalLanguage={originalLanguage}
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
  );
}
