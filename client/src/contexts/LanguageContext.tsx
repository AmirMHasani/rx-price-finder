import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import type { TranslationKeys } from "../i18n/en";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, TranslationKeys> = {
  en,
  es,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to English
    const saved = localStorage.getItem("language");
    return (saved === "es" ? "es" : "en") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Reload page to apply translations
    window.location.reload();
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper function to replace placeholders in translations
export function translate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  let result = text;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{{${key}}}`, String(value));
  });
  return result;
}
