"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  useMemo,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";
export type Theme = "light" | "dark";
export type Bilingual = { ar: string; en: string };

const THEME_KEY = "automed-theme";
const LANG_KEY = "automed-lang";

type Ctx = {
  lang: Lang;
  theme: Theme;
  /** pick the right text: t({ ar: "...", en: "..." }) */
  t: (text: Bilingual) => string;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
};

const PrefsContext = createContext<Ctx | null>(null);

const subscribe = (notify: () => void) => {
  window.addEventListener("automed-preferences", notify);
  return () => window.removeEventListener("automed-preferences", notify);
};
const notifyPreferences = () => window.dispatchEvent(new Event("automed-preferences"));

export default function Providers({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribe,
    () => document.documentElement.lang === "en" ? "en" : "ar", () => "ar");
  const theme = useSyncExternalStore<Theme>(subscribe,
    () => document.documentElement.dataset.theme === "dark" ? "dark" : "light", () => "light");

  const setLang = useCallback((l: Lang) => {
    const d = document.documentElement;
    d.lang = l;
    d.dir = l === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
    notifyPreferences();
  }, []);

  const setTheme = useCallback((th: Theme) => {
    document.documentElement.dataset.theme = th;
    try {
      localStorage.setItem(THEME_KEY, th);
    } catch {}
    notifyPreferences();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      theme,
      t: (text) => text[lang],
      setLang,
      setTheme,
      toggleLang: () => setLang(lang === "ar" ? "en" : "ar"),
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [lang, theme, setLang, setTheme]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("useI18n must be used inside <Providers>");
  return ctx;
}
