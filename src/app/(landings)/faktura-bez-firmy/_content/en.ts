import type { Dictionary } from './types';

export const en: Dictionary = {
  nav: { industries: 'Industries', howItWorks: 'How it works', benefits: 'What you get', faq: 'FAQ', cta: 'Free consultation' },
  hero: {
    badge: 'We support specialists and freelancers',
    h1: 'Issue invoices without setting up your own company',
    h1accent: 'invoices',
    bullets: ['Work with clients from around the world.', 'Issue invoices officially in our system.', 'Receive domestic and foreign currency payments.'],
    cta: 'Free consultation',
    modules: ['Invoicing', 'Banking', 'B2B Contracts', 'Accounting', 'Taxes', 'HR', 'Legal', 'Benefits'],
  },
  industries: { heading: 'Industries we work with', sub: 'Find your industry and see if we are a good match.', list: ['IT / Developers', 'Graphic Designers & Illustrators', 'Designer / Architect', 'Photographers / Videographers', 'Content Creators / UGC', 'Musicians & Audio Creators', 'Translators', 'Foreign Language Teachers', 'Article & Book Authors', 'E-commerce', 'Journalists / Copywriters', 'Coaching & Personal Development'] },
  howItWorks: {
    heading: 'How to start? 3 simple steps', processLabel: 'Process',
    steps: [
      { num: '01', title: 'Initial consultation', body: 'We will discuss the scope of services, cooperation model, working mode and settlement terms.' },
      { num: '02', title: 'Signing the cooperation agreement', body: 'We sign the agreement with the Foundation online or at our office, you get access to the financial system and bank account and can start providing services and issuing invoices.' },
      { num: '03', title: 'You issue an invoice and receive payment', body: 'You officially issue invoices for companies and individuals from Poland or abroad, receive transfers and remuneration.' },
    ],
    cta: 'I want to learn more',
  },
  exclusions: { heading: 'Who we do NOT work with', sub: 'Our solution is not for everyone — and that is OK.', items: [{ title: 'License or concession required', body: 'If your service requires a concession, license, or entry in an industry register.' }, { title: 'Excluded industries', body: 'If the service relates to: construction, mechanics, cosmetic services, taxi, deliveries, imports from China, logistics, transportation.' }] },
  benefits: {
    heading: 'What do you get in our support program?', programLabel: 'Support program', cta: 'I want to cooperate',
    categories: [
      { label: 'CLIENTS FROM AROUND THE WORLD', title: 'You work globally', items: ['Cooperation with clients from around the world', 'Billing companies and individuals', 'B2B contract handling and verification', 'Support in 4 languages: PL / EN / UA / RU'] },
      { label: 'PAYMENTS', title: 'Wide payment options from clients', items: ['3 business sub-accounts', 'Payments in PLN, USD, EUR and 50+ currencies', 'Account with IBAN / SWIFT / PayPal, Payoneer payments', 'Possibility of receiving payments in USDT'] },
      { label: 'LAW, TAXES & SUPPORT', title: 'Accounting, HR, administrative and legalization support', items: ['Dedicated HR supervisor', 'Legal and tax advisory', 'PIT and ZUS tax settlement handling', 'Certificates and Tax declarations'] },
      { label: 'BENEFITS', title: 'Sports and medical packages', items: ['Option to join NFZ health insurance', 'Medicover medical packages', 'MultiSport sports packages', "Young Person's Relief and student solutions — in accordance with applicable law"] },
    ],
  },
  stats: [{ value: '10+', label: 'years on the market' }, { value: '8,000+', label: 'clients worldwide' }, { value: '50,000+', label: 'invoices issued' }, { value: '30%', label: 'average cost savings' }],
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      { q: 'Will my client accept such an invoice?', a: 'Yes. The client receives a standard VAT invoice issued by the Foundation, with your name as the service provider. They book it the same way as an invoice from any other contractor. If the client has questions, we can speak with them directly.' },
      { q: 'Is this legal?', a: 'Yes. A business incubator is a solution that has been operating in Poland for years: the Foundation is the contracting party and taxpayer, and you provide services as a person cooperating with the Foundation. Invoices are issued by the Foundation, and tax settlements are on their side. Upon request, we will explain the legal basis to your client.' },
      { q: 'How much does it cost and what is included?', a: 'A fixed monthly fee, independent of the number of invoices issued, plus income tax on your revenue. The fee includes accounting service, invoice issuance, bank account with IBAN, cost settlement, legal support and a supervisor. We provide the exact amount and what it covers in response to your application — no hidden items.' },
      { q: 'Can I deduct expenses — equipment, software, courses?', a: 'Yes. Costs related to your activity are settled through the Foundation based on cost invoices, up to 25 documents per month in the package.' },
      { q: 'Do I retain copyright to what I create?', a: 'Yes. Copyright to your work transfers to the client on terms you agree upon in the contract. The Foundation does not claim rights to your work.' },
      { q: 'Can I invoice foreign clients?', a: 'Yes. Invoices in EUR, USD and other currencies, account with IBAN/SWIFT, two foreign currency accounts at no extra charge, PayPal and USDT payments.' },
      { q: 'What if I earn nothing one month?', a: 'You do not pay tax on revenue that did not exist. The question of the fee for a month without invoices is discussed individually before signing the agreement — you will know before you decide.' },
      { q: 'Can I quit and start my own business?', a: 'Yes, at any time. There is no minimum period. Many people start in the incubator, check if it makes sense, and only then register a company. We help with the transition.' },
      { q: "Does the incubator support the Young Person's Relief and students?", a: 'Yes. People under 26 benefit from the young person\'s relief, and students do not pay ZUS contributions — in accordance with applicable law. We take this into account in the settlement.' },
    ],
  },
  contact: {
    heading: 'Schedule a free consultation', sub: 'Fill in the form and our advisor will contact you within 24 hours.',
    fields: { name: 'First name', phone: 'Phone', email: 'E-mail', services: 'Type of services and brief description of your situation' },
    submit: 'Send application', gdpr: 'By submitting the form, you accept our Privacy Policy and consent to being contacted in response to your inquiry.', success: 'Thank you! We will contact you shortly.',
    consentCheckbox: 'I consent to the processing of my personal data in order to respond to my inquiry.',
    validation: { nameMin: 'Name must have at least 2 characters', emailRequired: 'Provide your e-mail address', emailInvalid: 'Provide a valid e-mail address', emailDisposable: 'Provide a permanent e-mail address, not a disposable one', descMin: 'Describe your situation (min. 10 characters)', descMax: 'Maximum 1000 characters', consentRequired: 'Consent to data processing is required' },
  },
  footer: { rights: '© 2026 Fundacja Firma dla każdego. All rights reserved.', officeLabel: 'Office', workdays: 'Mon – Fri', privacy: 'Privacy Policy' },
  heroBadges: [{ main: 'Up to 50 invoices / month', sub: 'included in the plan' }, { main: 'International payments', sub: '50+ currencies' }],
};
