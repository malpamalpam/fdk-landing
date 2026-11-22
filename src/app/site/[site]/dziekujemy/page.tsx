import type { Metadata } from 'next';
import { VALID_SITES } from '@/content/sites';
import SiteThankYouClient from './SiteThankYouClient';

export function generateStaticParams() {
  return VALID_SITES.map((site) => ({ site }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SiteThankYouPage() {
  return <SiteThankYouClient />;
}
