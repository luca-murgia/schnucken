import { getTranslations, setRequestLocale } from "next-intl/server";

import { PagePlaceholder } from "@/components/site/page-placeholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.reserveTable" });
  return { title: t("title") };
}

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <PagePlaceholder
      title={t("sections.reserveTable.title")}
      intro={t("sections.reserveTable.intro")}
      comingSoon={t("common.comingSoon")}
      back={t("common.backHome")}
    />
  );
}
