// Pure, dependency-free access + routing decisions used by proxy.ts.
// Kept separate from proxy.ts (which imports next-auth/next-intl and can't run
// in a plain unit test) so the logic is fully unit-testable.

/** Split a pathname into its locale prefix (if any) and the remaining path. */
export function splitLocale(
  pathname: string,
  locales: readonly string[],
  defaultLocale: string,
): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split("/");
  const hasLocalePrefix = locales.includes(segments[1]);
  const locale = hasLocalePrefix ? segments[1] : defaultLocale;
  const pathWithoutLocale = hasLocalePrefix
    ? `/${segments.slice(2).join("/")}`
    : pathname;
  return { locale, pathWithoutLocale };
}

/** True for the admin root and anything nested beneath it (locale stripped). */
export function isAdminPath(pathWithoutLocale: string): boolean {
  return (
    pathWithoutLocale === "/admin" || pathWithoutLocale.startsWith("/admin/")
  );
}

export type AdminAccess = "allow" | "redirect-login" | "redirect-home";

/** Decide what to do with a request to (or past) the admin area. */
export function adminAccess(opts: {
  isAdminPath: boolean;
  isLoggedIn: boolean;
  role: string | undefined;
}): AdminAccess {
  if (!opts.isAdminPath) return "allow";
  if (!opts.isLoggedIn) return "redirect-login";
  if (opts.role !== "admin") return "redirect-home";
  return "allow";
}
