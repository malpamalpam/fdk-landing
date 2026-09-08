/**
 * Test lead submission to /api/lead
 * Usage: npx tsx scripts/test-lead.ts
 * Requires: npm run dev running on localhost:3000
 */

const BASE = 'http://localhost:3000/api/lead';

async function send(label: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log(`[${res.status}] ${label}:`, JSON.stringify(data));
  } catch (e) {
    console.error(`[ERR] ${label}:`, e);
  }
}

const base = {
  firstName: 'Test',
  lastName: 'Testowy',
  email: 'test@example.com',
  phone: '+48123456789',
  description: 'To jest testowe zgłoszenie do weryfikacji integracji z Google Sheets',
  consent_rodo: true,
  consent_marketing: false,
  website: '', // honeypot empty = valid
  utm_source: 'test',
  utm_medium: 'script',
  utm_campaign: 'test-lead',
  landing_url: 'http://localhost:3000/lp/landing1',
  referrer: '',
  _t: Date.now() - 10000, // 10s ago
};

async function main() {
  console.log('--- Poprawne leady (3 landingi) ---');
  await send('landing1 (kontrakt-b2b)', { ...base, landing_slug: 'landing1', segment: 'kontrakt-b2b' });
  await send('landing2 (faktura-bez-firmy)', { ...base, landing_slug: 'landing2', segment: 'faktura-bez-firmy', email: 'test2@example.com' });
  await send('landing3 (wspolpraca-b2b)', { ...base, landing_slug: 'landing3', segment: 'wspolpraca-b2b', email: 'test3@example.com' });

  console.log('\n--- Honeypot (powinno 200 ok, bez zapisu) ---');
  await send('honeypot', { ...base, website: 'https://spam.com', landing_slug: 'landing1', segment: 'kontrakt-b2b' });

  console.log('\n--- Brak wymaganego pola (powinno 400) ---');
  await send('brak email', { ...base, email: '', landing_slug: 'landing1', segment: 'kontrakt-b2b' });

  console.log('\nGotowe. Sprawdź Supabase i Google Sheets.');
}

main();
