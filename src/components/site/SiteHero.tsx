'use client';

import { ArrowRight, Check } from 'lucide-react';
import type { SiteContent } from '@/content/site-types';

export default function SiteHero({
  content,
  hookIndex = 0,
  formSlot,
}: {
  content: SiteContent;
  hookIndex?: number;
  formSlot: React.ReactNode;
}) {
  const h1 = content.hero.hooks[hookIndex] ?? content.hero.hooks[0];

  return (
    <section className="bg-surfaceSite pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: text */}
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 bg-lime/15 text-navy text-sm font-medium px-4 py-1.5 rounded-pill w-fit">
            {content.hero.badge}
          </span>

          <h1 className="text-navy font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">
            {h1}
          </h1>

          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-xl">
            {content.hero.subtitle}
          </p>

          <ul className="flex flex-col gap-2.5">
            {content.hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-navy font-medium text-sm">
                <span className="w-5 h-5 rounded-full bg-lime/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-navy" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Mobile CTA — scroll to contact */}
          <a
            href="#kontakt"
            className="lg:hidden bg-lime text-navy font-bold text-base px-7 py-3.5 rounded-pill hover:bg-limeSoft transition-colors flex items-center justify-center gap-2 w-fit"
          >
            {content.hero.cta}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Right: form card (desktop) */}
        <div className="hidden lg:block">
          <div className="bg-navy rounded-card-site p-6 lg:p-8">
            <h2 className="text-white font-bold text-xl mb-5">{content.hero.formTitle}</h2>
            {formSlot}
          </div>
        </div>
      </div>
    </section>
  );
}
