import { getTranslations, setRequestLocale } from "next-intl/server";

import { PagePlaceholder } from "@/components/site/page-placeholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.reviews" });
  return { title: t("title") };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <PagePlaceholder
      title={t("sections.reviews.title")}
      intro={t("sections.reviews.intro")}
      comingSoon={t("common.comingSoon")}
      back={t("common.backHome")}
    />
  );
}
