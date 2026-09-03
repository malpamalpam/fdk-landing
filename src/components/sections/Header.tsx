'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/types';

const locales = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
];

export default function Header({ dict, locale }: { dict: Dictionary; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    const qs = searchParams.toString();
    return qs ? `${newPath}?${qs}` : newPath;
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-[4px]"
      >
        {dict.a11y.skip}
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-ink shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1140px] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
          <Link href={`/${locale}`}>
            <Image
              src="/logo-white.png"
              alt="Firma Dla Każdego"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Phone — hidden on mobile */}
            <a
              href={`tel:${dict.header.phone.replace(/\s/g, '')}`}
              className="hidden md:flex items-center gap-2 text-white text-sm hover:text-brand transition-colors"
              aria-label={dict.header.phone}
              data-track="phone_click"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {dict.header.phone}
            </a>

            {/* CTA */}
            <a
              href="#kontakt"
              className="bg-brand hover:bg-brandDark text-white text-sm font-semibold px-4 py-2 rounded-[4px] transition-colors"
              data-track="cta_click"
              data-track-place="header"
            >
              <span className="hidden sm:inline">{dict.header.cta}</span>
              <span className="sm:hidden">{dict.sticky.cta}</span>
            </a>

            {/* Language switcher */}
            <div className="flex items-center gap-1" role="group" aria-label={dict.header.langLabel}>
              {locales.map((l) => (
                <Link
                  key={l.code}
                  href={switchLocale(l.code)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                    locale === l.code
                      ? 'text-brand'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-current={locale === l.code ? 'true' : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
