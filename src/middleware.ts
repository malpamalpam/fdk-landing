import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["pl", "en", "uk", "ru"] as const;
const DEFAULT_LOCALE = "pl";
const COOKIE_NAME = "NEXT_LOCALE";

function getPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of preferred) {
      if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) {
        return lang;
      }
    }
  }

  return DEFAULT_LOCALE;
}

const SITE_HOSTS = new Set([
  "inkubatory.com.pl", "www.inkubatory.com.pl",
  "businessincubator.pl", "www.businessincubator.pl",
  "biznesinkubator.pl", "www.biznesinkubator.pl",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") || "").replace(/:\d+$/, "").toLowerCase();

  // New site domains — skip locale logic entirely, let next.config rewrites handle it
  if (SITE_HOSTS.has(host)) {
    return NextResponse.next();
  }

  // /site/* paths — pass through
  if (pathname.startsWith("/site/")) {
    return NextResponse.next();
  }

  // Locale prefix present — set cookie, continue
  const pathLocale = pathname.split("/")[1];
  if ((SUPPORTED_LOCALES as readonly string[]).includes(pathLocale)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  // Landing pages — pass through
  if (pathname.startsWith("/lp/") || pathname.startsWith("/lp-")) {
    return NextResponse.next();
  }

  // No locale prefix and not root — add /pl
  if (pathname !== "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url));
  }

  // Root "/" without locale — redirect to preferred locale
  // (This only fires if next.config redirects didn't catch it first)
  const locale = getPreferredLocale(request);
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*$).*)",
  ],
};
