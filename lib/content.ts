import { prisma } from "@/lib/prisma";

/**
 * Read an editable content block for (key, locale), falling back to `fallback`
 * when the value is unset OR the database is unreachable (e.g. during a build
 * before Neon is wired). This keeps public pages rendering with sensible
 * defaults from the message catalog until the admin sets real content.
 */
export async function getContent(
  key: string,
  locale: string,
  fallback: string,
): Promise<string> {
  try {
    const block = await prisma.contentBlock.findUnique({
      where: { key_locale: { key, locale } },
    });
    return block?.value.trim() ? block.value : fallback;
  } catch {
    return fallback;
  }
}

/** All locale values for a key (for the admin editor). Empty on DB error. */
export async function getContentByLocales(
  key: string,
): Promise<Record<string, string>> {
  try {
    const blocks = await prisma.contentBlock.findMany({ where: { key } });
    return Object.fromEntries(blocks.map((b) => [b.locale, b.value]));
  } catch {
    return {};
  }
}
