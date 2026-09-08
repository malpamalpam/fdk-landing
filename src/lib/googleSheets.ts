import { google, sheets_v4 } from 'googleapis';

// Cached client — created once per module (per serverless instance)
let cachedSheets: sheets_v4.Sheets | null = null;
const knownTabs = new Set<string>();

function getClient(): sheets_v4.Sheets | null {
  if (cachedSheets) return cachedSheets;

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;

  const auth = new google.auth.JWT(email, undefined, key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  cachedSheets = google.sheets({ version: 'v4', auth });
  return cachedSheets;
}

const HEADERS = [
  'Data i godzina',
  'Imię i nazwisko',
  'Email',
  'Telefon',
  'Zrodlo',
  'Wiadomość',
  'URL strony',
  'UTM source',
  'UTM medium',
  'UTM campaign',
];

async function ensureTab(sheets: sheets_v4.Sheets, sheetId: string, tabName: string) {
  if (knownTabs.has(tabName)) return;

  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const existingTabs = res.data.sheets?.map((s) => s.properties?.title) || [];

    if (!existingTabs.includes(tabName)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: tabName } } }],
        },
      });

      // Write headers to new tab
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${tabName}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [HEADERS] },
      });
    }

    knownTabs.add(tabName);
  } catch (e) {
    console.error('Error ensuring tab:', tabName, e);
  }
}

export interface LeadRow {
  datetime: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  description: string;
  pageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  consentMarketing: boolean;
}

function toRow(lead: LeadRow): string[] {
  return [
    lead.datetime,
    lead.name,
    lead.email,
    lead.phone,
    lead.source,
    lead.description,
    lead.pageUrl,
    lead.utmSource,
    lead.utmMedium,
    lead.utmCampaign,
  ];
}

export async function appendLeadToSheets(lead: LeadRow): Promise<boolean> {
  const sheets = getClient();
  if (!sheets) return false;

  const sheetId = process.env.SHEET_ID;
  if (!sheetId) return false;

  const allTab = process.env.SHEET_TAB_ALL || 'Wszystkie';
  const sourceTab = lead.source; // e.g. "landing1"

  try {
    // Ensure both tabs exist
    await ensureTab(sheets, sheetId, allTab);
    await ensureTab(sheets, sheetId, sourceTab);

    const row = toRow(lead);

    // Write to both tabs
    await Promise.all([
      sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${allTab}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      }),
      sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${sourceTab}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      }),
    ]);

    return true;
  } catch (e) {
    console.error('Google Sheets append error:', e);
    return false;
  }
}
