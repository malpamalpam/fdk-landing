import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import { SEGMENTS } from '@/dictionaries/types';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import ForWho from '@/components/sections/ForWho';
import Benefits from '@/components/sections/Benefits';
import HowItWorks from '@/components/sections/HowItWorks';
import FAQ from '@/components/sections/FAQ';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import StickyCTA from '@/components/StickyCTA';

const LOCALES = ['pl', 'en', 'uk', 'ru'] as const;

export async function generateStaticParams() {
  const params: { locale: string; segment: string }[] = [];
  for (const locale of LOCALES) {
    for (const segment of SEGMENTS) {
      params.push({ locale, segment });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; segment: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    robots: { index: false, follow: true },
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ locale: string; segment: string }>;
}) {
  const { locale, segment } = await params;

  if (!SEGMENTS.includes(segment as typeof SEGMENTS[number])) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <>
      <Suspense>
        <Header dict={dict} locale={locale} />
      </Suspense>
      <main id="main">
        <Suspense>
          <Hero dict={dict} segment={segment} locale={locale} />
        </Suspense>
        <ForWho dict={dict} />
        <Benefits dict={dict} />
        <HowItWorks dict={dict} />
        <FAQ dict={dict} />
        <ContactForm dict={dict} locale={locale} segment={segment} />
      </main>
      <Footer dict={dict} />
      <StickyCTA dict={dict} />
    </>
  );
}
