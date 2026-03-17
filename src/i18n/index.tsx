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

interface I18nProviderProps {
  children: ReactNode;
}

const dictionaries: Record<Locale, Dictionary> = { en, es };
const defaultLocale: Locale = 'en';

const i18nContext = createContext<I18nContextValue | null>(null);

/**
 * Reads the preferred locale from browser storage with English fallback.
 * @returns Persisted locale or the default locale.
 */
function getStoredLocale(): Locale {
  const storedLocale = localStorage.getItem('app-locale');
  return storedLocale === 'es' ? 'es' : defaultLocale;
}

/**
 * Resolves a dotted translation key against a nested dictionary object.
 * @param dictionary Locale dictionary to traverse.
 * @param key Dot-separated translation key.
 * @returns Resolved translation or undefined.
 */
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

/**
 * Interpolates template placeholders like {{token}} using runtime params.
 * @param template Source translation template.
 * @param params Replacement tokens.
 * @returns Interpolated translation string.
 */
function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => params[token] ?? '');
}

/**
 * Provides translation context and locale persistence for the app tree.
 * @param props Provider props.
 * @param props.children Descendant React nodes that consume i18n context.
 * @returns Context provider wrapping child nodes.
 */
export function I18nProvider(props: I18nProviderProps) {
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
          resolveKey(dictionaries[locale], key) ??
          resolveKey(dictionaries[defaultLocale], key) ??
          key;
        return interpolate(translated, params);
      },
    }),
    [locale],
  );

  return <i18nContext.Provider value={value}>{props.children}</i18nContext.Provider>;
}

/**
 * Reads translation helpers and active locale from i18n context.
 * @returns Context value with locale state and translation function.
 */
export function useI18n(): I18nContextValue {
  const context = useContext(i18nContext);
  if (context === null) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
