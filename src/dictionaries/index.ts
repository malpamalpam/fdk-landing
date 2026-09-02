import type { Dictionary } from './types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  pl: () => import('./pl').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
  uk: () => import('./uk').then((m) => m.default),
  ru: () => import('./ru').then((m) => m.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loader = dictionaries[locale] || dictionaries.pl;
  return loader();
};

export type { Dictionary };
