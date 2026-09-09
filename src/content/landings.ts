import { facts } from './facts';

export type RoleSplitItem = { label: string; items: string[] };
export type SocialProofItem = { value: string; label: string };

export type LandingContent = {
  slug: string;
  segment: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
    formHeading: string;
    formIntro: string;
    submitLabel: string;
    trustLine: string;
  };
  highlight: { title: string; intro?: string; items: { label: string; text: string }[] };
  roleSplit?: { title: string; columns: [RoleSplitItem, RoleSplitItem] };
  foreignWorkers?: { title: string; items: string[]; disclaimer: string };
  socialProof?: { items: SocialProofItem[] };
  forWhom: { title: string; items: string[] };
  notForWhom: { title: string; intro?: string; items: string[] };
  howItWorks: { title: string; steps: { title: string; text: string }[] };
  comparison: { title: string; note?: string; columns: string[]; rows: { label: string; cells: string[] }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  testimonials: { title: string; items: { name: string; role: string; text: string }[] };
  finalCta: { title: string; text: string; submitLabel: string };
  form: {
    descriptionLabel: string;
    descriptionPlaceholder: string;
    extraFields?: {
      company?: boolean;
      specialistsCount?: boolean;
      invoicesPerMonth?: boolean;
    };
  };
  thankYou: { h1: string; lead: string; next: string[] };
  nav: { anchors: { label: string; href: string }[] };
};

