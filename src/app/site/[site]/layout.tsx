import { notFound } from 'next/navigation';
import { Readex_Pro } from 'next/font/google';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';
import '@/app/globals.css';

const readexPro = Readex_Pro({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-readex-pro',
  display: 'swap',
});

export function generateStaticParams() {
  return VALID_SITES.map((site) => ({ site }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const content = getSiteContent(site);
  if (!content) return notFound();

  const config = SITES[site as keyof typeof SITES];
  if (!config) return notFound();

  return (
    <html lang={config.htmlLang} className={readexPro.variable}>
      <body className="font-site antialiased text-navy bg-white">
        {children}
      </body>
    </html>
  );
}
