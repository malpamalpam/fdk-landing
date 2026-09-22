export type Lang = 'PL' | 'EN' | 'RU' | 'UA';

export type Dictionary = {
  nav: { industries: string; howItWorks: string; benefits: string; pricing: string; faq: string; cta: string };
  hero: { badge: string; h1: string; h1accent: string; bullets: string[]; cta: string; tagline: string; modules: string[] };
  stats: { value: string; label: string }[];
  industries: {
    heading: string;
    list: string[];
    exclusionsHeading: string;
    exclusions: { title: string; body: string }[];
  };
  threeOptions: { heading: string; options: { label: string; text: string }[] };
  howItWorks: { heading: string; processLabel: string; steps: { num: string; title: string; body: string }[]; cta: string };
  benefits: { heading: string; programLabel: string; cta: string; categories: { label: string; title: string; items: string[] }[] };
  pricing: { heading: string; sub: string; popular: string; standardLabel: string; thresholdLabel: string; tiers: { threshold: string; price: string; period: string; desc: string; highlight: boolean }[]; cta: string };
  comparison: { heading: string; lossLabel: string; gainLabel: string; losses: string[]; gains: string[] };
  faq: { heading: string; items: { q: string; a: string }[] };
  contact: {
    heading: string; sub: string;
    fields: { name: string; email: string; phone: string; description: string; descriptionPlaceholder: string };
    submit: string; submitNote: string; success: string;
    consentRodo: string; consentMarketing: string; privacyLink: string;
    validation: { nameMin: string; emailRequired: string; emailInvalid: string; emailDisposable: string; descMin: string; descMax: string; consentRequired: string };
  };
  footer: { rights: string; officeLabel: string; workdays: string; privacy: string };
  heroBadges: { main: string; sub: string }[];
};
