"use client";

import { useLanguage } from "@/context/LanguageContext";
import { languages, type Language } from "@/i18n";

interface LanguageSwitcherProps {
  /** When true, uses light text (for transparent/dark navbar backgrounds) */
  light?: boolean;
}

export default function LanguageSwitcher({ light = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-current/10 overflow-hidden">
      {languages.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`px-2 py-1 text-[11px] font-semibold tracking-wide transition-all duration-200 ${
              isActive
                ? "bg-[#ff5c00] text-white"
                : light
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-[#0a0a0a]/60 hover:text-[#0a0a0a] hover:bg-[#0a0a0a]/5"
            }`}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
