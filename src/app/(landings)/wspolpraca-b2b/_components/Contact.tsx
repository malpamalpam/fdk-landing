'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { NAVY, BLUE, MID, GRAD } from '../_lib/tokens';
import { useLang } from './LangProvider';
import GlowCard from './GlowCard';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { getFirstTouch, getLastTouch, getSessionParam } from '@/lib/attribution';
import { DISPOSABLE_DOMAINS } from '@/lib/disposable-domains';

const DESC_MIN = 10;
const DESC_MAX = 1000;

function makeSchema(v: { nameMin: string; emailRequired: string; emailInvalid: string; emailDisposable: string; descMin: string; descMax: string; consentRequired: string }) {
  return z.object({
    firstName: z.string().min(2, v.nameMin),
    email: z.string().min(1, v.emailRequired).email(v.emailInvalid).refine(
      (e) => !DISPOSABLE_DOMAINS.has(e.split('@')[1]?.toLowerCase()),
      v.emailDisposable
    ),
    phone: z.string().optional(),
    description: z.string().min(DESC_MIN, v.descMin).max(DESC_MAX, v.descMax),
    consent_rodo: z.literal(true, { errorMap: () => ({ message: v.consentRequired }) }),
    consent_marketing: z.boolean().optional(),
    website: z.string().max(0).optional(),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function Contact() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const timestampRef = useRef(Date.now());

  const schema = makeSchema(t.contact.validation);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent_rodo: undefined, consent_marketing: false, website: '', phone: '' },
  });

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      pushEvent(EVENTS.formStart, { landing_slug: 'landing3', segment: 'wspolpraca-b2b' });
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError('');
    const eventId = crypto.randomUUID();
    const ft = getFirstTouch();
    const lt = getLastTouch();
    const langTag = lang === 'UA' ? 'UK' : lang;

    const payload = {
      firstName: data.firstName,
      lastName: '',
      email: data.email,
      phone: data.phone || '',
      description: `Język: ${langTag} | ${data.description}`,
      consent_rodo: data.consent_rodo,
      consent_marketing: data.consent_marketing || false,
      website: data.website,
      landing_slug: 'landing3',
      segment: 'wspolpraca-b2b',
      locale: langTag.toLowerCase(),
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
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.ok) {
        sessionStorage.setItem('fdk_lp_event_id', eventId);
        sessionStorage.setItem('fdk_lp_slug', 'landing3');
        sessionStorage.setItem('fdk_lp_segment', 'wspolpraca-b2b');
        pushEvent(EVENTS.formSubmit, { landing_slug: 'landing3', segment: 'wspolpraca-b2b', event_id: eventId });
        router.push('/lp-dziekujemy');
      } else if (result.error === 'rate_limited') {
        setServerError('Too many requests. Please try again shortly.');
      } else {
        setServerError(result.detail || result.error || 'Error');
      }
    } catch {
      setServerError('Network error. Please try again.');
    }
  };

  const inp = `w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all border border-[rgba(15,23,42,0.12)] bg-[#F1F5F9] text-[#0F172A] focus:border-[#2563EB] focus:bg-white`;
  const lbl = 'block text-sm font-semibold mb-1.5';
  const errCls = 'text-red-500 text-[11px] mt-0.5';

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-black mb-4" style={{ color: NAVY, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {t.contact.heading}
          </h2>
          <p className="leading-relaxed max-w-lg mx-auto text-base" style={{ color: MID }}>{t.contact.sub}</p>
        </div>

        <GlowCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5" onFocus={handleFormFocus}>
            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
              <label htmlFor="ws-contact">Website</label>
              <input id="ws-contact" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
            </div>

            {/* Imię */}
            <div>
              <label htmlFor="fn-contact" className={lbl} style={{ color: NAVY }}>
                {t.contact.fields.name}<span style={{ color: BLUE }}> *</span>
              </label>
              <input
                id="fn-contact" type="text" autoComplete="given-name"
                className={inp}
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <p className={errCls} role="alert">{errors.firstName.message}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="em-contact" className={lbl} style={{ color: NAVY }}>
                {t.contact.fields.email}<span style={{ color: BLUE }}> *</span>
              </label>
              <input
                id="em-contact" type="email" autoComplete="email"
                className={inp}
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className={errCls} role="alert">{errors.email.message}</p>}
            </div>

            {/* Telefon */}
            <div className="sm:col-span-2">
              <label htmlFor="ph-contact" className={lbl} style={{ color: NAVY }}>
                {t.contact.fields.phone}
              </label>
              <input
                id="ph-contact" type="tel" autoComplete="tel"
                className={inp}
                {...register('phone')}
              />
            </div>

            {/* Opis */}
            <div className="sm:col-span-2">
              <label htmlFor="desc-contact" className={lbl} style={{ color: NAVY }}>
                {t.contact.fields.description}<span style={{ color: BLUE }}> *</span>
              </label>
              <textarea
                id="desc-contact" rows={3}
                placeholder={t.contact.fields.descriptionPlaceholder}
                className={`${inp} resize-y`}
                {...register('description')}
                aria-invalid={!!errors.description}
              />
              {errors.description && <p className={errCls} role="alert">{errors.description.message}</p>}
            </div>

            {/* Zgody */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-start gap-2 text-[11px] leading-snug cursor-pointer" style={{ color: MID }}>
                <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded flex-shrink-0 accent-blue-600" {...register('consent_rodo')} aria-invalid={!!errors.consent_rodo} />
                <span>
                  {t.contact.consentRodo}{' '}
                  <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">{t.contact.privacyLink}</a>. *
                </span>
              </label>
              {errors.consent_rodo && <p className={errCls} role="alert">{errors.consent_rodo.message}</p>}

              <label className="flex items-start gap-2 text-[11px] leading-snug cursor-pointer" style={{ color: MID }}>
                <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded flex-shrink-0 accent-blue-600" {...register('consent_marketing')} />
                <span>{t.contact.consentMarketing}</span>
              </label>
            </div>

            {serverError && <p className="sm:col-span-2 text-red-500 text-xs" role="alert">{serverError}</p>}

            <div className="sm:col-span-2 text-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-xl text-base text-white transition-all disabled:opacity-60 hover:shadow-lg"
                style={{ background: GRAD, boxShadow: '0 4px 20px rgba(37,99,235,0.25)' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    ...
                  </>
                ) : (
                  <>
                    {t.contact.submit}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </GlowCard>
      </div>
    </section>
  );
}
