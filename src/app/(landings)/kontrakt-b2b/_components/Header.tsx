'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { NAVY, MID, SLATE_1, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';
import type { Lang } from '../_content';

function scrollTo(id: string, cb?: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  cb?.();
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: [string, string][] = [
    [t.nav.industries, 'industries'],
    [t.nav.howItWorks, 'how-it-works'],
    [t.nav.benefits, 'benefits'],
    [t.nav.pricing, 'pricing'],
    [t.nav.faq, 'faq'],
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(241,245,249,0.96)' : SLATE_1,
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(15,23,42,0.07)',
        boxShadow: scrolled ? '0 2px 16px rgba(15,23,42,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-16">
        <button onClick={() => scrollTo('top')} className="flex-shrink-0">
          <Image src="/img/logo-fdk.svg" alt="FDK Inkubator" width={140} height={36} className="h-9 w-auto" priority />
        </button>

        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-sm font-medium transition-colors whitespace-nowrap hover:text-[#0F172A]" style={{ color: MID }}>
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div ref={langRef} className="relative hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg border" style={{ borderColor: 'rgba(37,99,235,0.15)', background: SLATE_1 }}>
            {(['PL', 'EN', 'RU', 'UA'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className="px-2.5 py-1 text-xs font-bold rounded-md transition-all" style={lang === l ? { background: GRAD, color: '#fff', boxShadow: '0 1px 6px rgba(37,99,235,0.3)' } : { color: MID }}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo('contact')} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:shadow-lg" style={{ background: GRAD, boxShadow: '0 2px 12px rgba(37,99,235,0.25)' }}>
            {t.nav.cta}
          </button>
          <button onClick={() => scrollTo('contact')} className="sm:hidden text-[13px] font-semibold text-white px-3.5 py-2 rounded-xl" style={{ background: GRAD }}>
            <span className="sm:hidden">{lang === 'PL' ? 'Konsultacja' : lang === 'EN' ? 'Consult' : 'Консультація'}</span>
          </button>
          <button className="lg:hidden p-1.5 rounded-lg" style={{ color: NAVY }} onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-5 py-4 space-y-1" style={{ borderColor: 'rgba(37,99,235,0.08)' }}>
          {navLinks.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id, () => setMobileOpen(false))} className="block w-full text-left py-2.5 text-sm font-medium border-b last:border-0" style={{ color: MID, borderColor: 'rgba(15,23,42,0.04)' }}>
              {label}
            </button>
          ))}
          <div className="flex items-center gap-1.5 pt-3 flex-wrap">
            {(['PL', 'EN', 'RU', 'UA'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className="px-3 py-1 text-xs font-bold rounded-lg transition-all" style={lang === l ? { background: GRAD, color: '#fff' } : { color: MID, border: '1px solid rgba(37,99,235,0.2)' }}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo('contact', () => setMobileOpen(false))} className="w-full text-white font-semibold py-3 rounded-xl text-sm mt-2" style={{ background: GRAD }}>
            {t.nav.cta}
          </button>
        </div>
      )}
    </header>
  );
}
