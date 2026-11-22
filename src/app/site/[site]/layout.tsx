import { notFound } from 'next/navigation';
import { Readex_Pro } from 'next/font/google';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';
import '@/app/globals.css';

const readexPro = Readex_Pro({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-lime focus:text-navy focus:px-4 focus:py-2 focus:rounded-pill focus:font-bold focus:text-sm"
        >
          {content.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
