import type { SegmentHero, Segment } from './types';

const segments: Record<string, Record<Segment, SegmentHero>> = {
  pl: {
    'kontrakt-b2b': {
      badge: 'Dla osób, które dostały ofertę na B2B',
      title: 'KONTRAKT B2B BEZ ZAKŁADANIA FIRMY. BEZ ZUS, Z PIT 6%.',
      subtitle: 'Masz ofertę albo podpisany kontrakt B2B i nie chcesz otwierać działalności? Fakturujesz kontrahenta pod naszą osobowością prawną — start w 15 minut, jeden abonament 400 zł/mies., pełna księgowość w cenie.',
    },
    'faktura-bez-firmy': {
      badge: '>8 000 freelancerów już wystawiło faktury przez FDK · 4.7/5 w Google',
      title: 'WYSTAWIAJ FAKTURY BEZ WŁASNEJ FIRMY. BEZ ZUS, Z PIT 6%.',
      subtitle: 'Uczysz, tłumaczysz, programujesz albo projektujesz? Fakturuj wszystkich swoich klientów przez Fundację — bez JDG, bez ZUS, z jednym abonamentem 400 zł/mies.',
    },
    'wspolpraca-b2b': {
      badge: 'Dla firm i zespołów',
      title: 'ROZLICZAJ PODWYKONAWCĘ NA FAKTURĘ, NAWET JEŚLI NIE MA FIRMY.',
      subtitle: 'Twój współpracownik nie chce zakładać działalności? Fundacja wystawia Ci fakturę VAT za jego pracę, on dostaje wynagrodzenie po potrąceniu 6% PIT. Legalnie, bez umowy o pracę, bez ZUS po Twojej stronie.',
    },
    ogolny: {
      badge: '',
      title: '',
      subtitle: '',
    },
  },
  en: {
    'kontrakt-b2b': {
      badge: 'TODO_For people who received a B2B offer',
      title: 'TODO_B2B CONTRACT WITHOUT STARTING A COMPANY. NO ZUS, 6% INCOME TAX.',
      subtitle: 'TODO_You have a B2B offer or signed contract and don\'t want to register a business? Invoice your client under our legal entity — start in 15 minutes, one fee of 400 PLN/month, full accounting included.',
    },
    'faktura-bez-firmy': {
      badge: 'TODO_>8,000 freelancers have already invoiced through FDK · 4.7/5 on Google',
      title: 'TODO_ISSUE INVOICES WITHOUT YOUR OWN COMPANY. NO ZUS, 6% INCOME TAX.',
      subtitle: 'TODO_Teaching, translating, coding or designing? Invoice all your clients through the Foundation — no sole tradership, no ZUS, one fee of 400 PLN/month.',
    },
    'wspolpraca-b2b': {
      badge: 'TODO_For companies and teams',
      title: 'TODO_SETTLE WITH YOUR SUBCONTRACTOR ON INVOICE, EVEN IF THEY DON\'T HAVE A COMPANY.',
      subtitle: 'TODO_Your collaborator doesn\'t want to register a business? The Foundation issues you a VAT invoice for their work, they receive pay after a 6% deduction. Legally, no employment contract, no ZUS on your side.',
    },
    ogolny: { badge: '', title: '', subtitle: '' },
  },
  uk: {
    'kontrakt-b2b': {
      badge: 'TODO_Для тих, хто отримав пропозицію на B2B',
      title: 'TODO_КОНТРАКТ B2B БЕЗ ВІДКРИТТЯ ФІРМИ. БЕЗ ZUS, З ПОДАТКОМ 6%.',
      subtitle: 'TODO_Маєш пропозицію або підписаний контракт B2B і не хочеш відкривати ФОП? Виставляй рахунки контрагенту під нашою юридичною особою — старт за 15 хвилин, один абонемент 400 zł/міс.',
    },
    'faktura-bez-firmy': {
      badge: 'TODO_>8 000 фрилансерів вже виставили рахунки через FDK · 4.7/5 у Google',
      title: 'TODO_ВИСТАВЛЯЙ РАХУНКИ БЕЗ ВЛАСНОЇ ФІРМИ. БЕЗ ZUS, З ПОДАТКОМ 6%.',
      subtitle: 'TODO_Викладаєш, перекладаєш, програмуєш або проєктуєш? Виставляй рахунки всім своїм клієнтам через Фундацію — без ФОП, без ZUS, з одним абонементом 400 zł/міс.',
    },
    'wspolpraca-b2b': {
      badge: 'TODO_Для компаній і команд',
      title: 'TODO_РОЗРАХОВУЙ ПІДРЯДНИКА ЗА РАХУНКОМ, НАВІТЬ ЯКЩО У НЬОГО НЕМАЄ ФІРМИ.',
      subtitle: 'TODO_Твій співпрацівник не хоче відкривати ФОП? Фундація виставляє тобі фактуру VAT за його роботу, він отримує винагороду після відрахування 6% PIT.',
    },
    ogolny: { badge: '', title: '', subtitle: '' },
  },
  ru: {
    'kontrakt-b2b': {
      badge: 'TODO_Для тех, кто получил предложение на B2B',
      title: 'TODO_КОНТРАКТ B2B БЕЗ ОТКРЫТИЯ ФИРМЫ. БЕЗ ZUS, С НАЛОГОМ 6%.',
      subtitle: 'TODO_Есть предложение или подписанный контракт B2B и не хочешь открывать ИП? Выставляй счета заказчику под нашим юридическим лицом — старт за 15 минут, один абонемент 400 zł/мес.',
    },
    'faktura-bez-firmy': {
      badge: 'TODO_>8 000 фрилансеров уже выставили счета через FDK · 4.7/5 в Google',
      title: 'TODO_ВЫСТАВЛЯЙ СЧЕТА БЕЗ СОБСТВЕННОЙ ФИРМЫ. БЕЗ ZUS, С НАЛОГОМ 6%.',
      subtitle: 'TODO_Преподаёшь, переводишь, программируешь или проектируешь? Выставляй счета всем своим клиентам через Фонд — без ИП, без ZUS, с одним абонементом 400 zł/мес.',
    },
    'wspolpraca-b2b': {
      badge: 'TODO_Для компаний и команд',
      title: 'TODO_РАССЧИТЫВАЙСЯ С ПОДРЯДЧИКОМ ПО СЧЁТУ, ДАЖЕ ЕСЛИ У НЕГО НЕТ ФИРМЫ.',
      subtitle: 'TODO_Твой сотрудник не хочет открывать ИП? Фонд выставляет тебе фактуру VAT за его работу, он получает вознаграждение после вычета 6% PIT.',
    },
    ogolny: { badge: '', title: '', subtitle: '' },
  },
};

export function getSegmentHero(locale: string, segment: string): SegmentHero | null {
  const localeSegments = segments[locale] || segments.pl;
  const hero = localeSegments[segment as Segment];
  if (!hero || segment === 'ogolny' || !hero.title) return null;
  return hero;
}
