import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

const schema = z.object({
  // Accepts both old (name) and new (firstName+lastName) format
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  // Old i18n landing fields
  situation: z.string().optional(),
  industry: z.string().optional(),
  // Landing page fields
  sytuacja: z.string().optional(),
  branza: z.string().optional(),
  description: z.string().optional(),
  consent_rodo: z.boolean().optional(),
  landing_slug: z.string().optional(),
  // Common fields
  start_date: z.string().optional(),
  message: z.string().optional(),
  consent_privacy: z.boolean().optional(),
  consent_marketing: z.boolean().optional(),
  consent_state: z.any().optional(),
  website: z.string().max(0).optional(),
  segment: z.string().optional(),
  locale: z.string().optional(),
  hook_variant: z.string().optional(),
  event_id: z.string().optional(),
  submitted_at: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  gclid: z.string().optional(),
  gbraid: z.string().optional(),
  wbraid: z.string().optional(),
  fbclid: z.string().optional(),
  ttclid: z.string().optional(),
  msclkid: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  landing_url: z.string().optional(),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  // Attribution — old format (flat fields)
  first_touch_source: z.string().optional(),
  first_touch_medium: z.string().optional(),
  first_touch_campaign: z.string().optional(),
  first_touch_at: z.string().optional(),
  first_touch_url: z.string().optional(),
  last_touch_source: z.string().optional(),
  last_touch_medium: z.string().optional(),
  last_touch_campaign: z.string().optional(),
  last_touch_at: z.string().optional(),
  // Attribution — new format (JSON)
  first_touch: z.any().optional(),
  last_touch: z.any().optional(),
  _t: z.number().optional(),
});

// Rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string, maxCount = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxCount;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // If starts with 0, remove leading 0 and add 48 (Poland)
  if (digits.startsWith('0')) return '48' + digits.slice(1);
  // If doesn't start with country code, add 48
  if (digits.length <= 9) return '48' + digits;
  return digits;
}

function splitName(fullName: string): { fn: string; ln: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { fn: parts[0], ln: '' };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
}

async function sendMetaCAPI(data: z.infer<typeof schema>, ip: string, userAgent: string) {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const fn = data.firstName || splitName(data.name || '').fn;
  const ln = data.lastName || splitName(data.name || '').ln;
  const normalizedPhone = normalizePhone(data.phone || '');

  const eventData: Record<string, unknown> = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: data.event_id,
    event_source_url: data.landing_url || '',
    action_source: 'website',
    user_data: {
      em: [sha256(data.email.toLowerCase().trim())],
      ph: [sha256(normalizedPhone)],
      fn: [sha256(fn.toLowerCase().trim())],
      ...(ln && { ln: [sha256(ln.toLowerCase().trim())] }),
      client_ip_address: ip,
      client_user_agent: userAgent,
      ...(data.fbp && { fbp: data.fbp }),
      ...(data.fbc && { fbc: data.fbc }),
    },
    custom_data: {
      segment: data.segment,
      situation: data.situation,
      industry: data.industry,
      locale: data.locale,
      content_name: 'lead_form',
      currency: 'PLN',
      value: 0,
    },
  };

  const body: Record<string, unknown> = {
    data: [eventData],
  };

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  if (testCode) {
    body.test_event_code = testCode;
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  return { status: res.status, body: await res.text() };
}

