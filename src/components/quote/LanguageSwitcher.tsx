
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "fr";
  onLanguageChange: (language: "en" | "fr") => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-4 right-4 gap-1.5"
      onClick={() => onLanguageChange(currentLanguage === "en" ? "fr" : "en")}
    >
      <Languages size={16} />
      {currentLanguage === "en" ? "FR" : "ENG"}
    </Button>
  );
}
