'use client';

import { VIOLET } from '../_lib/tokens';

export default function ModulesTicker({ modules }: { modules: string[] }) {
  const doubled = [...modules, ...modules];
  return (
    <div
      className="relative rounded-xl overflow-hidden py-2.5"
      style={{
        background: `linear-gradient(135deg, ${VIOLET}ee, #6D28D9ee)`,
        boxShadow: `0 4px 24px ${VIOLET}40, 0 1px 0 rgba(255,255,255,0.08) inset`,
      }}
    >
      <div className="absolute inset-y-0 left-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #6D28D9ee, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #6D28D9ee, transparent)' }} />
      <div className="ticker-track flex items-center gap-0 whitespace-nowrap w-max">
        {doubled.map((mod, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 px-3">{mod}</span>
            <span className="text-white/30 text-xs select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
