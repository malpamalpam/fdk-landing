export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, string | number | boolean | undefined>, opts?: { event_id?: string }) => void;
      page: () => void;
    };
  }
}
