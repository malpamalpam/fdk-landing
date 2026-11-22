import { NextRequest, NextResponse } from "next/server";
import { getSiteByHost } from "@/config/sites";

const SUPPORTED_LOCALES = ["pl", "en", "uk", "ru"] as const;
const DEFAULT_LOCALE = "pl";
const COOKIE_NAME = "NEXT_LOCALE";

function cleanHost(raw: string): string {
  return raw
    .replace(/:\d+$/, "")       // strip port
    .replace(/^www\./, "")      // strip www.
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

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$/i.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths and static files — always
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // ── Multi-site: check host for custom domains ──
  const host = cleanHost(request.headers.get("host") || "");
  const siteId = getSiteByHost(host);

  if (siteId) {
    // Custom domain detected — only "/" and "/dziekujemy" are valid pages.
    // Everything else → redirect to "/"
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/site/${siteId}`;
      const response = NextResponse.rewrite(url);
      response.headers.set("x-site", siteId);
      return response;
    }

    if (pathname === "/dziekujemy") {
      const url = request.nextUrl.clone();
      url.pathname = `/site/${siteId}/dziekujemy`;
      const response = NextResponse.rewrite(url);
      response.headers.set("x-site", siteId);
      return response;
    }

    // Any other path on custom domain → redirect to root
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
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
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // Root path — redirect to preferred locale
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

  // No locale prefix — redirect to /pl/[rest]
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Explicitly include "/" (root) and all paths except
     * api, _next, favicon.ico, and static files with extensions.
     */
    "/",
    "/((?!api|_next|favicon\\.ico|.*\\..+$).*)",
  ],
};
