import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("datenschutzTitle") };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <h1 className="text-4xl font-semibold text-ink">
        {t("datenschutzTitle")}
      </h1>
      <p className="mt-6 text-muted-foreground">{t("placeholder")}</p>
    </section>
  );
}
