
import { useState } from 'react';
import { Plus, Bot, User, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Translation {
  language: string;
  text: string;
  translatorType?: 'human' | 'ai' | 'community';
  verified?: boolean;
  confidenceScore?: number;
}

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  translations?: Translation[];
  originalLanguage?: string;
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange,
  translations = [],
  originalLanguage 
}: LanguageSwitcherProps) {
  const [showAll, setShowAll] = useState(false);

  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case 'en': return 'ENG';
      case 'es': return 'ESP';
      case 'fr': return 'FR';
      case 'de': return 'DE';
      case 'it': return 'IT';
      case 'pt': return 'PT';
      case 'ru': return 'RU';
      case 'zh': return 'ZH';
      case 'ja': return 'JA';
      case 'ar': return 'AR';
      default: return lang.toUpperCase().slice(0, 3);
    }
  };

  const getTranslationQuality = (translation: Translation) => {
    if (translation.verified) {
      return <Shield size={8} className="text-green-500" />;
    }
    if (translation.translatorType === 'ai' && translation.confidenceScore && translation.confidenceScore < 0.7) {
      return <Bot size={8} className="text-amber-500" />;
    }
    if (translation.translatorType === 'ai') {
      return <Bot size={8} className="text-primary" />;
    }
    return <User size={8} className="text-foreground" />;
  };

  const availableLanguages = ['en'];
  if (originalLanguage && originalLanguage !== 'en') {
    availableLanguages.push(originalLanguage);
  }
  translations.forEach(t => {
    if (!availableLanguages.includes(t.language)) {
      availableLanguages.push(t.language);
    }
  });

  const visibleLanguages = showAll ? availableLanguages : availableLanguages.slice(0, 3);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {visibleLanguages.map((lang) => {
          const translation = translations.find(t => t.language === lang);
          const isActive = currentLanguage === lang;
          
          return (
            <Tooltip key={lang}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onLanguageChange(lang)}
                  className={`relative w-10 h-8 rounded-full ${
                    isActive ? 'bg-secondary' : 'bg-secondary/50'
                  } hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors`}
                  aria-label={`Switch to ${lang}`}
                >
                  <span>{getLanguageLabel(lang)}</span>
                  {translation && (
                    <div className="absolute -top-1 -right-1">
                      {getTranslationQuality(translation)}
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{lang === 'en' ? 'English (Original)' : `${lang.toUpperCase()} Translation`}</p>
                  {translation && (
                    <p className="text-xs text-muted-foreground">
                      {translation.translatorType === 'ai' ? 'AI Translated' : 
                       translation.translatorType === 'community' ? 'Community Translated' : 'Human Translated'}
                      {translation.verified && ' • Verified'}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {availableLanguages.length > 3 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors"
            aria-label="Show more languages"
          >
            <Plus size={14} />
          </button>
        )}

        {showAll && availableLanguages.length > 3 && (
          <button
            onClick={() => setShowAll(false)}
            className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors"
            aria-label="Show fewer languages"
          >
            <span className="text-xs">−</span>
          </button>
        )}
      </div>
    </TooltipProvider>
  );
}
