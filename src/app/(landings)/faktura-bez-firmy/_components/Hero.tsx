'use client';

import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { NAVY, BLUE, VIOLET, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';

const BADGE_DOTS = [BLUE, VIOLET, '#10B981', '#F59E0B'];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const { t } = useLang();
  const gStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${BLUE} 0%, ${VIOLET} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const acc = t.hero.h1accent;
  const parts = t.hero.h1.split(acc);

  return (
    <section id="top" className="relative overflow-hidden bg-white" style={{ minHeight: '88vh' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute pointer-events-none" style={{ top: '-80px', left: '-100px', width: '700px', height: '700px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-40px', right: '-60px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 65%)' }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 flex items-center" style={{ minHeight: '88vh' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 w-full items-center">
          {/* Left */}
          <div className="flex flex-col min-w-0">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-7 w-fit" style={{ borderColor: 'rgba(139,92,246,0.28)', background: 'rgba(139,92,246,0.07)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-65" style={{ background: VIOLET }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: VIOLET }} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.13em]" style={{ color: VIOLET }}>{t.hero.badge}</span>
            </div>

            <h1 className="font-extrabold mb-6 leading-[1.1] tracking-tight" style={{ color: NAVY, fontSize: 'clamp(2rem, 4.2vw, 3.5rem)' }}>
              {parts.map((part, i) => (
                <span key={i}>{part}{i < parts.length - 1 && <span style={gStyle}>{acc}</span>}</span>
              ))}
            </h1>

            <ul className="space-y-3 mb-8">
              {t.hero.bullets.map((bullet, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GRAD }}>
                    <Check className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-sm font-medium" style={{ color: NAVY }}>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => scrollTo('contact')} className="inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-xl text-[15px] text-white transition-all hover:scale-[1.03]" style={{ background: GRAD, boxShadow: '0 4px 24px rgba(37,99,235,0.32)' }}>
                {t.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => scrollTo('industries')} className="inline-flex items-center gap-2 font-medium px-5 py-3.5 rounded-xl text-[14px] transition-all hover:border-blue-300 hover:text-[#0F172A]" style={{ border: '1px solid rgba(15,23,42,0.14)', color: MID }}>
                {t.nav.industries}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: photo + badges */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3', boxShadow: '0 2px 0 0 rgba(37,99,235,0.1), 0 24px 64px rgba(15,23,42,0.14), 0 8px 24px rgba(15,23,42,0.08)' }}>
              <Image src="/img/wspolpraca/hero.webp" alt="" fill className="object-cover object-center" priority sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="absolute bottom-3 left-2 right-2 z-10 grid grid-cols-2 gap-1.5">
              {t.heroBadges.map((badge, i) => (
                <div key={i} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.65)', boxShadow: '0 2px 14px rgba(15,23,42,0.10)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: BADGE_DOTS[i] }} />
                    <span className="text-[11px] font-bold leading-tight" style={{ color: NAVY }}>{badge.main}</span>
                  </div>
                  <span className="text-[9px] leading-snug pl-3.5" style={{ color: MID }}>{badge.sub}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-3xl -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, transparent 70%)', filter: 'blur(32px)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
