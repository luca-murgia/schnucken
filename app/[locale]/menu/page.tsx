import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPublishedMenus, type MenuItemData } from "@/lib/menu";
import { AdminEditButton } from "@/components/site/admin-edit-button";
import { PagePlaceholder } from "@/components/site/page-placeholder";
import Image from "next/image";

// Rendered dynamically (not ISR-cached): the page contains the admin-only
// AdminEditButton, which depends on the per-request session — caching it would
// leak the edit affordance to the public. Admin edits still show immediately.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.menu" });
  return { title: t("title") };
}

// Group items into ordered category buckets, preserving the sortOrder from the
// DB. Items with no category fall into a leading, heading-less group.
function groupByCategory(items: MenuItemData[]) {
  const groups: { category: string | null; items: MenuItemData[] }[] = [];
  const byKey = new Map<string, (typeof groups)[number]>();
  for (const item of items) {
    const key = item.category ?? "";
    let group = byKey.get(key);
    if (!group) {
      group = { category: item.category ?? null, items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const menus = await getPublishedMenus();

  // Before Neon is wired (or when no menu has been created yet), fall back to
  // the placeholder so the page is never blank in the demo.
  if (menus.length === 0) {
    return (
      <>
        <PagePlaceholder
          title={t("sections.menu.title")}
          intro={t("sections.menu.intro")}
          comingSoon={t("common.comingSoon")}
          back={t("common.backHome")}
        />
        <AdminEditButton href="/admin/menu" label={t("menu.admin.editOnSite")} />
      </>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("menu.eyebrow")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.menu.title")}
      </h1>

      <div className="mt-12 space-y-16">
        {menus.map((menu) => (
          <div key={menu.id}>
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-semibold text-espresso md:text-3xl">
                {menu.title}
              </h2>
              {menu.subtitle && (
                <p className="mt-1.5 text-muted-foreground">{menu.subtitle}</p>
              )}
            </div>

            {menu.items.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                {t("menu.emptyItems")}
              </p>
            ) : (
              <div className="mt-6 space-y-10">
                {groupByCategory(menu.items).map((group, gi) => (
                  <div key={gi}>
                    {group.category && (
                      <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-clay uppercase">
                        {group.category}
                      </h3>
                    )}
                    <ul className="space-y-6">
                      {group.items.map((item) => (
                        <li key={item.id} className="flex gap-4">
                          {item.image && (
                            <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-md bg-oat">
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="4rem"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-4">
                              <h4 className="font-medium text-ink">
                                {item.name}
                              </h4>
                              <span className="shrink-0 tabular-nums text-espresso">
                                {item.price}
                              </span>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-sm text-ink/70">
                                {item.description}
                              </p>
                            )}
                            {item.dietaryTags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.dietaryTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-sage/15 px-2 py-0.5 text-xs font-medium text-forest"
                                  >
                                    {t(`menu.dietary.${tag}`)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <AdminEditButton href="/admin/menu" label={t("menu.admin.editOnSite")} />
    </section>
  );
}
