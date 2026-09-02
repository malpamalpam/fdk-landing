create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  email         text not null,
  industry      text,
  message       text,
  consent       boolean not null default false,
  locale        text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  fbclid        text,
  gclid         text,
  ttclid        text,
  landing_url   text,
  referrer      text,
  hook_variant  text,
  user_agent    text,
  ip            inet,
  status        text not null default 'new'   -- new / contacted / signed / lost
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);

alter table public.leads enable row level security;

create or replace view public.leads_by_campaign as
select
  coalesce(utm_source, '(direct)')   as source,
  coalesce(utm_campaign, '(none)')   as campaign,
  locale,
  count(*)                           as leads,
  min(created_at)                    as first_lead,
  max(created_at)                    as last_lead
from public.leads
group by 1, 2, 3
order by leads desc;
