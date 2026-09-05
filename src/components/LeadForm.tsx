'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { LandingContent } from '@/content/landings';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { getFirstTouch, getLastTouch, getSessionParam } from '@/lib/attribution';
import { DISPOSABLE_DOMAINS } from '@/lib/disposable-domains';

function makeSchema() {
  return z.object({
    name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
    email: z.string().min(1, 'Podaj adres e-mail').email('Podaj poprawny adres e-mail').refine(
      (v) => !DISPOSABLE_DOMAINS.has(v.split('@')[1]?.toLowerCase()),
      'Podaj stały adres e-mail, nie jednorazowy'
    ),
    phone: z.string().min(1, 'Podaj numer telefonu').regex(
      /^[+]?[\d\s()-]{6,20}$/,
      'Podaj numer telefonu w formacie 123 456 789'
    ),
    sytuacja: z.string().optional(),
    branza: z.string().optional(),
    start_date: z.string().optional(),
    message: z.string().optional(),
    consent_rodo: z.literal(true, { errorMap: () => ({ message: 'Zgoda jest wymagana' }) }),
    consent_marketing: z.boolean().optional(),
    website: z.string().max(0).optional(),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

function toValue(s: string) {
  return s.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]+/g, '-').replace(/-+$/, '');
}

export default function LeadForm({
  landing,
  variant = 'full',
}: {
  landing: LandingContent;
  variant?: 'hero' | 'full';
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const timestampRef = useRef(Date.now());

  const schema = makeSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent_rodo: undefined, consent_marketing: false, website: '' },
  });

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      pushEvent(EVENTS.formStart, { landing_slug: landing.slug, segment: landing.segment });
    }
  };

  const submitLabel = variant === 'hero' ? landing.hero.submitLabel : landing.finalCta.submitLabel;

  const onSubmit = async (data: FormData) => {
    setServerError('');

    const eventId = crypto.randomUUID();
    const ft = getFirstTouch();
    const lt = getLastTouch();

    const payload = {
      ...data,
      landing_slug: landing.slug,
      segment: landing.segment,
      event_id: eventId,
      utm_source: getSessionParam('utm_source'),
      utm_medium: getSessionParam('utm_medium'),
      utm_campaign: getSessionParam('utm_campaign'),
      utm_content: getSessionParam('utm_content'),
      utm_term: getSessionParam('utm_term'),
      gclid: getSessionParam('gclid'),
      gbraid: getSessionParam('gbraid'),
      wbraid: getSessionParam('wbraid'),
      fbclid: getSessionParam('fbclid'),
      ttclid: getSessionParam('ttclid'),
      msclkid: getSessionParam('msclkid'),
      referrer: getSessionParam('referrer') || document.referrer,
      landing_url: getSessionParam('landing_url') || window.location.href,
      first_touch: ft,
      last_touch: lt,
      user_agent: navigator.userAgent,
      _t: timestampRef.current,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.ok) {
        sessionStorage.setItem('fdk_lp_event_id', eventId);
        sessionStorage.setItem('fdk_lp_slug', landing.slug);
        sessionStorage.setItem('fdk_lp_segment', landing.segment);
        router.push(`/lp/${landing.slug}/dziekujemy`);
      } else if (result.error === 'rate_limited') {
        setServerError('Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę.');
      } else {
        setServerError('Coś poszło nie tak. Spróbuj ponownie albo zadzwoń: +48 575 594 500');
      }
    } catch {
      setServerError('Coś poszło nie tak. Spróbuj ponownie albo zadzwoń: +48 575 594 500');
    }
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow';
  const labelCls = 'block text-sm font-medium text-ink mb-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" onFocus={handleFormFocus}>
      {/* Honeypot */}
      <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`website-${variant}`}>Website</label>
        <input id={`website-${variant}`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label htmlFor={`name-${variant}`} className={labelCls}>Imię i nazwisko *</label>
        <input id={`name-${variant}`} type="text" autoComplete="name" className={inputCls} {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-red-500 text-sm mt-1" role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor={`email-${variant}`} className={labelCls}>E-mail *</label>
        <input id={`email-${variant}`} type="email" autoComplete="email" className={inputCls} {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-red-500 text-sm mt-1" role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor={`phone-${variant}`} className={labelCls}>Telefon *</label>
        <input id={`phone-${variant}`} type="tel" autoComplete="tel" className={inputCls} {...register('phone')} aria-invalid={!!errors.phone} />
        {errors.phone && <p className="text-red-500 text-sm mt-1" role="alert">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor={`sytuacja-${variant}`} className={labelCls}>{landing.form.sytuacjaLabel}</label>
        <select id={`sytuacja-${variant}`} className={inputCls} {...register('sytuacja')}>
          <option value="">—</option>
          {landing.form.sytuacjaOptions.map((opt) => <option key={opt} value={toValue(opt)}>{opt}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor={`branza-${variant}`} className={labelCls}>{landing.form.branzaLabel}</label>
        <select id={`branza-${variant}`} className={inputCls} {...register('branza')}>
          <option value="">—</option>
          {landing.form.branzaOptions.map((opt) => <option key={opt} value={toValue(opt)}>{opt}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor={`start-${variant}`} className={labelCls}>{landing.form.startLabel}</label>
        <select id={`start-${variant}`} className={inputCls} {...register('start_date')}>
          <option value="">—</option>
          {landing.form.startOptions.map((opt) => <option key={opt} value={toValue(opt)}>{opt}</option>)}
        </select>
      </div>

      {variant === 'full' && (
        <div>
          <label htmlFor={`message-${variant}`} className={labelCls}>Wiadomość (opcjonalnie)</label>
          <textarea id={`message-${variant}`} rows={3} className={`${inputCls} resize-y`} {...register('message')} />
        </div>
      )}

      <div className="flex items-start gap-3">
        <input id={`consent-rodo-${variant}`} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" {...register('consent_rodo')} aria-invalid={!!errors.consent_rodo} />
        <label htmlFor={`consent-rodo-${variant}`} className="text-sm text-body leading-snug">
          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu, zgodnie z{' '}
          <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Polityką Prywatności</a>.
          {' '}Administratorem danych jest Fundacja Firma dla Każdego, ul. Lwowska 17/4, 00-660 Warszawa (NIP: 5252625624). *
        </label>
      </div>
      {errors.consent_rodo && <p className="text-red-500 text-sm" role="alert">{errors.consent_rodo.message}</p>}

      <div className="flex items-start gap-3">
        <input id={`consent-mkt-${variant}`} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" {...register('consent_marketing')} />
        <label htmlFor={`consent-mkt-${variant}`} className="text-sm text-body leading-snug">
          Chcę otrzymywać informacje o usługach Fundacji e-mailem lub telefonicznie. Zgodę mogę wycofać w każdej chwili.
        </label>
      </div>

      {serverError && <p className="text-red-500 text-sm" role="alert" aria-live="assertive">{serverError}</p>}

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
            Wysyłanie…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
