'use client';

import { NAVY, BLUE, VIOLET, SLATE_1, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Pricing() {
  const { t } = useLang();
  return (
    <section id="pricing" className="py-20 lg:py-28" style={{ background: SLATE_1, scrollMarginTop: '80px' }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1.5 rounded-full" style={{ background: `${BLUE}12`, color: BLUE }}>
            {t.pricing.heading}
          </span>
          <h2 className="font-black" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.pricing.heading}
          </h2>
          <p className="mt-3 text-base max-w-md mx-auto" style={{ color: MID }}>{t.pricing.sub}</p>
        </div>

        {/* Top card — highlighted tier (index 1) */}
        <div className="relative rounded-2xl mb-5" style={{ background: 'white', border: `2px solid ${BLUE}`, boxShadow: `0 0 0 4px ${BLUE}14, 0 16px 48px rgba(37,99,235,0.16)` }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: GRAD }}>
            {t.pricing.popular}
          </div>
          <div className="p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: BLUE }}>
                {t.pricing.thresholdLabel}
              </p>
              <p className="font-bold text-base" style={{ color: NAVY }}>{t.pricing.tiers[1].threshold}</p>
            </div>
            <div className="flex items-baseline gap-1.5 sm:justify-end">
              <span className="font-black leading-none" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {t.pricing.tiers[1].price}
              </span>
              <span className="text-base font-medium" style={{ color: MID }}>{t.pricing.tiers[1].period}</span>
            </div>
            <button onClick={() => scrollTo('contact')} className="sm:self-center font-bold px-8 py-3.5 rounded-xl text-sm text-white transition-all whitespace-nowrap hover:shadow-lg" style={{ background: GRAD, boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
              {t.pricing.cta}
            </button>
          </div>
        </div>

        {/* Two other cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[t.pricing.tiers[0], t.pricing.tiers[2]].map((tier, i) => (
            <div key={i} className="relative flex flex-col rounded-2xl" style={{ background: 'white', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
              <div className="flex flex-col flex-1 p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MID }}>
                  {t.pricing.thresholdLabel}
                </p>
                <p className="font-semibold text-sm mb-5 leading-snug" style={{ color: NAVY }}>{tier.threshold}</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-black leading-none" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', background: `linear-gradient(135deg, ${NAVY}, ${MID})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {tier.price}
                  </span>
                  <span className="text-sm font-medium" style={{ color: MID }}>{tier.period}</span>
                </div>
                <button onClick={() => scrollTo('contact')} className="mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all hover:bg-blue-50" style={{ border: `1.5px solid ${BLUE}40`, color: BLUE, background: `${BLUE}06` }}>
                  {t.pricing.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
