'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X, ChevronRight, MessageCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import type { LandingContent } from '@/content/landings';
import LeadForm from '@/components/LeadForm';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

  return (
    <div ref={pageRef}>
      {/* ── Sticky header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-[1140px] mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <span className="text-white font-bold text-sm">Fundacja Firma Dla Każdego</span>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              {landing.nav.anchors.map((a) => (
                <a key={a.href} href={a.href} className="text-white/70 hover:text-white text-xs font-medium transition-colors" style={{ scrollMarginTop: '4rem' }}>
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
      <section className="relative bg-ink text-white pt-14" id="hero">
        <Image src="/hero.jpg" alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-[rgba(26,30,35,0.87)]" aria-hidden="true" />
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-6 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 lg:gap-10 items-start">
            <div className="lg:py-4">
              <p className="text-brand text-xs font-semibold uppercase tracking-wide mb-2">{landing.hero.eyebrow}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">{landing.hero.h1}</h1>
              <p className="text-sm lg:text-base text-white/80 mb-3">{landing.hero.lead}</p>
              <p className="text-white/50 text-xs hidden lg:block">{landing.hero.trustLine}</p>
            </div>
            <div className="bg-white rounded-[12px] p-4 lg:p-5 text-ink shadow-2xl" id="formularz">
              <h2 className="text-base lg:text-lg font-bold mb-0.5">{landing.hero.formHeading}</h2>
              <p className="text-body text-xs mb-2">{landing.hero.formIntro}</p>
              <LeadForm landing={landing} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlight ── */}
      <section className="py-16 md:py-24 bg-surface scroll-mt-16" id="opcje">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.highlight.title}</h2>
          {landing.highlight.intro && <p className="text-body text-lg mb-10 fade-in-up">{landing.highlight.intro}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landing.highlight.items.map((item, i) => (
              <div key={i} className="bg-white rounded-[12px] p-6 fade-in-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className="text-lg font-bold text-ink mb-2">{item.label}</h3>
                <p className="text-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Split (landing3 only) ── */}
      {landing.roleSplit && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.roleSplit.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landing.roleSplit.columns.map((col, i) => (
                <div key={i} className="fade-in-up" style={{ transitionDelay: `${i * 150}ms` }}>
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
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-8 fade-in-up">{landing.foreignWorkers.title}</h2>
            <div className="space-y-3 max-w-3xl mb-6">
              {landing.foreignWorkers.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 fade-in-up" style={{ transitionDelay: `${i * 75}ms` }}>
                  <Shield className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-body">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-body/70 italic fade-in-up">{landing.foreignWorkers.disclaimer}</p>
          </div>
        </section>
      )}

      {/* ── Social Proof (landing3 only) ── */}
      {landing.socialProof && (
        <section className="py-10 bg-ink text-white">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {landing.socialProof.items.map((item, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl font-extrabold text-brand">{item.value}</div>
                  <div className="text-xs text-white/60 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dla kogo ── */}
      <section className="py-16 md:py-24 bg-white scroll-mt-16" id="dla-kogo">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.forWhom.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landing.forWhom.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-[12px] bg-surface fade-in-up" style={{ transitionDelay: `${i * 75}ms` }}>
                <Check className="w-5 h-5 text-brand flex-shrink-0" aria-hidden="true" />
                <span className="text-ink font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dla kogo NIE ── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.notForWhom.title}</h2>
          {landing.notForWhom.intro && <p className="text-body text-lg mb-8 fade-in-up">{landing.notForWhom.intro}</p>}
          <div className="space-y-4 max-w-3xl">
            {landing.notForWhom.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 fade-in-up" style={{ transitionDelay: `${i * 75}ms` }}>
                <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-body">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jak to działa ── */}
      <section className="py-16 md:py-24 bg-white scroll-mt-16" id="kroki">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-12 fade-in-up">{landing.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landing.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative fade-in-up" style={{ transitionDelay: `${i * 150}ms` }}>
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
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 fade-in-up">{landing.comparison.title}</h2>
          {landing.comparison.note && <p className="text-body mb-8 fade-in-up">{landing.comparison.note}</p>}
          <div className="overflow-x-auto fade-in-up">
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
                {landing.comparison.rows.map((row, i) => (
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

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 bg-white scroll-mt-16" id="faq">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.faq.title}</h2>
          <div className="max-w-3xl space-y-3">
            {landing.faq.items.map((item, i) => (
              <details
                key={i}
                className="fade-in-up group bg-surface rounded-[12px] overflow-hidden"
                style={{ transitionDelay: `${i * 75}ms` }}
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

      {/* ── Opinie — only if non-empty ── */}
      {landing.testimonials.items.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-[1140px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-10 fade-in-up">{landing.testimonials.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {landing.testimonials.items.map((t, i) => (
                <div key={i} className="bg-white rounded-[12px] p-6 fade-in-up" style={{ transitionDelay: `${i * 100}ms` }}>
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

      {/* ── Final CTA — scroll to hero form ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[600px] mx-auto px-4 md:px-6 text-center fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">{landing.finalCta.title}</h2>
          <p className="text-body mb-8">{landing.finalCta.text}</p>
          <a href="#formularz" onClick={scrollToForm} className="inline-flex items-center justify-center bg-brand hover:bg-brandDark text-white font-semibold px-8 py-4 rounded-[4px] transition-colors text-lg">
            {landing.finalCta.submitLabel}
          </a>
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
