"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { DIETARY_TAGS } from "@/lib/dietary";
import type {
  MenuDownloadFormState,
  MenuFormState,
  MenuItemFormState,
} from "@/lib/menu";

// Uploaded images are stored as downscaled data URLs. Cap the stored string so
// a runaway payload can't bloat a row (the client downscales well below this).
const MAX_IMAGE_CHARS = 5_000_000;

// Downloadable menu files (PDF/image) are stored inline as base64 data URLs.
// Cap the base64 string at ~8 MB of characters (~6 MB file) — plenty for a menu.
const MAX_DOWNLOAD_CHARS = 8_000_000;
const ALLOWED_DOWNLOAD_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

/** Accept only a data: image URL or a local public path — never remote/script URLs. */
function normalizeImage(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("data:image/") && value.length <= MAX_IMAGE_CHARS) {
    return value;
  }
  if (value.startsWith("/")) return value;
  return null;
}

/** Refresh every locale's public menu page so edits appear without a redeploy. */
function revalidateMenu() {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/menu`);
  }
}

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Create or update a menu (admin-only). An empty `id` creates; a present `id`
 * updates that row. Items are managed separately via saveMenuItem.
 */
export async function saveMenu(
  _prev: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  if (!(await isAdmin())) return { status: "error" };

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const published = String(formData.get("published") ?? "true") !== "false";
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title) return { status: "error" };

  const data = { title, subtitle: subtitle || null, published, sortOrder };

  try {
    const saved = id
      ? await prisma.menu.update({ where: { id }, data })
      : await prisma.menu.create({ data });
    revalidateMenu();
    return { status: "saved", id: saved.id };
  } catch {
    return { status: "error" };
  }
}

/** Delete a menu and its items (cascade), admin-only. Invoked as a <form action>. */
export async function deleteMenu(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.menu.delete({ where: { id } });
    revalidateMenu();
  } catch {
    // Already gone / DB unreachable — nothing to surface for the demo.
  }
}

/**
 * Create or update a menu item (admin-only). Requires a `menuId` (the parent
 * menu) plus a name and price. Dietary tags are validated against the allowed
 * set so only known keys reach the DB.
 */
export async function saveMenuItem(
  _prev: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  if (!(await isAdmin())) return { status: "error" };

  const id = String(formData.get("id") ?? "").trim();
  const menuId = String(formData.get("menuId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image = normalizeImage(String(formData.get("image") ?? ""));
  const published = String(formData.get("published") ?? "true") !== "false";
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  const allowed = DIETARY_TAGS as readonly string[];
  const dietaryTags = formData
    .getAll("dietaryTags")
    .map(String)
    .filter((tag) => allowed.includes(tag));

  if (!menuId || !name || !price) return { status: "error" };

  const data = {
    menuId,
    name,
    description: description || null,
    price,
    category: category || null,
    dietaryTags,
    image,
    published,
    sortOrder,
  };

  try {
    const saved = id
      ? await prisma.menuItem.update({ where: { id }, data })
      : await prisma.menuItem.create({ data });
    revalidateMenu();
    return { status: "saved", id: saved.id };
  } catch {
    return { status: "error" };
  }
}

/** Delete a menu item (admin-only). Invoked as a <form action>. */
export async function deleteMenuItem(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.menuItem.delete({ where: { id } });
    revalidateMenu();
  } catch {
    // Already gone / DB unreachable — nothing to surface for the demo.
  }
}

/**
 * Validate an uploaded file data URL: it must be a base64 `data:` URL of an
 * allowed type (PDF or image) and within the size cap. Returns the MIME type on
 * success, or a reason string on failure.
 */
function validateDownload(
  raw: string,
): { mime: string } | { reason: "tooLarge" | "invalidFile" } {
  const value = raw.trim();
  const match = /^data:([^;,]+);base64,/.exec(value);
  if (!match) return { reason: "invalidFile" };
  const mime = match[1].toLowerCase();
  if (!(ALLOWED_DOWNLOAD_TYPES as readonly string[]).includes(mime)) {
    return { reason: "invalidFile" };
  }
  if (value.length > MAX_DOWNLOAD_CHARS) return { reason: "tooLarge" };
  return { mime };
}

/**
 * Create a downloadable menu file (admin-only). Requires a title plus a valid
 * uploaded file (base64 data URL). The MIME type is taken from the data URL
 * itself; the original filename is kept for the download attribute.
 */
export async function saveMenuDownload(
  _prev: MenuDownloadFormState,
  formData: FormData,
): Promise<MenuDownloadFormState> {
  if (!(await isAdmin())) return { status: "error" };

  const title = String(formData.get("title") ?? "").trim();
  const fileName = String(formData.get("fileName") ?? "").trim() || "menu";
  const file = String(formData.get("file") ?? "");
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title) return { status: "error" };

  const result = validateDownload(file);
  if ("reason" in result) return { status: "error", reason: result.reason };

  try {
    const saved = await prisma.menuDownload.create({
      data: { title, fileName, fileType: result.mime, file, sortOrder },
    });
    revalidateMenu();
    return { status: "saved", id: saved.id };
  } catch {
    return { status: "error" };
  }
}

/** Delete a downloadable menu file (admin-only). Invoked as a <form action>. */
export async function deleteMenuDownload(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.menuDownload.delete({ where: { id } });
    revalidateMenu();
  } catch {
    // Already gone / DB unreachable — nothing to surface for the demo.
  }
}
