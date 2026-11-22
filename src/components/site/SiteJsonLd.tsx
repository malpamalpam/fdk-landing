import type { SiteConfig } from '@/config/sites';
import type { SiteContent } from '@/content/site-types';

interface SiteJsonLdProps {
  content: SiteContent;
  config: SiteConfig;
}

export default function SiteJsonLd({ content, config }: SiteJsonLdProps) {
  const url = `https://${config.domains[0]}`;

  const organization = {
    '@type': 'Organization',
    name: 'Fundacja Firma Dla Każdego',
    url,
    telephone: config.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Lwowska 17/4',
      addressLocality: 'Warszawa',
      postalCode: '00-660',
      addressCountry: 'PL',
    },
    sameAs: [
      'https://www.facebook.com/firmadlakazdego',
      'https://www.instagram.com/firmadlakazdego/',
      'https://t.me/firmadlakazdego',
    ],
  };

  const service = {
    '@type': 'Service',
    name: content.meta.title,
    provider: {
      '@type': 'Organization',
      name: 'Fundacja Firma Dla Każdego',
    },
    areaServed: 'PL',
    offers: {
      '@type': 'Offer',
      price: '400',
      priceCurrency: 'PLN',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '400',
        priceCurrency: 'PLN',
        billingDuration: 'P1M',
      },
    },
  };

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const webSite = {
    '@type': 'WebSite',
    url,
    name: config.ogSiteName,
    inLanguage: config.htmlLang,
  };

  const jsonLd = [
    { '@context': 'https://schema.org', ...organization },
    { '@context': 'https://schema.org', ...service },
    { '@context': 'https://schema.org', ...faqPage },
    { '@context': 'https://schema.org', ...webSite },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
