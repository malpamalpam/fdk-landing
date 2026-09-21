import type { Dictionary } from './types';

export const pl: Dictionary = {
  nav: { industries: 'Branże', howItWorks: 'Jak to działa', benefits: 'Co otrzymujesz', faq: 'FAQ', cta: 'Bezpłatna konsultacja' },
  hero: {
    badge: 'Wspieramy specjalistów i freelancerów',
    h1: 'Wystawiaj faktury bez zakładania własnej firmy',
    h1accent: 'faktury',
    bullets: [
      'Współpracuj z klientami z całego świata.',
      'Wystawiaj faktury oficjalnie w naszym systemie.',
      'Otrzymuj płatności krajowe i walutowe.',
    ],
    cta: 'Bezpłatna konsultacja',
    modules: ['Fakturowanie', 'Bankowość', 'Umowy B2B', 'Księgowość', 'Podatki', 'HR', 'Prawo', 'Benefity'],
  },
  industries: {
    heading: 'Branże, z którymi współpracujemy',
    sub: 'Wybierz swoją branżę i sprawdź, czy pasujemy do siebie.',
    list: [
      'IT / Programiści', 'Graficy i ilustratorzy', 'Projektant / Architekt',
      'Fotografowie / Videografowie', 'Content creatorzy / UGC', 'Muzycy i twórcy audio',
      'Tłumacze', 'Lektorzy języka obcego', 'Autorzy artykułów i książek',
      'E-commerce', 'Dziennikarze / Copywriterzy', 'Coaching i trenerzy rozwoju osobistego',
    ],
  },
  howItWorks: {
    heading: 'Jak rozpocząć współpracę? 3 proste kroki',
    processLabel: 'Proces',
    steps: [
      { num: '01', title: 'Konsultacja wstępna', body: 'Omówimy zakres usług, model współpracy, tryb pracy oraz warunki rozliczeń.' },
      { num: '02', title: 'Podpisanie umowy współpracy', body: 'Podpisujemy umowę z Fundacją online lub w naszym biurze, otrzymujesz dostęp do systemu finansowego oraz konta bankowego i możesz rozpocząć świadczenie usług i wystawianie faktur.' },
      { num: '03', title: 'Wystawiasz fakturę i otrzymujesz opłatę od klienta', body: 'Oficjalnie wystawiasz faktury dla firm i osób fizycznych z Polski lub z zagranicy, otrzymujesz przelewy i wynagrodzenie.' },
    ],
    cta: 'Chcę dowiedzieć się więcej',
  },
  exclusions: {
    heading: 'Z kim NIE współpracujemy',
    sub: 'Nasze rozwiązanie nie jest dla każdego — i to jest OK.',
    items: [
      { title: 'Wymagana licencja lub koncesja', body: 'Jeśli Twoja usługa wymaga koncesji, licencji albo wpisu do rejestru branżowego.' },
      { title: 'Branże wykluczone', body: 'Jeśli jest to usługa dotycząca branż: budowlanej, mechaniki, usług kosmetycznych, gastronomii, taxi, dostaw, importu z Chin, logistyki, transportu.' },
    ],
  },
  benefits: {
    heading: 'Co otrzymujesz w ramach naszego programu wsparcia?',
    programLabel: 'Program wsparcia',
    cta: 'Chcę nawiązać współpracę',
    categories: [
      { label: 'KLIENCI Z CAŁEGO ŚWIATA', title: 'Współpracujesz globalnie', items: ['Współpraca z klientami z całego świata', 'Rozliczanie firm i osób fizycznych', 'Obsługa i weryfikacja umów B2B', 'Wsparcie w 4 językach: PL / EN / UA / RU'] },
      { label: 'PŁATNOŚCI', title: 'Szerokie możliwości opłat od klientów', items: ['3 subkonta biznesowe', 'Płatności w PLN, USD, EUR i 50+ walutach', 'Konto z IBAN / SWIFT / opłaty PayPal, Payoneer', 'Możliwość otrzymywania płatności w USDT'] },
      { label: 'PRAWO, PODATKI & WSPARCIE', title: 'Wsparcie księgowe, HR, administracyjne i legalizacyjne', items: ['Dedykowany opiekun HR', 'Doradztwo prawne i podatkowe', 'Obsługa rozliczeń podatkowych PIT i ZUS', 'Zaświadczenia i Deklaracje podatkowe'] },
      { label: 'BENEFITY', title: 'Pakiety sportowe i medyczne', items: ['Możliwość ubezpieczenia NFZ', 'Pakiety medyczne Medicover', 'Pakiety sportowe MultiSport', 'Ulga dla Młodych i rozwiązania dla studentów — zgodnie z obowiązującymi przepisami'] },
    ],
  },
  stats: [
    { value: '10+', label: 'lat na rynku' },
    { value: '8 000+', label: 'klientów z całego świata' },
    { value: '50 000+', label: 'wystawionych faktur' },
    { value: '30%', label: 'średniej oszczędności kosztów' },
  ],
  faq: {
    heading: 'Najczęściej zadawane pytania',
    items: [
      { q: 'Czy mój klient przyjmie taką fakturę?', a: 'Tak. Klient dostaje zwykłą fakturę VAT wystawioną przez Fundację, z Twoim imieniem jako wykonawcy usługi. Księguje ją tak samo jak fakturę od każdego innego kontrahenta. Jeśli klient ma pytania, możemy porozmawiać z nim bezpośrednio.' },
      { q: 'Czy to jest legalne?', a: 'Tak. Inkubator przedsiębiorczości to rozwiązanie funkcjonujące w Polsce od lat: Fundacja jest stroną umów i podatnikiem, a Ty świadczysz usługi jako osoba współpracująca z Fundacją. Faktury wystawia Fundacja, rozliczenia podatkowe są po jej stronie. Na życzenie wyjaśnimy podstawę prawną Twojemu klientowi.' },
      { q: 'Ile to kosztuje i co jest w tej cenie?', a: 'Stała opłata miesięczna, niezależna od liczby wystawionych faktur, plus podatek dochodowy od Twojego przychodu. W opłacie jest obsługa księgowa, wystawianie faktur, konto bankowe z IBAN, rozliczanie kosztów, wsparcie prawne i opiekun. Dokładną kwotę i to, co obejmuje, podajemy w odpowiedzi na zgłoszenie — bez ukrytych pozycji.' },
      { q: 'Czy mogę rozliczać koszty — sprzęt, oprogramowanie, kursy?', a: 'Tak. Koszty związane z Twoją działalnością rozliczasz przez Fundację na podstawie faktur kosztowych, w limicie do 25 dokumentów miesięcznie w pakiecie.' },
      { q: 'Czy zachowuję prawa autorskie do tego, co tworzę?', a: 'Tak. Prawa autorskie do Twoich prac przechodzą na klienta na zasadach, które ustalasz z nim w umowie. Fundacja nie rości sobie praw do Twojej twórczości.' },
      { q: 'Czy mogę fakturować klientów z zagranicy?', a: 'Tak. Faktury w EUR, USD i innych walutach, konto z IBAN/SWIFT, dwa konta walutowe bez dodatkowych opłat, płatności PayPal i USDT.' },
      { q: 'Co, jeśli w którymś miesiącu nic nie zarobię?', a: 'Nie płacisz podatku od przychodu, którego nie było. Kwestię opłaty za miesiąc bez faktur omawiamy indywidualnie przed podpisaniem umowy — dowiesz się tego zanim się zdecydujesz.' },
      { q: 'Czy mogę zrezygnować i przejść na własną działalność?', a: 'Tak, w każdej chwili. Nie ma okresu minimalnego. Wiele osób zaczyna w inkubatorze, sprawdza, czy to ma sens, i dopiero wtedy zakłada firmę. Pomagamy przy przejściu.' },
      { q: 'Czy inkubator obsługuje Ulgę dla Młodych i studentów?', a: 'Tak. Osoby do 26. roku życia korzystają z ulgi dla młodych, a studenci nie płacą składek ZUS — zgodnie z obowiązującymi przepisami. Uwzględniamy to w rozliczeniu.' },
    ],
  },
  contact: {
    heading: 'Umów się na bezpłatną konsultację',
    sub: 'Wypełnij formularz — odpowiadamy w 1 dzień roboczy.',
    fields: { name: 'Imię', email: 'E-mail', phone: 'Telefon (opcjonalnie)', description: 'Opisz swoją sytuację', descriptionPlaceholder: 'np. rodzaj usług, dla kogo pracujesz, jak często wystawiasz faktury...' },
    submit: 'Wyślij',
    submitNote: 'Odpowiadamy w 1 dzień roboczy. Bez zobowiązań.',
    consentRodo: 'Wyrażam zgodę na przetwarzanie danych osobowych w celu odpowiedzi na zapytanie. Zapoznałem/am się z',
    consentMarketing: 'Chcę otrzymywać informacje o usługach Fundacji e-mailem lub telefonicznie. Zgodę mogę wycofać w każdej chwili.',
    privacyLink: 'Polityką prywatności',
    success: 'Dziękujemy! Odpowiemy w 1 dzień roboczy.',
    validation: { nameMin: 'Imię musi mieć co najmniej 2 znaki', emailRequired: 'Podaj adres e-mail', emailInvalid: 'Podaj poprawny adres e-mail', emailDisposable: 'Podaj stały adres e-mail, nie jednorazowy', descMin: 'Opisz swoją sytuację (min. 10 znaków)', descMax: 'Maksymalnie 1000 znaków', consentRequired: 'Zgoda na przetwarzanie danych jest wymagana' },
  },
  footer: { rights: '© 2026 Fundacja Firma dla każdego. Wszelkie prawa zastrzeżone.', officeLabel: 'Biuro', workdays: 'Pon – Pt', privacy: 'Polityka prywatności' },
  heroBadges: [
    { main: 'Do 50 faktur miesięcznie', sub: 'w cenie programu' },
    { main: 'Płatności międzynarodowe', sub: 'w 50+ walutach' },
  ],
};
