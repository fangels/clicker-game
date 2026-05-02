import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { engineMessages } from '@clicker-game/engine';
import type { GameDefinition } from '@clicker-game/engine';

const STORAGE_KEY = 'clicker-game.locale';

const detectLocale = (supported: string[], fallback: string): string => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    if (stored && supported.includes(stored)) return stored;
    const navLang = (window.navigator?.language ?? '').slice(0, 2);
    if (navLang && supported.includes(navLang)) return navLang;
  }
  return fallback;
};

export const setupI18n = async (defs: GameDefinition): Promise<typeof i18n> => {
  const supported = defs.meta.supportedLocales;
  const lng = detectLocale(supported, defs.meta.defaultLocale);

  const resources: Record<string, Record<string, Record<string, string>>> = {};
  for (const locale of supported) {
    resources[locale] = {
      translation: {
        ...(engineMessages[locale] ?? engineMessages[defs.meta.defaultLocale] ?? {}),
        ...(defs.messages[locale] ?? {}),
      },
    };
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: defs.meta.defaultLocale,
    interpolation: { escapeValue: false },
    returnNull: false,
    nsSeparator: false,
    keySeparator: false,
  });

  return i18n;
};

export const persistLocale = (locale: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem(STORAGE_KEY, locale);
  }
};
