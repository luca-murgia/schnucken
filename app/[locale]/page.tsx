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
      {/* Hero — rose band matching the illustration's ground */}
      <section className="bg-rose">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <span className="text-xs font-semibold tracking-[0.22em] text-espresso/70 uppercase">
            {t("home.eyebrow")}
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold text-ink md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/75">
            {t("home.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
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
          <div className="mt-12">
            <Image
              src="/schnucken-hero.jpg"
              alt={t("nav.brand")}
              width={1333}
              height={667}
              priority
              className="mx-auto w-full max-w-3xl"
            />
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
