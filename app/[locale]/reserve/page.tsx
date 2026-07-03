import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReservationForm } from "@/components/site/reservation-form";

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
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("nav.reserveTable")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.reserveTable.title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        {t("reservation.intro")}
      </p>
      <ReservationForm />
    </section>
  );
}
