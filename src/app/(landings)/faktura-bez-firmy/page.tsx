import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLandingBySlug } from '@/content/landings';
import LandingTemplate from '@/components/LandingTemplate';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.firmadlakazdego.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Faktura bez własnej firmy — dla wolnych zawodów | Firma dla Każdego',
  description:
    'Wystawiaj faktury bez zakładania działalności. Dla tłumaczy, lektorów, grafików i programistów. Sprawdź, czy to się opłaca.',
  alternates: { canonical: '/faktura-bez-firmy' },
  openGraph: {
    title: 'Faktura bez własnej firmy — dla wolnych zawodów | Firma dla Każdego',
    description:
      'Wystawiaj faktury bez zakładania działalności. Dla tłumaczy, lektorów, grafików i programistów. Sprawdź, czy to się opłaca.',
    url: '/faktura-bez-firmy',
  },
};

export default function FakturaBezFirmyPage() {
  const landing = getLandingBySlug('landing2');
  if (!landing) notFound();
  return <LandingTemplate landing={landing} />;
}
