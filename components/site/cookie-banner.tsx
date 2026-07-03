"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

/**
 * Lightweight opt-in cookie banner (placeholder for the full c15t integration).
 * Stores the choice in localStorage + the Zustand UI store. No non-essential
 * scripts are loaded anywhere yet, so "reject" is the honest default state.
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const consent = useUIStore((s) => s.consent);
  const setConsent = useUIStore((s) => s.setConsent);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") setConsent(stored);
  }, [setConsent]);

  if (consent !== "unknown") return null;

  const choose = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-muted-foreground">{t("message")}</p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose("rejected")}>
            {t("reject")}
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
