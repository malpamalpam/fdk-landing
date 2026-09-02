'use client';

import type { Dictionary } from '@/dictionaries/types';
import {
  Wallet,
  Percent,
  Timer,
  Globe,
  Umbrella,
  BadgeCheck,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  Wallet,
  Percent,
  Timer,
  Globe,
  Umbrella,
  BadgeCheck,
  Clock,
  MessageCircle,
};

export default function Benefits({ dict }: { dict: Dictionary }) {
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-surface" id="korzysci">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {dict.benefits.title}
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            {dict.benefits.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dict.benefits.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={i}
                className="fade-in-up bg-white rounded-[12px] p-6 hover:shadow-md transition-shadow duration-300"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                  {Icon && (
                    <Icon
                      className="w-6 h-6 text-brand"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-lg font-semibold text-ink mt-12 fade-in-up">
          {dict.benefits.bottomLine}
        </p>
      </div>
    </section>
  );
}
