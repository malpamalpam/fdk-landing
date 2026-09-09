export const facts = {
  sinceYear: 2015,
  countries: '16+',
  languages: ['PL', 'EN', 'UA', 'RU'] as const,
  packageLimits: { salesDocs: 50, costDocs: 25, payoutsPerMonth: 3 },
  currencyAccounts: 2,
  payments: ['PLN', 'EUR', 'USD', '50+ walut', 'PayPal', 'USDT'] as const,
  legalSupportHours: 2,
  legalizationFilingDays: '1–2 dni',
  feeSource:
    'Opłata i podatki są pobierane z subkonta specjalisty; jeśli firma i specjalista tak ustalą, specjalista może doliczyć ją do faktury dla firmy.',

  // ── PONIŻSZE DO UZUPEŁNIENIA PRZEZ FUNDACJĘ ──
  // Gdy wartość = null, powiązane wiersze tabel / kroki / FAQ nie renderują się.
  // Po wpisaniu stringa automatycznie się pojawią.
  onboardingTime: null as string | null,       // TODO FDK: ile trwa formalności do pierwszej faktury
  monthlyFee: null as string | null,           // TODO FDK: opłata miesięczna
  idleMonthCost: null as string | null,        // TODO FDK: koszt w miesiącu bez zleceń
  noticePeriod: null as string | null,         // TODO FDK: okres wypowiedzenia
  zusStatus: null as string | null,            // TODO FDK: składki ZUS w inkubatorze
  comparisonInvoices: null as number | null,   // TODO FDK: liczba faktur do tabeli na landing2
} as const;
