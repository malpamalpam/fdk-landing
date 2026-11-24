'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import type { SiteContent } from '@/content/site-types';

export default function SiteHeader({ content, phone }: { content: SiteContent; phone: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shortCta = content.site === 'tutors' ? 'Consult' : content.site === 'creative' ? 'Консультация' : 'Konsultacja';
  const navLabel = content.site === 'tutors' ? 'Main navigation' : content.site === 'creative' ? 'Основная навигация' : 'Nawigacja główna';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy shadow-lg' : 'bg-navy/90 backdrop-blur-sm'
      }`}
    >
      <nav aria-label={navLabel} className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Image
          src="/logo-white.png"
          alt="Fundacja Firma Dla Każdego"
          width={140}
          height={32}
          className="h-7 w-auto"
        />

        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-lavender hover:text-white text-sm transition-colors min-h-11 inline-flex items-center hidden sm:inline-flex">
            {content.blog.navLabel}
          </Link>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-lavender hover:text-white text-sm transition-colors min-h-11"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{phone}</span>
          </a>
          <a
            href="#kontakt"
            className="bg-lime text-navy font-bold text-sm px-5 py-2 rounded-pill hover:bg-limeSoft transition-colors flex items-center gap-1.5 min-h-11"
          >
            <span className="sm:hidden">{shortCta}</span>
            <span className="hidden sm:inline">{content.hero.cta}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
