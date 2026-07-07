"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { SETTING_KEYS, type MenuMode } from "@/lib/settings";

export type SettingsFormState = { status: "saved" | "error" } | undefined;

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

/**
 * Save the site feature flags (admin-only). Re-checks the admin role (defense in
 * depth) and revalidates every public page whose visibility depends on a flag,
 * so changes appear without a redeploy.
 */
export async function saveSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  if (!(await isAdmin())) return { status: "error" };

  // Unchecked checkboxes are absent from the form data.
  const newsletterEnabled = formData.get("newsletterEnabled") != null;
  const menuMode: MenuMode =
    String(formData.get("menuMode") ?? "") === "live" ? "live" : "download";

  try {
    await upsertSetting(
      SETTING_KEYS.newsletterEnabled,
      newsletterEnabled ? "true" : "false",
    );
    await upsertSetting(SETTING_KEYS.menuMode, menuMode);

    // Refresh the public pages that read these flags, in every locale.
    for (const locale of routing.locales) {
      revalidatePath(`/${locale}/menu`);
      revalidatePath(`/${locale}/contact`);
      revalidatePath(`/${locale}/reserve`);
    }
    return { status: "saved" };
  } catch {
    return { status: "error" };
  }
}
