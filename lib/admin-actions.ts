"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

/**
 * Save an editable content block for every locale. Re-checks the admin role
 * (defense in depth) and revalidates the affected public pages so edits appear
 * without a redeploy. Returns a status key for the form UI.
 */
export async function saveContent(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const session = await auth();
  if (session?.user?.role !== "admin") return "error";

  const key = String(formData.get("key") ?? "");
  if (!key) return "error";

  try {
    for (const locale of routing.locales) {
      const value = String(formData.get(`value.${locale}`) ?? "");
      await prisma.contentBlock.upsert({
        where: { key_locale: { key, locale } },
        update: { value },
        create: { key, locale, value },
      });
    }

    // "about.body" is shown on /[locale]/about — refresh each locale's page.
    if (key === "about.body") {
      for (const locale of routing.locales) {
        revalidatePath(`/${locale}/about`);
      }
    }
    return "saved";
  } catch {
    return "error";
  }
}
