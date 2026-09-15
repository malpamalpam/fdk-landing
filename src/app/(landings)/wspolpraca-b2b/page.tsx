import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLandingBySlug } from '@/content/landings';
import LandingTemplate from '@/components/LandingTemplate';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.firmadlakazdego.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Faktura VAT od podwykonawcy bez działalności | Firma dla Każdego',
  description:
    'Wasz współpracownik nie ma firmy? Wystawimy fakturę VAT za jego usługi. Bez umowy o pracę, bez ZUS po Waszej stronie.',
  alternates: { canonical: '/wspolpraca-b2b' },
  openGraph: {
    title: 'Faktura VAT od podwykonawcy bez działalności | Firma dla Każdego',
    description:
      'Wasz współpracownik nie ma firmy? Wystawimy fakturę VAT za jego usługi. Bez umowy o pracę, bez ZUS po Waszej stronie.',
    url: '/wspolpraca-b2b',
  },
};

export default function WspolpracaB2BPage() {
  const landing = getLandingBySlug('landing3');
  if (!landing) notFound();
  return <LandingTemplate landing={landing} />;
}
