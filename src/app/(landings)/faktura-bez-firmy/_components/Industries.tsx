'use client';

import { Code2, Palette, Compass, Camera, Video, Music2, Languages, BookOpen, PenLine, ShoppingCart, Newspaper, Target } from 'lucide-react';
import { NAVY, BLUE, VIOLET, BG } from '../_lib/tokens';
import { useLang } from './LangProvider';

const ICONS = [Code2, Palette, Compass, Camera, Video, Music2, Languages, BookOpen, PenLine, ShoppingCart, Newspaper, Target];

export default function Industries() {
  const { t } = useLang();
  return (
    <section id="industries" className="py-20 lg:py-28" style={{ background: BG, scrollMarginTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="max-w-xl mb-10">
          <h2 className="font-black leading-tight" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)' }}>
            {t.industries.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {t.industries.list.map((label, i) => {
            const Icon = ICONS[i];
            const iconColor = i % 3 === 0 ? BLUE : i % 3 === 1 ? VIOLET : '#0EA5E9';
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white cursor-default transition-all duration-200" style={{ border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
                <Icon className="flex-shrink-0" style={{ width: 18, height: 18, color: iconColor, strokeWidth: 1.75 }} />
                <span className="text-sm font-semibold leading-snug" style={{ color: NAVY }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
