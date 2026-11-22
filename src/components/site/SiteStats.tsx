import type { SiteContent } from '@/content/site-types';

export default function SiteStats({ stats }: { stats: SiteContent['stats'] }) {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-10 lg:gap-20">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-navy font-bold text-3xl lg:text-4xl">{s.value}</div>
            <div className="text-muted text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
