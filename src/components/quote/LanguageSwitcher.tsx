
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "es" | "fr";
  onLanguageChange: (language: "en" | "es" | "fr") => void;
  hasTranslations: boolean;
  originalLanguage?: string;
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange,
  hasTranslations,
  originalLanguage 
}: LanguageSwitcherProps) {
  const [showAll, setShowAll] = useState(false);

  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case 'en': return 'ENG';
      case 'es': return 'SP';
      case 'fr': return 'FR';
      default: return lang.toUpperCase();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onLanguageChange('en')}
        className={`w-8 h-8 rounded-full ${currentLanguage === 'en' ? 'bg-secondary' : 'bg-secondary/50'} hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors`}
        aria-label="Switch to English"
      >
        ENG
      </button>

      {originalLanguage === 'es' && (
        <button
          onClick={() => onLanguageChange('es')}
          className={`w-8 h-8 rounded-full ${currentLanguage === 'es' ? 'bg-secondary' : 'bg-secondary/50'} hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors`}
          aria-label="Switch to Spanish"
        >
          SP
        </button>
      )}

      {hasTranslations && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors"
          aria-label="Show more languages"
        >
          <Plus size={14} />
        </button>
      )}

      {showAll && hasTranslations && (
        <button
          onClick={() => onLanguageChange('fr')}
          className={`w-8 h-8 rounded-full ${currentLanguage === 'fr' ? 'bg-secondary' : 'bg-secondary/50'} hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors`}
          aria-label="Switch to French"
        >
          FR
        </button>
      )}
    </div>
  );
}
