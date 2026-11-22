import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { appendLeadToSheets } from '@/lib/googleSheets';
import { isValidSource } from '@/lib/leadSources';

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
  site: z.string().optional(),
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

function isValidIp(value: string): boolean {
  // IPv4
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true;
  // IPv6 (simplified check)
  if (value.includes(':') && /^[0-9a-fA-F:]+$/.test(value)) return true;
  return false;
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
    const isNewLp = !!body.landing_slug || !!body.site;
    // New landings / site leads: 15/hour; old landing: 5/10min
    if (isNewLp ? isRateLimited(ip, 15, 60 * 60 * 1000) : isRateLimited(ip)) {
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

    // Build insert row — supports both old i18n landing and new slug landings
    const isNewLanding = !!data.landing_slug;
    const ft = data.first_touch;
    const lt = data.last_touch;

    // Build name from firstName+lastName or use name field
    const fullName = data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.name || '';

    // Use only columns from the original schema.sql to avoid PostgREST cache issues.
    // Extra data goes into the 'message' field as structured text.
    const isSiteLead = !!data.site;
    const extraInfo = isNewLanding
      ? [
          data.description || '',
          data.landing_slug ? `[landing: ${data.landing_slug}]` : '',
          ft ? `[ft: ${ft.source}/${ft.medium}/${ft.campaign}]` : '',
          lt ? `[lt: ${lt.source}/${lt.medium}/${lt.campaign}]` : '',
        ].filter(Boolean).join('\n')
      : isSiteLead
        ? [
            data.situation ? `Sytuacja: ${data.situation}` : '',
            data.message || '',
          ].filter(Boolean).join(' | ')
        : data.message || '';

    const insertRow: Record<string, unknown> = {
      name: fullName,
      phone: data.phone || '',
      email: data.email,
      industry: or(isNewLanding ? data.landing_slug : data.industry),
      situation: or(data.situation || data.sytuacja),
      message: extraInfo || null,
      consent: data.consent_privacy ?? data.consent_rodo ?? false,
      consent_marketing: data.consent_marketing || false,
      locale: or(isSiteLead ? data.site : isNewLanding ? data.landing_slug : data.locale),
      segment: or(data.segment),
      event_id: or(data.event_id),
      ...(data.site && { site: data.site }),
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
      fbp: or(data.fbp),
      fbc: or(data.fbc),
      landing_url: or(data.landing_url),
      referrer: or(data.referrer),
      hook_variant: or(data.hook_variant || data.segment),
      user_agent: data.user_agent || userAgent,
      ip: ip && ip !== '0.0.0.0' && isValidIp(ip) ? ip : null,
      // Attribution — flatten first/last touch JSON into columns
      ...(ft && {
        first_touch_source: ft.source || null,
        first_touch_medium: ft.medium || null,
        first_touch_campaign: ft.campaign || null,
        first_touch_at: ft.at || null,
        first_touch_url: ft.url || null,
      }),
      ...(lt && {
        last_touch_source: lt.source || null,
        last_touch_medium: lt.medium || null,
        last_touch_campaign: lt.campaign || null,
        last_touch_at: lt.at || null,
      }),
      // Also flatten old-format flat fields if present (backward compat)
      ...(!ft && data.first_touch_source && {
        first_touch_source: data.first_touch_source,
        first_touch_medium: data.first_touch_medium || null,
        first_touch_campaign: data.first_touch_campaign || null,
        first_touch_at: data.first_touch_at || null,
        first_touch_url: data.first_touch_url || null,
      }),
      ...(!lt && data.last_touch_source && {
        last_touch_source: data.last_touch_source,
        last_touch_medium: data.last_touch_medium || null,
        last_touch_campaign: data.last_touch_campaign || null,
        last_touch_at: data.last_touch_at || null,
      }),
    };

    const { error } = await supabase.from('leads').insert(insertRow);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ ok: false, error: 'db', detail: error.message }, { status: 500 });
    }

    // Google Sheets — write to "Wszystkie" + per-landing tab
    const sheetsSource = data.landing_slug || data.segment || '';
    if (sheetsSource && isValidSource(sheetsSource)) {
      const now = new Date();
      const datetime = now.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
      try {
        await appendLeadToSheets({
          datetime,
          name: fullName,
          email: data.email,
          phone: data.phone || '',
          source: sheetsSource,
          description: data.description || data.message || '',
          pageUrl: data.landing_url || '',
          utmSource: data.utm_source || '',
          utmMedium: data.utm_medium || '',
          utmCampaign: data.utm_campaign || '',
          consentMarketing: data.consent_marketing || false,
        });
      } catch (e) {
        // Google Sheets error should not block the lead submission
        console.error('Google Sheets error:', e);
      }
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
    const notifyEmails = (process.env.LEAD_NOTIFY_EMAIL || 'kontakt@firmadlakazdego.pl').split(',').map(e => e.trim());

    if (!resendKey) {
      await supabase.from('leads').update({ email_error: 'no_api_key' }).eq('event_id', data.event_id);
    } else {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        const firstName = data.firstName || fullName.split(' ')[0] || '';

        // Determine brand for subject line
        let siteBrand = 'FDK Landing';
        if (data.site) {
          try {
            const { SITES } = await import('@/config/sites');
            const siteCfg = SITES[data.site as keyof typeof SITES];
            if (siteCfg) siteBrand = siteCfg.domains[0];
          } catch { /* fallback to FDK Landing */ }
        }

        // Build first/last touch summary
        const ftSummary = ft
          ? `${ft.source || '—'}/${ft.medium || '—'}/${ft.campaign || '—'}`
          : data.first_touch_source
            ? `${data.first_touch_source}/${data.first_touch_medium || '—'}/${data.first_touch_campaign || '—'}`
            : '—';
        const ltSummary = lt
          ? `${lt.source || '—'}/${lt.medium || '—'}/${lt.campaign || '—'}`
          : data.last_touch_source
            ? `${data.last_touch_source}/${data.last_touch_medium || '—'}/${data.last_touch_campaign || '—'}`
            : '—';

        // Team notification
        try {
          await resend.emails.send({
            from: 'FDK Landing <noreply@firmadlakazdego.pl>',
            to: notifyEmails,
            replyTo: data.email,
            subject: `[${siteBrand}] Nowy lead: ${fullName} — ${data.situation || '—'} / ${data.industry || '—'}`,
            text: [
              `Imię i nazwisko: ${fullName}`,
              `Telefon: ${data.phone || '—'}`,
              `E-mail: ${data.email}`,
              `Opis: ${data.description || data.message || '—'}`,
              `Sytuacja: ${data.sytuacja || data.situation || '—'}`,
              `Branża: ${data.branza || data.industry || '—'}`,
              `Planowany start: ${data.start_date || '—'}`,
              `Segment: ${data.segment || 'ogolny'}`,
              `Site: ${data.site || '—'}`,
              `Landing: ${data.landing_slug || '—'}`,
              `Locale: ${data.locale || '—'}`,
              `Zgoda marketing: ${data.consent_marketing ? 'TAK' : 'NIE'}`,
              `UTM: ${data.utm_source || '—'} / ${data.utm_medium || '—'} / ${data.utm_campaign || '—'}`,
              `Click IDs: gclid=${data.gclid || '—'} fbclid=${data.fbclid || '—'} ttclid=${data.ttclid || '—'} msclkid=${data.msclkid || '—'}`,
              `First touch: ${ftSummary}`,
              `Last touch: ${ltSummary}`,
              `Event ID: ${data.event_id || '—'}`,
              `Landing URL: ${data.landing_url || '—'}`,
              `CAPI: ${capiResponse || 'nie wysłano'}`,
              ``,
              `Supabase: wyszukaj event_id = ${data.event_id || '—'}`,
            ].join('\n'),
          });

          await supabase
            .from('leads')
            .update({ notify_sent_at: new Date().toISOString() })
            .eq('event_id', data.event_id);
        } catch (notifyErr) {
          console.error('Resend notify error:', notifyErr);
          await supabase
            .from('leads')
            .update({ email_error: `notify: ${notifyErr instanceof Error ? notifyErr.message : 'unknown'}` })
            .eq('event_id', data.event_id);
        }

        // Autoresponder to lead
        try {
          const rodoFooter: Record<string, string> = {
            pl: 'Administratorem danych jest Fundacja Firma Dla Każdego, ul. Lwowska 17/4, 00-660 Warszawa. Dane przetwarzane w celu kontaktu. Masz prawo do wycofania zgody w każdej chwili.',
            en: 'Data controller: Fundacja Firma Dla Każdego, ul. Lwowska 17/4, 00-660 Warsaw. Data processed for contact purposes. You may withdraw consent at any time.',
            ru: 'Администратор данных: Fundacja Firma Dla Każdego, ul. Lwowska 17/4, 00-660 Warszawa. Данные обрабатываются в целях связи. Вы можете отозвать согласие в любой момент.',
          };

          let autoSubject: string;
          let autoText: string;
          let autoHtml: string | undefined;
          let lang = 'pl';

          if (data.site) {
            // Site leads — use content dictionaries
            const { getSiteContent } = await import('@/content/sites');
            const { SITES } = await import('@/config/sites');
            const siteContent = getSiteContent(data.site);
            const siteCfg = SITES[data.site as keyof typeof SITES];
            if (siteCfg) lang = siteCfg.htmlLang;

            if (siteContent) {
              const ar = siteContent.email.autoresponder;
              autoSubject = ar.subject;
              const greeting = ar.greeting.replace('{name}', firstName);
              const body = ar.body.replace('{name}', firstName).replace('{phone}', data.phone || '—');
              const callNow = ar.callNow.replace('{phone}', data.phone || '—');
              const signoff = ar.signoff;

              autoText = [greeting, '', body, '', callNow, '', signoff].join('\n');
              const rodo = rodoFooter[lang] || rodoFooter['pl'];
              autoHtml = `<!DOCTYPE html><html><body style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;">` +
                `<p>${greeting.replace(/\n/g, '<br>')}</p>` +
                `<p>${body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>` +
                `<p>${callNow.replace(/\n/g, '<br>')}</p>` +
                `<p>${signoff.replace(/\n/g, '<br>')}</p>` +
                `<hr style="margin-top:24px;border:none;border-top:1px solid #ddd;">` +
                `<p style="font-size:12px;color:#888;">${rodo}</p>` +
                `</body></html>`;
            } else {
              // Site set but no content — use PL default
              autoSubject = 'Dziękujemy za kontakt — Fundacja Firma Dla Każdego';
              autoText = `Dzień dobry ${firstName},\n\ndziękujemy za wysłanie formularza. Otrzymaliśmy Twoje zgłoszenie i niezwłocznie się z Tobą skontaktujemy.\n\nJeśli w międzyczasie chcesz coś dodać, po prostu odpowiedz na tę wiadomość.\n\nPozdrawiamy,\nZespół Fundacji Firma Dla Każdego\nhttps://firmadlakazdego.pl\n+48 575 594 500\nkontakt@firmadlakazdego.pl`;
            }
          } else {
            // Non-site leads — PL default
            autoSubject = 'Dziękujemy za kontakt — Fundacja Firma Dla Każdego';
            autoText = `Dzień dobry ${firstName},\n\ndziękujemy za wysłanie formularza. Otrzymaliśmy Twoje zgłoszenie i niezwłocznie się z Tobą skontaktujemy.\n\nJeśli w międzyczasie chcesz coś dodać, po prostu odpowiedz na tę wiadomość.\n\nPozdrawiamy,\nZespół Fundacji Firma Dla Każdego\nhttps://firmadlakazdego.pl\n+48 575 594 500\nkontakt@firmadlakazdego.pl`;
          }

          await resend.emails.send({
            from: 'Firma Dla Każdego <kontakt@firmadlakazdego.pl>',
            replyTo: 'kontakt@firmadlakazdego.pl',
            to: data.email,
            subject: autoSubject,
            text: autoText,
            ...(autoHtml && { html: autoHtml }),
          });

          await supabase
            .from('leads')
            .update({ autoresponder_sent_at: new Date().toISOString() })
            .eq('event_id', data.event_id);
        } catch (autoErr) {
          console.error('Resend autoresponder error:', autoErr);
          const prevError = (await supabase.from('leads').select('email_error').eq('event_id', data.event_id).single()).data?.email_error;
          const errMsg = `autoresponder: ${autoErr instanceof Error ? autoErr.message : 'unknown'}`;
          await supabase
            .from('leads')
            .update({ email_error: prevError ? `${prevError}; ${errMsg}` : errMsg })
            .eq('event_id', data.event_id);
        }
      } catch (emailError) {
        console.error('Resend init error:', emailError);
        await supabase
          .from('leads')
          .update({ email_error: `init: ${emailError instanceof Error ? emailError.message : 'unknown'}` })
          .eq('event_id', data.event_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
