'use client';

import { useEffect } from 'react';
import LangProvider from './LangProvider';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import ModulesTicker from './ModulesTicker';
import Industries from './Industries';
import HowItWorks from './HowItWorks';
import Exclusions from './Exclusions';
import Benefits from './Benefits';
import Contact from './Contact';
import Faq from './Faq';
import Footer from './Footer';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';
import { useLang } from './LangProvider';

function PageInner() {
  const { t } = useLang();

  useEffect(() => {
    captureAttribution();
    pushEvent(EVENTS.pageView, { landing_slug: 'landing2', segment: 'faktura-bez-firmy' });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <Header />
      <Hero />
      <Stats />
      <section className="py-6 overflow-hidden bg-white">
        <ModulesTicker modules={[...t.hero.modules]} />
      </section>
      <Industries />
      <HowItWorks />
      <Exclusions />
      <Benefits />
      <Contact />
      <Faq />
      <Footer />
    </div>
  );
}

export default function FakturaBezFirmyClient() {
  return (
    <LangProvider>
      <PageInner />
    </LangProvider>
  );
}
