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
  // PONIŻSZE NADAL NIEZNANE — placeholdery do uzupełnienia przez Fundację:
  onboardingTime: '[FDK: termin]',
  monthlyFee: '[FDK: koszt]',
  idleMonthCost: '[FDK: koszt w miesiącu bez zleceń]',
  noticePeriod: '[FDK: okres wypowiedzenia]',
  zusStatus: '[FDK: składki ZUS w inkubatorze]',
} as const;
