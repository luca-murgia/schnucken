import { prisma } from "@/lib/prisma";

// Menus shown on /[locale]/menu. Types + reads live here (no "use server" — safe
// to import from server components); writes are in lib/menu-actions.ts.

export type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string | null;
  dietaryTags: string[];
  image: string | null;
  published: boolean;
  sortOrder: number;
};

export type MenuData = {
  id: string;
  title: string;
  subtitle: string | null;
  published: boolean;
  sortOrder: number;
  items: MenuItemData[];
};

// Lower sortOrder first, then newest menu / oldest item — the owner controls
// order per row, with a stable tiebreak.
const MENU_ORDER = [{ sortOrder: "asc" }, { createdAt: "desc" }] as const;
const ITEM_ORDER = [{ sortOrder: "asc" }, { createdAt: "asc" }] as const;

const ITEM_FIELDS = {
  id: true,
  name: true,
  description: true,
  price: true,
  category: true,
  dietaryTags: true,
  image: true,
  published: true,
  sortOrder: true,
} as const;

const MENU_FIELDS = {
  id: true,
  title: true,
  subtitle: true,
  published: true,
  sortOrder: true,
} as const;

/**
 * Published menus (with their published items) for the public page. Returns an
 * empty array when the DB is unreachable (e.g. during a build before Neon is
 * wired) — the page then falls back to the placeholder, mirroring lib/events.ts.
 */
export async function getPublishedMenus(): Promise<MenuData[]> {
  try {
    return await prisma.menu.findMany({
      where: { published: true },
      orderBy: [...MENU_ORDER],
      select: {
        ...MENU_FIELDS,
        items: {
          where: { published: true },
          orderBy: [...ITEM_ORDER],
          select: ITEM_FIELDS,
        },
      },
    });
  } catch {
    return [];
  }
}

/** Every menu (published or draft) with all items for the admin manager. */
export async function getAllMenus(): Promise<MenuData[]> {
  try {
    return await prisma.menu.findMany({
      orderBy: [...MENU_ORDER],
      select: {
        ...MENU_FIELDS,
        items: {
          orderBy: [...ITEM_ORDER],
          select: ITEM_FIELDS,
        },
      },
    });
  } catch {
    return [];
  }
}

// State returned by the save actions, consumed via useActionState.
export type MenuFormState =
  | { status: "saved"; id: string }
  | { status: "error" }
  | undefined;

export type MenuItemFormState = MenuFormState;
