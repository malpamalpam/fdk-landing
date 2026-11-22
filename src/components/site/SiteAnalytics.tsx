'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

function getAdConsent(): boolean {
  try {
    const raw = localStorage.getItem('fdk_lp_consent');
    if (!raw) return false;
    const prefs = JSON.parse(raw);
    return prefs?.advertising === 'granted';
  } catch {
    return false;
  }
}

export default function SiteAnalytics({ site }: { site: string }) {
  const [adConsent, setAdConsent] = useState(false);

  useEffect(() => {
    setAdConsent(getAdConsent());
  }, []);

  const prefix = site.toUpperCase();
  const gtmId =
    (typeof process !== 'undefined' && process.env[`NEXT_PUBLIC_GTM_ID_${prefix}`]) ||
    process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId =
    (typeof process !== 'undefined' && process.env[`NEXT_PUBLIC_META_PIXEL_ID_${prefix}`]) ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokPixelId =
    (typeof process !== 'undefined' && process.env[`NEXT_PUBLIC_TIKTOK_PIXEL_ID_${prefix}`]) ||
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <>
      {/* Consent Mode v2 defaults */}
      <Script
        id={`consent-defaults-${site}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'granted',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* Restore saved consent */}
      <Script
        id={`consent-restore-${site}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var c = JSON.parse(localStorage.getItem('fdk_lp_consent'));
                if (c && c.analytics) {
                  gtag('consent', 'update', {
                    analytics_storage: c.analytics,
                    ad_storage: c.advertising,
                    ad_user_data: c.advertising,
                    ad_personalization: c.advertising
                  });
                }
              } catch(e){}
            })();
          `,
        }}
      />

      {/* GTM */}
      {gtmId && (
        <Script
          id={`gtm-${site}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}

      {/* Meta Pixel */}
      {adConsent && metaPixelId && (
        <Script
          id={`meta-pixel-${site}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${metaPixelId}');
              fbq('track','PageView');
            `,
          }}
        />
      )}

      {/* TikTok Pixel */}
      {adConsent && tiktokPixelId && (
        <Script
          id={`tiktok-pixel-${site}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off",
              "once","ready","alias","group","enableCookie","disableCookie"],
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(
              Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;
              i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=
              ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
              return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
              ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";
              o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];
              a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window,document,'ttq');
            `,
          }}
        />
      )}
    </>
  );
}
