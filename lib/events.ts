import { prisma } from "@/lib/prisma";

// Event cards shown on /[locale]/events. Types + reads live here (no
// "use server" — safe to import from server components); writes are in
// lib/event-actions.ts.

export type EventCard = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  published: boolean;
  sortOrder: number;
};

// Lower sortOrder first, then newest — the owner controls order per card.
const EVENT_ORDER = [{ sortOrder: "asc" }, { createdAt: "desc" }] as const;

const EVENT_FIELDS = {
  id: true,
  title: true,
  subtitle: true,
  description: true,
  image: true,
  published: true,
  sortOrder: true,
} as const;

/**
 * Published events for the public page. Returns an empty array when the DB is
 * unreachable (e.g. during a build before Neon is wired) — the page then falls
 * back to the built-in example event, mirroring lib/content.ts.
 */
export async function getPublishedEvents(): Promise<EventCard[]> {
  try {
    return await prisma.event.findMany({
      where: { published: true },
      orderBy: [...EVENT_ORDER],
      select: EVENT_FIELDS,
    });
  } catch {
    return [];
  }
}

/** Every event (published or draft) for the admin manager. Empty on DB error. */
export async function getAllEvents(): Promise<EventCard[]> {
  try {
    return await prisma.event.findMany({
      orderBy: [...EVENT_ORDER],
      select: EVENT_FIELDS,
    });
  } catch {
    return [];
  }
}

// State returned by the saveEvent server action, consumed via useActionState.
export type EventFormState =
  | { status: "saved"; id: string }
  | { status: "error" }
  | undefined;
