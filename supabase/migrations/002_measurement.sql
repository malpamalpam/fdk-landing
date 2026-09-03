-- Migration 002: Measurement layer for conversion tracking
-- Run this in Supabase SQL Editor after the initial schema.sql

alter table public.leads
  add column if not exists segment text,
  add column if not exists situation text,
  add column if not exists start_date text,
  add column if not exists consent_marketing boolean not null default false,
  add column if not exists consent_state jsonb,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists msclkid text,
  add column if not exists fbp text,
  add column if not exists fbc text,
  add column if not exists first_touch_source text,
  add column if not exists first_touch_medium text,
  add column if not exists first_touch_campaign text,
  add column if not exists first_touch_at timestamptz,
  add column if not exists first_touch_url text,
  add column if not exists last_touch_source text,
  add column if not exists last_touch_medium text,
  add column if not exists last_touch_campaign text,
  add column if not exists last_touch_at timestamptz,
  add column if not exists event_id uuid,
  add column if not exists qualified_at timestamptz,
  add column if not exists capi_sent_at timestamptz,
  add column if not exists capi_response text,
  add column if not exists offline_exported_at timestamptz;

create unique index if not exists leads_event_id_idx on public.leads (event_id);

-- Status: dopuszczalne wartości
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new','contacted','qualified','signed','lost','spam'));

-- qualified_at ustawia się automatycznie przy zmianie statusu na qualified
create or replace function public.set_qualified_at() returns trigger language plpgsql as $$
begin
  if new.status = 'qualified' and (old.status is distinct from 'qualified') then
    new.qualified_at = now();
  end if;
  return new;
end $$;
drop trigger if exists trg_set_qualified_at on public.leads;
create trigger trg_set_qualified_at before update on public.leads
  for each row execute function public.set_qualified_at();

-- Widok: eksport konwersji offline do Google Ads (leady kwalifikowane z gclid/gbraid/wbraid)
-- Kolumny zgodne z szablonem Google Ads "Conversions from clicks"
-- Uwaga: offset timezone może wymagać korekty na +02:00 latem (CEST)
create or replace view public.offline_conversions_google as
select
  gclid                                   as "Google Click ID",
  gbraid                                  as "GBRAID",
  wbraid                                  as "WBRAID",
  'FDK Qualified Lead'                    as "Conversion Name",
  to_char(qualified_at at time zone 'Europe/Warsaw', 'YYYY-MM-DD HH24:MI:SSTZH:TZM') as "Conversion Time",
  ''                                      as "Conversion Value",
  'PLN'                                   as "Conversion Currency"
from public.leads
where status = 'qualified'
  and qualified_at is not null
  and (gclid is not null or gbraid is not null or wbraid is not null);

-- Widok raportowy per segment i źródło
create or replace view public.leads_report as
select
  date_trunc('day', created_at)::date as day,
  segment, locale,
  coalesce(last_touch_source, utm_source, '(direct)') as source,
  coalesce(utm_campaign, '(none)') as campaign,
  situation, industry,
  count(*) filter (where status <> 'spam')                as leads,
  count(*) filter (where status in ('qualified','signed')) as qualified,
  count(*) filter (where status = 'signed')               as signed
from public.leads
group by 1,2,3,4,5,6,7
order by 1 desc;
