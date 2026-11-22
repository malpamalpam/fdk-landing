-- Migration: add site column for multi-site landing pages
-- Run this in Supabase SQL Editor

alter table public.leads add column if not exists site text;
create index if not exists leads_site_idx on public.leads(site);
