'use client';

import { Check, ArrowRight, Building2, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { NAVY, BLUE, SLATE_1, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function RolesSplit() {
  const { t } = useLang();
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-black mb-3" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            {t.roles.heading}
          </h2>
          <p className="text-sm" style={{ color: MID }}>{t.roles.sub}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
          {/* Company */}
          <div className="rounded-2xl p-8 border flex flex-col" style={{ borderColor: 'rgba(15,23,42,0.08)', background: SLATE_1 }}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border-2 flex-shrink-0" style={{ borderColor: 'rgba(15,23,42,0.15)', background: 'white' }}>
                <Building2 className="w-5 h-5" style={{ color: NAVY }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: NAVY }}>{t.roles.company.title}</h3>
            </div>
            <ul className="space-y-3.5 flex-1">
              {t.roles.company.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: MID }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white border" style={{ borderColor: 'rgba(15,23,42,0.1)' }}>
                    <Check className="w-3 h-3" style={{ color: NAVY }} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Center photo */}
          <div className="hidden lg:flex flex-col items-center justify-center w-56 xl:w-64 flex-shrink-0">
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' }}>
              <Image src="/img/wspolpraca/roles-center.webp" alt="" fill className="object-cover" sizes="256px" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ background: GRAD, boxShadow: '0 0 16px rgba(37,99,235,0.5)' }}>
                <ArrowRight className="w-3.5 h-3.5 text-white rotate-180" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ background: GRAD, boxShadow: '0 0 16px rgba(37,99,235,0.5)' }}>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Incubator — dark card */}
          <div className="rounded-2xl p-8 relative overflow-hidden flex flex-col" style={{ background: NAVY }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(37,99,235,0.28), transparent 55%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="relative flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRAD }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{t.roles.incubator.title}</h3>
              </div>
              <ul className="space-y-3.5 flex-1">
                {t.roles.incubator.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: BLUE }}>
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base text-white transition-all hover:shadow-lg"
            style={{ background: GRAD, boxShadow: '0 4px 20px rgba(37,99,235,0.25)' }}
          >
            {t.roles.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
