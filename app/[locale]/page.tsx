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
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
          <span className="text-xs font-semibold tracking-[0.22em] text-amber uppercase">
            {t("home.eyebrow")}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            {t("home.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-amber text-amber-foreground hover:bg-amber/90"
            >
              <Link href="/menu">{t("home.ctaMenu")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream/30 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
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
              <Card className="h-full transition-colors group-hover:border-forest/40 group-hover:bg-oat/40">
                <CardHeader>
                  <CardTitle className="text-xl text-forest">
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
