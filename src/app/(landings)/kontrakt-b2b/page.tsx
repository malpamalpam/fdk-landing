import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLandingBySlug } from '@/content/landings';
import LandingTemplate from '@/components/LandingTemplate';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.firmadlakazdego.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Kontrakt B2B bez zakładania firmy — Firma dla Każdego',
  description:
    'Dostałeś kontrakt B2B? Wystawiaj faktury przez inkubator — bez ZUS, bez księgowej, start w kilka dni. Sprawdzimy Twoją sytuację.',
  alternates: { canonical: '/kontrakt-b2b' },
  openGraph: {
    title: 'Kontrakt B2B bez zakładania firmy — Firma dla Każdego',
    description:
      'Dostałeś kontrakt B2B? Wystawiaj faktury przez inkubator — bez ZUS, bez księgowej, start w kilka dni. Sprawdzimy Twoją sytuację.',
    url: '/kontrakt-b2b',
  },
};

export default function KontraktB2BPage() {
  const landing = getLandingBySlug('landing1');
  if (!landing) notFound();
  return <LandingTemplate landing={landing} />;
}
