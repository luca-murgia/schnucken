"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, ImageIcon, Pencil, Trash2 } from "lucide-react";

import {
  deleteMenu,
  deleteMenuItem,
  saveMenu,
  saveMenuItem,
} from "@/lib/menu-actions";
import type { MenuData, MenuItemData } from "@/lib/menu";
import { DIETARY_TAGS } from "@/lib/dietary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Downscale an image file to a JPEG data URL in the browser, so no blob storage
 * is needed — the string is saved straight into the DB. Capped at 1600px on the
 * long edge (typically well under 400 KB). Mirrors the event manager.
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

function DeleteButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
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

const EMPTY_MENU = {
  title: "",
  subtitle: "",
  published: true,
  sortOrder: "0",
};

type MenuFields = typeof EMPTY_MENU;

export function MenuManager({ menus }: { menus: MenuData[] }) {
  const t = useTranslations("menu.admin");
  const [state, formAction, pending] = useActionState(saveMenu, undefined);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuFields>(EMPTY_MENU);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<MenuFields>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_MENU);
  }

  function startEdit(menu: MenuData) {
    setEditingId(menu.id);
    setForm({
      title: menu.title,
      subtitle: menu.subtitle ?? "",
      published: menu.published,
      sortOrder: String(menu.sortOrder),
    });
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-10">
      {/* Create / edit menu */}
      <div
        ref={formTopRef}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="text-lg font-semibold text-espresso">
          {editingId ? t("editMenu") : t("newMenu")}
        </h3>

        <form action={formAction} className="mt-5 space-y-5">
          <input type="hidden" name="id" value={editingId ?? ""} />
          <input
            type="hidden"
            name="published"
            value={form.published ? "true" : "false"}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="menu-title">{t("menuTitleLabel")}</Label>
              <Input
                id="menu-title"
                name="title"
                required
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder={t("menuTitlePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menu-subtitle">{t("menuSubtitleLabel")}</Label>
              <Input
                id="menu-subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                placeholder={t("menuSubtitlePlaceholder")}
              />
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
              <Label htmlFor="menu-order">{t("orderLabel")}</Label>
              <Input
                id="menu-order"
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
            <Button type="submit" disabled={pending}>
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

      {/* Existing menus */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-espresso">
          {t("menusHeading")}
        </h3>
        {menus.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("emptyMenus")}</p>
        ) : (
          <ul className="space-y-3">
            {menus.map((menu) => {
              const open = openMenuId === menu.id;
              return (
                <li
                  key={menu.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="flex items-center gap-4 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-ink">
                          {menu.title}
                        </p>
                        {!menu.published && (
                          <span className="shrink-0 rounded-full bg-oat px-2 py-0.5 text-xs text-taupe">
                            {t("draft")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("itemCount", { count: menu.items.length })}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuId(open ? null : menu.id)}
                      >
                        {t("manageItems")}
                        <ChevronDown
                          className={`size-4 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(menu)}
                      >
                        <Pencil className="size-4" />
                        {t("edit")}
                      </Button>
                      <form
                        action={deleteMenu}
                        onSubmit={(e) => {
                          if (!window.confirm(t("deleteMenuConfirm")))
                            e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="id" value={menu.id} />
                        <DeleteButton
                          label={t("delete")}
                          pendingLabel={t("deleting")}
                        />
                      </form>
                    </div>
                  </div>

                  {open && (
                    <div className="border-t border-border bg-oat/30 p-4">
                      <MenuItemsEditor menu={menu} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

const EMPTY_ITEM = {
  name: "",
  price: "",
  description: "",
  category: "",
  dietaryTags: [] as string[],
  image: "",
  published: true,
  sortOrder: "0",
};

type ItemFields = typeof EMPTY_ITEM;

function MenuItemsEditor({ menu }: { menu: MenuData }) {
  const t = useTranslations("menu.admin");
  const tDiet = useTranslations("menu.dietary");
  const [state, formAction, pending] = useActionState(saveMenuItem, undefined);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ItemFields>(EMPTY_ITEM);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handledSave = useRef<string | null>(null);

  const update = (patch: Partial<ItemFields>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_ITEM);
    setImageError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEdit(item: MenuItemData) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      description: item.description ?? "",
      category: item.category ?? "",
      dietaryTags: [...item.dietaryTags],
      image: item.image ?? "",
      published: item.published,
      sortOrder: String(item.sortOrder),
    });
    setImageError(false);
  }

  function toggleTag(tag: string, checked: boolean) {
    update({
      dietaryTags: checked
        ? [...form.dietaryTags, tag]
        : form.dietaryTags.filter((x) => x !== tag),
    });
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

  // After creating a new item, clear the form so the owner can add the next one
  // without editing over the previous values. Edits keep their values (+ a
  // "Saved" confirmation).
  useEffect(() => {
    if (state?.status === "saved" && handledSave.current !== state.id) {
      handledSave.current = state.id;
      if (!editingId) resetForm();
    }
  }, [state, editingId]);

  return (
    <div className="space-y-6">
      {/* Existing items */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold tracking-wide text-espresso uppercase">
          {t("itemsHeading")}
        </h4>
        {menu.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("emptyItems")}</p>
        ) : (
          <ul className="space-y-2">
            {menu.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
              >
                <div className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-md bg-oat">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="2.5rem"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-clay/40">
                      <ImageIcon className="size-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{item.name}</p>
                    {!item.published && (
                      <span className="shrink-0 rounded-full bg-oat px-2 py-0.5 text-xs text-taupe">
                        {t("draft")}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {[item.category, item.price].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil className="size-4" />
                    {t("edit")}
                  </Button>
                  <form
                    action={deleteMenuItem}
                    onSubmit={(e) => {
                      if (!window.confirm(t("deleteItemConfirm")))
                        e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton
                      label={t("delete")}
                      pendingLabel={t("deleting")}
                    />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create / edit item */}
      <form
        action={formAction}
        className="space-y-5 rounded-lg border border-border bg-card p-4"
      >
        <input type="hidden" name="id" value={editingId ?? ""} />
        <input type="hidden" name="menuId" value={menu.id} />
        <input type="hidden" name="image" value={form.image} />
        <input
          type="hidden"
          name="published"
          value={form.published ? "true" : "false"}
        />

        <h5 className="font-medium text-espresso">
          {editingId ? t("editItem") : t("newItem")}
        </h5>

        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor={`item-name-${menu.id}`}>{t("nameLabel")}</Label>
            <Input
              id={`item-name-${menu.id}`}
              name="name"
              required
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`item-price-${menu.id}`}>{t("priceLabel")}</Label>
            <Input
              id={`item-price-${menu.id}`}
              name="price"
              required
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
              placeholder={t("pricePlaceholder")}
              className="sm:w-32"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`item-desc-${menu.id}`}>{t("descriptionLabel")}</Label>
          <Textarea
            id={`item-desc-${menu.id}`}
            name="description"
            rows={2}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`item-cat-${menu.id}`}>{t("categoryLabel")}</Label>
            <Input
              id={`item-cat-${menu.id}`}
              name="category"
              value={form.category}
              onChange={(e) => update({ category: e.target.value })}
              placeholder={t("categoryPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("categoryHint")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`item-order-${menu.id}`}>{t("orderLabel")}</Label>
            <Input
              id={`item-order-${menu.id}`}
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

        {/* Dietary tags */}
        <div className="space-y-2">
          <Label>{t("dietaryLabel")}</Label>
          <div className="flex flex-wrap gap-4">
            {DIETARY_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  name="dietaryTags"
                  value={tag}
                  checked={form.dietaryTags.includes(tag)}
                  onChange={(e) => toggleTag(tag, e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                {tDiet(tag)}
              </label>
            ))}
          </div>
        </div>

        {/* Image upload + preview */}
        <div className="space-y-2">
          <Label>{t("imageLabel")}</Label>
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-md border border-border bg-oat">
              {form.image ? (
                <Image
                  src={form.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="6rem"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-clay/40">
                  <ImageIcon className="size-7" />
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

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update({ published: e.target.checked })}
              className="size-4 rounded border-input accent-primary"
            />
            {t("publishedLabel")}
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={pending || imageBusy}>
            {pending ? t("saving") : editingId ? t("save") : t("addItem")}
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
  );
}