async function sendTikTokEvent(data: z.infer<typeof schema>, ip: string, userAgent: string) {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const normalizedPhone = normalizePhone(data.phone || '');

  const eventData = {
    event: 'SubmitForm',
    event_id: data.event_id,
    timestamp: new Date().toISOString(),
    context: {
      user_agent: userAgent,
      ip: ip,
      user: {
        email: sha256(data.email.toLowerCase().trim()),
        phone_number: sha256(normalizedPhone),
      },
    },
    properties: {
      content_name: 'lead_form',
    },
  };

  try {
    await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify({
        pixel_code: pixelId,
        data: [eventData],
      }),
    });
  } catch (e) {
    console.error('TikTok Events API error:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const body = await request.json();
    const isNewLp = !!body.landing_slug;
    // New landings: 3/hour; old landing: 5/10min
    if (isRateLimited(ip, isNewLp ? 3 : 5, isNewLp ? 60 * 60 * 1000 : 10 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }

    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 });
    }

    const data = result.data;

    // Honeypot
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Time check
    if (data._t && Date.now() - data._t < 3000) {
      return NextResponse.json({ ok: true });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ ok: false, error: 'config' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const userAgent = request.headers.get('user-agent') || '';

    const or = (v: string | undefined) => v || null;
    const orTs = (v: string | undefined) => (v && v.length > 0 ? v : null);

    // Build insert row — supports both old i18n landing and new slug landings
    const isNewLanding = !!data.landing_slug;
    const ft = data.first_touch;
    const lt = data.last_touch;

    // Build name from firstName+lastName or use name field
    const fullName = data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.name || '';

    const insertRow: Record<string, unknown> = {
      name: fullName,
      phone: data.phone || '',
      email: data.email,
      start_date: or(data.start_date),
      message: or(data.message),
      consent: data.consent_privacy ?? data.consent_rodo ?? false,
      consent_marketing: data.consent_marketing || false,
      consent_state: data.consent_state || null,
      segment: or(data.segment),
      locale: or(data.locale),
      hook_variant: or(data.hook_variant),
      event_id: or(data.event_id),
      utm_source: or(data.utm_source),
      utm_medium: or(data.utm_medium),
      utm_campaign: or(data.utm_campaign),
      utm_content: or(data.utm_content),
      utm_term: or(data.utm_term),
      gclid: or(data.gclid),
      gbraid: or(data.gbraid),
      wbraid: or(data.wbraid),
      fbclid: or(data.fbclid),
      ttclid: or(data.ttclid),
      msclkid: or(data.msclkid),
      fbp: or(data.fbp),
      fbc: or(data.fbc),
      landing_url: or(data.landing_url),
      referrer: or(data.referrer),
      user_agent: data.user_agent || userAgent,
      ip: ip && ip !== '0.0.0.0' ? ip : null,
    };

    if (isNewLanding) {
      // New landing page format
      insertRow.landing_slug = data.landing_slug;
      insertRow.sytuacja = or(data.sytuacja);
      insertRow.branza = or(data.branza);
      // description goes into message column
      if (data.description) insertRow.message = data.description;
      insertRow.consent_rodo = data.consent_rodo || false;
      // JSON attribution
      if (ft) {
        insertRow.first_touch_source = ft.source || null;
        insertRow.first_touch_medium = ft.medium || null;
        insertRow.first_touch_campaign = ft.campaign || null;
        insertRow.first_touch_at = ft.at || null;
        insertRow.first_touch_url = ft.url || null;
      }
      if (lt) {
        insertRow.last_touch_source = lt.source || null;
        insertRow.last_touch_medium = lt.medium || null;
        insertRow.last_touch_campaign = lt.campaign || null;
        insertRow.last_touch_at = lt.at || null;
      }
    } else {
      // Old i18n landing format
      insertRow.situation = or(data.situation);
      insertRow.industry = or(data.industry);
      insertRow.first_touch_source = or(data.first_touch_source);
      insertRow.first_touch_medium = or(data.first_touch_medium);
      insertRow.first_touch_campaign = or(data.first_touch_campaign);
      insertRow.first_touch_at = orTs(data.first_touch_at);
      insertRow.first_touch_url = or(data.first_touch_url);
      insertRow.last_touch_source = or(data.last_touch_source);
      insertRow.last_touch_medium = or(data.last_touch_medium);
      insertRow.last_touch_campaign = or(data.last_touch_campaign);
      insertRow.last_touch_at = orTs(data.last_touch_at);
    }

    const { error } = await supabase.from('leads').insert(insertRow);

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error));
      // TODO: remove debug detail before production
      return NextResponse.json({ ok: false, error: 'db', debug: { message: error.message, code: error.code, details: error.details, hint: error.hint } }, { status: 500 });
    }

    // Meta CAPI — send if consent allows
    const consentState = data.consent_state;
    const adConsent = consentState?.ad_storage === 'granted' || data.consent_marketing;
    let capiResponse = '';

    if (adConsent) {
      try {
        const capiResult = await sendMetaCAPI(data, ip, userAgent);
        if (capiResult) {
          capiResponse = `${capiResult.status}: ${capiResult.body.slice(0, 200)}`;
          await supabase
            .from('leads')
            .update({ capi_sent_at: new Date().toISOString(), capi_response: capiResponse })
            .eq('event_id', data.event_id);
        }
      } catch (e) {
        console.error('CAPI error:', e);
        capiResponse = `error: ${e instanceof Error ? e.message : 'unknown'}`;
        await supabase
          .from('leads')
          .update({ capi_response: capiResponse })
          .eq('event_id', data.event_id);
      }

      // TikTok Events API
      try {
        await sendTikTokEvent(data, ip, userAgent);
      } catch (e) {
        console.error('TikTok API error:', e);
      }
    }

    // Email notifications via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL || 'kontakt@firmadlakazdego.pl';

    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        const landingName = data.landing_slug || data.segment || 'ogolny';
        const firstName = data.firstName || fullName.split(' ')[0] || '';

        // Team notification
        await resend.emails.send({
          from: 'FDK Landing <noreply@firmadlakazdego.pl>',
          to: notifyEmail,
          subject: `Nowe zgłoszenie z ${landingName} — ${fullName}`,
          text: [
            `Imię i nazwisko: ${fullName}`,
            `Telefon: ${data.phone || '—'}`,
            `E-mail: ${data.email}`,
            `Opis: ${data.description || data.message || '—'}`,
            `Sytuacja: ${data.sytuacja || data.situation || '—'}`,
            `Branża: ${data.branza || data.industry || '—'}`,
            `Planowany start: ${data.start_date || '—'}`,
            `Segment: ${data.segment || 'ogolny'}`,
            `Landing: ${data.landing_slug || '—'}`,
            `Locale: ${data.locale || '—'}`,
            `Zgoda marketing: ${data.consent_marketing ? 'TAK' : 'NIE'}`,
            `UTM: ${data.utm_source || '—'} / ${data.utm_medium || '—'} / ${data.utm_campaign || '—'}`,
            `Event ID: ${data.event_id || '—'}`,
            `Landing URL: ${data.landing_url || '—'}`,
            `CAPI: ${capiResponse || 'nie wysłano'}`,
            ``,
            `Supabase: Table Editor → leads (filtruj event_id)`,
          ].join('\n'),
        });

        // Autoresponder to lead
        await resend.emails.send({
          from: 'Firma Dla Każdego <kontakt@firmadlakazdego.pl>',
          replyTo: 'kontakt@firmadlakazdego.pl',
          to: data.email,
          subject: 'Dziękujemy za kontakt — Fundacja Firma Dla Każdego',
          text: `Dzień dobry ${firstName},\n\ndziękujemy za wysłanie formularza. Otrzymaliśmy Twoje zgłoszenie i niezwłocznie się z Tobą skontaktujemy.\n\nJeśli w międzyczasie chcesz coś dodać, po prostu odpowiedz na tę wiadomość.\n\nPozdrawiamy,\nZespół Fundacji Firma Dla Każdego\nhttps://firmadlakazdego.pl\n+48 575 594 500\nkontakt@firmadlakazdego.pl`,
        });
      } catch (emailError) {
        console.error('Resend error:', emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
