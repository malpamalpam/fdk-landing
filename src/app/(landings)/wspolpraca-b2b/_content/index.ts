import type { Dictionary, Lang } from './types';
import { pl } from './pl';
import { en } from './en';
import { ru } from './ru';
import { uk } from './uk';

export type { Dictionary, Lang };

export const dictionaries: Record<Lang, Dictionary> = { PL: pl, EN: en, RU: ru, UA: uk };

export const LANG_HTML: Record<Lang, string> = { PL: 'pl', EN: 'en', RU: 'ru', UA: 'uk' };
