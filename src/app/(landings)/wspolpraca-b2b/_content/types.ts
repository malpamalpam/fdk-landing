export type Dictionary = {
  nav: { forWhom: string; whyUs: string; services: string; howItWorks: string; faq: string; cta: string };
  hero: { badge: string; h1: string; h1accent: string; subtitle: string; sub2: string; cta: string };
  stats: { value: string; label: string }[];
  forWhom: { heading: string; sub: string; cards: { num: string; title: string; body: string; tag: string }[] };
  roles: { heading: string; company: { title: string; items: string[] }; incubator: { title: string; items: string[] }; sub: string; cta: string };
  howItWorks: { heading: string; processLabel: string; steps: { num: string; title: string; body: string }[] };
  whyUs: { heading: string; sub: string; items: { title: string; body: string }[] };
  notWeDo: { heading: string; sub: string; items: string[] };
  services: { heading: string; scopeLabel: string; tabs: { id: string; label: string; items: string[] }[]; legalDisclaimer: string };
  faq: { heading: string; items: { q: string; a: string }[] };
  contact: {
    heading: string; sub: string;
    fields: { name: string; email: string; phone: string; description: string; descriptionPlaceholder: string };
    consentRodo: string; consentMarketing: string; submit: string; privacyLink: string;
    validation: { nameMin: string; emailRequired: string; emailInvalid: string; emailDisposable: string; descMin: string; descMax: string; consentRequired: string };
  };
  footer: { tagline: string; rights: string; privacy: string };
};

export type Lang = 'PL' | 'EN' | 'RU' | 'UA';
