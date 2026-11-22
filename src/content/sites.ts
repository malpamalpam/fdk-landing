import type { SiteId } from '@/config/sites';
import type { SiteContent } from './site-types';
import { general } from './general';
import { tutors } from './tutors';
import { creative } from './creative';

const SITE_CONTENT: Record<Exclude<SiteId, 'fdk'>, SiteContent> = {
  general,
  tutors,
  creative,
};

export function getSiteContent(site: string): SiteContent | null {
  return SITE_CONTENT[site as Exclude<SiteId, 'fdk'>] ?? null;
}

export const VALID_SITES = Object.keys(SITE_CONTENT) as Exclude<SiteId, 'fdk'>[];
