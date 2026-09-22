import type { Metadata } from 'next';
import KontraktB2BClient from './_components/KontraktB2BClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.firmadlakazdego.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Kontrakt B2B bez zakładania firmy — Firma dla Każdego',
  description:
    'Dostałeś ofertę B2B? Zacznij pracę bez zakładania firmy. Fakturuj od razu przez inkubator — bez ZUS, bez księgowej, nawet w 1 dzień roboczy.',
  alternates: { canonical: '/kontrakt-b2b' },
  openGraph: {
    title: 'Kontrakt B2B bez zakładania firmy — Firma dla Każdego',
    description:
      'Dostałeś ofertę B2B? Zacznij pracę bez zakładania firmy. Fakturuj od razu przez inkubator — bez ZUS, bez księgowej, nawet w 1 dzień roboczy.',
    url: '/kontrakt-b2b',
  },
};

export default function KontraktB2BPage() {
  return <KontraktB2BClient />;
}
