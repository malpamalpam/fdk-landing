'use client';

import type { Dictionary } from '@/dictionaries/types';
import {
  GraduationCap,
  Languages,
  Code2,
  ShoppingCart,
  Handshake,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  GraduationCap,
  Languages,
  Code2,
  ShoppingCart,
  Handshake,
  Sparkles,
};

export default function ForWho({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-in-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white" id="dla-kogo">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {dict.forWho.title}
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            {dict.forWho.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dict.forWho.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={i}
                className="fade-in-up bg-white border border-gray-100 rounded-[12px] p-6 md:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {Icon && (
                  <Icon
                    className="w-10 h-10 text-brand mb-4"
                    aria-hidden="true"
                  />
                )}
                <h3 className="text-xl font-semibold text-ink mb-3">
                  {item.title}
                </h3>
                <p className="text-body leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
