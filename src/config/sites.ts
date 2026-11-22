export type SiteId = 'fdk' | 'general' | 'tutors' | 'creative';

export interface SiteConfig {
  id: SiteId;
  domains: string[];
  htmlLang: string;
  phone: string;
  ogImage: string;
  envPrefix: string;
}

export const SITES: Record<Exclude<SiteId, 'fdk'>, SiteConfig> = {
  general: {
    id: 'general',
    domains: ['inkubatory.com.pl'],
    htmlLang: 'pl',
    phone: '+48 575 594 500',
    ogImage: '/og-general.png',
    envPrefix: 'GENERAL',
  },
  tutors: {
    id: 'tutors',
    domains: ['businessincubator.pl'],
    htmlLang: 'en',
    phone: '+48 794 731 000',
    ogImage: '/og-tutors.png',
    envPrefix: 'TUTORS',
  },
  creative: {
    id: 'creative',
    domains: ['biznesinkubator.pl'],
    htmlLang: 'ru',
    phone: '+48 794 731 000',
    ogImage: '/og-creative.png',
    envPrefix: 'CREATIVE',
  },
};

export const SITE_DOMAINS = new Map<string, Exclude<SiteId, 'fdk'>>();
for (const [id, cfg] of Object.entries(SITES)) {
  for (const d of cfg.domains) {
    SITE_DOMAINS.set(d, id as Exclude<SiteId, 'fdk'>);
  }
}

export function getSiteByHost(host: string): Exclude<SiteId, 'fdk'> | null {
  const h = host.replace(/:\d+$/, '').toLowerCase();
  return SITE_DOMAINS.get(h) ?? null;
}
