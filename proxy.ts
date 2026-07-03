import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";
import { adminAccess, isAdminPath, splitLocale } from "@/lib/access";

// Edge-safe NextAuth instance: authConfig has NO adapter / Prisma / bcrypt, so
// this only validates + decodes the signed JWT cookie and populates `req.auth`.
const { auth } = NextAuth(authConfig);

// next-intl handles locale negotiation, the /de|/en|/it prefix, and rewrites.
const handleI18nRouting = createIntlMiddleware(routing);

/**
 * Next.js 16 renamed `middleware` -> `proxy`. Only ONE proxy is allowed, so auth
 * and i18n are composed here. The routing/role DECISIONS live in pure functions
 * in `lib/access.ts` (unit-tested); this file just wires them to Next APIs.
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const { locale, pathWithoutLocale } = splitLocale(
    nextUrl.pathname,
    routing.locales,
    routing.defaultLocale,
  );

  const access = adminAccess({
    isAdminPath: isAdminPath(pathWithoutLocale),
    isLoggedIn: !!req.auth?.user,
    role: req.auth?.user?.role,
  });

  if (access === "redirect-login") {
    const signInUrl = new URL(`/${locale}/login`, nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  if (access === "redirect-home") {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  return handleI18nRouting(req);
});

export const config = {
  // Skip API routes (incl. /api/auth/*), Next internals, and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
