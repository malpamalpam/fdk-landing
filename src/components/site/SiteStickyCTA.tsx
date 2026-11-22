'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SiteStickyCTA({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('[data-hero]');
      const kontakt = document.getElementById('kontakt');
      if (!hero) return;

      const heroBottom = hero.getBoundingClientRect().bottom;
      const kontaktVisible = kontakt
        ? kontakt.getBoundingClientRect().top < window.innerHeight
        : false;

      setVisible(heroBottom < 0 && !kontaktVisible);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-100 lg:hidden">
      <a
        href="#kontakt"
        className="flex items-center justify-center gap-2 bg-lime text-navy font-bold text-sm py-3 rounded-pill hover:bg-limeSoft transition-colors w-full"
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
