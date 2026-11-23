import type { SiteContent } from './site-types';

export const general: SiteContent = {
  site: 'general',

  meta: {
    title: 'Inkubator przedsiębiorczości — faktury bez firmy, bez ZUS, PIT 6%',
    description:
      'Wystawiaj faktury pod osobowością prawną Fundacji zamiast zakładać działalność. Zero ZUS, 6% podatku, pełna księgowość i wsparcie prawne w jednym abonamencie 400 zł/mies. Na rynku od 2015 r.',
  },

  hero: {
    badge: 'Inkubator przedsiębiorczości · na rynku od 2015 roku',
    hooks: [
      'Firma bez firmy. Wystawiaj faktury, nie płać ZUS, zostaw sobie więcej.',
      'Twoja praca, nasza osobowość prawna. 6% podatku, 0 zł ZUS, 400 zł miesięcznie.',
      'Zanim założysz działalność, sprawdź, czy w ogóle musisz.',
    ],
    subtitle:
      'Inkubator to legalna alternatywa dla JDG: działasz pod NIP-em i REGON-em Fundacji, my prowadzimy księgowość, Ty wystawiasz faktury i dostajesz wypłatę. Dla freelancerów, kontraktorów B2B i firm, które chcą rozliczać współpracowników bez etatu.',
    bullets: ['Start w 15 minut, online', 'Faktury w PLN, EUR, USD', 'Rezygnacja w każdej chwili'],
    formTitle: 'Zostaw kontakt — oddzwonimy',
    cta: 'Chcę bezpłatną konsultację',
  },

  stats: [
    { value: 'od 2015', label: 'lat doświadczenia' },
    { value: '10 000+', label: 'obsłużonych klientów' },
    { value: '4.7/5', label: 'ocena w Google' },
  ],

  who: {
    title: 'Dla kogo jest inkubator?',
    items: [
      {
        icon: 'Briefcase',
        title: 'Kontraktorzy B2B',
        text: 'Masz ofertę na kontrakt i warunek „faktura". Zamiast CEIDG podpisujesz umowę z Fundacją i fakturujesz od pierwszego dnia.',
      },
      {
        icon: 'Laptop',
        title: 'Freelancerzy',
        text: 'Kilku klientów, nieregularne zlecenia, zero ochoty na ZUS w miesiącach bez pracy. Płacisz tylko stały abonament.',
      },
      {
        icon: 'Building2',
        title: 'Firmy i zespoły',
        text: 'Chcesz rozliczać współpracownika na fakturę, a on nie ma działalności. Fundacja wystawia Ci fakturę VAT, on dostaje wynagrodzenie.',
      },
      {
        icon: 'Globe',
        title: 'Pracujący dla zagranicy',
        text: 'Klient w Berlinie, Londynie, Nowym Jorku. Faktury w walucie, reverse charge, bez rejestracji zagranicznego VAT.',
      },
      {
        icon: 'Users',
        title: 'Cudzoziemcy w Polsce',
        text: 'Legalna praca na własny rachunek bez JDG i bez tłumaczenia się z polskich przepisów. Obsługa po polsku, angielsku, ukraińsku i rosyjsku.',
      },
      {
        icon: 'Sparkles',
        title: 'Dorabiający',
        text: 'Etat plus zlecenia na boku? Inkubator rozlicza to, co poza etatem, bez drugiego ZUS.',
      },
    ],
  },

  how: {
    title: 'Jak to działa?',
    steps: [
      {
        title: 'Rozmowa',
        text: 'Opisujesz, co robisz i dla kogo; bezpłatnie sprawdzamy, czy inkubator Ci się opłaca.',
      },
      {
        title: 'Umowa online',
        text: 'Podpisujesz umowę z Fundacją, dostajesz dostęp do systemu i dane do faktur.',
      },
      {
        title: 'Pracujesz i fakturujesz',
        text: 'Ty wystawiasz faktury w CRM, my księgujemy, rozliczamy podatek i wypłacamy Ci wynagrodzenie.',
      },
    ],
  },

  benefits: {
    title: 'Co dostajesz za 400 zł miesięcznie',
    items: [
      {
        icon: 'ShieldOff',
        title: 'Zero ZUS',
        text: 'Żadnych składek społecznych i zdrowotnej. Na JDG to ponad 1 800 zł co miesiąc, niezależnie od przychodu.',
      },
      {
        icon: 'Percent',
        title: 'Podatek 6%',
        text: 'Jedna stawka od wynagrodzenia, bez ryczałtu, bez skali, bez rocznego PIT-u na własną rękę.',
      },
      {
        icon: 'FileCheck',
        title: 'Faktury bez limitu',
        text: 'Dowolna liczba faktur, dla dowolnej liczby klientów, w PLN i walutach obcych.',
      },
      {
        icon: 'Calculator',
        title: 'Księgowość w cenie',
        text: 'Deklaracje, JPK, sprawozdania. Nie zatrudniasz księgowej.',
      },
      {
        icon: 'Scale',
        title: 'Prawnik pod ręką',
        text: 'Umowy z kontrahentami, prawa autorskie, klauzule. Pytasz, dostajesz odpowiedź.',
      },
      {
        icon: 'DoorOpen',
        title: 'Bez zobowiązań',
        text: 'Bez opłat wstępnych, bez okresu minimalnego. Zakończysz współpracę jednym mailem.',
      },
    ],
  },

  compare: {
    title: 'Etat, JDG czy inkubator? Przykład: 8 000 zł przychodu miesięcznie',
    columns: ['', 'Etat (UoP)', 'JDG (ryczałt 12–15%)', 'Inkubator'],
    rows: [
      { label: 'ZUS', cells: ['~1 100 zł', '1 825 zł', '0 zł'] },
      { label: 'Składka zdrowotna', cells: ['~720 zł', '~556 zł', '0 zł'] },
      { label: 'Podatek', cells: ['~600 zł', '960–1 200 zł', '480 zł (6%)'] },
      { label: 'Księgowość / abonament', cells: ['—', '~400 zł', '400 zł'] },
      { label: 'Na rękę', cells: ['~5 580 zł', '~4 000–4 300 zł', '~7 120 zł'] },
    ],
    note: 'Wartości orientacyjne; dokładne wyliczenie na konsultacji.',
  },

  faq: {
    title: 'Najczęstsze pytania',
    items: [
      {
        q: 'Czy to legalne?',
        a: 'Tak. Model preinkubacji działa w Polsce od lat: Fundacja użycza Ci osobowości prawnej na podstawie umowy, a Ty świadczysz usługi w jej imieniu. Fundacja działa od 2015 r. i rozlicza setki osób.',
      },
      {
        q: 'Czym to się różni od działalności nierejestrowanej?',
        a: 'Nierejestrowana ma limit przychodu (75% minimalnego wynagrodzenia miesięcznie) i nie pozwala wystawiać faktur VAT. W inkubatorze limitu nie ma.',
      },
      {
        q: 'Czy kontrahent widzi, że nie mam firmy?',
        a: 'Dostaje fakturę VAT od Fundacji z opisem usługi i Twoim nazwiskiem jako wykonawcy. Dla działu zakupów to zwykły dostawca B2B.',
      },
      {
        q: 'Czy mogę mieć ubezpieczenie zdrowotne?',
        a: 'ZUS nie jest obowiązkowy, ale podpowiemy, jak zgłosić się dobrowolnie do NFZ.',
      },
      {
        q: 'Ile trwa start?',
        a: 'Umowę podpisujesz online; zwykle fakturujesz tego samego dnia.',
      },
      {
        q: 'Czy muszę być w Polsce?',
        a: 'Nie. Wystarczy legalny pobyt w Polsce lub praca zdalna dla polskich/zagranicznych kontrahentów. Obsługujemy w 4 językach.',
      },
    ],
  },

  form: {
    nameLabel: 'Imię i nazwisko',
    phoneLabel: 'Telefon',
    emailLabel: 'E-mail',
    situationLabel: 'Twoja sytuacja',
    situationOptions: [
      { value: 'b2b_contract', label: 'Mam kontrakt / ofertę B2B' },
      { value: 'freelance', label: 'Pracuję jako freelancer' },
      { value: 'employer', label: 'Chcę rozliczać współpracowników mojej firmy' },
      { value: 'other', label: 'Inna' },
    ],
    industryLabel: 'Branża',
    industryOptions: [
      { value: 'programista', label: 'Programista' },
      { value: 'grafik', label: 'Grafik' },
      { value: 'lektor', label: 'Lektor' },
      { value: 'tlumacz', label: 'Tłumacz' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'e-commerce', label: 'E-commerce' },
      { value: 'inne', label: 'Inne' },
    ],
    messageLabel: 'Wiadomość (opcjonalnie)',
    consentPrivacy:
      'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu zgodnie z <a href="https://firmadlakazdego.pl/polityka-prywatnosci/" target="_blank" rel="noopener noreferrer">Polityką prywatności</a>. Administrator danych: Fundacja Firma dla Każdego, ul. Lwowska 17/4, 00-660 Warszawa (NIP 5252625624).',
    consentMarketing:
      'Chcę otrzymywać informacje o usługach Fundacji. Zgodę mogę wycofać w każdej chwili.',
    submit: 'Wyślij i umów konsultację',
    note: 'Oddzwaniamy w ciągu 24 godzin roboczych.',
    selectPlaceholder: '— wybierz —',
  },

  thanks: {
    title: 'Dziękujemy, zgłoszenie dotarło.',
    text: 'Oddzwonimy w ciągu 24 godzin roboczych. Chcesz od razu? Zadzwoń: +48 575 594 500.',
    nextSteps: [
      'Dla kogo pracujesz lub będziesz pracować (firma, platforma, klienci)',
      'Orientacyjny miesięczny przychód',
      'Waluta rozliczeń',
    ],
  },

  contact: { title: 'Skontaktuj się' },
  skipToContent: 'Przejdź do treści',
  stickyCtaLabel: 'Zostaw kontakt',
  ogSiteName: 'Inkubatory.com.pl',
  ogLocale: 'pl_PL',
  email: {
    autoresponder: {
      subject: 'Dziękujemy za zgłoszenie — oddzwonimy w ciągu 24 h',
      greeting: 'Dzień dobry {name},',
      body: 'dziękujemy za kontakt z inkubatorem Fundacji Firma Dla Każdego. Skontaktujemy się z Tobą w ciągu 24 godzin roboczych pod numerem {phone}.\n\nŻeby rozmowa była konkretna, warto mieć pod ręką: dla kogo pracujesz lub będziesz pracować (firma, platforma, klienci), orientacyjny miesięczny przychód oraz walutę rozliczeń.',
      callNow: 'Chcesz porozmawiać od razu? Zadzwoń: +48 575 594 500 (pon.–pt. 9–17).',
      signoff: 'Pozdrawiamy,\nZespół Fundacji Firma Dla Każdego\nul. Lwowska 17/4, 00-660 Warszawa\nfirmadlakazdego.pl',
    },
  },

  cookie: {
    text: 'Używamy plików cookie do mierzenia skuteczności reklam.',
    accept: 'Akceptuję',
    essential: 'Tylko niezbędne',
    settings: 'Ustawienia',
  },

  footer: {
    tagline: 'Inkubator przedsiębiorczości Fundacji Firma Dla Każdego.',
  },
};
