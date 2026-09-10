import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { getLandingBySlug, getAllSlugs } from '@/content/landings';
import LandingConsentBanner from '@/components/LandingConsentBanner';
import '../../globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingBySlug(slug);

  if (!landing) {
    return { title: 'Nie znaleziono strony' };
  }

  return {
    title: landing.meta.title,
    description: landing.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: landing.meta.title,
      description: landing.meta.description,
    },
  };
}

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={montserrat.variable}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PD48WSK');`,
          }}
        />
      </head>
      <body className="font-sans antialiased text-ink bg-white">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PD48WSK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <LandingConsentBanner />
      </body>
    </html>
  );
}
