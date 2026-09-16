'use client';

import { useEffect } from 'react';
import LangProvider from './LangProvider';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import ForWhom from './ForWhom';
import RolesSplit from './RolesSplit';
import HowItWorks from './HowItWorks';
import WhyUs from './WhyUs';
import NotWeDo from './NotWeDo';
import Services from './Services';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

export default function WspolpracaClient() {
  useEffect(() => {
    captureAttribution();
    pushEvent(EVENTS.pageView, { landing_slug: 'landing3', segment: 'wspolpraca-b2b' });
  }, []);

  return (
    <LangProvider>
      <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
        <Header />
        <Hero />
        <Stats />
        <ForWhom />
        <RolesSplit />
        <HowItWorks />
        <WhyUs />
        <NotWeDo />
        <Services />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </LangProvider>
  );
}
