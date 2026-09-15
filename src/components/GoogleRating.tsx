import { Star } from 'lucide-react';
import type { LandingContent } from '@/content/landings';
import { facts } from '@/content/facts';

export default function GoogleRating({ landing }: { landing: LandingContent }) {
  const googleRating = facts.googleRating;
  const googleReviewsCount = facts.googleReviewsCount;
  const googleReviewsUrl = facts.googleReviewsUrl;
  const hasRating = googleRating !== null && googleReviewsCount !== null;

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">

        {hasRating && googleRating !== null && googleReviewsCount !== null && (
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-gray-100 fade-in-up">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-5 h-5 ${n <= Math.round(googleRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xl font-extrabold text-ink">{googleRating.toFixed(1)}</span>
            <span className="text-body text-sm">({googleReviewsCount} opinii w Google)</span>
            {googleReviewsUrl !== null && (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-sm hover:underline ml-auto"
              >
                Zobacz wszystkie opinie →
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {landing.trustCards.map((card, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-[12px] bg-surface border border-gray-100 fade-in-up">
              <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand font-extrabold">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-ink font-bold mb-1 text-sm">{card.title}</h3>
                <p className="text-body text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
