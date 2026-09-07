'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LandingContent } from '@/content/landings';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { getFirstTouch, getLastTouch, getSessionParam } from '@/lib/attribution';
import { DISPOSABLE_DOMAINS } from '@/lib/disposable-domains';

const DESC_MIN = 20;
const DESC_MAX = 1000;

function makeSchema() {
  return z.object({
    firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
    lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
    email: z.string().min(1, 'Podaj adres e-mail').email('Podaj poprawny adres e-mail').refine(
      (v) => !DISPOSABLE_DOMAINS.has(v.split('@')[1]?.toLowerCase()),
      'Podaj stały adres e-mail, nie jednorazowy'
    ),
    phone: z.string().optional(),
    description: z.string()
      .min(DESC_MIN, `Opisz swoją sytuację (min. ${DESC_MIN} znaków)`)
      .max(DESC_MAX, `Maksymalnie ${DESC_MAX} znaków`),
    consent_rodo: z.literal(true, { errorMap: () => ({ message: 'Zgoda na przetwarzanie danych jest wymagana' }) }),
    consent_marketing: z.boolean().optional(),
    website: z.string().max(0).optional(),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function LeadForm({
  landing,
  variant = 'hero',
}: {
  landing: LandingContent;
  variant?: 'hero' | 'full';
}) {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [formStarted, setFormStarted] = useState(false);
  const timestampRef = useRef(Date.now());

  const schema = makeSchema();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent_rodo: undefined, consent_marketing: false, website: '', phone: '' },
  });

  const descVal = watch('description') || '';

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      pushEvent(EVENTS.formStart, { landing_slug: landing.slug, segment: landing.segment });
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError('');
    const eventId = crypto.randomUUID();
    const ft = getFirstTouch();
    const lt = getLastTouch();

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      description: data.description,
      consent_rodo: data.consent_rodo,
      consent_marketing: data.consent_marketing || false,
      website: data.website,
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
        setSuccess(data.email);
        pushEvent(EVENTS.formSubmit, { landing_slug: landing.slug, segment: landing.segment, event_id: eventId });
      } else if (result.error === 'rate_limited') {
        setServerError('Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę.');
      } else {
        setServerError('Nie udało się wysłać formularza. Spróbuj ponownie lub napisz na kontakt@firmadlakazdego.pl');
      }
    } catch {
      setServerError('Nie udało się wysłać formularza. Spróbuj ponownie lub napisz na kontakt@firmadlakazdego.pl');
    }
  };

  // ── Success ──
  if (success) {
    return (
      <div className="bg-brand/5 border border-brand/20 rounded-[12px] p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-ink mb-3">Dziękujemy za wiadomość!</h3>
        <p className="text-body text-sm">
          Otrzymaliśmy Twoje zgłoszenie i niezwłocznie się z Tobą skontaktujemy.
          Potwierdzenie wysłaliśmy na adres <strong className="text-ink">{success}</strong>.
        </p>
      </div>
    );
  }

  const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-[4px] text-ink text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow';
  const lbl = 'block text-xs font-medium text-ink mb-1';
  const err = 'text-red-500 text-xs mt-0.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3" onFocus={handleFormFocus}>
      <p className="text-[11px] text-body">* pole wymagane</p>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
        <label htmlFor={`hp-${variant}`}>Website</label>
        <input id={`hp-${variant}`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Imię + Nazwisko — one row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`fn-${variant}`} className={lbl}>Imię *</label>
          <input id={`fn-${variant}`} type="text" autoComplete="given-name" className={inp} {...register('firstName')} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? `fn-e-${variant}` : undefined} />
          {errors.firstName && <p id={`fn-e-${variant}`} className={err} role="alert">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor={`ln-${variant}`} className={lbl}>Nazwisko *</label>
          <input id={`ln-${variant}`} type="text" autoComplete="family-name" className={inp} {...register('lastName')} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? `ln-e-${variant}` : undefined} />
          {errors.lastName && <p id={`ln-e-${variant}`} className={err} role="alert">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* E-mail */}
      <div>
        <label htmlFor={`em-${variant}`} className={lbl}>E-mail *</label>
        <input id={`em-${variant}`} type="email" autoComplete="email" className={inp} {...register('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? `em-e-${variant}` : undefined} />
        {errors.email && <p id={`em-e-${variant}`} className={err} role="alert">{errors.email.message}</p>}
      </div>

      {/* Telefon */}
      <div>
        <label htmlFor={`ph-${variant}`} className={lbl}>Telefon (opcjonalnie)</label>
        <input id={`ph-${variant}`} type="tel" autoComplete="tel" className={inp} {...register('phone')} />
      </div>

      {/* Opis */}
      <div>
        <label htmlFor={`desc-${variant}`} className={lbl}>Krótki opis Twojej działalności *</label>
        <textarea
          id={`desc-${variant}`}
          rows={3}
          className={`${inp} resize-y`}
          placeholder={landing.form.descriptionPlaceholder}
          {...register('description')}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? `desc-e-${variant}` : `desc-c-${variant}`}
        />
        <div className="flex justify-between mt-0.5">
          {errors.description ? <p id={`desc-e-${variant}`} className={err} role="alert">{errors.description.message}</p> : <span />}
          <span id={`desc-c-${variant}`} className={`text-[11px] ${descVal.length > DESC_MAX ? 'text-red-500' : 'text-body'}`}>{descVal.length}/{DESC_MAX}</span>
        </div>
      </div>

      {/* Zgody — compact */}
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-[11px] text-body leading-snug cursor-pointer">
          <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0" {...register('consent_rodo')} aria-invalid={!!errors.consent_rodo} aria-describedby={errors.consent_rodo ? `rodo-e-${variant}` : undefined} />
          <span>
            Wyrażam zgodę na przetwarzanie danych osobowych w celu odpowiedzi na zapytanie. Zapoznałem/am się z{' '}
            <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Polityką prywatności</a>. *
          </span>
        </label>
        {errors.consent_rodo && <p id={`rodo-e-${variant}`} className={err} role="alert">{errors.consent_rodo.message}</p>}

        <label className="flex items-start gap-2 text-[11px] text-body leading-snug cursor-pointer">
          <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0" {...register('consent_marketing')} />
          <span>Chcę otrzymywać informacje o usługach Fundacji e-mailem lub telefonicznie. Zgodę mogę wycofać w każdej chwili.</span>
        </label>
      </div>

      {/* Error */}
      {serverError && <p className="text-red-500 text-xs" role="alert" aria-live="assertive">{serverError}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand hover:bg-brandDark disabled:opacity-60 text-white font-semibold py-3.5 rounded-[4px] transition-colors flex items-center justify-center gap-2 text-base"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Wysyłanie…
          </>
        ) : (
          landing.hero.submitLabel
        )}
      </button>

      <p className="text-[11px] text-body text-center">Odpowiemy tak szybko, jak to możliwe.</p>

      {/* Klauzula informacyjna — collapsible */}
      <details className="text-[10px] text-body/50 leading-relaxed">
        <summary className="cursor-pointer hover:text-body text-[11px]">Więcej o przetwarzaniu danych</summary>
        <p className="mt-2">
          Administratorem danych osobowych jest Fundacja Firma Dla Każdego, ul. Lwowska 17/4, 00-660 Warszawa, e-mail: kontakt@firmadlakazdego.pl (NIP: 5252625624).
          Dane przetwarzane są w celu odpowiedzi na zapytanie (art. 6 ust. 1 lit. b RODO) oraz, w przypadku wyrażenia zgody, w celach marketingowych (art. 6 ust. 1 lit. a RODO).
          Dane przechowywane będą przez okres niezbędny do realizacji celu przetwarzania.
          Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu.
          Zgodę na marketing możesz wycofać w każdej chwili. Masz prawo wniesienia skargi do Prezesa UODO.
          Szczegóły w <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">Polityce prywatności</a>.
        </p>
      </details>
    </form>
  );
}
