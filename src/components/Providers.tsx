"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

export default function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [theme, setThemeState] = useState<Theme>("light");

  // The inline script in layout.tsx already applied the saved values to <html>
  // before first paint. Here we only sync React state with it.
  useEffect(() => {
    const d = document.documentElement;
    setThemeState(d.dataset.theme === "dark" ? "dark" : "light");
    setLangState(d.lang === "en" ? "en" : "ar");
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const d = document.documentElement;
    d.lang = l;
    d.dir = l === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  }, []);

  const setTheme = useCallback((th: Theme) => {
    setThemeState(th);
    document.documentElement.dataset.theme = th;
    try {
      localStorage.setItem(THEME_KEY, th);
    } catch {}
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
