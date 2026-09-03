import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export async function POST(request: NextRequest) {
  const secret = process.env.QUALIFIED_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 404 });
  }

  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: 'config' }, { status: 500 });
  }

  try {
    const { lead_id } = await request.json();
    if (!lead_id) {
      return NextResponse.json({ ok: false, error: 'missing_lead_id' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to qualified (trigger sets qualified_at)
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'qualified' })
      .eq('id', lead_id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 500 });
    }

    // Fetch lead for CAPI
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (!lead) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    // Send Meta CAPI QualifiedLead event
    const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

    if (pixelId && accessToken && lead.event_id) {
      try {
        const qualifiedEventId = `${lead.event_id}-q`;
        const phone = lead.phone.replace(/\D/g, '');

        const res = await fetch(
          `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: [{
                event_name: 'QualifiedLead',
                event_time: Math.floor(Date.now() / 1000),
                event_id: qualifiedEventId,
                action_source: 'website',
                user_data: {
                  em: [sha256(lead.email.toLowerCase().trim())],
                  ph: [sha256(phone.length <= 9 ? '48' + phone : phone)],
                  ...(lead.fbp && { fbp: lead.fbp }),
                  ...(lead.fbc && { fbc: lead.fbc }),
                },
                custom_data: {
                  segment: lead.segment,
                  content_name: 'qualified_lead',
                },
              }],
              ...(process.env.META_CAPI_TEST_EVENT_CODE && {
                test_event_code: process.env.META_CAPI_TEST_EVENT_CODE,
              }),
            }),
          }
        );

        const responseText = await res.text();
        await supabase
          .from('leads')
          .update({ capi_response: `qualified: ${res.status}: ${responseText.slice(0, 200)}` })
          .eq('id', lead_id);
      } catch (e) {
        console.error('CAPI qualified error:', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Qualified API error:', err);
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
