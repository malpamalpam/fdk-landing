import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { getDictionary } from '@/dictionaries';
import Analytics from '@/components/Analytics';
import CookieBanner from '@/components/CookieBanner';
import UTMCapture from '@/components/UTMCapture';
import { DictionaryProvider } from '@/components/DictionaryProvider';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

const LOCALES = ['pl', 'en', 'uk', 'ru'] as const;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twoja-domena.pl';

  const alternates: Record<string, string> = {};
  for (const l of LOCALES) {
    alternates[l] = `${siteUrl}/${l}`;
  }
  alternates['x-default'] = `${siteUrl}/pl`;

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${siteUrl}/${locale}`,
      siteName: 'Firma Dla Każdego',
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
      locale: locale === 'uk' ? 'uk_UA' : locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'pl_PL',
      type: 'website',
    },
    alternates: {
      languages: alternates,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={montserrat.variable}>
      <body className="font-sans antialiased text-ink bg-white">
        <DictionaryProvider dict={dict}>
          <UTMCapture locale={locale} />
          {children}
          <CookieBanner dict={dict} />
          <Analytics />
        </DictionaryProvider>
      </body>
    </html>
  );
}
