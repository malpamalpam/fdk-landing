'use client';

import { NAVY, SLATE_1, MID, GRAD, GRAD_BORDER_DIM, GRAD_BORDER_HOV } from '../_lib/tokens';
import { useLang } from './LangProvider';
import { useState } from 'react';

export default function ThreeOptions() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-28" style={{ background: SLATE_1 }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <h2 className="font-black text-center mb-12" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
          {t.threeOptions.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {t.threeOptions.options.map((opt, i) => (
            i === 2 ? <HighlightCard key={i} label={opt.label} text={opt.text} /> : (
              <div key={i} className="rounded-2xl bg-white p-7" style={{ border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
                <h3 className="font-bold mb-3 text-base" style={{ color: NAVY }}>{opt.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MID }}>{opt.text}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({ label, text }: { label: string; text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-2xl transition-all duration-300"
      style={{
        padding: '2px',
        background: hovered ? GRAD_BORDER_HOV : GRAD_BORDER_DIM,
        boxShadow: hovered ? '0 0 28px rgba(37,99,235,0.14), 0 0 56px rgba(139,92,246,0.08)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-white rounded-2xl h-full p-7">
        <h3 className="font-bold mb-3 text-base" style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{label}</h3>
        <p className="text-sm leading-relaxed" style={{ color: MID }}>{text}</p>
      </div>
    </div>
  );
}
