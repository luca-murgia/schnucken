import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getContent } from "@/lib/content";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  // Editable in the admin content editor; falls back to the message catalog.
  const body = await getContent(
    "about.body",
    locale,
    t("sections.about.intro"),
  );
  const paragraphs = body.split("\n").filter((p) => p.trim());

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-28">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("nav.about")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("sections.about.title")}
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted-foreground">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/">{t("common.backHome")}</Link>
        </Button>
      </div>
    </section>
  );
}
