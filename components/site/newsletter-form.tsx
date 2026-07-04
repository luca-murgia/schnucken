"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Demo newsletter sign-up: validates the email client-side and shows a thank-you
// state. No persistence yet — newsletter delivery is out of scope for the demo.
export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "done">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="text-ink/80" role="status">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="space-y-2">
        <Label htmlFor="newsletter-email">{t("emailLabel")}</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "invalid") setStatus("idle");
            }}
            aria-invalid={status === "invalid"}
            className="sm:flex-1"
          />
          <Button type="submit">{t("submit")}</Button>
        </div>
      </div>
      {status === "invalid" && (
        <p className="text-sm text-destructive" role="alert">
          {t("invalid")}
        </p>
      )}
    </form>
  );
}
