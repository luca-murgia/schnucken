"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ImageIcon, Pencil, Trash2 } from "lucide-react";

import { deleteEvent, saveEvent } from "@/lib/event-actions";
import type { EventCard } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  published: true,
  sortOrder: "0",
};

type FormFields = typeof EMPTY_FORM;

/**
 * Downscale an image file to a JPEG data URL entirely in the browser, so no
 * blob storage is needed — the string is saved straight into the DB. Capped at
 * 1600px on the long edge (typically well under 400 KB).
 */
async function fileToDataUrl(file: File): Promise<string> {
  const MAX_EDGE = 1600;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return canvas.toDataURL("image/jpeg", 0.85);
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="size-4" />
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function EventManager({ events }: { events: EventCard[] }) {
  const t = useTranslations("events.admin");
  const [state, formAction, pending] = useActionState(saveEvent, undefined);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<FormFields>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEdit(event: EventCard) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      subtitle: event.subtitle ?? "",
      description: event.description,
      image: event.image ?? "",
      published: event.published,
      sortOrder: String(event.sortOrder),
    });
    setImageError(false);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(false);
    setImageBusy(true);
    try {
      update({ image: await fileToDataUrl(file) });
    } catch {
      setImageError(true);
    } finally {
      setImageBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Create / edit form */}
      <div ref={formTopRef} className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-espresso">
          {editingId ? t("editEvent") : t("newEvent")}
        </h3>

        <form action={formAction} className="mt-5 space-y-5">
          <input type="hidden" name="id" value={editingId ?? ""} />
          <input type="hidden" name="image" value={form.image} />
          <input
            type="hidden"
            name="published"
            value={form.published ? "true" : "false"}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">{t("titleLabel")}</Label>
              <Input
                id="title"
                name="title"
                required
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder={t("titlePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">{t("subtitleLabel")}</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                placeholder={t("subtitlePlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={7}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          {/* Image upload + preview */}
          <div className="space-y-2">
            <Label>{t("imageLabel")}</Label>
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-md border border-border bg-oat">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="8rem"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-clay/40">
                    <ImageIcon className="size-8" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={imageBusy}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.image ? t("changeImage") : t("chooseImage")}
                  </Button>
                  {form.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        update({ image: "" });
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      {t("removeImage")}
                    </Button>
                  )}
                </div>
                <p className="max-w-xs text-xs text-muted-foreground">
                  {t("imageHint")}
                </p>
                {imageError && (
                  <p className="text-xs text-destructive">{t("error")}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update({ published: e.target.checked })}
                className="size-4 rounded border-input accent-primary"
              />
              {t("publishedLabel")}
            </label>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">{t("orderLabel")}</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                inputMode="numeric"
                value={form.sortOrder}
                onChange={(e) => update({ sortOrder: e.target.value })}
                className="w-24"
              />
              <p className="text-xs text-muted-foreground">{t("orderHint")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button type="submit" disabled={pending || imageBusy}>
              {pending ? t("saving") : t("save")}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
            )}
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
      </div>

      {/* Existing events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-espresso">{t("listHeading")}</h3>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("emptyList")}</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
              >
                <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-md bg-oat">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="3.5rem"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-clay/40">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{event.title}</p>
                    {!event.published && (
                      <span className="shrink-0 rounded-full bg-oat px-2 py-0.5 text-xs text-taupe">
                        {t("draft")}
                      </span>
                    )}
                  </div>
                  {event.subtitle && (
                    <p className="truncate text-sm text-muted-foreground">
                      {event.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(event)}
                  >
                    <Pencil className="size-4" />
                    {t("edit")}
                  </Button>
                  <form
                    action={deleteEvent}
                    onSubmit={(e) => {
                      if (!window.confirm(t("deleteConfirm"))) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="id" value={event.id} />
                    <SubmitButton label={t("delete")} pendingLabel={t("deleting")} />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
