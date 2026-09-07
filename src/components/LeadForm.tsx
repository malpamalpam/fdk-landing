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
  variant = 'full',
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

  const descriptionValue = watch('description') || '';

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
        // Store for thank-you page events
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

  // ── Success state ──
  if (success) {
    return (
      <div className="bg-brand/5 border border-brand/20 rounded-[12px] p-6 text-center">
        <h3 className="text-2xl font-bold text-ink mb-3">Dziękujemy za wiadomość!</h3>
        <p className="text-body">
          Otrzymaliśmy Twoje zgłoszenie i niezwłocznie się z Tobą skontaktujemy.
          Potwierdzenie wysłaliśmy na adres <strong>{success}</strong>.
        </p>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-[4px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow';
  const labelCls = 'block text-sm font-medium text-ink mb-1';
  const errCls = 'text-red-500 text-sm mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" onFocus={handleFormFocus}>
      <p className="text-xs text-body mb-2">* pole wymagane</p>

      {/* Honeypot — invisible to users */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
        <label htmlFor={`hp-${variant}`}>Website</label>
        <input id={`hp-${variant}`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Imię */}
      <div>
        <label htmlFor={`fn-${variant}`} className={labelCls}>Imię *</label>
        <input id={`fn-${variant}`} type="text" autoComplete="given-name" className={inputCls} {...register('firstName')} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? `fn-err-${variant}` : undefined} />
        {errors.firstName && <p id={`fn-err-${variant}`} className={errCls} role="alert">{errors.firstName.message}</p>}
      </div>

      {/* Nazwisko */}
      <div>
        <label htmlFor={`ln-${variant}`} className={labelCls}>Nazwisko *</label>
        <input id={`ln-${variant}`} type="text" autoComplete="family-name" className={inputCls} {...register('lastName')} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? `ln-err-${variant}` : undefined} />
        {errors.lastName && <p id={`ln-err-${variant}`} className={errCls} role="alert">{errors.lastName.message}</p>}
      </div>

      {/* E-mail */}
      <div>
        <label htmlFor={`em-${variant}`} className={labelCls}>E-mail *</label>
        <input id={`em-${variant}`} type="email" autoComplete="email" className={inputCls} {...register('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? `em-err-${variant}` : undefined} />
        {errors.email && <p id={`em-err-${variant}`} className={errCls} role="alert">{errors.email.message}</p>}
      </div>

      {/* Telefon (opcjonalnie) */}
      <div>
        <label htmlFor={`ph-${variant}`} className={labelCls}>Telefon (opcjonalnie)</label>
        <input id={`ph-${variant}`} type="tel" autoComplete="tel" className={inputCls} {...register('phone')} />
      </div>

      {/* Opis działalności */}
      <div>
        <label htmlFor={`desc-${variant}`} className={labelCls}>Krótki opis Twojej działalności *</label>
        <textarea
          id={`desc-${variant}`}
          rows={variant === 'hero' ? 3 : 4}
          className={`${inputCls} resize-y`}
          placeholder={landing.form.descriptionPlaceholder}
          {...register('description')}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? `desc-err-${variant}` : `desc-count-${variant}`}
        />
        <div className="flex justify-between items-start mt-1">
          {errors.description ? (
            <p id={`desc-err-${variant}`} className={errCls} role="alert">{errors.description.message}</p>
          ) : <span />}
          <span id={`desc-count-${variant}`} className={`text-xs ${descriptionValue.length > DESC_MAX ? 'text-red-500' : 'text-body'}`}>
            {descriptionValue.length}/{DESC_MAX}
          </span>
        </div>
      </div>

      {/* Zgoda RODO */}
      <div className="flex items-start gap-3">
        <input id={`rodo-${variant}`} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" {...register('consent_rodo')} aria-invalid={!!errors.consent_rodo} aria-describedby={errors.consent_rodo ? `rodo-err-${variant}` : undefined} />
        <label htmlFor={`rodo-${variant}`} className="text-sm text-body leading-snug">
          Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w formularzu przez Fundację Firma Dla Każdego w celu udzielenia odpowiedzi na moje zapytanie. Zapoznałem/am się z{' '}
          <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Polityką prywatności</a>. *
        </label>
      </div>
      {errors.consent_rodo && <p id={`rodo-err-${variant}`} className={errCls} role="alert">{errors.consent_rodo.message}</p>}

      {/* Zgoda marketingowa */}
      <div className="flex items-start gap-3">
        <input id={`mkt-${variant}`} type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" {...register('consent_marketing')} />
        <label htmlFor={`mkt-${variant}`} className="text-sm text-body leading-snug">
          Chcę otrzymywać informacje o usługach Fundacji e-mailem lub telefonicznie. Zgodę mogę wycofać w każdej chwili.
        </label>
      </div>

      {/* Błąd serwera */}
      {serverError && <p className="text-red-500 text-sm" role="alert" aria-live="assertive">{serverError}</p>}

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
            Wysyłanie…
          </>
        ) : (
          submitLabel
        )}
      </button>

      <p className="text-sm text-body text-center">Odpowiemy tak szybko, jak to możliwe.</p>

      {/* Klauzula informacyjna */}
      <div className="text-[11px] text-body/60 leading-relaxed mt-4 border-t border-gray-100 pt-4">
        Administratorem danych osobowych jest [FDK: pełna nazwa Fundacji], z siedzibą pod adresem [FDK: adres], e-mail: [FDK: adres e-mail kontaktowy].
        Dane przetwarzane są w celu odpowiedzi na zapytanie (art. 6 ust. 1 lit. b RODO) oraz, w przypadku wyrażenia zgody, w celach marketingowych (art. 6 ust. 1 lit. a RODO).
        Dane przechowywane będą przez okres niezbędny do realizacji celu przetwarzania, nie dłużej niż [FDK: okres przechowywania].
        Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu wobec przetwarzania.
        Zgodę na marketing możesz wycofać w każdej chwili. Masz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
        Szczegóły w <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">Polityce prywatności</a>.
      </div>
    </form>
  );
}
