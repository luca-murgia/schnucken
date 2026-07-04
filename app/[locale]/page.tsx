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
      {/* Hero — copy on the left, illustration on the right (rose band) */}
      <section className="bg-rose">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2 md:gap-10 md:px-6 md:py-14">
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
                <Link href="/reserve">{t("home.ctaReserve")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-espresso/30 bg-transparent text-espresso hover:bg-espresso/5"
              >
                <Link href="/menu">{t("home.ctaMenu")}</Link>
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
              className="mx-auto h-auto w-full max-w-[420px]"
            />
            <Image
              src="/schnucken-hero-logo.svg"
              alt={t("nav.brand")}
              width={1079}
              height={648}
              unoptimized
              className="mx-auto mt-4 h-auto w-1/3 max-w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Discover our house */}
      <section className="bg-oat">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
          <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
            {t("home.sectionsEyebrow")}
          </span>
          <h2 className="mt-3 text-3xl font-semibold text-ink">
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
