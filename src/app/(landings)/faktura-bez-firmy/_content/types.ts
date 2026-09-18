export type Lang = 'PL' | 'EN' | 'RU' | 'UA';

export type Dictionary = {
  nav: { industries: string; howItWorks: string; benefits: string; faq: string; cta: string };
  hero: { badge: string; h1: string; h1accent: string; bullets: string[]; cta: string; modules: string[] };
  industries: { heading: string; sub: string; list: string[] };
  howItWorks: { heading: string; processLabel: string; steps: { num: string; title: string; body: string }[]; cta: string };
  exclusions: { heading: string; sub: string; items: { title: string; body: string }[] };
  benefits: { heading: string; programLabel: string; cta: string; categories: { label: string; title: string; items: string[] }[] };
  stats: { value: string; label: string }[];
  faq: { heading: string; items: { q: string; a: string }[] };
  contact: {
    heading: string; sub: string;
    fields: { name: string; phone: string; email: string; services: string };
    submit: string; gdpr: string; success: string;
    consentCheckbox: string;
    validation: { nameMin: string; emailRequired: string; emailInvalid: string; emailDisposable: string; descMin: string; descMax: string; consentRequired: string };
  };
  footer: { rights: string; officeLabel: string; workdays: string; privacy: string };
  heroBadges: { main: string; sub: string }[];
};
