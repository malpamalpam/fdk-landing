'use client';

import Image from 'next/image';
import { NAVY, BLUE, MID } from '../_lib/tokens';
import { useLang } from './LangProvider';
import GlowCard from './GlowCard';

const IMGS = ['/img/wspolpraca/for-whom-1.webp', '/img/wspolpraca/for-whom-2.webp', '/img/wspolpraca/for-whom-3.webp', '/img/wspolpraca/for-whom-4.webp'];

export default function ForWhom() {
  const { t } = useLang();
  return (
    <section id="for-whom" className="py-20 lg:py-28 bg-white" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-black mb-4 leading-tight" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)' }}>
            {t.forWhom.heading}
          </h2>
          <p className="leading-relaxed text-base" style={{ color: MID }}>{t.forWhom.sub}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {t.forWhom.cards.map((card, i) => (
            <GlowCard key={i}>
              <div className="p-6 flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm relative">
                  <Image src={IMGS[i]} alt={card.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-sm font-black tracking-wider" style={{ color: BLUE }}>{card.num}</span>
                    <span className="w-px h-3.5" style={{ background: 'rgba(15,23,42,0.15)' }} />
                    <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${BLUE}12`, color: BLUE }}>{card.tag}</span>
                  </div>
                  <h3 className="font-extrabold mb-2 leading-snug" style={{ color: NAVY, fontSize: '1.05rem' }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MID }}>{card.body}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
