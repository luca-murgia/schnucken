import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAllMenus } from "@/lib/menu";
import { MenuManager } from "@/components/admin/menu-manager";

export default async function AdminMenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("menu.admin");
  const menus = await getAllMenus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-espresso">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <MenuManager menus={menus} />
    </div>
  );
}
