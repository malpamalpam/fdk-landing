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
| `RESEND_API_KEY` | Nie | Klucz API Resend do powiadomień e-mail |
| `LEAD_NOTIFY_EMAIL` | Nie | E-mail do powiadomień (domyślnie kontakt@firmadlakazdego.pl) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Nie | ID piksela Meta (Facebook) |
| `NEXT_PUBLIC_GA4_ID` | Nie | ID Google Analytics 4 (G-XXXXXXX) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Nie | ID Google Ads (AW-XXXXXXXXX) |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Nie | Label konwersji Google Ads |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Nie | ID piksela TikTok |

## Baza danych

Utwórz tabelę `leads` w Supabase, uruchamiając SQL z pliku `supabase/schema.sql`.

Leady widoczne w Table Editor → tabela `leads`. Raport konwersji per kampania: widok `leads_by_campaign`.

## Piksele reklamowe

Piksele ładują się dopiero po akceptacji cookies przez użytkownika. ID pikseli ustaw w zmiennych środowiskowych — jeśli zmienna jest pusta, dany piksel nie jest ładowany.

Konwersja główna odpala się na stronie `/[locale]/dziekujemy` po wysłaniu formularza:
- Meta: `Lead`
- GA4: `generate_lead`
- Google Ads: `conversion`
- TikTok: `SubmitForm`

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres)
- Resend (opcjonalnie)
- Lucide React (ikony)
- React Hook Form + Zod (formularz)
