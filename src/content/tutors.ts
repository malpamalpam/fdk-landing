import type { SiteContent } from './site-types';

export const tutors: SiteContent = {
  site: 'tutors',

  meta: {
    title: 'Invoice your language students and schools without a company — Business Incubator Poland',
    description:
      'For language teachers and translators in Poland: issue VAT invoices under our foundation\'s legal entity. No sole-trader registration, no ZUS, 6% income tax, full accounting. 400 PLN/month, cancel any time.',
  },

  hero: {
    badge: 'For language teachers & translators in Poland',
    hooks: [
      'Teach. Translate. Invoice. We handle the Polish paperwork.',
      'No company, no ZUS, 6% tax. Invoice every school and every student legally.',
      'Your lessons are your business. Registering one shouldn\'t be.',
    ],
    subtitle:
      'Language schools, online platforms, corporate clients and private students all want an invoice. The Business Incubator lets you issue VAT invoices under our foundation\'s tax ID — no sole-trader registration, no monthly ZUS, no Polish accountant to hire. You teach, we do the rest.',
    bullets: [
      'Set up online in 15 minutes',
      'Invoices in PLN, EUR, USD, GBP',
      'Support in English, Ukrainian, Russian, Polish',
    ],
    formTitle: 'Book a free call',
    cta: 'Get my free consultation',
  },

  stats: [
    { value: 'since 2015', label: 'helping freelancers in Poland' },
    { value: '493', label: 'active members' },
    { value: '4.7/5', label: 'Google rating' },
  ],

  who: {
    title: 'Who is this for?',
    items: [
      {
        icon: 'GraduationCap',
        title: 'Online tutors',
        text: 'Teaching on Preply, italki, Tutlo, Cambly or your own site? Invoice the platform or your students and get paid to a Polish account.',
      },
      {
        icon: 'School',
        title: 'Teachers at language schools',
        text: 'Schools in Poland prefer B2B contracts. We issue the invoice, the school pays us, you get your pay minus 6%.',
      },
      {
        icon: 'Building',
        title: 'Corporate trainers',
        text: 'In-company English, German or Polish courses for businesses. VAT invoices that a corporate procurement team accepts without questions.',
      },
      {
        icon: 'Languages',
        title: 'Translators & interpreters',
        text: 'Agencies, sworn translations, conference work. One flat fee covers all your clients, in any currency.',
      },
      {
        icon: 'Plane',
        title: 'Foreigners living in Poland',
        text: "You have a residence permit and want to work legally for yourself. No need to understand CEIDG, ZUS or Polish tax forms — we explain everything in English.",
      },
      {
        icon: 'Sun',
        title: 'Seasonal workers',
        text: 'Summer with no lessons? Your only fixed cost is the monthly fee. No "minimum ZUS" for months you didn\'t earn.',
      },
    ],
  },

  how: {
    title: 'How it works',
    steps: [
      {
        title: 'Free call',
        text: 'Tell us where you teach and who pays you; we check if the incubator makes sense for you.',
      },
      {
        title: 'Sign online',
        text: 'One agreement with the foundation; you get access to our invoicing system and the details your clients need.',
      },
      {
        title: 'Teach & invoice',
        text: 'You issue invoices in a few clicks, we do the accounting and taxes and pay you out.',
      },
    ],
  },

  benefits: {
    title: 'What you get for 400 PLN a month',
    items: [
      {
        icon: 'ShieldOff',
        title: 'No ZUS contributions',
        text: 'Sole traders in Poland pay 1,800+ PLN a month in social insurance before earning anything. You pay zero.',
      },
      {
        icon: 'Percent',
        title: '6% income tax, flat',
        text: "No lump-sum scheme to choose, no tax brackets, no annual return to file yourself. We withhold 6% and that's it.",
      },
      {
        icon: 'FileCheck',
        title: 'Unlimited invoices',
        text: 'Every school, every platform, every private student. PLN, EUR, USD, GBP. Reverse charge for EU clients.',
      },
      {
        icon: 'Calculator',
        title: 'Accounting included',
        text: 'Monthly filings, VAT, year-end — done by us, in the fee.',
      },
      {
        icon: 'MessageCircle',
        title: 'A lawyer who speaks English',
        text: 'School contract with an odd clause? Copyright in your course materials? Ask, get an answer.',
      },
      {
        icon: 'DoorOpen',
        title: 'Cancel any time',
        text: 'No set-up fee, no minimum term. Leave with a single email.',
      },
    ],
  },

  compare: {
    title: 'Employment, sole trader or incubator? Example: 8,000 PLN monthly revenue',
    columns: ['', 'Employment contract', 'Sole trader (8.5% lump sum)', 'Incubator'],
    rows: [
      { label: 'ZUS (social insurance)', cells: ['~1,100 PLN', '1,825 PLN', '0 PLN'] },
      { label: 'Health contribution', cells: ['~720 PLN', '~556 PLN', '0 PLN'] },
      { label: 'Income tax', cells: ['~600 PLN', '~680 PLN', '480 PLN (6%)'] },
      { label: 'Accounting / fee', cells: ['—', '~400 PLN', '400 PLN'] },
      { label: 'Take-home', cells: ['~5,580 PLN', '~4,540 PLN', '~7,120 PLN'] },
    ],
    note: 'Indicative figures; we calculate your exact case on the call.',
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Is this legal in Poland?',
        a: '"Pre-incubation" is an established model: the foundation lends you its legal entity under a written agreement and you provide services in its name. The foundation has operated since 2015.',
      },
      {
        q: 'Do I need a residence permit or Polish citizenship?',
        a: 'You need to live in Poland legally (any residence permit, temporary or permanent, or EU citizenship) or work remotely from abroad for Polish clients. We can also help with legalisation of stay — ask on the call.',
      },
      {
        q: 'Can I invoice platforms like Preply or Tutlo?',
        a: "Yes. Many of our members do exactly that. We'll tell you how each platform handles invoices.",
      },
      {
        q: 'What about health insurance?',
        a: "ZUS is not mandatory in this model. If you want NFZ coverage, we'll show you how to join voluntarily.",
      },
      {
        q: 'How fast can I start?',
        a: 'You sign online; most people issue their first invoice the same day.',
      },
      {
        q: 'Can I invoice private students without VAT?',
        a: "Language teaching has specific VAT rules in Poland; we'll apply the correct treatment for your situation and explain it on the call.",
      },
    ],
  },

  form: {
    nameLabel: 'Full name',
    phoneLabel: 'Phone',
    emailLabel: 'E-mail',
    situationLabel: 'Your situation',
    situationOptions: [
      { value: 'b2b_contract', label: 'A school/platform wants to pay me on invoice' },
      { value: 'freelance', label: 'I work with several clients' },
      { value: 'other', label: 'Something else' },
    ],
    industryLabel: 'What do you do?',
    industryOptions: [
      { value: 'language_teacher', label: 'Language teacher / tutor' },
      { value: 'translator', label: 'Translator' },
      { value: 'interpreter', label: 'Interpreter' },
      { value: 'other', label: 'Other' },
    ],
    messageLabel: 'Message (optional)',
    consentPrivacy:
      'I consent to the processing of my personal data for contact purposes in accordance with the <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. Data controller: Fundacja Firma dla Każdego, ul. Lwowska 17/4, 00-660 Warsaw (NIP 5252625624).',
    consentMarketing:
      "I'd like to receive information about the foundation's services. I can withdraw consent at any time.",
    submit: 'Send & book my call',
    note: 'We reply within 24 business hours.',
    selectPlaceholder: '— select —',
  },

  thanks: {
    title: 'Thanks — we\'ve got your request.',
    text: 'We\'ll call you within 24 business hours. Want to talk now? +48 794 731 000.',
    nextSteps: [
      'Who you work for (schools, platforms, clients)',
      'Your approximate monthly income',
      'The currency you get paid in',
    ],
  },

  contact: { title: 'Get in touch' },
  skipToContent: 'Skip to content',
  stickyCtaLabel: 'Book a call',
  ogSiteName: 'Business Incubator Poland',
  ogLocale: 'en_GB',
  email: {
    autoresponder: {
      subject: 'Thanks — we\'ll call you within 24 business hours',
      greeting: 'Hi {name},',
      body: 'thank you for contacting the Business Incubator run by Fundacja Firma Dla Każdego. We\'ll call you within 24 business hours at {phone}.\n\nTo make the call useful, have these at hand: who you work for (schools, platforms, clients), your approximate monthly income and the currency you get paid in.',
      callNow: 'Want to talk now? Call +48 794 731 000 (Mon\u2013Fri, 9 am\u20135 pm CET) \u2014 we speak English, Ukrainian, Russian and Polish.',
      signoff: 'Best regards,\nFundacja Firma Dla Każdego team\nul. Lwowska 17/4, 00-660 Warsaw\nfirmadlakazdego.pl',
    },
  },

  cookie: {
    text: 'We use cookies to measure ad performance.',
    accept: 'Accept all',
    essential: 'Essential only',
    settings: 'Settings',
  },

  footer: {
    tagline: 'Business Incubator by Fundacja Firma Dla Każdego, Warsaw.',
  },
};
