import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en", "it"],
  defaultLocale: "de",
  // Prefix every locale (/de, /en, /it) for consistent, SEO-friendly URLs.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
