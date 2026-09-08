import { z } from 'zod';
import { DISPOSABLE_DOMAINS } from './disposable-domains';

export const leadSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki').max(100),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki').max(100),
  email: z.string().min(1, 'Podaj adres e-mail').email('Podaj poprawny adres e-mail').refine(
    (v) => !DISPOSABLE_DOMAINS.has(v.split('@')[1]?.toLowerCase()),
    'Podaj stały adres e-mail, nie jednorazowy'
  ),
  phone: z.string().optional().transform((v) => v?.replace(/[\s-]/g, '') || '').pipe(
    z.string().refine(
      (v) => !v || /^\+?\d{9,15}$/.test(v),
      'Podaj poprawny numer telefonu'
    )
  ),
  description: z.string().min(20, 'Opisz swoją sytuację (min. 20 znaków)').max(2000),
  source: z.string().min(1, 'Brak źródła'),
  consent_rodo: z.literal(true, { errorMap: () => ({ message: 'Zgoda na przetwarzanie danych jest wymagana' }) }),
  consent_marketing: z.boolean().optional(),
  website: z.string().max(0).optional(), // honeypot
  // UTMs and attribution — filled automatically
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referrer_url: z.string().optional(),
  landing_url: z.string().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

// Client-side schema (without source — it's set by the component)
export const clientLeadSchema = leadSchema.omit({
  source: true,
  utm_source: true,
  utm_medium: true,
  utm_campaign: true,
  referrer_url: true,
  landing_url: true,
});
