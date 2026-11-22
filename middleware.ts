import { NextRequest, NextResponse } from "next/server";
import { getSiteByHost } from "@/config/sites";

const SUPPORTED_LOCALES = ["pl", "en", "uk", "ru"] as const;
const DEFAULT_LOCALE = "pl";
const COOKIE_NAME = "NEXT_LOCALE";

function cleanHost(raw: string): string {
  return raw
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .toLowerCase();
}

function getPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
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
      if (SUPPORTED_LOCALES.includes(lang as any)) {
        return lang;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Multi-site: check host FIRST, before any locale logic ──
  const host = cleanHost(request.headers.get("host") || "");
  const siteId = getSiteByHost(host);

  if (siteId) {
    if (pathname === "/") {
      const res = NextResponse.rewrite(new URL(`/site/${siteId}`, request.url));
      res.headers.set("x-site", siteId);
      return res;
    }

    if (pathname === "/dziekujemy") {
      const res = NextResponse.rewrite(new URL(`/site/${siteId}/dziekujemy`, request.url));
      res.headers.set("x-site", siteId);
      return res;
    }

    // Any other path on a custom domain → redirect to "/"
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── 2. Direct /site/* on vercel.app / localhost — pass through ──
  if (pathname.startsWith("/site/")) {
    const res = NextResponse.next();
    const seg = pathname.split("/")[2];
    if (seg) res.headers.set("x-site", seg);
    return res;
  }

  // ── 3. Original FDK locale logic (unchanged) ──
  const segments = pathname.split("/");
  const pathLocale = segments[1];

  if (SUPPORTED_LOCALES.includes(pathLocale as any)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  if (pathname === "/") {
    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (pathname.startsWith("/lp/") || pathname.startsWith("/lp-")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*$).*)",
  ],
};
