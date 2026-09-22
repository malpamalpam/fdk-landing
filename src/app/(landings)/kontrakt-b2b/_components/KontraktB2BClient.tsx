'use client';

import { useEffect } from 'react';
import LangProvider from './LangProvider';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import ModulesTicker from './ModulesTicker';
import Industries from './Industries';
import ThreeOptions from './ThreeOptions';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import Pricing from './Pricing';
import Comparison from './Comparison';
import Contact from './Contact';
import Faq from './Faq';
import Footer from './Footer';
import MobileCtaBar from './MobileCtaBar';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';
import { useLang } from './LangProvider';

function PageInner() {
  const { t } = useLang();

  useEffect(() => {
    captureAttribution();
    pushEvent(EVENTS.pageView, { landing_slug: 'landing1', segment: 'kontrakt-b2b' });
  }, []);

  return (
    <div className="min-h-screen pb-14 md:pb-0" style={{ background: '#F8FAFC' }}>
      <Header />
      <Hero />
      <Stats />
      <section className="py-6 overflow-hidden bg-white">
        <ModulesTicker modules={[...t.hero.modules]} />
      </section>
      <Industries />
      <ThreeOptions />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Comparison />
      <Contact />
      <Faq />
      <Footer />
      <MobileCtaBar label={t.nav.cta} />
    </div>
  );
}

export default function KontraktB2BClient() {
  return (
    <LangProvider>
      <PageInner />
    </LangProvider>
  );
}
