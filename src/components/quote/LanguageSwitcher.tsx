
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "fr";
  onLanguageChange: (language: "en" | "fr") => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <button
      onClick={() => onLanguageChange(currentLanguage === "en" ? "fr" : "en")}
      className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xs font-medium transition-colors"
      aria-label={`Switch to ${currentLanguage === "en" ? "French" : "English"}`}
    >
      {currentLanguage === "en" ? "FR" : "ENG"}
    </button>
  );
}
