"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import type { EventFormState } from "@/lib/events";

// Uploaded images are stored as downscaled data URLs. Cap the stored string so
// a runaway payload can't bloat a row (the client downscales well below this).
const MAX_IMAGE_CHARS = 5_000_000;

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

/** Refresh every locale's public events page so edits appear without a redeploy. */
function revalidateEvents() {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/events`);
  }
}

/**
 * Create or update an event card (admin-only). An empty `id` creates; a present
 * `id` updates that row. Re-checks the admin role as defense in depth.
 */
export async function saveEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const session = await auth();
  if (session?.user?.role !== "admin") return { status: "error" };

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = normalizeImage(String(formData.get("image") ?? ""));
  const published = String(formData.get("published") ?? "true") !== "false";

  const parsedOrder = Number.parseInt(String(formData.get("sortOrder") ?? ""), 10);
  const sortOrder = Number.isFinite(parsedOrder) ? parsedOrder : 0;

  if (!title || !description) return { status: "error" };

  const data = {
    title,
    subtitle: subtitle || null,
    description,
    image,
    published,
    sortOrder,
  };

  try {
    const saved = id
      ? await prisma.event.update({ where: { id }, data })
      : await prisma.event.create({ data });
    revalidateEvents();
    return { status: "saved", id: saved.id };
  } catch {
    return { status: "error" };
  }
}

/** Delete an event card (admin-only). Invoked as a <form action>. */
export async function deleteEvent(formData: FormData): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "admin") return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.event.delete({ where: { id } });
    revalidateEvents();
  } catch {
    // Already gone / DB unreachable — nothing to surface for the demo.
  }
}
