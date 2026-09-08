import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dziękujemy za kontakt — Firma Dla Każdego',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-lg text-center">
        <CheckCircle className="w-16 h-16 text-brand mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
          Dziękujemy za kontakt
        </h1>
        <p className="text-lg text-body mb-8">
          Otrzymaliśmy Twoje zgłoszenie. Odezwiemy się w ciągu 1 dnia roboczego.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-brand hover:text-brandDark font-semibold transition-colors"
        >
          ← Wróć na stronę główną
        </Link>
      </div>
    </main>
  );
}
