'use client';

import type { Dictionary } from '@/dictionaries/types';
import { useEffect, useRef } from 'react';

export default function FAQ({ dict }: { dict: Dictionary }) {
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-surface" id="faq">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-ink mb-12 text-center fade-in-up">
          {dict.faq.title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {dict.faq.items.map((item, i) => (
            <details
              key={i}
              className="fade-in-up group bg-white rounded-[12px] border border-gray-100 overflow-hidden"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-lg font-semibold text-ink hover:text-brand transition-colors list-none [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="ml-4 flex-shrink-0 text-brand transition-transform group-open:rotate-45 text-2xl leading-none" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-body leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
