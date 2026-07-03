"use client";

import type { ReactNode } from "react";
import {
  ConsentBanner,
  ConsentDialog,
  ConsentManagerProvider,
} from "@c15t/nextjs";

import { consentTheme } from "./consent-theme";

/**
 * GDPR/TTDSG cookie consent (c15t) in OFFLINE mode: consent is stored in the
 * browser (localStorage + cookie) with no backend/account — ideal for the demo
 * and Vercel. Built-in DE/EN/IT copy follows the next-intl locale. Banner +
 * settings dialog are client-only, so this wrapper is a client component while
 * `app/[locale]/layout.tsx` stays a server component.
 */
export function ConsentProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "offline",
        consentCategories: [
          "necessary",
          "functionality",
          "measurement",
          "marketing",
        ],
        // Offline mode can't geo-detect: pin the GDPR jurisdiction. The banner
        // language also auto-detects from the visitor's browser; `language` is a
        // hint toward the current page locale.
        overrides: { country: "DE", language: locale },
        theme: consentTheme,
      }}
    >
      <ConsentBanner />
      <ConsentDialog />
      {children}
    </ConsentManagerProvider>
  );
}
