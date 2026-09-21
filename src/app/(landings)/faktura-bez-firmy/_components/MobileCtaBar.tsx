'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { GRAD } from '../_lib/tokens';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function MobileCtaBar({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;

    let heroVisible = true;
    let contactVisible = false;

    const update = () => setVisible(!heroVisible && !contactVisible);

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target.id === 'top') heroVisible = e.isIntersecting;
        if (e.target.id === 'contact') contactVisible = e.isIntersecting;
      }
      update();
    }, { threshold: 0.1 });

    observer.observe(hero);
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', boxShadow: '0 -2px 16px rgba(15,23,42,0.08)' }}
    >
      <div className="px-4 py-2.5">
        <button
          onClick={() => scrollTo('contact')}
          className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm text-white transition-all"
          style={{ background: GRAD, boxShadow: '0 2px 12px rgba(37,99,235,0.25)' }}
        >
          {label}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
