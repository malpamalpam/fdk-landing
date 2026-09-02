'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Dictionary } from '@/dictionaries/types';

const hookMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };

export default function Hero({ dict }: { dict: Dictionary }) {
  const searchParams = useSearchParams();
  const [hookIndex, setHookIndex] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('fdk_hook_variant');
    const param = searchParams.get('h')?.toLowerCase();

    let idx = 0;
    if (param && hookMap[param] !== undefined) {
      idx = hookMap[param];
      sessionStorage.setItem('fdk_hook_variant', param);
    } else if (stored && hookMap[stored] !== undefined) {
      idx = hookMap[stored];
    }

    setHookIndex(idx);
  }, [searchParams]);

  const hookVariantLetter = Object.entries(hookMap).find(([, v]) => v === hookIndex)?.[0] || 'a';

  return (
    <section
      className="relative min-h-[90vh] md:min-h-[85vh] flex items-center bg-ink"
      id="hero"
    >
      {/* Background image with overlay */}
      {/* TODO: Add hero.jpg to /public and use next/image:
          <Image src="/hero.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[rgba(26,30,35,0.75)]" />
      */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-ink/70"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-6 py-24 md:py-32">
        {/* Badge */}
        <div className="inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full mb-6">
          {dict.hero.badge}
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight max-w-4xl leading-tight">
          {dict.hero.hooks[hookIndex]}
        </h1>

        {/* Separator */}
        <div className="w-full max-w-xl h-px bg-white/30 my-6 md:my-8" />

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
          {dict.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center bg-brand hover:bg-brandDark text-white font-semibold text-lg px-8 py-4 rounded-[4px] transition-colors"
            data-track="cta_click"
            data-track-place="hero"
          >
            {dict.hero.ctaPrimary}
          </a>
          <a
            href="#korzysci"
            className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 rounded-[4px] transition-colors"
          >
            {dict.hero.ctaSecondary}
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 md:gap-16">
          {dict.hero.stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="text-3xl md:text-4xl font-extrabold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden input for hook variant — read by contact form */}
      <input type="hidden" id="hook-variant" value={hookVariantLetter} />
    </section>
  );
}
