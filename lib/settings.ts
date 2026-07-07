import { prisma } from "@/lib/prisma";

// Site-wide feature flags. Types + reads live here (no "use server" — safe to
// import from server components); the write action is in lib/settings-actions.ts.

export type MenuMode = "live" | "download";

export type SiteSettings = {
  /** When false, the newsletter sign-up (contact page + reservation checkbox) is hidden. */
  newsletterEnabled: boolean;
  /** "live" shows the built menu; "download" shows uploaded files to download. */
  menuMode: MenuMode;
};

// DB keys for each flag.
export const SETTING_KEYS = {
  newsletterEnabled: "newsletter.enabled",
  menuMode: "menu.mode",
} as const;

// Conservative defaults for a fresh install (and whenever the DB is unreachable
// during a build before Neon is wired): the newsletter stays hidden until the
// owner enables it, and the menu starts in "download" mode (upload a PDF) until
// a live menu is built.
export const DEFAULT_SETTINGS: SiteSettings = {
  newsletterEnabled: false,
  menuMode: "download",
};

function parseMenuMode(raw: string | undefined): MenuMode {
  return raw === "live" ? "live" : "download";
}

/**
 * Read all site settings in a single query, falling back to DEFAULT_SETTINGS for
 * any unset key or when the database is unreachable. Never throws.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: { in: [SETTING_KEYS.newsletterEnabled, SETTING_KEYS.menuMode] },
      },
    });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      newsletterEnabled: map.get(SETTING_KEYS.newsletterEnabled) === "true",
      menuMode: parseMenuMode(map.get(SETTING_KEYS.menuMode)),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
