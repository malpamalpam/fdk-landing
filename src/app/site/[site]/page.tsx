import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';
import SiteHeader from '@/components/site/SiteHeader';
import SiteStats from '@/components/site/SiteStats';
import SiteForWho from '@/components/site/SiteForWho';
import SiteHowItWorks from '@/components/site/SiteHowItWorks';
import SiteBenefits from '@/components/site/SiteBenefits';
import SiteCompare from '@/components/site/SiteCompare';
import SiteFAQ from '@/components/site/SiteFAQ';
import SiteContact from '@/components/site/SiteContact';
import SiteFooter from '@/components/site/SiteFooter';
import SiteLeadForm from '@/components/site/SiteLeadForm';
import SiteConsentBanner from '@/components/site/SiteConsentBanner';
import SiteStickyCTA from '@/components/site/SiteStickyCTA';
import SiteAnalytics from '@/components/site/SiteAnalytics';
import UTMCapture from '@/components/UTMCapture';
import SiteJsonLd from '@/components/site/SiteJsonLd';
import SiteHookSelector from './SiteHookSelector';

export function generateStaticParams() {
  return VALID_SITES.map((site) => ({ site }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}): Promise<Metadata> {
  const { site } = await params;
  const content = getSiteContent(site);
  if (!content) return {};

  const config = SITES[site as keyof typeof SITES];
  if (!config) return {};

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isVercel = host.includes('vercel.app') || host.includes('localhost');
  const canonical = isVercel ? undefined : `https://${config.domains[0]}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    ...(canonical && {
      alternates: { canonical },
    }),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: canonical,
      type: 'website',
      locale: config.ogLocale,
      siteName: config.ogSiteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
    },
    other: {
      'geo.region': 'PL',
      'geo.placename': 'Warszawa',
    },
    icons: {
      icon: '/icon.png',
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: isVercel ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string }>;
  searchParams: Promise<{ h?: string }>;
}) {
  const { site } = await params;
  const { h } = await searchParams;
  const content = getSiteContent(site);
  if (!content) return notFound();

  const config = SITES[site as keyof typeof SITES];
  if (!config) return notFound();

  const hookMap: Record<string, number> = { a: 0, b: 1, c: 2 };
  const hookIndex = hookMap[h || 'a'] ?? 0;

  return (
    <>
      <SiteJsonLd content={content} config={config} />
      <SiteHeader content={content} phone={config.phone} />

      <main id="main">
        <SiteHookSelector content={content} hookIndex={hookIndex} />

        <SiteStats stats={content.stats} />

        <SiteForWho data={content.who} />

        <SiteHowItWorks data={content.how} />

        <SiteBenefits data={content.benefits} />

        {content.compare && <SiteCompare data={content.compare} />}

        <SiteFAQ data={content.faq} />

        <SiteContact
          content={content}
          phone={config.phone}
          contactTitle={content.contact.title}
          formSlot={<SiteLeadForm content={content} variant="full" />}
        />
      </main>

      <SiteFooter content={content} phone={config.phone} />

      <SiteStickyCTA label={content.stickyCtaLabel} />
      <SiteConsentBanner content={content} />
      <SiteAnalytics site={site} />
      <UTMCapture segment={site} locale={config.htmlLang} hookVariant={h || 'a'} />
    </>
  );
}
