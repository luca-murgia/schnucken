"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { saveSettings } from "@/lib/settings-actions";
import type { MenuMode, SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MENU_MODES: MenuMode[] = ["live", "download"];

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const t = useTranslations("admin.settings");
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [newsletterEnabled, setNewsletterEnabled] = useState(
    initial.newsletterEnabled,
  );
  const [menuMode, setMenuMode] = useState<MenuMode>(initial.menuMode);

  return (
    <form
      action={action}
      className="max-w-2xl space-y-8 rounded-xl border border-border bg-card p-6"
    >
      {/* Menu mode is set via the segmented control below. */}
      <input type="hidden" name="menuMode" value={menuMode} />

      {/* Newsletter visibility */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-espresso">
          {t("newsletterHeading")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("newsletterHint")}</p>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="newsletterEnabled"
            checked={newsletterEnabled}
            onChange={(e) => setNewsletterEnabled(e.target.checked)}
            className="size-4 rounded border-input accent-primary"
          />
          {t("newsletterLabel")}
        </label>
      </section>

      {/* Menu display mode */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-espresso">
          {t("menuModeHeading")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("menuModeHint")}</p>
        <div className="inline-flex rounded-lg border border-border p-1">
          {MENU_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMenuMode(mode)}
              aria-pressed={menuMode === mode}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                menuMode === mode
                  ? "bg-espresso text-cream"
                  : "text-ink hover:bg-oat",
              )}
            >
              {mode === "live" ? t("menuModeLive") : t("menuModeDownload")}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state?.status === "saved" && (
          <span className="flex items-center gap-1 text-sm text-espresso">
            <Check className="size-4" /> {t("saved")}
          </span>
        )}
        {state?.status === "error" && (
          <span className="text-sm text-destructive">{t("error")}</span>
        )}
      </div>
    </form>
  );
}
