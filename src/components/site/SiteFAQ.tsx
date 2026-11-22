'use client';

import type { SiteContent } from '@/content/site-types';

export default function SiteFAQ({ data }: { data: SiteContent['faq'] }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-navy font-bold text-2xl lg:text-3xl text-center mb-10">{data.title}</h2>
        <div className="space-y-3">
          {data.items.map((item) => (
            <details
              key={item.q}
              className="group bg-surfaceSite rounded-card-site overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-4 flex items-center justify-between text-navy font-medium text-base hover:bg-surfaceAlt transition-colors list-none [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="text-lime text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-5 text-muted text-sm leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
