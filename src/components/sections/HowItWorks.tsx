'use client';

import type { Dictionary } from '@/dictionaries/types';
import { useEffect, useRef } from 'react';

export default function HowItWorks({ dict }: { dict: Dictionary }) {
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-white" id="jak-dzialamy">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {dict.howItWorks.title}
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            {dict.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {dict.howItWorks.steps.map((step, i) => (
            <div
              key={i}
              className="fade-in-up relative text-center lg:text-left"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="text-6xl md:text-7xl font-extrabold text-brand/20 mb-2 leading-none">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">
                {step.title}
              </h3>
              <p className="text-body leading-relaxed">
                {step.description}
              </p>
              {i < dict.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8 h-px bg-brand/30" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
