import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

export type Language = "en" | "fr" | "ar";

export type TranslationKey = keyof typeof en;

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  fr,
  ar,
};

export const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

export const rtlLanguages: Language[] = ["ar"];

export function isRTL(lang: Language): boolean {
  return rtlLanguages.includes(lang);
}
