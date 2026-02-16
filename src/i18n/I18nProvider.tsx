import { createContext, useContext, useMemo, useState } from 'react';

type Locale = 'es' | 'en';

type Messages = {
  es: string;
  en: string;
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  tr: (messages: Messages) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'es';
  }

  const storedLocale = window.localStorage.getItem('studio26-locale');
  if (storedLocale === 'es' || storedLocale === 'en') {
    return storedLocale;
  }

  const browserLocale = window.navigator.language.toLowerCase();
  return browserLocale.startsWith('es') ? 'es' : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('studio26-locale', nextLocale);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  const tr = (messages: Messages) => messages[locale] ?? messages.es;

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, tr }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
