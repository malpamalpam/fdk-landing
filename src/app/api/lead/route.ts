import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6).regex(/^[+]?[\d\s()-]{6,20}$/),
  email: z.string().email(),
  industry: z.string().optional(),
  message: z.string().optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  locale: z.string().optional(),
  hook_variant: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  fbclid: z.string().optional(),
  gclid: z.string().optional(),
  ttclid: z.string().optional(),
  landing_url: z.string().optional(),
  referrer: z.string().optional(),
  _t: z.number().optional(),
});

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  entry.count++;
  return entry.count > 5;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 });
    }

    const data = result.data;

    // Honeypot check
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ ok: true }); // Fake success
    }

    // Time-based spam check (< 3 seconds)
    if (data._t && Date.now() - data._t < 3000) {
      return NextResponse.json({ ok: true }); // Fake success
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ ok: false, error: 'config' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const userAgent = request.headers.get('user-agent') || '';

    const { error } = await supabase.from('leads').insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      industry: data.industry || null,
      message: data.message || null,
      consent: data.consent,
      locale: data.locale || null,
      hook_variant: data.hook_variant || null,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,
      fbclid: data.fbclid || null,
      gclid: data.gclid || null,
      ttclid: data.ttclid || null,
      landing_url: data.landing_url || null,
      referrer: data.referrer || null,
      user_agent: userAgent,
      ip: ip,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ ok: false, error: 'db' }, { status: 500 });
    }

    // Optional: Send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL || 'kontakt@firmadlakazdego.pl';

    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: 'FDK Landing <noreply@firmadlakazdego.pl>',
          to: notifyEmail,
          subject: `Nowy lead: ${data.name} (${data.industry || 'brak branży'})`,
          text: [
            `Imię i nazwisko: ${data.name}`,
            `Telefon: ${data.phone}`,
            `E-mail: ${data.email}`,
            `Branża: ${data.industry || '—'}`,
            `Wiadomość: ${data.message || '—'}`,
            `Locale: ${data.locale || '—'}`,
            `Hook: ${data.hook_variant || '—'}`,
            `UTM: ${data.utm_source || '—'} / ${data.utm_medium || '—'} / ${data.utm_campaign || '—'}`,
            `Landing URL: ${data.landing_url || '—'}`,
          ].join('\n'),
        });
      } catch (emailError) {
        // Don't fail the lead submission if email fails
        console.error('Resend email error:', emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
