import { Suspense } from 'react';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import ForWho from '@/components/sections/ForWho';
import Benefits from '@/components/sections/Benefits';
import HowItWorks from '@/components/sections/HowItWorks';
import FAQ from '@/components/sections/FAQ';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import StickyCTA from '@/components/StickyCTA';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Suspense>
        <Header dict={dict} locale={locale} />
      </Suspense>
      <main id="main">
        <Suspense>
          <Hero dict={dict} segment="ogolny" locale={locale} />
        </Suspense>
        <ForWho dict={dict} />
        <Benefits dict={dict} />
        <HowItWorks dict={dict} />
        <FAQ dict={dict} />
        <ContactForm dict={dict} locale={locale} segment="ogolny" />
      </main>
      <Footer dict={dict} />
      <StickyCTA dict={dict} />
    </>
  );
}
