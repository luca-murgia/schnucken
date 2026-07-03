import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

// Edge-safe NextAuth instance: authConfig has NO adapter / Prisma / bcrypt, so
// this only validates + decodes the signed JWT cookie and populates `req.auth`.
const { auth } = NextAuth(authConfig);

// next-intl handles locale negotiation, the /de|/en|/it prefix, and rewrites.
const handleI18nRouting = createIntlMiddleware(routing);

const locales = routing.locales as readonly string[];

/**
 * Next.js 16 renamed `middleware` -> `proxy`. Only ONE proxy is allowed, so auth
 * and i18n are composed here. Do auth/role redirects FIRST, then hand off to
 * next-intl for locale routing.
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  // Strip a possible locale prefix (/de, /en, /it) to test the real path.
  const segments = nextUrl.pathname.split("/");
  const hasLocalePrefix = locales.includes(segments[1]);
  const locale = hasLocalePrefix ? segments[1] : routing.defaultLocale;
  const pathWithoutLocale = hasLocalePrefix
    ? `/${segments.slice(2).join("/")}`
    : nextUrl.pathname;

  const isAdminRoute =
    pathWithoutLocale === "/admin" || pathWithoutLocale.startsWith("/admin/");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const signInUrl = new URL(`/${locale}/login`, nextUrl);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
    }
  }

  return handleI18nRouting(req);
});

export const config = {
  // Skip API routes (incl. /api/auth/*), Next internals, and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
