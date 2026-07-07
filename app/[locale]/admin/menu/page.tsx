import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";

import { getAllMenus, getMenuDownloads } from "@/lib/menu";
import { getSettings } from "@/lib/settings";
import { Link } from "@/i18n/navigation";
import { MenuManager } from "@/components/admin/menu-manager";
import { MenuDownloadsManager } from "@/components/admin/menu-downloads-manager";

export default async function AdminMenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("menu.admin");
  const [menus, downloads, settings] = await Promise.all([
    getAllMenus(),
    getMenuDownloads(),
    getSettings(),
  ]);

  const modeName =
    settings.menuMode === "live" ? t("modeLive") : t("modeDownload");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl text-espresso">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Which mode visitors currently see — changed on the Settings page. */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border bg-oat/40 px-4 py-3 text-sm text-ink">
        <Info className="size-4 shrink-0 text-clay" />
        <span>{t("modeBanner", { mode: modeName })}</span>
        <Link
          href="/admin/settings"
          className="font-medium text-espresso underline underline-offset-4 hover:text-clay"
        >
          {t("changeInSettings")}
        </Link>
      </div>

      {/* Live menu builder */}
      <MenuManager menus={menus} />

      {/* Downloadable files (shown to visitors in "download" mode) */}
      <div className="border-t border-border pt-8">
        <MenuDownloadsManager downloads={downloads} />
      </div>
    </div>
  );
}
