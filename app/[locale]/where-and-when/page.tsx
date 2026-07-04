import { getTranslations, setRequestLocale } from "next-intl/server";

import { openingHours } from "@/lib/opening-hours";
import { LocationMap } from "@/components/site/location-map";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("whereAndWhen") };
}

export default async function WhereAndWhenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-6 md:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-clay uppercase">
        {t("openingHours.eyebrow")}
      </span>
      <h1 className="mt-3 text-4xl font-semibold text-ink md:text-5xl">
        {t("nav.whereAndWhen")}
      </h1>

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-14">
        {/* When — opening times */}
        <section>
          <h2 className="text-2xl font-semibold text-ink">
            {t("openingHours.title")}
          </h2>
          <dl className="mt-6 divide-y divide-border/70">
            {openingHours.map((d) => (
              <div
                key={d.key}
                className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-4"
              >
                <dt className="font-medium text-ink">
                  {t(`openingHours.days.${d.key}`)}
                </dt>
                <dd>
                  {d.closed ? (
                    <span className="text-muted-foreground">
                      {t("openingHours.closed")}
                    </span>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="font-medium text-ink tabular-nums">
                        {d.hours}
                      </div>
                      {d.kitchen?.map((k, i) => (
                        <div
                          key={i}
                          className="text-sm text-muted-foreground tabular-nums"
                        >
                          {t("openingHours.kitchen")} · {k}
                        </div>
                      ))}
                    </div>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Where — location */}
        <section>
          <h2 className="text-2xl font-semibold text-ink">
            {t("location.title")}
          </h2>
          <address className="mt-3 text-lg text-ink/80 not-italic">
            Elfbuchenstraße 18
            <br />
            34119 Kassel
          </address>
          <div className="mt-6">
            <LocationMap />
          </div>
        </section>
      </div>
    </div>
  );
}
