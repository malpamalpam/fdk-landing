export type SiteId = 'fdk' | 'general' | 'tutors' | 'creative';

export interface SiteConfig {
  id: SiteId;
  domains: string[];
  htmlLang: string;
  phone: string;
  ogImage: string;
  ogLocale: string;
  ogSiteName: string;
  brandName: string;
  envPrefix: string;
}

export const SITES: Record<Exclude<SiteId, 'fdk'>, SiteConfig> = {
  general: {
    id: 'general',
    domains: ['inkubatory.com.pl'],
    htmlLang: 'pl',
    phone: '+48 575 594 500',
    ogImage: '/og-general.png',
    ogLocale: 'pl_PL',
    ogSiteName: 'Inkubatory.com.pl',
    brandName: 'Inkubator Przedsiębiorczości',
    envPrefix: 'GENERAL',
  },
  tutors: {
    id: 'tutors',
    domains: ['businessincubator.pl'],
    htmlLang: 'en',
    phone: '+48 794 731 000',
    ogImage: '/og-tutors.png',
    ogLocale: 'en_GB',
    ogSiteName: 'Business Incubator Poland',
    brandName: 'Business Incubator Poland',
    envPrefix: 'TUTORS',
  },
  creative: {
    id: 'creative',
    domains: ['biznesinkubator.pl'],
    htmlLang: 'ru',
    phone: '+48 794 731 000',
    ogImage: '/og-creative.png',
    ogLocale: 'ru_RU',
    ogSiteName: 'Бизнес-инкубатор',
    brandName: 'Бизнес-инкубатор Polska',
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
  const h = host.replace(/:\d+$/, '').replace(/^www\./, '').toLowerCase();
  return SITE_DOMAINS.get(h) ?? null;
}
