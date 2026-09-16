'use client';

import { NAVY, BLUE, VIOLET, SLATE_1, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how-it-works" className="py-20 lg:py-28" style={{ background: SLATE_1, scrollMarginTop: '80px' }}>
      <div className="max-w-2xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1.5 rounded-full" style={{ background: `${BLUE}12`, color: BLUE }}>
            {t.howItWorks.processLabel}
          </span>
          <h2 className="font-black" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.howItWorks.heading}
          </h2>
        </div>

        <div className="space-y-3">
          {t.howItWorks.steps.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white z-10 flex-shrink-0 text-[0.9rem]"
                  style={{ background: GRAD, boxShadow: '0 4px 20px rgba(37,99,235,0.3)', minWidth: '48px' }}
                >
                  {step.num}
                </div>
                {i < t.howItWorks.steps.length - 1 && (
                  <div className="flex-1 w-0.5 my-1" style={{ background: `linear-gradient(to bottom, ${BLUE}55, ${VIOLET}20)`, minHeight: '20px' }} />
                )}
              </div>
              <div className="flex-1 rounded-2xl px-6 py-5 mb-1" style={{ background: 'white', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 1px 6px rgba(15,23,42,0.05)' }}>
                <h3 className="font-bold mb-1.5 leading-snug" style={{ color: NAVY, fontSize: '1rem' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MID }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
