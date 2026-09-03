'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { Dictionary } from '@/dictionaries/types';
import { track } from '@/lib/track';
import { getFirstTouch, getLastTouch, getSessionParam, getCookie } from '@/lib/attribution';
import { getConsent } from '@/lib/consent';

function getConsentText(raw: string) {
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

function uuid(): string {
  return crypto.randomUUID();
}

export default function ContactForm({ dict, locale, segment = 'ogolny' }: { dict: Dictionary; locale: string; segment?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const timestampRef = useRef(Date.now());
  const sectionRef = useRef<HTMLElement>(null);

  const schema = z.object({
    name: z.string().min(1, dict.form.errorRequired),
    phone: z.string().min(6, dict.form.errorPhone).regex(/^[+]?[\d\s()-]{6,20}$/, dict.form.errorPhone),
    email: z.string().min(1, dict.form.errorRequired).email(dict.form.errorEmail),
    situation: z.string().min(1, dict.form.errorRequired),
    industry: z.string().optional(),
    start_date: z.string().optional(),
    message: z.string().optional(),
    consent_privacy: z.literal(true, { errorMap: () => ({ message: dict.form.errorConsent }) }),
    consent_marketing: z.boolean().optional(),
    website: z.string().max(0).optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent_privacy: undefined, consent_marketing: false, website: '' },
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

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      track('form_start', { segment });
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError(false);

    const eventId = uuid();
    const hookVariant = (document.getElementById('hook-variant') as HTMLInputElement | null)?.value || 'a';
    const ft = getFirstTouch();
    const lt = getLastTouch();
    const consentState = getConsent();

    // Determine effective segment: URL param overrides path segment
    const urlSegment = new URLSearchParams(window.location.search).get('segment');
    const effectiveSegment = urlSegment || segment;

    const payload = {
      ...data,
      segment: effectiveSegment,
      locale,
      hook_variant: hookVariant,
      event_id: eventId,
      submitted_at: new Date().toISOString(),
      consent_state: consentState,
      // Session UTMs
      utm_source: getSessionParam('utm_source'),
      utm_medium: getSessionParam('utm_medium'),
      utm_campaign: getSessionParam('utm_campaign'),
      utm_content: getSessionParam('utm_content'),
      utm_term: getSessionParam('utm_term'),
      // Click IDs
      gclid: getSessionParam('gclid'),
      gbraid: getSessionParam('gbraid'),
      wbraid: getSessionParam('wbraid'),
      fbclid: getSessionParam('fbclid'),
      ttclid: getSessionParam('ttclid'),
      msclkid: getSessionParam('msclkid'),
      // Facebook cookies
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      // URLs
      landing_url: getSessionParam('landing_url') || window.location.href,
      referrer: getSessionParam('referrer') || document.referrer,
      // Attribution
      first_touch_source: ft?.source || '',
      first_touch_medium: ft?.medium || '',
      first_touch_campaign: ft?.campaign || '',
      first_touch_at: ft?.at || '',
      first_touch_url: ft?.url || '',
      last_touch_source: lt?.source || '',
      last_touch_medium: lt?.medium || '',
      last_touch_campaign: lt?.campaign || '',
      last_touch_at: lt?.at || '',
      // Spam check
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
        // Store for thank you page
        sessionStorage.setItem('fdk_event_id', eventId);
        sessionStorage.setItem('fdk_segment', effectiveSegment);
        sessionStorage.setItem('fdk_situation', data.situation || '');
        sessionStorage.setItem('fdk_industry', data.industry || '');
        router.push(`/${locale}/dziekujemy`);
      } else {
        setServerError(true);
        track('form_error', { segment: effectiveSegment, field: 'server' });
      }
    } catch {
      setServerError(true);
      track('form_error', { segment: effectiveSegment, field: 'server' });
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

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" onFocus={handleFormFocus}>
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
                  <p id="name-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">{errors.name.message}</p>
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
                  <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">{errors.phone.message}</p>
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
                  <p id="email-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">{errors.email.message}</p>
                )}
              </div>

              {/* Situation */}
              <div>
                <label htmlFor="situation" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.situation} *
                </label>
                <select
                  id="situation"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('situation')}
                  aria-invalid={!!errors.situation}
                  aria-describedby={errors.situation ? 'situation-error' : undefined}
                >
                  <option value="">—</option>
                  {dict.form.situationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.situation && (
                  <p id="situation-error" className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">{errors.situation.message}</p>
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
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Start date */}
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-ink mb-1">
                  {dict.form.startDate}
                </label>
                <select
                  id="start_date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  {...register('start_date')}
                >
                  <option value="">—</option>
                  {dict.form.startDateOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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

              {/* Privacy consent */}
              <div className="flex items-start gap-3">
                <input
                  id="consent_privacy"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                  {...register('consent_privacy')}
                  aria-invalid={!!errors.consent_privacy}
                  aria-describedby={errors.consent_privacy ? 'consent-error' : undefined}
                />
                <label htmlFor="consent_privacy" className="text-sm text-body leading-snug">
                  {getConsentText(dict.form.consent)} *
                </label>
              </div>
              {errors.consent_privacy && (
                <p id="consent-error" className="text-red-500 text-sm" role="alert" aria-live="polite">{errors.consent_privacy.message}</p>
              )}

              {/* Marketing consent */}
              <div className="flex items-start gap-3">
                <input
                  id="consent_marketing"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                  {...register('consent_marketing')}
                />
                <label htmlFor="consent_marketing" className="text-sm text-body leading-snug">
                  {dict.form.consentMarketing}
                </label>
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-red-500 text-sm" role="alert" aria-live="assertive">{dict.form.errorServer}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brandDark disabled:opacity-60 text-white font-semibold text-lg py-4 rounded-[4px] transition-colors flex items-center justify-center gap-2"
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
                    onClick={() => track('phone_click', { segment, place: 'contact' })}
                  >
                    {dict.contact.phonePL}
                  </a>
                  <a
                    href={`tel:${dict.contact.phoneINT.split(' (')[0].replace(/\s/g, '')}`}
                    className="block text-ink hover:text-brand transition-colors"
                    onClick={() => track('phone_click', { segment, place: 'contact' })}
                  >
                    {dict.contact.phoneINT}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${dict.contact.email}`} className="text-ink hover:text-brand transition-colors">
                  {dict.contact.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-ink mb-1">{dict.contact.addressTitle}</h4>
                  <p className="text-body whitespace-pre-line leading-relaxed">{dict.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
