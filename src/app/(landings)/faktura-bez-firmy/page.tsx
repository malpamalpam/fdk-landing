import type { Metadata } from 'next';
import FakturaBezFirmyClient from './_components/FakturaBezFirmyClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.firmadlakazdego.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Faktura bez firmy – wystawiaj faktury bez działalności | Fundacja Firma dla każdego',
  description: 'Wystawiaj faktury bez zakładania działalności. Dla tłumaczy, lektorów, grafików i programistów. Sprawdź, czy to się opłaca.',
  alternates: { canonical: '/faktura-bez-firmy' },
  openGraph: {
    title: 'Faktura bez firmy – wystawiaj faktury bez działalności | Fundacja Firma dla każdego',
    description: 'Wystawiaj faktury bez zakładania działalności. Dla tłumaczy, lektorów, grafików i programistów. Sprawdź, czy to się opłaca.',
    url: '/faktura-bez-firmy',
  },
};

export default function FakturaBezFirmyPage() {
  return <FakturaBezFirmyClient />;
}
