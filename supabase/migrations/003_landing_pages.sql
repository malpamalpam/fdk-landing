-- Migration 003: Landing pages support
-- Adds columns for new landing page format

alter table public.leads
  add column if not exists landing_slug text,
  add column if not exists sytuacja text,
  add column if not exists branza text,
  add column if not exists consent_rodo boolean,
  add column if not exists notes text;

-- Rename situation/industry to avoid confusion: old columns stay, new ones added
-- landing_slug distinguishes new landings from legacy

create index if not exists leads_landing_slug_idx on public.leads (landing_slug);
