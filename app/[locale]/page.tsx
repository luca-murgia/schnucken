import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { sections } from "@/lib/nav";
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

  return (
    <>
      {/* Hero — the illustration is the banner; copy + CTAs overlaid on it */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden bg-rose md:min-h-[660px]">
        <Image
          src="/schnucken-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 text-center md:px-6">
          <span className="text-outline-sm text-xs font-semibold tracking-[0.24em] uppercase">
            {t("home.eyebrow")}
          </span>
          <h1 className="text-outline mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="text-outline-sm mx-auto mt-6 max-w-xl text-lg font-medium">
            {t("home.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/menu">{t("home.ctaMenu")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-espresso/40 bg-cream/85 text-espresso shadow-sm hover:bg-cream"
            >
              <Link href="/contact">{t("home.ctaContact")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section cards */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
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
      </section>
    </>
  );
}
