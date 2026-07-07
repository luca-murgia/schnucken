"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { de, enGB, it } from "date-fns/locale";
import { CalendarIcon, Check } from "lucide-react";

import { createReservation } from "@/lib/reservation-actions";
import { CLOSED_WEEKDAYS, PARTY_SIZES, TIME_SLOTS } from "@/lib/reservation";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DF_LOCALES = { de, en: enGB, it } as const;

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ReservationForm({
  newsletterEnabled = false,
}: {
  newsletterEnabled?: boolean;
}) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dfLocale = DF_LOCALES[locale as keyof typeof DF_LOCALES] ?? enGB;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [state, formAction, pending] = useActionState(
    createReservation,
    undefined,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (state?.status === "success") {
    const s = state.summary;
    const dateLabel = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${s.date}T00:00:00`));

    return (
      <div className="mx-auto mt-8 max-w-lg rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="size-6 text-primary" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-ink">
          {t("thankYouTitle")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("thankYouBody")}</p>
        <dl className="mx-auto mt-6 max-w-xs space-y-1 text-left text-sm text-ink">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("nameLabel")}</dt>
            <dd className="font-medium">{s.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("dateLabel")}</dt>
            <dd className="font-medium">{dateLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("timeLabel")}</dt>
            <dd className="font-medium tabular-nums">{s.time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("guestsLabel")}</dt>
            <dd className="font-medium">
              {t("guestsOption", { count: Number(s.guests) })}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            {t("newReservation")}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{tCommon("backHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="date" value={date ? toISODate(date) : ""} />
      <input type="hidden" name="time" value={time} />
      <input type="hidden" name="guests" value={guests} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("nameLabel")}</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests">{t("guestsLabel")}</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger id="guests" className="w-full">
              <SelectValue placeholder={t("guestsPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {PARTY_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {t("guestsOption", { count: n })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("dateLabel")}</Label>
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4" />
                {date
                  ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
                      date,
                    )
                  : t("datePlaceholder")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setCalOpen(false);
                }}
                locale={dfLocale}
                weekStartsOn={1}
                disabled={[{ before: today }, { dayOfWeek: CLOSED_WEEKDAYS }]}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">{t("timeLabel")}</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger id="time" className="w-full">
              <SelectValue placeholder={t("timePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot} className="tabular-nums">
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneLabel")}</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      {/* Newsletter opt-in — hidden unless enabled in the backoffice settings. */}
      {newsletterEnabled && (
        <div className="flex items-center gap-3">
          <Checkbox id="newsletter" name="newsletter" defaultChecked />
          <Label htmlFor="newsletter" className="font-normal">
            {t("newsletterLabel")}
          </Label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">{t("notesLabel")}</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder={t("notesPlaceholder")}
        />
      </div>

      {state?.status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {t("error")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={pending || !date || !time || !guests}
        >
          {pending ? t("submitting") : t("submit")}
        </Button>
        <span className="text-sm text-muted-foreground">{t("closedNote")}</span>
      </div>
    </form>
  );
}
