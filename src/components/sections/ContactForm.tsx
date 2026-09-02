'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/types';
import { track } from '@/lib/track';

function getConsentText(raw: string) {
  // Convert markdown link [text](url) to JSX
  const match = raw.match(/\[(.+?)\]\((.+?)\)/);
  if (!match) return raw;
  const before = raw.slice(0, match.index);
  const after = raw.slice((match.index || 0) + match[0].length);
  return (
    <>
      {before}
      <a href={match[2]} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
        {match[1]}
      </a>
      {after}
    </>
  );
}

export default function ContactForm({ dict, locale }: { dict: Dictionary; locale: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState(false);
  const timestampRef = useRef(Date.now());
  const sectionRef = useRef<HTMLElement>(null);

  const schema = z.object({
    name: z.string().min(1, dict.form.errorRequired),
    phone: z.string().min(6, dict.form.errorPhone).regex(/^[+]?[\d\s()-]{6,20}$/, dict.form.errorPhone),
    email: z.string().min(1, dict.form.errorRequired).email(dict.form.errorEmail),
    industry: z.string().optional(),
    message: z.string().optional(),
    consent: z.literal(true, { errorMap: () => ({ message: dict.form.errorConsent }) }),
    website: z.string().max(0).optional(), // honeypot
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent: undefined, website: '' },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.fade-in-up');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: FormData) => {
    setServerError(false);

    const hookVariant = document.getElementById('hook-variant') as HTMLInputElement | null;

    const payload = {
      ...data,
      locale,
      hook_variant: hookVariant?.value || 'a',
      utm_source: sessionStorage.getItem('fdk_utm_source') || '',
      utm_medium: sessionStorage.getItem('fdk_utm_medium') || '',
      utm_campaign: sessionStorage.getItem('fdk_utm_campaign') || '',
      utm_content: sessionStorage.getItem('fdk_utm_content') || '',
      utm_term: sessionStorage.getItem('fdk_utm_term') || '',
      fbclid: sessionStorage.getItem('fdk_fbclid') || '',
      gclid: sessionStorage.getItem('fdk_gclid') || '',
      ttclid: sessionStorage.getItem('fdk_ttclid') || '',
      landing_url: sessionStorage.getItem('fdk_landing_url') || window.location.href,
      referrer: sessionStorage.getItem('fdk_referrer') || document.referrer,
      _t: timestampRef.current,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server error');

      const result = await res.json();
      if (result.ok) {
        router.push(`/${locale}/dziekujemy`);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-surface" id="kontakt">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
              {dict.form.title}
            </h2>
            <p className="text-body mb-8">{dict.form.subtitle}</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Honeypot */}
              <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.name} *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.phone} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('phone')}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.email} *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.industry}
                </label>
                <select
                  id="industry"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('industry')}
                >
                  <option value="">—</option>
                  {dict.form.industryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.message}
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow resize-y"
                  {...register('message')}
                />
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                  {...register('consent')}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <label htmlFor="consent" className="text-sm text-body leading-snug">
                  {getConsentText(dict.form.consent)} *
                </label>
              </div>
              {errors.consent && (
                <p id="consent-error" className="text-red-500 text-sm" role="alert" aria-live="polite">
                  {errors.consent.message}
                </p>
              )}

              {/* Server error */}
              {serverError && (
                <p className="text-red-500 text-sm" role="alert" aria-live="assertive">
                  {dict.form.errorServer}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brandDark disabled:opacity-60 text-white font-semibold text-lg py-4 rounded-[4px] transition-colors flex items-center justify-center gap-2"
                data-track="cta_click"
                data-track-place="form"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {dict.form.sending}
                  </>
                ) : (
                  dict.form.submit
                )}
              </button>

              <p className="text-sm text-body text-center">{dict.form.note}</p>
            </form>
          </div>

          {/* Contact info */}
          <div className="fade-in-up" style={{ transitionDelay: '200ms' }}>
            <h3 className="text-2xl font-bold text-ink mb-6">{dict.contact.title}</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <a
                    href={`tel:${dict.contact.phonePL.split(' (')[0].replace(/\s/g, '')}`}
                    className="block text-ink hover:text-brand transition-colors"
                    onClick={() => track('phone_click', { phone: 'PL' })}
                  >
                    {dict.contact.phonePL}
                  </a>
                  <a
                    href={`tel:${dict.contact.phoneINT.split(' (')[0].replace(/\s/g, '')}`}
                    className="block text-ink hover:text-brand transition-colors"
                    onClick={() => track('phone_click', { phone: 'INT' })}
                  >
                    {dict.contact.phoneINT}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${dict.contact.email}`}
                  className="text-ink hover:text-brand transition-colors"
                >
                  {dict.contact.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-ink mb-1">{dict.contact.addressTitle}</h4>
                  <p className="text-body whitespace-pre-line leading-relaxed">
                    {dict.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