export const landings: LandingContent[] = [
  // ─── LANDING 1 — Kontrakt B2B ───
  {
    slug: 'landing1',
    segment: 'kontrakt-b2b',
    meta: {
      title: 'Kontrakt B2B bez zakładania firmy — Firma dla Każdego',
      description: 'Dostałeś kontrakt B2B? Wystawiaj faktury przez inkubator — bez ZUS, bez księgowej, start w kilka dni. Sprawdzimy Twoją sytuację.',
    },
    hero: {
      eyebrow: 'Dla przechodzących z etatu na kontrakt',
      h1: 'Masz kontrakt B2B. Nie musisz zakładać firmy.',
      lead: 'Wystawiaj faktury przez inkubator przedsiębiorczości — bez składek ZUS przedsiębiorcy, bez księgowej, bez wizyty w urzędzie. Sprawdzimy, czy w Twoim przypadku to ma sens, i powiemy wprost, jeśli nie ma.',
      formHeading: 'Powiedz nam, co podpisujesz',
      formIntro: 'Napisz, czym się zajmujesz i kiedy startuje kontrakt. Odpowiemy tak szybko, jak to możliwe.',
      submitLabel: 'Wyślij',
      trustLine: 'Bez zobowiązań. Nie wysyłamy ofert masowych.',
    },
    highlight: {
      title: 'Dostałeś kontrakt B2B. Masz trzy opcje.',
      items: [
        { label: 'Własna działalność', text: 'Szybko, ale wchodzisz w składki, deklaracje i księgowość na stałe. To decyzja, którą trudno cofnąć w połowie kontraktu.' },
        { label: 'Umowa zlecenie', text: 'Klient zwykle nie chce, bo po jego stronie oznacza koszt i obowiązki płatnika składek.' },
        { label: 'Inkubator', text: 'Fakturujesz od razu, nie zakładasz firmy. Jeśli po kilku miesiącach uznasz, że wolisz własną działalność, przechodzisz na nią bez przeszkód.' },
      ],
    },
    forWhom: {
      title: 'Dla kogo to jest',
      items: ['Programista', 'Tester i analityk', 'Marketingowiec i specjalista SEO/SEM', 'Grafik i projektant UI', 'Project manager', 'Konsultant i trener', 'Specjalista przechodzący z etatu na kontrakt'],
    },
    notForWhom: {
      title: 'Dla kogo to nie jest',
      intro: 'Nie każdemu się to opłaca. Pięć sytuacji, w których odradzamy:',
      items: [
        'Prowadzisz usługi fizyczne — budowlanka, mechanika, usługi kosmetyczne. To nie nasz profil.',
        'Masz od lat zoptymalizowaną działalność i dobrą księgową. Zostań przy swoim.',
        'Twoja usługa wymaga koncesji, licencji albo wpisu do rejestru branżowego.',
        'Zatrudniasz ludzi na etat.',
        'Budujesz firmę pod sprzedaż inwestorowi.',
      ],
    },
    howItWorks: {
      title: 'Jak to wygląda w praktyce',
      steps: [
        { title: 'Piszesz, co i kiedy', text: 'Czym się zajmujesz i kiedy startuje kontrakt. Dwa zdania wystarczą.' },
        { title: 'Sprawdzamy Twój przypadek', text: 'Odpowiemy tak szybko, jak to możliwe. Jeśli lepszym rozwiązaniem jest własna działalność, mówimy to wprost.' },
        { title: 'Podpisujesz i fakturujesz', text: `Formalności zajmują ${facts.onboardingTime}. Pierwszą fakturę wystawiasz od razu po podpisaniu.` },
      ],
    },
    comparison: {
      title: 'Etat, własna działalność czy inkubator',
      note: 'Porównanie dotyczy sytuacji osoby rozpoczynającej kontrakt B2B. Konkretne kwoty zależą od formy rozliczenia — policzymy je dla Twojego przypadku.',
      columns: ['Etat', 'Własna działalność', 'Inkubator'],
      rows: [
        { label: 'Składki ZUS przedsiębiorcy', cells: ['po stronie pracodawcy', 'tak', facts.zusStatus] },
        { label: 'Księgowość', cells: ['pracodawca', 'po Twojej stronie', 'po naszej stronie'] },
        { label: 'Formalności na start', cells: ['umowa o pracę', 'rejestracja, konto firmowe, wybór formy opodatkowania', facts.onboardingTime] },
        { label: 'Czas do pierwszej faktury', cells: ['nie dotyczy', facts.onboardingTime, facts.onboardingTime] },
        { label: 'Koszt w miesiącu bez zleceń', cells: ['nie dotyczy', facts.idleMonthCost, facts.idleMonthCost] },
        { label: 'Zakończenie', cells: ['okres wypowiedzenia', 'zamknięcie działalności', facts.noticePeriod] },
      ],
    },
    faq: {
      title: 'Najczęstsze pytania',
      items: [
        { q: 'Czy mój klient przyjmie taką fakturę?', a: '[FDK]' },
        { q: 'Czy to jest legalne?', a: '[FDK]' },
        { q: 'Ile to kosztuje i co jest w tej cenie?', a: '[FDK]' },
        { q: 'Czym to się różni od własnej działalności?', a: '[FDK]' },
        { q: 'Zdążę przed startem kontraktu?', a: '[FDK]' },
        { q: 'Co, jeśli w którymś miesiącu nie będę miał zleceń?', a: '[FDK]' },
        { q: 'Czy mogę później przejść na własną działalność?', a: '[FDK]' },
        { q: 'Co ze składką zdrowotną i ubezpieczeniem?', a: 'Działając w inkubatorze, nie masz obowiązku opłacania składek ZUS przedsiębiorcy. Możesz ubezpieczyć się w NFZ dobrowolnie — pomożemy to ustawić. Na wniosek wystawiamy zaświadczenie o dochodach potrzebne do ubezpieczenia.' },
        { q: 'Czy inkubator obsługuje Ulgę dla Młodych i studentów?', a: 'Tak. Osoby do 26. roku życia korzystają z ulgi dla młodych, a studenci nie płacą składek ZUS — zgodnie z obowiązującymi przepisami. Uwzględniamy to w rozliczeniu.' },
      ],
    },
    testimonials: {
      title: 'Osoby, które przez to przeszły',
      items: [], // TODO: uzupełnić prawdziwymi opiniami
    },
    finalCta: {
      title: 'Kontrakt już czeka?',
      text: 'Napisz nam datę startu — sprawdzimy, co zdążysz.',
      submitLabel: 'Wyślij',
    },
    form: {
      descriptionLabel: 'Krótki opis Twojej działalności',
      descriptionPlaceholder: 'Czym się zajmujesz, kiedy startuje kontrakt, dla kogo będziesz pracować?',
    },
    thankYou: {
      h1: 'Dziękujemy — mamy Twoje zgłoszenie.',
      lead: 'Odpowiemy tak szybko, jak to możliwe, na adres, który podałeś.',
      next: [
        'Sprawdzimy, czy inkubator pasuje do Twojego kontraktu',
        'Jeśli lepszym rozwiązaniem będzie własna działalność — napiszemy to wprost',
        'Jeśli tak, dostaniesz listę tego, co potrzebne do startu',
      ],
    },
    nav: {
      anchors: [
        { label: 'Możliwości', href: '#opcje' },
        { label: 'Jak to działa?', href: '#kroki' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Kontakt', href: '#formularz' },
      ],
    },
  },

  // ─── LANDING 2 — Faktura bez własnej firmy ───
  {
    slug: 'landing2',
    segment: 'faktura-bez-firmy',
    meta: {
      title: 'Faktura bez własnej firmy — dla wolnych zawodów | Firma dla Każdego',
      description: 'Wystawiaj faktury bez zakładania działalności. Dla tłumaczy, lektorów, grafików i programistów. Sprawdź, czy to się opłaca.',
    },
    hero: {
      eyebrow: 'Dla wolnych zawodów i freelancerów',
      h1: 'Wystawiaj faktury bez zakładania firmy.',
      lead: 'Kilku klientów, regularne zlecenia i zero ochoty na administrację wokół tego. Wystawiasz fakturę, my zajmujemy się resztą.',
      formHeading: 'Policzmy Twój przypadek',
      formIntro: 'Napisz, czym się zajmujesz i ile faktur miesięcznie planujesz. Odpowiemy tak szybko, jak to możliwe.',
      submitLabel: 'Wyślij',
      trustLine: 'Jeśli przy Twojej skali taniej wyjdzie coś innego — powiemy to wprost.',
    },
    highlight: {
      title: 'Ile faktur miesięcznie wystawiasz?',
      intro: 'To jedno pytanie decyduje o tym, co się opłaca. Odpowiadamy uczciwie, także wtedy, gdy odpowiedzią nie jesteśmy my.',
      items: [
        { label: 'Jedna, dwie w roku', text: 'Serwis pobierający prowizję od pojedynczej faktury wyjdzie taniej. Nie ma sensu wiązać się stałą opłatą.' },
        { label: 'Kilka miesięcznie', text: 'Tu inkubator zwykle wygrywa, bo prowizja od każdej faktury szybko przekracza stałą opłatę, a dochodzi możliwość rozliczania kosztów.' },
        { label: 'Regularnie i rośnie', text: 'Warto policzyć również własną działalność. Przy odpowiednio wysokich przychodach potrafi być korzystniejsza — pokażemy Ci ten próg.' },
      ],
    },
    forWhom: {
      title: 'Dla kogo to jest',
      items: ['Tłumacz', 'Lektor języka obcego', 'Grafik i ilustrator', 'Architekt', 'Fotograf', 'Muzyk i twórca', 'Programista', 'Osoba prowadząca e-commerce'],
    },
    notForWhom: {
      title: 'Kiedy tego nie polecamy',
      items: [
        'Wystawiasz fakturę raz na kilka miesięcy — wtedy prowizja od pojedynczego dokumentu jest tańsza.',
        'Prowadzisz usługi fizyczne. To nie nasz profil.',
        'Twoja usługa wymaga koncesji, licencji albo wpisu do rejestru branżowego.',
        'Zatrudniasz ludzi na etat.',
      ],
    },
    howItWorks: {
      title: 'Jak to wygląda w praktyce',
      steps: [
        { title: 'Mówisz, ile i za co', text: 'Czym się zajmujesz i ile faktur miesięcznie planujesz.' },
        { title: 'Liczymy Twój przypadek', text: 'Porównujemy trzy ścieżki i pokazujemy różnicę. Bez naciągania w naszą stronę.' },
        { title: 'Wystawiasz pierwszą fakturę', text: `Formalności zajmują ${facts.onboardingTime}. Fakturę wystawiasz w panelu.` },
      ],
    },
    comparison: {
      title: 'Trzy sposoby na fakturę bez własnej firmy',
      note: 'Porównanie przy [FDK: N] fakturach miesięcznie. Dla Twojej liczby policzymy indywidualnie.',
      columns: ['Serwis prowizyjny', 'Własna działalność', 'Inkubator'],
      rows: [
        { label: 'Model opłaty', cells: ['prowizja od każdej faktury', 'koszty stałe niezależne od przychodu', facts.monthlyFee] },
        { label: 'Koszt przy [FDK: N] fakturach', cells: ['[FDK]', '[FDK]', '[FDK]'] },
        { label: 'Rozliczanie kosztów firmowych', cells: ['nie', 'tak', `tak — do ${facts.packageLimits.costDocs} dokumentów kosztowych miesięcznie w pakiecie`] },
        { label: 'Składki ZUS przedsiębiorcy', cells: ['nie', 'tak', facts.zusStatus] },
        { label: 'Faktury dla klientów zagranicznych', cells: ['[FDK]', 'tak', `tak — ${facts.payments.join(', ')}`] },
        { label: 'Wsparcie księgowe', cells: ['brak', 'po Twojej stronie', 'po naszej stronie'] },
      ],
    },
    faq: {
      title: 'Najczęstsze pytania',
      items: [
        { q: 'Czy mój klient przyjmie taką fakturę?', a: '[FDK]' },
        { q: 'Czy to jest legalne?', a: '[FDK]' },
        { q: 'Ile to kosztuje i co jest w tej cenie?', a: '[FDK]' },
        { q: 'Czy mogę rozliczać koszty — sprzęt, oprogramowanie, kursy?', a: '[FDK]' },
        { q: 'Czy zachowuję prawa autorskie do tego, co tworzę?', a: '[FDK]' },
        { q: 'Czy mogę fakturować klientów z zagranicy?', a: '[FDK]' },
        { q: 'Co, jeśli w którymś miesiącu nic nie zarobię?', a: '[FDK]' },
        { q: 'Czy mogę zrezygnować i przejść na własną działalność?', a: '[FDK]' },
        { q: 'Czy inkubator obsługuje Ulgę dla Młodych i studentów?', a: 'Tak. Osoby do 26. roku życia korzystają z ulgi dla młodych, a studenci nie płacą składek ZUS — zgodnie z obowiązującymi przepisami. Uwzględniamy to w rozliczeniu.' },
      ],
    },
    testimonials: {
      title: 'Osoby, które tak pracują',
      items: [], // TODO: uzupełnić prawdziwymi opiniami
    },
    finalCta: {
      title: 'Nie wiesz, czy Ci się opłaca?',
      text: 'Napisz, ile faktur miesięcznie planujesz — policzymy i odpiszemy.',
      submitLabel: 'Wyślij',
    },
    form: {
      descriptionLabel: 'Krótki opis Twojej działalności',
      descriptionPlaceholder: 'Czym się zajmujesz, dla kogo pracujesz, jak często wystawiasz faktury?',
      extraFields: { invoicesPerMonth: true },
    },
    thankYou: {
      h1: 'Dziękujemy — policzymy Twój przypadek.',
      lead: 'Odpowiemy tak szybko, jak to możliwe, na podany adres.',
      next: [
        'Porównamy trzy ścieżki przy Twojej liczbie faktur',
        'Jeśli taniej wyjdzie coś innego — napiszemy to wprost',
        'Jeśli inkubator ma sens, dostaniesz listę tego, co potrzebne',
      ],
    },
    nav: {
      anchors: [
        { label: 'Ile faktur', href: '#opcje' },
        { label: 'Jak to działa?', href: '#kroki' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Kontakt', href: '#formularz' },
      ],
    },
  },

  // ─── LANDING 3 — Współpraca B2B ───
  {
    slug: 'landing3',
    segment: 'wspolpraca-b2b',
    meta: {
      title: 'Faktura VAT od podwykonawcy bez działalności | Firma dla Każdego',
      description: 'Wasz współpracownik nie ma firmy? Wystawimy fakturę VAT za jego usługi. Bez umowy o pracę, bez ZUS po Waszej stronie.',
    },
    hero: {
      eyebrow: 'Dla firm współpracujących z freelancerami',
      h1: 'Wasz współpracownik wystawi Wam fakturę VAT. Bez zakładania działalności.',
      lead: 'Rozwiązanie dla firm, które chcą rozliczać się z podwykonawcami na fakturę — bez umowy o pracę i bez zlecenia z pełnymi obowiązkami płatnika.',
      formHeading: 'Napiszcie, kogo to dotyczy',
      formIntro: 'Ilu współpracowników i w jakich rolach. Odpowiemy tak szybko, jak to możliwe.',
      submitLabel: 'Wyślij',
      trustLine: 'Bez zobowiązań. Rozmawiamy najpierw o Waszej sytuacji, nie o cenniku.',
    },
    highlight: {
      title: 'Co się zmienia w Waszym procesie',
      intro: 'Nic. I to jest cała idea tego rozwiązania.',
      items: [
        { label: 'Dokument kosztowy', text: 'Dostajecie normalną fakturę VAT. Księgowość księguje ją tak samo jak każdą inną fakturę od kontrahenta.' },
        { label: 'Płatność', text: 'Przelew na fakturę, w Waszym zwykłym terminie. Bez list płac i bez terminów składkowych.' },
        { label: 'Obowiązki płatnika', text: 'Nie powstają. Rozliczenie jest po stronie współpracownika i po naszej.' },
        { label: 'Kadry', text: 'Bez akt osobowych, badań i szkoleń BHP, bo nie ma stosunku pracy.' },
      ],
    },
    roleSplit: {
      title: 'Ty wybierasz specjalistę. My obsługujemy zaplecze.',
      columns: [
        {
          label: 'Firma',
          items: [
            'Wybiera specjalistę',
            'Ustala zakres usług',
            'Ustala warunki współpracy',
            'Przekazuje zadania',
            'Opłaca fakturę',
          ],
        },
        {
          label: 'Inkubator',
          items: [
            'Przygotowuje dokumentację',
            'Zapewnia obsługę formalną',
            'Rozlicza i prowadzi księgowość',
            'Wspiera kwestie podatkowe',
            'Pomaga w formalnościach związanych z cudzoziemcami',
            'Zapewnia formalną podstawę współpracy',
          ],
        },
      ],
    },
    foreignWorkers: {
      title: 'Współpracownicy spoza Polski',
      items: [
        'Oświadczenia o powierzeniu pracy i zezwolenia na pracę typu A',
        'Zezwolenia na pobyt czasowy i pracę, karta pobytu, Blue Card',
        'Powiadomienia dotyczące obywateli Ukrainy',
        `Wnioski składane w ${facts.legalizationFilingDays}`,
      ],
      disclaimer: 'Możliwość legalizacji pobytu zależy od sytuacji danej osoby i obowiązujących przepisów — sprawdzamy to indywidualnie.',
    },
    socialProof: {
      items: [
        { value: `Od ${facts.sinceYear}`, label: 'roku na rynku' },
        { value: `${facts.countries}`, label: 'krajów pochodzenia specjalistów' },
        { value: facts.languages.join(' · '), label: 'języki obsługi' },
        { value: 'Administracja · Księgowość · HR · Legalizacja', label: 'w jednym miejscu' },
      ],
    },
    forWhom: {
      title: 'Dla kogo to jest',
      items: ['Agencje marketingowe', 'Software house\'y', 'Studia graficzne i produkcyjne', 'Firmy e-commerce', 'Wydawnictwa i redakcje', 'Firmy szkoleniowe i językowe', 'Zespoły korzystające z podwykonawców sezonowo'],
    },
    notForWhom: {
      title: 'Czego nie robimy',
      intro: 'Mówimy to wprost, bo to najczęstsze pytanie, jakie dostajemy od firm:',
      items: [
        'Nie przenosimy obecnych pracowników etatowych na współpracę B2B i nie doradzamy takiego rozwiązania.',
        'Nie jesteśmy agencją pracy tymczasowej ani firmą outsourcingową.',
        'Nie obsługujemy zawodów wymagających koncesji, licencji lub uprawnień branżowych.',
        'Nie prowadzimy rekrutacji ani nie dostarczamy podwykonawców.',
      ],
    },
    howItWorks: {
      title: 'Jak to wygląda w praktyce',
      steps: [
        { title: 'Mówicie, kogo to dotyczy', text: 'Ilu współpracowników i czym się zajmują.' },
        { title: 'Przeprowadzamy ich przez formalności', text: 'Cała obsługa jest po naszej stronie. Wasz zespół nie robi nic poza wskazaniem osób.' },
        { title: 'Dostajecie faktury', text: 'Normalne faktury VAT, w Waszym zwykłym obiegu dokumentów.' },
      ],
    },
    comparison: {
      title: 'Trzy sposoby rozliczenia współpracownika',
      columns: ['Umowa o pracę', 'Umowa zlecenie', 'Faktura przez inkubator'],
      rows: [
        { label: 'Obowiązki płatnika po Waszej stronie', cells: ['pełne', '[FDK]', 'brak'] },
        { label: 'Dokument w księgowości', cells: ['lista płac', 'rachunek', 'faktura VAT'] },
        { label: 'Obsługa kadrowa', cells: ['pełna', 'częściowa', 'brak'] },
        { label: 'Elastyczność zakończenia współpracy', cells: ['okres wypowiedzenia', '[FDK]', facts.noticePeriod] },
        { label: 'Czas uruchomienia dla jednej osoby', cells: ['[FDK]', '[FDK]', facts.onboardingTime] },
        { label: 'Kto ponosi koszt uczestnictwa', cells: ['nie dotyczy', 'nie dotyczy', facts.feeSource] },
      ],
    },
    faq: {
      title: 'Pytania, które zadają firmy',
      items: [
        { q: 'Czy to jest bezpieczne od strony formalnej dla naszej firmy?', a: '[FDK]' },
        { q: 'Jak księgujemy taką fakturę?', a: '[FDK]' },
        { q: 'Z kim podpisujemy umowę?', a: 'Umowę o świadczenie usług podpisujecie z Fundacją. Fundacja jest stroną umowy, a współpracownik jest wskazany jako wykonawca. Możemy przygotować umowę albo zweryfikować Waszą.' },
        { q: 'Kto ponosi koszt uczestnictwa w inkubatorze?', a: facts.feeSource },
        { q: 'Ile trwa uruchomienie dla jednej osoby?', a: '[FDK]' },
        { q: 'Co, jeśli współpracownik zakończy współpracę z nami?', a: '[FDK]' },
        { q: 'Czy możecie obsłużyć współpracowników spoza Polski?', a: '[FDK]' },
        { q: 'Czy da się to uruchomić dla większej grupy naraz?', a: '[FDK]' },
        { q: 'Czy dokumenty możemy podpisać online?', a: 'Tak. Cały proces, łącznie z podpisaniem dokumentów, może odbyć się zdalnie.' },
      ],
    },
    testimonials: {
      title: 'Firmy, które tak pracują',
      items: [], // TODO: uzupełnić prawdziwymi opiniami
    },
    finalCta: {
      title: 'Macie konkretną sytuację do poukładania?',
      text: 'Napiszcie, ilu osób to dotyczy — odezwiemy się z konkretami.',
      submitLabel: 'Wyślij',
    },
    form: {
      descriptionLabel: 'Kim są współpracownicy i czym się zajmują',
      descriptionPlaceholder: 'Ilu współpracowników to dotyczy, w jakich rolach pracują, jak rozliczacie się z nimi teraz?',
      extraFields: { company: true, specialistsCount: true },
    },
    thankYou: {
      h1: 'Dziękujemy — mamy Wasze zgłoszenie.',
      lead: 'Odpowiemy tak szybko, jak to możliwe, na podany adres.',
      next: [
        'Zapytamy o szczegóły ról i skali współpracy',
        'Pokażemy, jak to wygląda od strony Waszej księgowości',
        'Jeśli to rozwiązanie nie pasuje do Waszej sytuacji, powiemy to wprost',
      ],
    },
    nav: {
      anchors: [
        { label: 'Dla kogo', href: '#dla-kogo' },
        { label: 'Jak to działa?', href: '#kroki' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Kontakt', href: '#formularz' },
      ],
    },
  },
];

export function getLandingBySlug(slug: string): LandingContent | undefined {
  return landings.find((l) => l.slug === slug);
}

export function getAllSlugs(): string[] {
  return landings.map((l) => l.slug);
}
