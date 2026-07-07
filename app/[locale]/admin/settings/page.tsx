import { getTranslations, setRequestLocale } from "next-intl/server";

import { getSettings } from "@/lib/settings";
import { SettingsEditor } from "@/components/admin/settings-editor";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.settings");
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-espresso">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <SettingsEditor initial={settings} />
    </div>
  );
}
