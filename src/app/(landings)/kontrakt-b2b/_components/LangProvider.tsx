'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { dictionaries, LANG_HTML, type Dictionary, type Lang } from '../_content';

const STORAGE_KEY = 'fdk_lp_lang';
type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: Dictionary; mounted: boolean };
const Ctx = createContext<LangCtx>({ lang: 'PL', setLang: () => {}, t: dictionaries.PL, mounted: false });
export function useLang() { return useContext(Ctx); }

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('PL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && stored in dictionaries) setLangState(stored);
    } catch {}
    setMounted(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    document.documentElement.lang = LANG_HTML[l];
  }, []);

  useEffect(() => {
    if (mounted) document.documentElement.lang = LANG_HTML[lang];
  }, [lang, mounted]);

  return <Ctx.Provider value={{ lang, setLang, t: dictionaries[lang], mounted }}>{children}</Ctx.Provider>;
}
