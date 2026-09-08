# FDK Landing — Firma Dla Każdego

Landing page dla Fundacji „Firma Dla Każdego" — inkubatora przedsiębiorczości dla freelancerów.

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env.local
# Uzupełnij zmienne w .env.local (przynajmniej SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY)
npm run dev
```

Strona dostępna pod `http://localhost:3000` (przekieruje na `/pl`).

## Wdrożenie na Vercel

1. Połącz repozytorium z Vercel.
2. Ustaw zmienne środowiskowe w dashboardzie Vercel (patrz `.env.example`).
3. Deploy — Vercel automatycznie wykryje Next.js.

## Zmienne środowiskowe

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `NEXT_PUBLIC_SITE_URL` | Tak | URL produkcyjny (do OG, sitemap) |
| `SUPABASE_URL` | Tak | URL projektu Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Tak | Service role key (tylko serwer!) |
| `RESEND_API_KEY` | Nie | Klucz API Resend (powiadomienia + autoresponder) |
| `LEAD_NOTIFY_EMAIL` | Nie | E-mail do powiadomień (domyślnie kontakt@firmadlakazdego.pl) |
| `NEXT_PUBLIC_GTM_ID` | Nie | Google Tag Manager (GTM-XXXXXXX) |
| `NEXT_PUBLIC_COOKIEBOT_ID` | Nie | Cookiebot (zastępuje wbudowany baner) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Nie | ID piksela Meta (klient) |
| `META_PIXEL_ID` | Nie | ID piksela Meta (serwer, CAPI) |
| `META_CAPI_ACCESS_TOKEN` | Nie | Token dostępu Meta CAPI |
| `META_CAPI_TEST_EVENT_CODE` | Nie | Kod testowy Meta Events Manager |
| `NEXT_PUBLIC_GA4_ID` | Nie | Google Analytics 4 (fallback bez GTM) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Nie | Google Ads ID |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Nie | Label konwersji Google Ads |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Nie | ID piksela TikTok (klient) |
| `TIKTOK_PIXEL_ID` | Nie | ID piksela TikTok (serwer) |
| `TIKTOK_ACCESS_TOKEN` | Nie | Token TikTok Events API |
| `QUALIFIED_WEBHOOK_SECRET` | Nie | Klucz API dla /api/qualified |

## Baza danych

1. Utwórz tabelę `leads` — uruchom SQL z `supabase/schema.sql`
2. Dodaj kolumny pomiarowe — uruchom SQL z `supabase/migrations/002_measurement.sql`

Leady: Table Editor → `leads`. Raport: widok `leads_report`. Konwersje per kampania: widok `leads_by_campaign`.

## Segmenty

Landing obsługuje segmenty pod `/[locale]/lp/[segment]`:
- `/pl/lp/kontrakt-b2b` — osoby z ofertą na B2B
- `/pl/lp/faktura-bez-firmy` — freelancerzy
- `/pl/lp/wspolpraca-b2b` — firmy szukające rozwiązania dla podwykonawców

Strony segmentowe mają `noindex` i nie są w sitemap. Segment trafia do leadów i zdarzeń.

## Consent Mode v2

- Domyślnie wszystkie zgody = `denied`
- GTM ładuje się zawsze (Consent Mode kontroluje)
- Meta Pixel i TikTok Pixel ładują się tylko po zgodzie reklamowej
- Meta CAPI wysyła server-side tylko gdy `ad_storage = granted` lub `consent_marketing = true`

## Eksport konwersji offline (Google Ads)

1. Supabase → SQL Editor:
   ```sql
   select * from offline_conversions_google
   where "Conversion Time" >= '2024-01-01';
   ```
2. Export CSV
3. Google Ads → Goals → Conversions → Uploads → wgraj CSV

Kolumny widoku są zgodne z szablonem Google Ads „Conversions from clicks".

## Zbieranie leadów — Google Sheets (automatyczny zapis)

Leady z formularzy `/lp/landing1`, `/lp/landing2`, `/lp/landing3` zapisują się automatycznie do Google Sheets.

### Konfiguracja krok po kroku

1. **Google Cloud Console** → utwórz nowy projekt (lub użyj istniejącego)
2. Włącz **Google Sheets API** (APIs & Services → Library → szukaj "Google Sheets API" → Enable)
3. **IAM & Admin → Service Accounts** → utwórz konto serwisowe → Keys → Add Key → JSON
4. Skopiuj z pobranego JSON:
   - `client_email` → zmienna `GOOGLE_CLIENT_EMAIL`
   - `private_key` → zmienna `GOOGLE_PRIVATE_KEY` (cały klucz z `-----BEGIN...`)
5. Utwórz arkusz Google Sheets z zakładką `Wszystkie` i nagłówkami w wierszu 1:
   `Data i godzina | Imię i nazwisko | E-mail | Telefon | Źródło | Opis działalności | URL strony | UTM source | UTM medium | UTM campaign | Zgoda marketing`
6. Zakładki `landing1`, `landing2`, `landing3` powstają automatycznie przy pierwszym leadzie
7. **Udostępnij arkusz** (Share → Editor) na adres `client_email` z pkt 4
8. `SHEET_ID` to fragment URL arkusza między `/d/` a `/edit`
9. W Vercel → Settings → Environment Variables dodaj: `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SHEET_ID`, `SHEET_TAB_ALL`

### Zakładka Podsumowanie

Utwórz zakładkę `Podsumowanie` i wstaw formuły:
- Leady per landing: `=COUNTIF(Wszystkie!E:E,"landing1")`
- Leady per dzień: `=COUNTIFS(Wszystkie!E:E,"landing1",Wszystkie!A:A,">="&A2,Wszystkie!A:A,"<"&A2+1)`

### Eksport CSV z Supabase

```bash
npm run export:leads > leads.csv
```

W Google Sheets: File → Import → Replace current sheet → wklej CSV.

## Test przed startem

1. Wejdź: `/pl/lp/kontrakt-b2b?utm_source=google&utm_medium=cpc&utm_campaign=test_b2b&gclid=TEST123&fbclid=TESTFB&ttclid=TESTTT`
2. Zaakceptuj zgody, wyślij formularz z imieniem `TEST TEST`
3. Sprawdź:
   - Supabase: wiersz ma `segment=kontrakt-b2b`, `utm_*`, `gclid/fbclid/ttclid`, `first_touch_*`, `event_id`
   - GTM Preview: `lead` z `event_id`
   - Meta Events Manager → Test Events: `Lead` z przeglądarki i serwera z tym samym `event_id` (zdeduplikowane)
   - Przyszedł autoresponder i mail do zespołu
4. Ustaw status `qualified` → sprawdź `qualified_at` i widok `offline_conversions_google`
5. Usuń testowe wiersze

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres)
- Resend (autoresponder + powiadomienia)
- Lucide React (ikony)
- React Hook Form + Zod (formularz)
- Google Consent Mode v2 + GTM
- Meta Conversions API (server-side)
- Google Sheets (automatyczny zapis leadów)
