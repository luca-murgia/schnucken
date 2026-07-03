"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { saveContent } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LOCALE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "English",
  it: "Italiano",
};

export function ContentEditor({
  contentKey,
  locales,
  initial,
}: {
  contentKey: string;
  locales: readonly string[];
  initial: Record<string, string>;
}) {
  const t = useTranslations("admin.content");
  const [state, action, pending] = useActionState(saveContent, undefined);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="key" value={contentKey} />

      {locales.map((locale) => (
        <div key={locale} className="space-y-2">
          <Label htmlFor={`value-${locale}`}>
            {LOCALE_LABELS[locale] ?? locale}
          </Label>
          <textarea
            id={`value-${locale}`}
            name={`value.${locale}`}
            defaultValue={initial[locale] ?? ""}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state === "saved" && (
          <span className="text-sm text-espresso">{t("saved")}</span>
        )}
        {state === "error" && (
          <span className="text-sm text-destructive">{t("error")}</span>
        )}
      </div>
    </form>
  );
}
