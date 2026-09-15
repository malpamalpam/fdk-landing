'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X, ChevronRight, MessageCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import type { LandingContent } from '@/content/landings';
import { isKnown } from '@/lib/fdk';
import LeadForm from '@/components/LeadForm';
import GoogleRating from '@/components/GoogleRating';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

// ─── Scroll-reveal with 800 ms fail-safe ───
function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Immediately show everything if reduced-motion or no IO support
    if (mq.matches || typeof IntersectionObserver === 'undefined') {
      ref.current?.querySelectorAll('.fade-in-up').forEach((el) => el.classList.add('visible'));
      return;
    }

    const els = ref.current ? Array.from(ref.current.querySelectorAll('.fade-in-up')) : [];

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.05 }
    );
    els.forEach((el) => observer.observe(el));

    // Fail-safe: reveal anything still invisible after 800 ms
    const timer = setTimeout(() => {
      els.forEach((el) => el.classList.add('visible'));
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [ref]);
}

function scrollToForm(e: React.MouseEvent) {
  e.preventDefault();
  const el = document.getElementById('formularz');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    el.querySelector<HTMLInputElement>('input:not([type=hidden]):not([tabindex="-1"])')?.focus({ preventScroll: true });
  }
}

// ─── Mobile card view for comparison table ───
function ComparisonCards({ columns, rows }: { columns: string[]; rows: { label: string; cells: (string | null)[] }[] }) {
  const lastIdx = columns.length - 1;
  return (
    <div className="space-y-4 sm:hidden" aria-label="Tabela porównawcza">
      {rows.map((row, i) => (
        <div key={i} className="bg-white rounded-[12px] p-4 border border-gray-100">
          <p className="text-sm font-bold text-ink mb-3">{row.label}</p>
          <div className="space-y-1.5">
            {columns.map((col, j) => (
              <div key={j} className="flex items-start justify-between gap-2">
                <span className="text-xs text-body flex-shrink-0">{col}</span>
                <span className={`text-xs text-right ${j === lastIdx ? 'font-semibold text-brand' : 'text-body'}`}>
                  {row.cells[j]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingTemplate({ landing }: { landing: LandingContent }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useFadeIn(pageRef);

  useEffect(() => {
    captureAttribution();
    pushEvent(EVENTS.pageView, { landing_slug: landing.slug, segment: landing.segment });
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [landing.slug, landing.segment]);

  const isL3 = landing.slug === 'landing3';

  return (
    <div ref={pageRef}>
      {/* ── Sticky header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-[1140px] mx-auto px-4 md:px-6 flex items-center justify-between h-14 md:h-16">
          <a href="#hero" className="flex-shrink-0">
            <Image src="/logo-white.png" alt="Firma Dla Każdego" width={180} height={60} className="h-12 w-auto" priority />
          </a>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              {landing.nav.anchors.map((a) => (
                <a key={a.href} href={a.href} className="text-white/70 hover:text-white text-xs font-medium transition-colors">
                  {a.label}
                </a>
              ))}
            </nav>
            <a href="#formularz" onClick={scrollToForm} className="bg-brand hover:bg-brandDark text-white text-xs font-semibold px-4 py-2 rounded-[4px] transition-colors">
              {landing.hero.submitLabel}
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero with form ── */}
      <section className="relative bg-ink text-white pt-14 md:pt-16 min-h-[85vh] flex flex-col" id="hero">
        <Image src="/hero.jpg" alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-[rgba(26,30,35,0.87)]" aria-hidden="true" />
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-6 py-8 lg:py-14 flex-1 flex items-center w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12 items-start w-full">

            {/* Left column */}
            <div className="lg:py-4">
              <p className="text-brand text-xs font-semibold uppercase tracking-wide mb-3">{landing.hero.eyebrow}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-tight mb-4">
                {isL3 ? (
                  <>
                    <span className="sm:hidden">Wasz współpracownik wystawi fakturę VAT.</span>
                    <span className="hidden sm:inline">{landing.hero.h1}</span>
                  </>
                ) : landing.hero.h1}
              </h1>
              <p className="text-base lg:text-xl text-white/80 mb-5 leading-relaxed">
                {isL3 ? (
                  <>
                    <span className="sm:hidden">Rozliczajcie się z podwykonawcami na fakturę — bez umowy o pracę i bez obowiązków płatnika.</span>
                    <span className="hidden sm:inline">{landing.hero.lead}</span>
                  </>
                ) : landing.hero.lead}
              </p>

              {/* Bullets */}
              <ul className="space-y-2.5 mb-5">
                {landing.hero.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/90">
                    <span className="text-brand font-bold mt-0.5 flex-shrink-0 leading-tight">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Disclaimer */}
              <div className="bg-white/10 border border-white/20 rounded-[8px] px-4 py-3 text-xs text-white/60 leading-relaxed max-w-md">
                {landing.hero.disclaimer}
              </div>
            </div>

            {/* Right column — sticky form */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[12px] p-4 lg:p-6 text-ink shadow-2xl" id="formularz">
                <h2 className="text-base lg:text-lg font-bold mb-0.5">{landing.hero.formHeading}</h2>
                <p className="text-body text-xs mb-3">{landing.hero.formIntro}</p>
                <LeadForm landing={landing} />
              </div>

              {/* Image with card overlay — desktop only */}
              <div className="mt-3 relative h-[120px] rounded-[12px] overflow-hidden hidden lg:block">
                <Image src="/hero.jpg" alt="" fill className="object-cover object-center" sizes="(min-width: 1024px) 45vw, 100vw" />
                <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
                <div className="absolute inset-0 flex items-center px-5">
                  <p className="text-white text-sm font-medium leading-snug">{landing.hero.imageCardText}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <GoogleRating landing={landing} />

      {/* ── Highlight ── */}
      <section className="py-12 md:py-16 bg-surface scroll-mt-[--header-h]" id="opcje" style={{ scrollMarginTop: 'var(--header-h, 56px)' }}>
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.highlight.title}</h2>
          {landing.highlight.intro && <p className="text-body text-lg mb-10 fade-in-up">{landing.highlight.intro}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landing.highlight.items.map((item, i) => (
              <div key={i} className="bg-white rounded-[12px] p-6 fade-in-up">
                <h3 className="text-lg font-bold text-ink mb-2">{item.label}</h3>
                <p className="text-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Split (landing3 only) ── */}
      {landing.roleSplit && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.roleSplit.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landing.roleSplit.columns.map((col, i) => (
                <div key={i} className="fade-in-up">
                  <h3 className={`text-xl font-bold mb-4 ${i === 1 ? 'text-brand' : 'text-ink'}`}>{col.label}</h3>
                  <ul className="space-y-2">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${i === 1 ? 'text-brand' : 'text-ink/40'}`} aria-hidden="true" />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Foreign workers (landing3 only) ── */}
      {landing.foreignWorkers && (
        <section className="py-12 md:py-16 bg-surface">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.foreignWorkers.title}</h2>
            {landing.foreignWorkers.intro && (
              <p className="text-body text-lg mb-6 fade-in-up">{landing.foreignWorkers.intro}</p>
            )}
            <div className="space-y-3 max-w-3xl mb-6">
              {landing.foreignWorkers.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 fade-in-up">
                  <Shield className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-body">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-body/70 italic fade-in-up">{landing.foreignWorkers.disclaimer}</p>
          </div>
        </section>
      )}

      {/* ── Dla kogo ── */}
      <section className="py-12 md:py-16 bg-white" id="dla-kogo" style={{ scrollMarginTop: 'var(--header-h, 56px)' }}>
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.forWhom.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landing.forWhom.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-[12px] bg-surface fade-in-up">
                <Check className="w-5 h-5 text-brand flex-shrink-0" aria-hidden="true" />
                <span className="text-ink font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dla kogo NIE ── */}
      <section className="py-12 md:py-16 bg-surface">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.notForWhom.title}</h2>
          {landing.notForWhom.intro && <p className="text-body text-lg mb-8 fade-in-up">{landing.notForWhom.intro}</p>}
          <div className="space-y-4 max-w-3xl">
            {landing.notForWhom.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 fade-in-up">
                <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-body">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jak to działa ── */}
      <section className="py-12 md:py-16 bg-white" id="kroki" style={{ scrollMarginTop: 'var(--header-h, 56px)' }}>
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-12 fade-in-up">{landing.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landing.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative fade-in-up">
                <div className="text-6xl font-extrabold text-brand/20 mb-2 leading-none">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-xl font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-body">{step.text}</p>
                {i < landing.howItWorks.steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-brand/30" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabela porównawcza ── */}
      {(() => {
        const visibleRows = landing.comparison.rows.filter((row) => row.cells.every(isKnown));
        if (visibleRows.length < 3) return null;
        return (
          <section className="py-12 md:py-16 bg-surface">
            <div className="max-w-[1140px] mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.comparison.title}</h2>
              {landing.comparison.note && <p className="text-body mb-8 fade-in-up">{landing.comparison.note}</p>}

              {/* Mobile: card view */}
              <div className="fade-in-up">
                <ComparisonCards columns={landing.comparison.columns} rows={visibleRows} />
              </div>

              {/* Desktop: table */}
              <div className="overflow-x-auto fade-in-up hidden sm:block" aria-hidden="false">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-brand/20">
                      <th className="py-3 pr-4 text-body font-medium text-sm w-1/4"></th>
                      {landing.comparison.columns.map((col, i) => (
                        <th key={i} className={`py-3 px-4 text-sm font-bold ${i === landing.comparison.columns.length - 1 ? 'text-brand' : 'text-ink'}`}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-sm font-medium text-ink">{row.label}</td>
                        {row.cells.map((cell, j) => (
                          <td key={j} className={`py-3 px-4 text-sm ${j === row.cells.length - 1 ? 'font-medium text-brand' : 'text-body'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Social Proof — directly above FAQ ── */}
      {landing.socialProof && (
        <section className="py-10 bg-ink text-white">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {landing.socialProof.items.map((item, i) => (
                <div key={i}>
                  {/* 4th tile: on mobile show shorter value */}
                  <div className="text-[22px] md:text-2xl font-extrabold text-brand leading-tight">
                    {i === 3 ? (
                      <>
                        <span className="sm:hidden">4 działy</span>
                        <span className="hidden sm:inline">{item.value}</span>
                      </>
                    ) : i === 2 ? (
                      // Languages tile: if too long, show "4 języki" on mobile
                      <>
                        <span className="sm:hidden">4 języki</span>
                        <span className="hidden sm:inline">{item.value}</span>
                      </>
                    ) : (
                      item.value
                    )}
                  </div>
                  <div className="text-[11px] md:text-xs text-white/60 mt-1 leading-snug">
                    {i === 3 ? (
                      <>
                        <span className="sm:hidden">administracja · księgowość · HR · legalizacja</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ — items with null answer are hidden ── */}
      {(() => {
        const visibleFaq = landing.faq.items.filter((item) => isKnown(item.a));
        if (visibleFaq.length === 0) return null;
        return (
          <section className="py-12 md:py-16 bg-white" id="faq" style={{ scrollMarginTop: 'var(--header-h, 56px)' }}>
            <div className="max-w-[1140px] mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.faq.title}</h2>
              <div className="max-w-3xl space-y-3">
                {visibleFaq.map((item, i) => (
                  <details
                    key={i}
                    className="fade-in-up group bg-surface rounded-[12px] overflow-hidden"
                    onToggle={(e) => {
                      if ((e.target as HTMLDetailsElement).open) {
                        pushEvent(EVENTS.faqOpen, { landing_slug: landing.slug, question: item.q.slice(0, 60) });
                      }
                    }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-ink font-semibold hover:text-brand transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="ml-4 flex-shrink-0 text-brand transition-transform group-open:rotate-45 text-2xl leading-none" aria-hidden="true">+</span>
                    </summary>
                    <div className="px-6 pb-4 text-body leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Opinie — only if non-empty ── */}
      {landing.testimonials.items.length > 0 && (
        <section className="py-12 md:py-16 bg-surface">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.testimonials.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {landing.testimonials.items.map((t, i) => (
                <div key={i} className="bg-white rounded-[12px] p-6 fade-in-up">
                  <MessageCircle className="w-8 h-8 text-brand/20 mb-3" aria-hidden="true" />
                  <p className="text-body italic mb-4">{t.text}</p>
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-body">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[600px] mx-auto px-4 md:px-6 text-center fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">{landing.finalCta.title}</h2>
          <p className="text-body mb-8">{landing.finalCta.text}</p>
          <a href="#formularz" onClick={scrollToForm} className="inline-flex items-center justify-center bg-brand hover:bg-brandDark text-white font-semibold px-8 py-4 rounded-[4px] transition-colors text-lg">
            {landing.finalCta.submitLabel}
          </a>
          <p className="text-sm text-body/60 mt-4">Formularz jest na górze strony — 30 sekund.</p>
        </div>
      </section>

      {/* ── Stopka ── */}
      <footer className="bg-ink text-white/40 py-6 text-center text-sm">
        <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
          Polityka prywatności
        </a>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Fundacja Firma Dla Każdego</span>
      </footer>
    </div>
  );
}
