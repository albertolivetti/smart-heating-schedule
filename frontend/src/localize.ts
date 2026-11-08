import { en, type Strings } from "./translations/en";
import { it } from "./translations/it";

/** Keyed by Home Assistant language code. */
export const translations: Record<string, Strings> = { en, it };

const lookup = (strings: Strings | undefined, key: string): string | undefined => {
  let value: any = strings;
  for (const part of key.split(".")) value = value?.[part];
  return typeof value === "string" ? value : undefined;
};

export type Localize = (key: string, values?: Record<string, string>) => string;

/** Returns a translate function for a language, falling back to English. */
export const localizer = (language: string): Localize => {
  const strings = translations[language] ?? translations[language.split("-")[0]];
  return (key, values) => {
    let text = lookup(strings, key) ?? lookup(en, key) ?? key;
    for (const [name, value] of Object.entries(values ?? {})) {
      text = text.replaceAll(`{${name}}`, value);
    }
    return text;
  };
};
