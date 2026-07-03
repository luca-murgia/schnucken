import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
import { getContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // "Get to Know Us" story — editable via the admin content editor, falls back
  // to the message catalog when the DB isn't wired.
  const aboutBody = await getContent(
    "about.body",
    locale,
    t("sections.about.body"),
  );
  const aboutParagraphs = aboutBody.split("\n").filter((p) => p.trim());

  return (
    <>
      {/* Hero — copy on the left, illustration on the right (rose band) */}
      <section className="bg-rose">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:gap-10 md:px-6 md:py-24">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold tracking-[0.22em] text-espresso/70 uppercase">
              {t("home.eyebrow")}
            </span>
            <h1 className="mt-4 text-4xl leading-[1.05] font-semibold text-ink md:text-5xl lg:text-6xl">
              {t("home.title")}
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/75 max-md:mx-auto">
              {t("home.subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild size="lg">
                <Link href="/menu">{t("home.ctaMenu")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-espresso/30 bg-transparent text-espresso hover:bg-espresso/5"
              >
                <Link href="/contact">{t("home.ctaContact")}</Link>
              </Button>
            </div>
          </div>

          <div className="md:order-last">
            <Image
              src="/schnucken-hero.svg"
              alt={t("nav.brand")}
              width={545}
              height={513}
              priority
              unoptimized
              className="mx-auto h-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Get to Know Us */}
      <section id="about" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-20">
          <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
            {t("nav.about")}
          </span>
          <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            {t("home.aboutHeading")}
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink/80">
            {aboutParagraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === aboutParagraphs.length - 1
                    ? "font-medium text-ink italic"
                    : undefined
                }
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Discover our house */}
      <section className="bg-oat">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-semibold text-ink">
            {t("home.sectionsTitle")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link key={s.key} href={s.href} className="group">
                <Card className="h-full transition-colors group-hover:border-espresso/30 group-hover:bg-blush/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-espresso">
                      {t(`nav.${s.key}`)}
                    </CardTitle>
                    <CardDescription>
                      {t(`sections.${s.key}.intro`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
