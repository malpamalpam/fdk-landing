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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="pl" className={montserrat.variable}>
      <body className="font-sans antialiased text-ink bg-white">
        <Script
          id="lp-consent-defaults"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent','default',{
                'ad_storage':'denied','ad_user_data':'denied',
                'ad_personalization':'denied','analytics_storage':'denied',
                'functionality_storage':'granted','security_storage':'granted',
                'wait_for_update':500
              });
              (function(){try{var c=JSON.parse(localStorage.getItem('fdk_lp_consent'));
              if(c){gtag('consent','update',{analytics_storage:c.analytics||'denied',
              ad_storage:c.advertising||'denied',ad_user_data:c.advertising||'denied',
              ad_personalization:c.advertising||'denied'});}}catch(e){}})();
            `,
          }}
        />
        {gtmId && (
          <Script
            id="lp-gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {children}
        <LandingConsentBanner />
      </body>
    </html>
  );
}
