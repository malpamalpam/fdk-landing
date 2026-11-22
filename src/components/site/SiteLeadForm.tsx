'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import type { SiteContent } from '@/content/site-types';
import { SITES } from '@/config/sites';
import { pushEvent, EVENTS } from '@/lib/analytics';
import { getFirstTouch, getLastTouch, getSessionParam } from '@/lib/attribution';
import { DISPOSABLE_DOMAINS } from '@/lib/disposable-domains';

function makeSchema(content: SiteContent) {
  return z.object({
    name: z.string().min(2, content.site === 'tutors' ? 'At least 2 characters' : content.site === 'creative' ? 'Минимум 2 символа' : 'Minimum 2 znaki'),
    phone: z.string().min(1, content.site === 'tutors' ? 'Required' : content.site === 'creative' ? 'Обязательно' : 'Wymagane'),
    email: z
      .string()
      .min(1, content.site === 'tutors' ? 'Required' : content.site === 'creative' ? 'Обязательно' : 'Wymagane')
      .email(content.site === 'tutors' ? 'Enter a valid email' : content.site === 'creative' ? 'Введи корректный e-mail' : 'Podaj poprawny adres e-mail')
      .refine(
        (v) => !DISPOSABLE_DOMAINS.has(v.split('@')[1]?.toLowerCase()),
        content.site === 'tutors' ? 'Use a permanent email address' : content.site === 'creative' ? 'Используй постоянный адрес' : 'Podaj stały adres e-mail'
      ),
    situation: z.string().min(1, content.site === 'tutors' ? 'Select your situation' : content.site === 'creative' ? 'Выбери ситуацию' : 'Wybierz sytuację'),
    industry: z.string().optional(),
    message: z.string().optional(),
    consent_privacy: z.literal(true, {
      errorMap: () => ({
        message: content.site === 'tutors' ? 'Consent is required' : content.site === 'creative' ? 'Согласие обязательно' : 'Zgoda jest wymagana',
      }),
    }),
    consent_marketing: z.boolean().optional(),
    website: z.string().max(0).optional(),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function SiteLeadForm({
  content,
  variant = 'hero',
}: {
  content: SiteContent;
  variant?: 'hero' | 'full';
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const timestampRef = useRef(Date.now());

  const schema = makeSchema(content);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent_privacy: undefined,
      consent_marketing: false,
      website: '',
      situation: '',
      industry: '',
      message: '',
    },
  });

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      pushEvent(EVENTS.formStart, { site: content.site, segment: content.site });
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError('');
    const eventId = crypto.randomUUID();
    const ft = getFirstTouch();
    const lt = getLastTouch();

    const siteConfig = SITES[content.site as keyof typeof SITES];
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      situation: data.situation,
      industry: data.industry || '',
      message: data.message || '',
      consent_privacy: true,
      consent_marketing: data.consent_marketing || false,
      website: data.website,
      site: content.site,
      segment: content.site,
      locale: siteConfig?.htmlLang || content.site,
      event_id: eventId,
      hook_variant: new URLSearchParams(window.location.search).get('h') || 'a',
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
        sessionStorage.setItem('fdk_site_event_id', eventId);
        sessionStorage.setItem('fdk_site_id', content.site);
        pushEvent(EVENTS.formSubmit, { site: content.site, segment: content.site, event_id: eventId });
        // On custom domains middleware rewrites /dziekujemy → /site/{site}/dziekujemy
        // On vercel.app/localhost we need the full /site/{site}/dziekujemy path
        const isCustomDomain = !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('localhost');
        router.push(isCustomDomain ? '/dziekujemy' : `/site/${content.site}/dziekujemy`);
      } else if (result.error === 'rate_limited') {
        setServerError(
          content.site === 'tutors'
            ? 'Too many submissions. Please try again shortly.'
            : content.site === 'creative'
              ? 'Слишком много заявок. Попробуй позже.'
              : 'Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę.'
        );
      } else {
        setServerError(
          content.site === 'tutors'
            ? 'Could not submit the form. Please try again or email kontakt@firmadlakazdego.pl'
            : content.site === 'creative'
              ? 'Не удалось отправить форму. Попробуй снова или напиши kontakt@firmadlakazdego.pl'
              : 'Nie udało się wysłać formularza. Spróbuj ponownie lub napisz na kontakt@firmadlakazdego.pl'
        );
      }
    } catch {
      setServerError(
        content.site === 'tutors'
          ? 'Could not submit the form. Please try again or email kontakt@firmadlakazdego.pl'
          : content.site === 'creative'
            ? 'Не удалось отправить форму. Попробуй снова или напиши kontakt@firmadlakazdego.pl'
            : 'Nie udało się wysłać formularza. Spróbuj ponownie lub napisz na kontakt@firmadlakazdego.pl'
      );
    }
  };

  const isHero = variant === 'hero';
  const inp = `w-full px-3.5 py-2.5 border ${isHero ? 'border-lavender/30 bg-navySoft text-white placeholder-lavender/60' : 'border-gray-200 bg-white text-navy placeholder-muted/50'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-shadow`;
  const lbl = `block text-sm font-medium ${isHero ? 'text-lavender' : 'text-navy'} mb-1`;
  const errCls = `text-red-400 text-[11px] mt-0.5`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3" onFocus={handleFormFocus}>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
        <label htmlFor={`hp-site-${variant}`}>Website</label>
        <input id={`hp-site-${variant}`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Name */}
      <div>
        <label htmlFor={`name-${variant}`} className={lbl}>{content.form.nameLabel} *</label>
        <input id={`name-${variant}`} type="text" autoComplete="name" className={inp} {...register('name')} />
        {errors.name && <p className={errCls} role="alert">{errors.name.message}</p>}
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`phone-${variant}`} className={lbl}>{content.form.phoneLabel} *</label>
          <input id={`phone-${variant}`} type="tel" autoComplete="tel" className={inp} {...register('phone')} />
          {errors.phone && <p className={errCls} role="alert">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor={`email-${variant}`} className={lbl}>{content.form.emailLabel} *</label>
          <input id={`email-${variant}`} type="email" autoComplete="email" className={inp} {...register('email')} />
          {errors.email && <p className={errCls} role="alert">{errors.email.message}</p>}
        </div>
      </div>

      {/* Situation */}
      <div>
        <label htmlFor={`sit-${variant}`} className={lbl}>{content.form.situationLabel} *</label>
        <select id={`sit-${variant}`} className={inp} {...register('situation')}>
          <option value="">{content.form.selectPlaceholder}</option>
          {content.form.situationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.situation && <p className={errCls} role="alert">{errors.situation.message}</p>}
      </div>

      {/* Industry */}
      <div>
        <label htmlFor={`ind-${variant}`} className={lbl}>{content.form.industryLabel}</label>
        <select id={`ind-${variant}`} className={inp} {...register('industry')}>
          <option value="">{content.form.selectPlaceholder}</option>
          {content.form.industryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`msg-${variant}`} className={lbl}>{content.form.messageLabel}</label>
        <textarea id={`msg-${variant}`} rows={2} className={`${inp} resize-y`} {...register('message')} />
      </div>

      {/* Consents */}
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-[11px] leading-snug cursor-pointer">
          <input
            type="checkbox"
            className={`mt-0.5 w-3.5 h-3.5 rounded flex-shrink-0 ${isHero ? 'border-lavender/30 text-lime focus:ring-lime' : 'border-gray-300 text-lime focus:ring-lime'}`}
            {...register('consent_privacy')}
          />
          <span
            className={isHero ? 'text-lavender' : 'text-muted'}
            dangerouslySetInnerHTML={{ __html: content.form.consentPrivacy + ' *' }}
          />
        </label>
        {errors.consent_privacy && <p className={errCls} role="alert">{errors.consent_privacy.message}</p>}

        <label className="flex items-start gap-2 text-[11px] leading-snug cursor-pointer">
          <input
            type="checkbox"
            className={`mt-0.5 w-3.5 h-3.5 rounded flex-shrink-0 ${isHero ? 'border-lavender/30 text-lime focus:ring-lime' : 'border-gray-300 text-lime focus:ring-lime'}`}
            {...register('consent_marketing')}
          />
          <span className={isHero ? 'text-lavender' : 'text-muted'}>{content.form.consentMarketing}</span>
        </label>
      </div>

      {/* Error */}
      {serverError && <p className="text-red-400 text-xs" role="alert">{serverError}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-lime hover:bg-limeSoft disabled:opacity-60 text-navy font-bold py-3.5 rounded-pill transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {content.site === 'tutors' ? 'Sending...' : content.site === 'creative' ? 'Отправка...' : 'Wysyłanie...'}
          </>
        ) : (
          <>
            {content.form.submit}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className={`text-[11px] text-center ${isHero ? 'text-lavender/60' : 'text-muted/60'}`}>
        {content.form.note}
      </p>
    </form>
  );
}
