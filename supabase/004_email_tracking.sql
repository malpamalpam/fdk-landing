-- Migration 004: Email tracking columns
alter table public.leads
  add column if not exists notify_sent_at timestamptz,
  add column if not exists autoresponder_sent_at timestamptz,
  add column if not exists email_error text;
