export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  a11y: {
    skip: string;
  };
  header: {
    cta: string;
    phone: string;
    langLabel: string;
  };
  hero: {
    badge: string;
    hooks: string[];
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
  };
  forWho: {
    title: string;
    subtitle: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  benefits: {
    title: string;
    subtitle: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
    bottomLine: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  form: {
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    email: string;
    industry: string;
    industryOptions: string[];
    message: string;
    consent: string;
    submit: string;
    sending: string;
    note: string;
    errorRequired: string;
    errorEmail: string;
    errorPhone: string;
    errorConsent: string;
    errorServer: string;
  };
  contact: {
    title: string;
    phonePL: string;
    phoneINT: string;
    email: string;
    addressTitle: string;
    address: string;
  };
  thanks: {
    title: string;
    text: string;
    cta: string;
  };
  footer: {
    tagline: string;
    privacy: string;
    terms: string;
    copy: string;
  };
  cookie: {
    text: string;
    accept: string;
    essential: string;
  };
  sticky: {
    cta: string;
  };
}
