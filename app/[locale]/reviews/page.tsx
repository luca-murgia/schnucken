import { getTranslations, setRequestLocale } from "next-intl/server";

import { contact } from "@/lib/contact";
import { Button } from "@/components/ui/button";

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
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("reviews.eyebrow")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.reviews.title")}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
        {t("reviews.body")}
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <a href={contact.googleReviewUrl} target="_blank" rel="noreferrer">
            {t("reviews.cta")}
          </a>
        </Button>
      </div>
    </section>
  );
}
