import type { SiteId } from '@/config/sites';

export type SiteContent = {
  site: Exclude<SiteId, 'fdk'>;
  meta: { title: string; description: string };
  hero: {
    badge: string;
    hooks: string[];
    subtitle: string;
    bullets: string[];
    formTitle: string;
    cta: string;
  };
  stats: { value: string; label: string }[];
  who: {
    title: string;
    items: { icon: string; title: string; text: string }[];
  };
  how: {
    title: string;
    steps: { title: string; text: string }[];
  };
  benefits: {
    title: string;
    items: { icon: string; title: string; text: string }[];
  };
  compare?: {
    title: string;
    columns: string[];
    rows: { label: string; cells: string[] }[];
    note: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  form: {
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    situationLabel: string;
    situationOptions: { value: string; label: string }[];
    industryLabel: string;
    industryOptions: { value: string; label: string }[];
    messageLabel: string;
    consentPrivacy: string;
    consentMarketing: string;
    submit: string;
    note: string;
    selectPlaceholder: string;
  };
  thanks: {
    title: string;
    text: string;
  };
  cookie: {
    text: string;
    accept: string;
    essential: string;
    settings: string;
  };
  footer: {
    tagline: string;
  };
};
