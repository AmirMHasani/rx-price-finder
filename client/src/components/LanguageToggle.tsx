import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={language === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {language === "en" ? "EN" : "ES"}
      </span>
    </Button>
  );
}
