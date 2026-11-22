import { NextRequest, NextResponse } from "next/server";
import { getSiteByHost } from "@/config/sites";

const SUPPORTED_LOCALES = ["pl", "en", "uk", "ru"] as const;
const DEFAULT_LOCALE = "pl";
const COOKIE_NAME = "NEXT_LOCALE";

function getPreferredLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
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

  // 3. Default
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Multi-site: check host for new domains ──
  const host = request.headers.get("host") || "";
  const siteId = getSiteByHost(host);

  if (siteId) {
    // Production domain → rewrite to /site/[site]/...
    const rewritePath = pathname === "/" ? `/site/${siteId}` : `/site/${siteId}${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    const response = NextResponse.rewrite(url);
    response.headers.set("x-site", siteId);
    return response;
  }

  // ── Direct /site/* access on vercel.app/localhost — allow through ──
  if (pathname.startsWith("/site/")) {
    const response = NextResponse.next();
    const siteSeg = pathname.split("/")[2];
    if (siteSeg) response.headers.set("x-site", siteSeg);
    return response;
  }

  // ── Existing FDK logic below — unchanged ──

  // Check if the path starts with a supported locale
  const segments = pathname.split("/");
  const pathLocale = segments[1];

  if (SUPPORTED_LOCALES.includes(pathLocale as any)) {
    // Valid locale in path - set cookie and continue
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // Root path - redirect to preferred locale
  if (pathname === "/") {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Landing pages — pass through
  if (pathname.startsWith("/lp/") || pathname.startsWith("/lp-")) {
    return NextResponse.next();
  }

  // No locale prefix - redirect to /pl/[rest]
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/(pl|en|uk|ru)/:path*", "/((?!api|_next|favicon\\.ico|.*\\..+$).*)"],
};
