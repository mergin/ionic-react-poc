import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import en from './locales/en.json';
import es from './locales/es.json';

type Locale = 'en' | 'es';

interface Dictionary {
  [key: string]: string | Dictionary;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const dictionaries: Record<Locale, Dictionary> = { en, es };
const defaultLocale: Locale = 'en';

const i18nContext = createContext<I18nContextValue | null>(null);

function getStoredLocale(): Locale {
  const storedLocale = localStorage.getItem('app-locale');
  return storedLocale === 'es' ? 'es' : defaultLocale;
}

function resolveKey(dictionary: Dictionary, key: string): string | undefined {
  const chunks = key.split('.');
  let current: string | Dictionary | undefined = dictionary;

  for (const chunk of chunks) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    current = current[chunk];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => params[token] ?? '');
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale: Locale) => {
        localStorage.setItem('app-locale', nextLocale);
        setLocaleState(nextLocale);
      },
      t: (key: string, params?: Record<string, string>) => {
        const translated =
          resolveKey(dictionaries[locale], key) ?? resolveKey(dictionaries[defaultLocale], key) ?? key;
        return interpolate(translated, params);
      },
    }),
    [locale],
  );

  return <i18nContext.Provider value={value}>{children}</i18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(i18nContext);
  if (context === null) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
