/**
 * Export leads to CSV for Google Sheets.
 *
 * Usage: npx tsx scripts/export-leads.ts > leads.csv
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const COLUMNS = [
  'created_at', 'id', 'status', 'qualified_at', 'segment', 'locale', 'situation', 'industry', 'start_date',
  'name', 'email', 'phone', 'consent_marketing',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid',
  'first_touch_source', 'first_touch_medium', 'first_touch_campaign', 'first_touch_at',
  'last_touch_source', 'last_touch_medium', 'last_touch_campaign', 'last_touch_at',
  'landing_url', 'referrer', 'hook_variant', 'event_id', 'capi_sent_at', 'message',
] as const;

const HEADER = [
  'created_at', 'lead_id', 'status', 'qualified_at', 'segment', 'locale', 'situation', 'industry', 'start_date',
  'name', 'email', 'phone', 'consent_marketing',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid',
  'first_touch_source', 'first_touch_medium', 'first_touch_campaign', 'first_touch_at',
  'last_touch_source', 'last_touch_medium', 'last_touch_campaign', 'last_touch_at',
  'landing_url', 'referrer', 'hook_variant', 'event_id', 'capi_sent_at', 'message',
];

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Europe/Warsaw' }).replace('T', ' ');
  } catch {
    return iso;
  }
}

function escapeCsv(val: unknown): string {
  const str = val == null ? '' : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function main() {
  const { data, error } = await supabase
    .from('leads')
    .select(COLUMNS.join(','))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Query error:', error);
    process.exit(1);
  }

  // Header
  console.log(HEADER.join(','));

  // Rows
  for (const row of data || []) {
    const values = COLUMNS.map((col) => {
      const val = (row as Record<string, unknown>)[col];
      if (col === 'created_at' || col === 'qualified_at' || col === 'first_touch_at' || col === 'last_touch_at' || col === 'capi_sent_at') {
        return escapeCsv(formatDate(val as string | null));
      }
      return escapeCsv(val);
    });
    console.log(values.join(','));
  }
}

main();
